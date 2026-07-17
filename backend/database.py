from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./zoom_clone.db"

# check_same_thread=False is needed only for SQLite, since by default
# it only allows one thread to talk to it, but FastAPI can use multiple.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# used as a FastAPI dependency to get a db session per request
# and make sure it closes after the request is done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()