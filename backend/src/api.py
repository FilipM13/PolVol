from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import spectra, person, event, stance, complex, user

app = FastAPI()
# no restriction for development purposes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# adding routers
app.include_router(spectra.router)
app.include_router(person.router)
app.include_router(event.router)
app.include_router(stance.router)
app.include_router(complex.router)
app.include_router(user.router)
