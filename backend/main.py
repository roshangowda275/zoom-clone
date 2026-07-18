from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import meeting
from .seed import seed

Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="Zoom Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meeting.router)


@app.get("/")
def root():
    return {"message": "Zoom Clone API is running"}