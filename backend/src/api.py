from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from models import (
    SpectrumDB,
    PersonDB,
    EventDB,
    StanceOnEventDB,
    SpectrumScoreDB,
)
from models_validators import (
    Spectrum,
    Person,
    Event,
    StanceOnEvent,
    SpectrumScore,
    AverageSpectra
)
from db import SessionLocal
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from statistics import mean, stdev

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CRUD for SpectrumDB
@app.post("/spectra", response_model=Spectrum)
def create_spectrum(spectrum: Spectrum, db: Session = Depends(get_db)):
    db_spectrum = SpectrumDB(**spectrum.model_dump(exclude_unset=True))
    db.add(db_spectrum)
    db.commit()
    db.refresh(db_spectrum)
    fields = Spectrum.model_fields.keys()
    data = {field: getattr(db_spectrum, field) for field in fields}
    return Spectrum.model_validate(data)


@app.get("/spectra", response_model=List[Spectrum])
def list_spectrums(db: Session = Depends(get_db)):
    spectrums = db.query(SpectrumDB).all()
    fields = Spectrum.model_fields.keys()
    return [
        Spectrum.model_validate({field: getattr(s, field) for field in fields})
        for s in spectrums
    ]


@app.get("/spectra/{spectrum_id}", response_model=Spectrum)
def get_spectrum(spectrum_id: int, db: Session = Depends(get_db)):
    s = db.query(SpectrumDB).get(spectrum_id)
    if not s:
        raise HTTPException(status_code=404, detail="SpectrumDB not found")
    fields = Spectrum.model_fields.keys()
    data = {field: getattr(s, field) for field in fields}
    return Spectrum.model_validate(data)


@app.put("/spectra/{spectrum_id}", response_model=Spectrum)
def update_spectrum(
    spectrum_id: int, spectrum: Spectrum, db: Session = Depends(get_db)
):
    db_spectrum = db.query(SpectrumDB).get(spectrum_id)
    if not db_spectrum:
        raise HTTPException(status_code=404, detail="SpectrumDB not found")
    for key, value in spectrum.model_dump(exclude_unset=True).items():
        setattr(db_spectrum, key, value)
    db.commit()
    db.refresh(db_spectrum)
    fields = Spectrum.model_fields.keys()
    data = {field: getattr(db_spectrum, field) for field in fields}
    return Spectrum.model_validate(data)


@app.delete("/spectra/{spectrum_id}")
def delete_spectrum(spectrum_id: int, db: Session = Depends(get_db)):
    db_spectrum = db.query(SpectrumDB).get(spectrum_id)
    if not db_spectrum:
        raise HTTPException(status_code=404, detail="SpectrumDB not found")
    db.delete(db_spectrum)
    db.commit()
    return {"detail": "Deleted"}


# CRUD for PersonDB
@app.post("/persons", response_model=Person)
def create_person(person: Person, db: Session = Depends(get_db)):
    import datetime
    data = person.model_dump(exclude_unset=True)
    if 'date_of_birth' in data and isinstance(data['date_of_birth'], str):
        data['date_of_birth'] = datetime.date.fromisoformat(data['date_of_birth'])
    db_person = PersonDB(**data)
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    fields = Person.model_fields.keys()
    data = {field: getattr(db_person, field) for field in fields}
    return Person.model_validate(data)


@app.get("/persons", response_model=List[Person])
def list_persons(db: Session = Depends(get_db)):
    persons = db.query(PersonDB).all()
    fields = Person.model_fields.keys()
    return [
        Person.model_validate({field: getattr(p, field) for field in fields})
        for p in persons
    ]


@app.get("/persons/{person_id}", response_model=Person)
def get_person(person_id: int, db: Session = Depends(get_db)):
    p = db.query(PersonDB).get(person_id)
    if not p:
        raise HTTPException(status_code=404, detail="PersonDB not found")
    fields = Person.model_fields.keys()
    data = {field: getattr(p, field) for field in fields}
    return Person.model_validate(data)


@app.put("/persons/{person_id}", response_model=Person)
def update_person(person_id: int, person: Person, db: Session = Depends(get_db)):
    db_person = db.query(PersonDB).get(person_id)
    if not db_person:
        raise HTTPException(status_code=404, detail="PersonDB not found")
    import datetime
    for key, value in person.model_dump(exclude_unset=True).items():
        if key == 'date_of_birth' and isinstance(value, str):
            value = datetime.date.fromisoformat(value)
        setattr(db_person, key, value)
    db.commit()
    db.refresh(db_person)
    fields = Person.model_fields.keys()
    data = {field: getattr(db_person, field) for field in fields}
    return Person.model_validate(data)


@app.delete("/persons/{person_id}")
def delete_person(person_id: int, db: Session = Depends(get_db)):
    db_person = db.query(PersonDB).get(person_id)
    if not db_person:
        raise HTTPException(status_code=404, detail="PersonDB not found")
    db.delete(db_person)
    db.commit()
    return {"detail": f"Deleted {db_person.first_name} {db_person.last_name}"}


# CRUD for EventDB
@app.post("/events", response_model=Event)
def create_event(event: Event, db: Session = Depends(get_db)):
    import datetime
    data = event.model_dump(exclude_unset=True)
    if 'date' in data and isinstance(data['date'], str):
        data['date'] = datetime.date.fromisoformat(data['date'])
    db_event = EventDB(**data)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    fields = Event.model_fields.keys()
    data = {field: getattr(db_event, field) for field in fields}
    return Event.model_validate(data)


@app.get("/events", response_model=List[Event])
def list_events(db: Session = Depends(get_db)):
    events = db.query(EventDB).all()
    fields = Event.model_fields.keys()
    return [
        Event.model_validate({field: getattr(e, field) for field in fields})
        for e in events
    ]


@app.get("/events/{event_id}", response_model=Event)
def get_event(event_id: int, db: Session = Depends(get_db)):
    e = db.query(EventDB).get(event_id)
    if not e:
        raise HTTPException(status_code=404, detail="EventDB not found")
    fields = Event.model_fields.keys()
    data = {field: getattr(e, field) for field in fields}
    return Event.model_validate(data)


@app.put("/events/{event_id}", response_model=Event)
def update_event(event_id: int, event: Event, db: Session = Depends(get_db)):
    db_event = db.query(EventDB).get(event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="EventDB not found")
    import datetime
    for key, value in event.model_dump(exclude_unset=True).items():
        if key == 'date' and isinstance(value, str):
            value = datetime.date.fromisoformat(value)
        setattr(db_event, key, value)
    db.commit()
    db.refresh(db_event)
    fields = Event.model_fields.keys()
    data = {field: getattr(db_event, field) for field in fields}
    return Event.model_validate(data)


@app.delete("/events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(EventDB).get(event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="EventDB not found")
    db.delete(db_event)
    db.commit()
    return {"detail": f"Deleted {db_event.name} on {db_event.date}"}


# CRUD for StanceOnEventDB
@app.post("/stances", response_model=StanceOnEvent)
def create_stance(stance: StanceOnEvent, db: Session = Depends(get_db)):
    import datetime
    data = stance.model_dump(exclude_unset=True)
    scores_data = data.pop('scores', None)
    if 'date' in data and isinstance(data['date'], str):
        data['date'] = datetime.date.fromisoformat(data['date'])
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
    scores = db.query(SpectrumScoreDB).filter(SpectrumScoreDB.stance_id == db_stance.id).all()
    fields = StanceOnEvent.model_fields.keys()
    data = {field: getattr(db_stance, field) for field in fields}
    data['scores'] = [SpectrumScore.model_validate({field: getattr(s, field) for field in SpectrumScore.model_fields.keys()}) for s in scores]
    return StanceOnEvent.model_validate(data)


@app.get("/stances", response_model=List[StanceOnEvent])
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
            for score in getattr(s, 'scores', [])
        ]
        stance_dict['scores'] = scores
        result.append(stance_dict)
    return result


@app.get("/stances/{stance_id}", response_model=StanceOnEvent)
def get_stance(stance_id: int, db: Session = Depends(get_db)):
    s = db.query(StanceOnEventDB).get(stance_id)
    if not s:
        raise HTTPException(status_code=404, detail="StanceOnEventDB not found")
    stance_fields = StanceOnEvent.model_fields.keys()
    score_fields = SpectrumScore.model_fields.keys()
    stance_dict = {field: getattr(s, field) for field in stance_fields}
    scores = [
        {field: getattr(score, field) for field in score_fields}
        for score in getattr(s, 'scores', [])
    ]
    stance_dict['scores'] = scores
    return stance_dict


@app.put("/stances/{stance_id}", response_model=StanceOnEvent)
def update_stance(stance_id: int, stance: StanceOnEvent, db: Session = Depends(get_db)):
    db_stance = db.query(StanceOnEventDB).get(stance_id)
    if not db_stance:
        raise HTTPException(status_code=404, detail="StanceOnEventDB not found")
    import datetime
    data = stance.model_dump(exclude_unset=True)
    scores_data = data.pop('scores', None)
    # Update stance fields
    for key, value in data.items():
        if key == 'date' and isinstance(value, str):
            value = datetime.date.fromisoformat(value)
        setattr(db_stance, key, value)
    db.commit()
    # Replace all scores if provided
    if scores_data is not None:
        # Delete existing scores
        db.query(SpectrumScoreDB).filter(SpectrumScoreDB.stance_id == db_stance.id).delete()
        db.commit()
        # Add new scores
        for score in scores_data:
            score_obj = SpectrumScoreDB(**score, stance_id=db_stance.id)
            db.add(score_obj)
        db.commit()
    db.refresh(db_stance)
    # Fetch scores for response
    scores = db.query(SpectrumScoreDB).filter(SpectrumScoreDB.stance_id == db_stance.id).all()
    fields = StanceOnEvent.model_fields.keys()
    data = {field: getattr(db_stance, field) for field in fields}
    data['scores'] = [SpectrumScore.model_validate({field: getattr(s, field) for field in SpectrumScore.model_fields.keys()}) for s in scores]
    return StanceOnEvent.model_validate(data)


@app.delete("/stances/{stance_id}")
def delete_stance(stance_id: int, db: Session = Depends(get_db)):
    db_stance = db.query(StanceOnEventDB).get(stance_id)
    if not db_stance:
        raise HTTPException(status_code=404, detail="StanceOnEventDB not found")
    db.delete(db_stance)
    db.commit()
    return {"detail": f"Deleted stance {stance_id}"}

# Calculation endpoints
# get avarage spectrum scores for a person
@app.get("/persons/{person_id}/average_spectra", response_model=List[AverageSpectra])
def get_person_average_spectra(person_id: int, db: Session = Depends(get_db)):
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
        average_scores.append(AverageSpectra.model_validate({
            "spectrum": spectrum_id_to_name.get(spectrum_id, str(spectrum_id)),
            "mean_value": mean(values),
            "stdev_value": round(std(values), 2),
            "count": len(values),
        }))

    return average_scores