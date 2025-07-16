from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import UserDB, TokenDB
from models_validators import User, Token
from db import get_db
from logger import logger
import datetime
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError

router = APIRouter(prefix="/auth")

KEY = "abcd1234"  # change to github secret
ALGO = "HS256"

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oath2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_current_user(token: str = Depends(oath2_bearer), db: Session = Depends(get_db)):
    """
    Get the current user based on the provided JWT token.
    """
    try:
        payload = jwt.decode(token, KEY, algorithms=ALGO)
        username = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=401, detail="Invalid authentication credentials"
            )
    except JWTError:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    user = db.query(UserDB).filter(UserDB.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/", response_model=User)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get the current user's information.
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    fields = User.model_fields.keys()
    user_info = User.model_validate({f: getattr(current_user, f) for f in fields})
    user_info.password = "******"  # Hide password in response
    return user_info


@router.post("/register", response_model=User)
def register_user(user: User, db: Session = Depends(get_db)):
    """
    Register a new user in the system.
    """
    existing_user = db.query(UserDB).filter(UserDB.username == user.username).first()
    if existing_user:
        logger.warning(f"User {user.username} already exists.")
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = bcrypt_context.hash(user.password)
    new_user = UserDB(
        username=user.username,
        password=hashed_password,
        authorization=user.authorization.value,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    fields = User.model_fields.keys()
    new_user = User.model_validate(
        {f: getattr(new_user, f) for f in fields}
    )  # Convert to Pydantic model
    logger.info(f"User {user.username} registered successfully.")
    new_user.password = "******"  # Hide password in response
    return new_user


@router.delete("/delete/{user_id}", response_model=User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete a user by ID.
    """
    user = db.query(UserDB).get(user_id)
    if not user:
        logger.warning(f"User with ID {user_id} not found.")
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    fields = User.model_fields.keys()
    user = User.model_validate({f: getattr(user, f) for f in fields})
    user.password = "******"  # Hide password in response
    logger.info(f"User with ID {user_id} deleted successfully.")
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """
    Generate a JWT token for user authentication.
    """
    user = db.query(UserDB).filter(UserDB.username == form_data.username).first()
    if not user or not bcrypt_context.verify(
        form_data.password, getattr(user, "password")
    ):
        logger.warning("Invalid username or password.")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token_data = {
        "sub": user.username,
        "exp": datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1),
    }
    token = jwt.encode(token_data, KEY, algorithm=ALGO)

    new_token = TokenDB(
        user_id=user.id,
        token=token,
        expiration=datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1),
    )
    db.add(new_token)
    db.commit()
    db.refresh(new_token)
    fields = Token.model_fields.keys()
    new_token = Token.model_validate({f: getattr(new_token, f) for f in fields})
    logger.info(f"Token generated for user {user.username}.")
    return new_token


@router.delete("/logout")
def logout(token: str = Depends(oath2_bearer), db: Session = Depends(get_db)):
    """
    Remove the user's JWT token.
    """
    token_record = db.query(TokenDB).filter(TokenDB.token == token).first()
    if not token_record:
        logger.warning("Token not found.")
        raise HTTPException(status_code=404, detail="Token not found")

    db.delete(token_record)
    db.commit()
    logger.info("User logged out successfully.")
    return {"detail": "Logged out successfully"}
