from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class Authorizations(Enum):
    """
    Enum for different authorization levels.
    """
    ADMIN = "admin"  # all permissions, assigning autorhizations to other users
    DATA_ANALYST = "data_analyst"  # all below + CU on stances
    DATA_PROVIDER = "data_provider"  # all below + CU events, spectra, people
    GUEST = "guest"  # R all


class User(BaseModel):
    """
    User model for authentication and authorization.
    """
    id: Optional[int] = None
    username: str
    password: str
    authorization: Authorizations = Authorizations.GUEST


class Token(BaseModel):
    """
    Token model for user authentication.
    """
    id: Optional[int] = None
    user_id: int
    token: str
    expiration: datetime


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
    count: int = Field(..., ge=0)
