from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# --- SQLAlchemy ORM Classes ---


class SpectrumDB(Base):  # type: ignore [misc, valid-type]
    """
    Describes a political or ideological spectrum.
    """

    __tablename__ = "spectrums"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    scores = relationship(
        "SpectrumScoreDB", back_populates="spectrum", cascade="all, delete-orphan"
    )


class SpectrumScoreDB(Base):  # type: ignore [misc, valid-type]
    """
    Value for specific spectrum (for stance on event, person or political party).
    """

    __tablename__ = "spectrum_scores"
    id = Column(Integer, primary_key=True)
    spectrum_id = Column(Integer, ForeignKey("spectrums.id"))
    stance_id = Column(Integer, ForeignKey("stances_on_event.id"), nullable=True)
    value = Column(Float, nullable=False)
    # Constraint: value must be between -50 and 50
    __table_args__ = (
        {
            "sqlite_autoincrement": True,
            "check_constraints": ["value >= -50 AND value <= 50"],
        },
    )
    spectrum = relationship("SpectrumDB", back_populates="scores")
    stance = relationship("StanceOnEventDB", back_populates="scores")


class PersonDB(Base):  # type: ignore [misc, valid-type]
    """
    Basic template for every person to register.
    """

    __tablename__ = "persons"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    stances = relationship(
        "StanceOnEventDB", back_populates="person", cascade="all, delete-orphan"
    )


class EventDB(Base):  # type: ignore [misc, valid-type]
    """
    Registering and objective description of a single event.
    """

    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    stances = relationship(
        "StanceOnEventDB", back_populates="event", cascade="all, delete-orphan"
    )


class StanceOnEventDB(Base):  # type: ignore [misc, valid-type]
    """
    Stance of a peron on an event with specific scores attached to it.
    """

    __tablename__ = "stances_on_event"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    person_id = Column(Integer, ForeignKey("persons.id"))
    date = Column(Date, nullable=False)
    event = relationship("EventDB", back_populates="stances")
    person = relationship("PersonDB", back_populates="stances")
    scores = relationship(
        "SpectrumScoreDB", back_populates="stance", cascade="all, delete-orphan"
    )
