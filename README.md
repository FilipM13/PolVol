# PolVol

Sample project of online platform.

## Tech Stack

| Component | Technology |
| --------- | ---------- |
| Frontend  | React      |
| Backend   | FastApi    |
| Database  | SQLite     |

## Requirements

- npm 9.2.0
  - react 19.1.0
  - react-dom 19.1.0
  - react-router 7.6.3
  - react-router-dom 7.6.3
  - vite 7.0.4
- Python 3.12.11
  - pydantic 2.11.7
  - FastApi 0.112.2
  - SQLAlchemy 2.0.41
- Docker [not yet implemented]

## Frontend

React frontend created with Vite. `src` directory is devided by views for specific views and data models (eg. `src/Header` for navigation and header, `src/Login` for user login and registration, `src/Person` for CRUD operations on Person data model). Reusable components have been created in `src/shared` directory to keepthe style consistent across all views and to minimize code repetitions (mostly css). This react app is using React Router to redirect to specific views/components.

## Backend

Python FastApi api handling all CRUD operations on different data models, authentication, generating and removing JSON Web Tokens (JWT).
It is using Pydantic data models to verify body of the request.

## Batabase

SQLite database created with Python SQLAlchemy. For each database data model there is matching Pydantic model for validation (`backend.src.models.PersonDB` -> `backend.src.models_validators.Person` etc.).

## Authorization and Authentication

Authentication is managed by JWT. Token are automatically removed from database after their expiration datetime is exceeded (via celery scheduled job [not yet implemented]). Authorization is devided into 4 levels specified in `backend.src.models_validators.Authorizations`:

```python
class Authorizations(Enum):
    ADMIN = "admin"  # all permissions, assigning autorhizations to other users
    DATA_ANALYST = "data_analyst"  # all below + CU on stances
    DATA_PROVIDER = "data_provider"  # all below + CU events, spectra, people
    GUEST = "guest"  # R all
```

After user registers for a specific authorization level, another user of the same level or higher has to approve him. Until that, newly registered user has lowest authorization (guest). [not yet implemented]

## Launching (temporary, until deployed to Azure)

Terminal 1 (backend):

```bash
cd backend/src
python -m pip install -r requirements.txt
python -m uvicorn api:app
```

Terminal 2 (frontend):

```bash
cd frontend
npm install
npm run build
serve -s dist
```

## Automation (Celery)

not yet implemented

## DevOps (GitHub Actions)

not yet implemented

## Containerization (Docker)

not yet implemented

## Cloud (Azure)

not yet implemented

## LLM (Ollama / HuggingFace)

not yet implemented
