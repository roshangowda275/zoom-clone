from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_code = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    host_name = Column(String, nullable=False, default="Guest Host")
    meeting_type = Column(String, nullable=False)  # "instant" or "scheduled"
    scheduled_time = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    participants = relationship("Participant", back_populates="meeting")


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    display_name = Column(String, nullable=False)
    joined_at = Column(DateTime, server_default=func.now())

    meeting = relationship("Meeting", back_populates="participants")