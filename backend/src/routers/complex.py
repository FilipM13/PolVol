from statistics import mean, stdev
from logger import logger
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import SpectrumScoreDB, SpectrumDB, StanceOnEventDB
from models_validators import AverageSpectra
from db import get_db
from logger import logger
from typing import List

router = APIRouter()


# get avarage spectrum scores for a person
@router.get(
    "/persons/{person_id}/average_spectra_scores", response_model=List[AverageSpectra]
)
def get_person_average_spectra_scores(person_id: int, db: Session = Depends(get_db)):
    logger.info(f"Calculating average spectra for person with ID {person_id}")
    scores = (
        db.query(SpectrumScoreDB)
        .join(StanceOnEventDB)
        .filter(StanceOnEventDB.person_id == person_id)
        .all()
    )

    spectrum_scores = {}
    for score in scores:
        spectrum_scores.setdefault(score.spectrum_id, []).append(score.value)

    # Fetch all spectrums for name lookup
    spectrum_objs = db.query(SpectrumDB).all()
    spectrum_id_to_name = {s.id: s.name for s in spectrum_objs}

    average_scores = []
    for spectrum_id, values in spectrum_scores.items():
        std = stdev if len(values) > 1 else lambda x: 0.0
        average_scores.append(
            AverageSpectra.model_validate(
                {
                    "spectrum": spectrum_id_to_name.get(spectrum_id, str(spectrum_id)),
                    "mean_value": mean(values),
                    "stdev_value": round(std(values), 2),
                    "count": len(values),
                }
            )
        )

    return average_scores


# get avarage score for a spectrum
@router.get("/spectra/{spectrum_id}/average_scores", response_model=AverageSpectra)
def get_spectrum_average_scores(spectrum_id: int, db: Session = Depends(get_db)):
    logger.info(f"Calculating average scores for spectrum with ID {spectrum_id}")
    values = [
        v
        for (v,) in db.query(SpectrumScoreDB.value)
        .filter(SpectrumScoreDB.spectrum_id == spectrum_id)
        .all()
    ]

    if not values:
        logger.warning(f"No scores found for SpectrumDB with ID {spectrum_id}")
        return AverageSpectra.model_validate(
            {
                "spectrum": str(spectrum_id),
                "mean_value": 0,
                "stdev_value": 0.0,
                "count": 0,
            }
        )

    if len(values) == 1:
        return AverageSpectra.model_validate(
            {
                "spectrum": str(spectrum_id),
                "mean_value": values[0],
                "stdev_value": 0.0,
                "count": 1,
            }
        )

    return AverageSpectra.model_validate(
        {
            "spectrum": str(spectrum_id),
            "mean_value": mean(values),
            "stdev_value": round(stdev(values), 2),
            "count": len(values),
        }
    )
