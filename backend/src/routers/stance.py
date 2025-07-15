from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import StanceOnEventDB, SpectrumScoreDB
from models_validators import StanceOnEvent, SpectrumScore
from db import get_db
from logger import logger
from typing import List
import datetime

router = APIRouter(prefix="/stances")


@router.post("/", response_model=StanceOnEvent)
def create_stance(stance: StanceOnEvent, db: Session = Depends(get_db)):
    logger.info(
        f"Creating stance for event: {stance.event_id} by person: {stance.person_id}"
    )
    data = stance.model_dump(exclude_unset=True)
    scores_data = data.pop("scores", None)
    if "date" in data and isinstance(data["date"], str):
        data["date"] = datetime.date.fromisoformat(data["date"])
    db_stance = StanceOnEventDB(**data)
    db.add(db_stance)
    db.commit()
    # Now add scores if provided
    if scores_data:
        for score in scores_data:
            score_obj = SpectrumScoreDB(**score, stance_id=db_stance.id)
            db.add(score_obj)
        db.commit()
    db.refresh(db_stance)
    # Fetch scores for response
    scores = (
        db.query(SpectrumScoreDB)
        .filter(SpectrumScoreDB.stance_id == db_stance.id)
        .all()
    )
    fields = StanceOnEvent.model_fields.keys()
    data = {field: getattr(db_stance, field) for field in fields}
    data["scores"] = [
        SpectrumScore.model_validate(
            {field: getattr(s, field) for field in SpectrumScore.model_fields.keys()}
        )
        for s in scores
    ]
    return StanceOnEvent.model_validate(data)


@router.get("/", response_model=List[StanceOnEvent])
def list_stances(db: Session = Depends(get_db)):
    stances = db.query(StanceOnEventDB).all()
    stance_fields = StanceOnEvent.model_fields.keys()
    score_fields = SpectrumScore.model_fields.keys()
    result = []
    for s in stances:
        stance_dict = {field: getattr(s, field) for field in stance_fields}
        # Convert nested scores to dicts
        scores = [
            {field: getattr(score, field) for field in score_fields}
            for score in getattr(s, "scores", [])
        ]
        stance_dict["scores"] = scores
        result.append(stance_dict)
    return result


@router.get("/{stance_id}", response_model=StanceOnEvent)
def get_stance(stance_id: int, db: Session = Depends(get_db)):
    s = db.query(StanceOnEventDB).get(stance_id)
    if not s:
        logger.warning(f"StanceOnEventDB with ID {stance_id} not found")
        raise HTTPException(status_code=404, detail="StanceOnEventDB not found")
    stance_fields = StanceOnEvent.model_fields.keys()
    score_fields = SpectrumScore.model_fields.keys()
    stance_dict = {field: getattr(s, field) for field in stance_fields}
    scores = [
        {field: getattr(score, field) for field in score_fields}
        for score in getattr(s, "scores", [])
    ]
    stance_dict["scores"] = scores
    return stance_dict


@router.put("/{stance_id}", response_model=StanceOnEvent)
def update_stance(stance_id: int, stance: StanceOnEvent, db: Session = Depends(get_db)):
    logger.info(f"Updating stance with ID {stance_id}")
    db_stance = db.query(StanceOnEventDB).get(stance_id)
    if not db_stance:
        logger.warning(f"StanceOnEventDB with ID {stance_id} not found")
        raise HTTPException(status_code=404, detail="StanceOnEventDB not found")
    import datetime

    data = stance.model_dump(exclude_unset=True)
    scores_data = data.pop("scores", None)
    # Update stance fields
    for key, value in data.items():
        if key == "date" and isinstance(value, str):
            value = datetime.date.fromisoformat(value)
        setattr(db_stance, key, value)
    db.commit()
    # Replace all scores if provided
    if scores_data is not None:
        # Delete existing scores
        db.query(SpectrumScoreDB).filter(
            SpectrumScoreDB.stance_id == db_stance.id
        ).delete()
        db.commit()
        # Add new scores
        for score in scores_data:
            score_obj = SpectrumScoreDB(**score, stance_id=db_stance.id)
            db.add(score_obj)
        db.commit()
    db.refresh(db_stance)
    # Fetch scores for response
    scores = (
        db.query(SpectrumScoreDB)
        .filter(SpectrumScoreDB.stance_id == db_stance.id)
        .all()
    )
    fields = StanceOnEvent.model_fields.keys()
    data = {field: getattr(db_stance, field) for field in fields}
    data["scores"] = [
        SpectrumScore.model_validate(
            {field: getattr(s, field) for field in SpectrumScore.model_fields.keys()}
        )
        for s in scores
    ]
    return StanceOnEvent.model_validate(data)


@router.delete("/{stance_id}")
def delete_stance(stance_id: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting stance with ID {stance_id}")
    db_stance = db.query(StanceOnEventDB).get(stance_id)
    if not db_stance:
        logger.warning(f"StanceOnEventDB with ID {stance_id} not found")
        raise HTTPException(status_code=404, detail="StanceOnEventDB not found")
    db.delete(db_stance)
    db.commit()
    return {"detail": f"Deleted."}
