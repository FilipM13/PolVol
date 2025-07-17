"""
Complex queries for specific views in front end.
"""

from statistics import mean, stdev
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict
from ..logger import logger
from ..models import SpectrumScoreDB, SpectrumDB, StanceOnEventDB
from ..models_validators import AverageSpectra
from ..db import get_db
from ..logger import logger

router = APIRouter()


# get avarage spectrum scores for a person
@router.get(
    "/persons/{person_id}/average_spectra_scores", response_model=List[AverageSpectra]
)
def get_person_average_spectra_scores(person_id: int, db: Session = Depends(get_db)):
    """
    Get mean value, standard deviation, and count of scores for each spectrum
    for a given person.
    """
    logger.info(f"Calculating average spectra for person with ID {person_id}")
    scores = (
        db.query(SpectrumScoreDB)
        .join(StanceOnEventDB)
        .filter(StanceOnEventDB.person_id == person_id)
        .all()
    )

    spectrum_scores: Dict[int, List[float]] = {}
    for score in scores:
        spectrum_scores.setdefault(score.spectrum_id, []).append(score.value)  # type: ignore [arg-type]

    # Fetch all spectrums for name lookup
    spectrum_objs = db.query(SpectrumDB).all()
    spectrum_id_to_name = {s.id: s.name for s in spectrum_objs}

    average_scores = []
    for spectrum_id, values in spectrum_scores.items():
        std = stdev if len(values) > 1 else lambda x: 0.0  # type: ignore [misc]
        average_scores.append(
            AverageSpectra.model_validate(
                {
                    "spectrum": spectrum_id_to_name.get(spectrum_id, str(spectrum_id)),  # type: ignore [call-overload]
                    "mean_value": round(mean(values), 2),
                    "stdev_value": round(std(values), 2),
                    "count": len(values),
                }
            )
        )

    return average_scores


# get avarage score for a spectrum
@router.get("/spectra/{spectrum_id}/average_scores", response_model=AverageSpectra)
def get_spectrum_average_scores(spectrum_id: int, db: Session = Depends(get_db)):
    """
    Get mean value, standard deviation, and count of scores for a given spectrum.
    """
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
            "mean_value": round(mean(values), 2),
            "stdev_value": round(stdev(values), 2),
            "count": len(values),
        }
    )
