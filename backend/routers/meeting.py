import random
import string
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Meeting, Participant
from ..schemas import (
    ScheduleMeetingRequest,
    JoinMeetingRequest,
    MeetingResponse,
    ParticipantResponse,
)

router = APIRouter(prefix="/meetings", tags=["meetings"])


def generate_meeting_code(db: Session):
    while True:
        parts = []
        for length in (3, 4, 3):
            parts.append("".join(random.choices(string.ascii_lowercase, k=length)))
        code = "-".join(parts)

        existing = db.query(Meeting).filter(Meeting.meeting_code == code).first()
        if not existing:
            return code


@router.post("/instant", response_model=MeetingResponse)
def create_instant_meeting(db: Session = Depends(get_db)):
    meeting = Meeting(
        meeting_code=generate_meeting_code(db),
        title="Instant Meeting",
        host_name="Guest Host",
        meeting_type="instant",
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


@router.post("/schedule", response_model=MeetingResponse)
def schedule_meeting(payload: ScheduleMeetingRequest, db: Session = Depends(get_db)):
    meeting = Meeting(
        meeting_code=generate_meeting_code(db),
        title=payload.title,
        description=payload.description,
        host_name="Guest Host",
        meeting_type="scheduled",
        scheduled_time=payload.scheduled_time,
        duration_minutes=payload.duration_minutes,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


@router.get("/upcoming", response_model=list[MeetingResponse])
def get_upcoming_meetings(db: Session = Depends(get_db)):
    now = datetime.now()
    meetings = (
        db.query(Meeting)
        .filter(Meeting.scheduled_time.is_not(None), Meeting.scheduled_time >= now)
        .order_by(Meeting.scheduled_time.asc())
        .all()
    )
    return meetings


@router.get("/recent", response_model=list[MeetingResponse])
def get_recent_meetings(db: Session = Depends(get_db)):
    now = datetime.now()
    meetings = (
        db.query(Meeting)
        .filter(
            (Meeting.scheduled_time.is_(None)) | (Meeting.scheduled_time < now)
        )
        .order_by(Meeting.created_at.desc())
        .all()
    )
    return meetings


@router.get("/{meeting_code}", response_model=MeetingResponse)
def get_meeting(meeting_code: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.meeting_code == meeting_code).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.get("/{meeting_code}/participants", response_model=list[ParticipantResponse])
def get_participants(meeting_code: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.meeting_code == meeting_code).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    participants = (
        db.query(Participant)
        .filter(Participant.meeting_id == meeting.id)
        .order_by(Participant.joined_at.asc())
        .all()
    )
    return participants


@router.post("/join/{meeting_code}", response_model=MeetingResponse)
def join_meeting(
    meeting_code: str, payload: JoinMeetingRequest, db: Session = Depends(get_db)
):
    meeting = db.query(Meeting).filter(Meeting.meeting_code == meeting_code).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    participant = Participant(meeting_id=meeting.id, display_name=payload.display_name)
    db.add(participant)
    db.commit()
    db.refresh(participant)

    return meeting


@router.delete("/{meeting_id}/participants/{participant_id}", status_code=204)
def remove_participant(
    meeting_id: int, participant_id: int, db: Session = Depends(get_db)
):
    participant = (
        db.query(Participant)
        .filter(Participant.id == participant_id, Participant.meeting_id == meeting_id)
        .first()
    )
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    db.delete(participant)
    db.commit()
    return None