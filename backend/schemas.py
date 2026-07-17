from datetime import datetime
from pydantic import BaseModel, field_validator


class ScheduleMeetingRequest(BaseModel):
    title: str
    description: str | None = None
    scheduled_time: datetime
    duration_minutes: int


class JoinMeetingRequest(BaseModel):
    display_name: str

    @field_validator("display_name")
    @classmethod
    def display_name_not_blank(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("display_name cannot be empty or just whitespace")
        return cleaned


class MeetingResponse(BaseModel):
    id: int
    meeting_code: str
    title: str
    description: str | None
    host_name: str
    meeting_type: str
    scheduled_time: datetime | None
    duration_minutes: int | None
    created_at: datetime

    model_config = {"from_attributes": True}