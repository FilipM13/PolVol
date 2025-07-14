from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import SpectrumDB
from models_validators import Spectrum
from db import get_db
from logger import logger
from typing import List

router = APIRouter()


@router.post("/spectra", response_model=Spectrum)
def create_spectrum(spectrum: Spectrum, db: Session = Depends(get_db)):
    logger.info(f"Creating spectrum: {spectrum.name}")
    db_spectrum = SpectrumDB(**spectrum.model_dump(exclude_unset=True))
    db.add(db_spectrum)
    db.commit()
    db.refresh(db_spectrum)
    fields = Spectrum.model_fields.keys()
    data = {field: getattr(db_spectrum, field) for field in fields}
    return Spectrum.model_validate(data)


@router.get("/spectra", response_model=List[Spectrum])
def list_spectrums(db: Session = Depends(get_db)):
    spectrums = db.query(SpectrumDB).all()
    fields = Spectrum.model_fields.keys()
    return [
        Spectrum.model_validate({field: getattr(s, field) for field in fields})
        for s in spectrums
    ]


@router.get("/spectra/{spectrum_id}", response_model=Spectrum)
def get_spectrum(spectrum_id: int, db: Session = Depends(get_db)):
    s = db.query(SpectrumDB).get(spectrum_id)
    if not s:
        logger.warning(f"SpectrumDB with ID {spectrum_id} not found")
        raise HTTPException(status_code=404, detail="SpectrumDB not found")
    fields = Spectrum.model_fields.keys()
    data = {field: getattr(s, field) for field in fields}
    return Spectrum.model_validate(data)


@router.put("/spectra/{spectrum_id}", response_model=Spectrum)
def update_spectrum(
    spectrum_id: int, spectrum: Spectrum, db: Session = Depends(get_db)
):
    logger.info(f"Updating spectrum with ID {spectrum_id}")
    db_spectrum = db.query(SpectrumDB).get(spectrum_id)
    if not db_spectrum:
        logger.warning(f"SpectrumDB with ID {spectrum_id} not found")
        raise HTTPException(status_code=404, detail="SpectrumDB not found")
    for key, value in spectrum.model_dump(exclude_unset=True).items():
        setattr(db_spectrum, key, value)
    db.commit()
    db.refresh(db_spectrum)
    fields = Spectrum.model_fields.keys()
    data = {field: getattr(db_spectrum, field) for field in fields}
    return Spectrum.model_validate(data)


@router.delete("/spectra/{spectrum_id}")
def delete_spectrum(spectrum_id: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting spectrum with ID {spectrum_id}")
    db_spectrum = db.query(SpectrumDB).get(spectrum_id)
    if not db_spectrum:
        logger.warning(f"SpectrumDB with ID {spectrum_id} not found")
        raise HTTPException(status_code=404, detail="SpectrumDB not found")
    db.delete(db_spectrum)
    db.commit()
    return {"detail": "Deleted"}
