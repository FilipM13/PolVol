from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import EventDB
from models_validators import Event
from db import get_db
from logger import logger
import datetime
from typing import List

router = APIRouter(prefix="/events")


@router.post("/", response_model=Event)
def create_event(event: Event, db: Session = Depends(get_db)):
    logger.info(f"Creating event: {event.name}")
    data = event.model_dump(exclude_unset=True)
    if "date" in data and isinstance(data["date"], str):
        data["date"] = datetime.date.fromisoformat(data["date"])
    db_event = EventDB(**data)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    fields = Event.model_fields.keys()
    data = {field: getattr(db_event, field) for field in fields}
    return Event.model_validate(data)


@router.get("/", response_model=List[Event])
def list_events(db: Session = Depends(get_db)):
    events = db.query(EventDB).all()
    fields = Event.model_fields.keys()
    return [
        Event.model_validate({field: getattr(e, field) for field in fields})
        for e in events
    ]


@router.get("/{event_id}", response_model=Event)
def get_event(event_id: int, db: Session = Depends(get_db)):
    e = db.query(EventDB).get(event_id)
    if not e:
        logger.warning(f"EventDB with ID {event_id} not found")
        raise HTTPException(status_code=404, detail="EventDB not found")
    fields = Event.model_fields.keys()
    data = {field: getattr(e, field) for field in fields}
    return Event.model_validate(data)


@router.put("/{event_id}", response_model=Event)
def update_event(event_id: int, event: Event, db: Session = Depends(get_db)):
    logger.info(f"Updating event with ID {event_id}")
    db_event = db.query(EventDB).get(event_id)
    if not db_event:
        logger.warning(f"EventDB with ID {event_id} not found")
        raise HTTPException(status_code=404, detail="EventDB not found")
    import datetime

    for key, value in event.model_dump(exclude_unset=True).items():
        if key == "date" and isinstance(value, str):
            value = datetime.date.fromisoformat(value)
        setattr(db_event, key, value)
    db.commit()
    db.refresh(db_event)
    fields = Event.model_fields.keys()
    data = {field: getattr(db_event, field) for field in fields}
    return Event.model_validate(data)


@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting event with ID {event_id}")
    db_event = db.query(EventDB).get(event_id)
    if not db_event:
        logger.warning(f"EventDB with ID {event_id} not found")
        raise HTTPException(status_code=404, detail="EventDB not found")
    db.delete(db_event)
    db.commit()
    return {"detail": f"Deleted."}
