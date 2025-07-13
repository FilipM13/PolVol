from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


class Spectrum(BaseModel):
    """
    Describes a political or ideological spectrum.
    """

    id: Optional[int] = None
    name: str


class SpectrumScore(BaseModel):
    """
    Value for specific spectrum (for stance on event, person or political party).
    """

    id: Optional[int] = None
    spectrum_id: int
    value: float = Field(..., ge=-50, le=50)


class Person(BaseModel):
    """
    Basic template for every person to register.
    """

    id: Optional[int] = None
    name: str





class Event(BaseModel):
    """
    Registering and objective description of a single event.
    """

    id: Optional[int] = None
    name: str
    date: date


class StanceOnEvent(BaseModel):
    """
    Stance of a peron on an event with specific scores attached to it.
    """

    id: Optional[int] = None
    event_id: int
    person_id: int
    date: date
    scores: Optional[List["SpectrumScore"]] = None


class AverageSpectra(BaseModel):
    """
    Average spectra for a person.
    """
    spectrum: str
    mean_value: float = Field(..., ge=-50, le=50)
    stdev_value: float = Field(..., ge=0)
    count: int = Field(..., ge=1)