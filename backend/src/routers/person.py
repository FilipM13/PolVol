from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import PersonDB
from models_validators import Person
from db import get_db
from logger import logger
from typing import List

router = APIRouter(prefix="/persons")


@router.post("/", response_model=Person)
def create_person(person: Person, db: Session = Depends(get_db)):
    logger.info(f"Creating person: {person.name}")
    import datetime

    data = person.model_dump(exclude_unset=True)
    if "date_of_birth" in data and isinstance(data["date_of_birth"], str):
        data["date_of_birth"] = datetime.date.fromisoformat(data["date_of_birth"])
    db_person = PersonDB(**data)
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    fields = Person.model_fields.keys()
    data = {field: getattr(db_person, field) for field in fields}
    return Person.model_validate(data)


@router.get("/", response_model=List[Person])
def list_persons(db: Session = Depends(get_db)):
    persons = db.query(PersonDB).all()
    fields = Person.model_fields.keys()
    return [
        Person.model_validate({field: getattr(p, field) for field in fields})
        for p in persons
    ]


@router.get("/{person_id}", response_model=Person)
def get_person(person_id: int, db: Session = Depends(get_db)):
    p = db.query(PersonDB).get(person_id)
    if not p:
        logger.warning(f"PersonDB with ID {person_id} not found")
        raise HTTPException(status_code=404, detail="PersonDB not found")
    fields = Person.model_fields.keys()
    data = {field: getattr(p, field) for field in fields}
    return Person.model_validate(data)


@router.put("/{person_id}", response_model=Person)
def update_person(person_id: int, person: Person, db: Session = Depends(get_db)):
    logger.info(f"Updating person with ID {person_id}")
    db_person = db.query(PersonDB).get(person_id)
    if not db_person:
        logger.warning(f"PersonDB with ID {person_id} not found")
        raise HTTPException(status_code=404, detail="PersonDB not found")
    import datetime

    for key, value in person.model_dump(exclude_unset=True).items():
        if key == "date_of_birth" and isinstance(value, str):
            value = datetime.date.fromisoformat(value)
        setattr(db_person, key, value)
    db.commit()
    db.refresh(db_person)
    fields = Person.model_fields.keys()
    data = {field: getattr(db_person, field) for field in fields}
    return Person.model_validate(data)


@router.delete("/{person_id}")
def delete_person(person_id: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting person with ID {person_id}")
    db_person = db.query(PersonDB).get(person_id)
    if not db_person:
        logger.warning(f"PersonDB with ID {person_id} not found")
        raise HTTPException(status_code=404, detail="PersonDB not found")
    db.delete(db_person)
    db.commit()
    return {"detail": f"Deleted."}
