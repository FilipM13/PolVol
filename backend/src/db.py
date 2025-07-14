from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# SQLite database URL
DATABASE_URL = "sqlite:///polvol.db"

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Create all tables defined in models.py
Base.metadata.create_all(engine)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# getting session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
