from datetime import datetime, UTC
from sqlalchemy.orm import Session
from .db import get_db
from .models import TokenDB
from .logger import logger


def clear_tokens():
    """
    Remove expired tokens from database.
    """
    logger.info(f"Cleaning expired tokens.")
    db = get_db().__next__()
    if not db:
        logger.warning("Cleaner job could not make connection to database.")
    try:
        invalid_tokens = (
            db.query(TokenDB).filter(TokenDB.expiration < datetime.now(UTC)).all()
        )
        logger.info(f"Removing {len(invalid_tokens)} tokens.")
        for it in invalid_tokens:
            db.delete(it)
        db.commit()
        logger.info("Cleaning tokens complete.")
    except Exception as e:
        print(e)
        logger.warning("Cleaning failed.")
        db.rollback()


def data_reset():
    """
    For demo only. Clear all data in database and write from statuc file.
    """
    pass
