from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime, BLOB
from sqlalchemy.orm import declarative_base, relationship
from .models_validators import Authorizations, UserStatus

Base = declarative_base()

# --- SQLAlchemy ORM Classes ---


class UserDB(Base):  # type: ignore [misc, valid-type]
    """
    Represents a user in the system.
    """

    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    status = Column(String, default="not_approved", nullable=False)
    authorization = Column(String, default="guest", nullable=False)

    __table_args__ = (
        {
            "sqlite_autoincrement": True,
            "check_constraints": [
                f"authorization IN ({', '.join([f'\'{a}\'' for a in Authorizations])})",
                f"status IN ({', '.join([f'\'{u}\'' for u in UserStatus])})",
            ],
        },
    )

    tokens = relationship(
        "TokenDB", back_populates="user", cascade="all, delete-orphan"
    )


class TokenDB(Base):  # type: ignore [misc, valid-type]
    """
    Represents a token for user authentication.
    """

    __tablename__ = "tokens"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, nullable=False, unique=True)
    expiration = Column(DateTime, nullable=False)

    user = relationship("UserDB", back_populates="tokens")


class SpectrumDB(Base):  # type: ignore [misc, valid-type]
    """
    Describes a political or ideological spectrum.
    """

    __tablename__ = "spectrums"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    left_label = Column(String, nullable=False)
    middle_label = Column(String, nullable=True)
    right_label = Column(String, nullable=False)
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
    first_name = Column(String, nullable=False)
    middle_name = Column(String, nullable=True)
    last_name = Column(String, nullable=False)
    picture = Column(BLOB, nullable=True)
    description_md = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=False)
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
    description = Column(String, nullable=False)
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
    description = Column(String, nullable=False)
    event = relationship("EventDB", back_populates="stances")
    person = relationship("PersonDB", back_populates="stances")
    scores = relationship(
        "SpectrumScoreDB", back_populates="stance", cascade="all, delete-orphan"
    )
