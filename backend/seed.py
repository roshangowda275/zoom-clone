import random
import string
from datetime import datetime, timedelta

from .database import Base, engine, SessionLocal
from .models import Meeting, Participant


def generate_meeting_code():
    parts = []
    for length in (3, 4, 3):
        parts.append("".join(random.choices(string.ascii_lowercase, k=length)))
    return "-".join(parts)


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if db.query(Meeting).first():
            print("Database already has data. Skipping seeding.")
            return

        now = datetime.now()

        upcoming_meetings = [
            Meeting(
                meeting_code=generate_meeting_code(),
                title="Product Roadmap Sync",
                description="Discuss Q3 roadmap priorities with the team",
                host_name="Guest Host",
                meeting_type="scheduled",
                scheduled_time=now + timedelta(days=1, hours=2),
                duration_minutes=45,
            ),
            Meeting(
                meeting_code=generate_meeting_code(),
                title="Client Demo Call",
                description="Walkthrough of the new dashboard for the client",
                host_name="Guest Host",
                meeting_type="scheduled",
                scheduled_time=now + timedelta(days=3),
                duration_minutes=30,
            ),
            Meeting(
                meeting_code=generate_meeting_code(),
                title="Weekly Team Standup",
                description=None,
                host_name="Guest Host",
                meeting_type="scheduled",
                scheduled_time=now + timedelta(days=6, hours=1),
                duration_minutes=15,
            ),
        ]

        past_meetings = [
            Meeting(
                meeting_code=generate_meeting_code(),
                title="Design Review",
                description="Reviewed new landing page mockups",
                host_name="Guest Host",
                meeting_type="scheduled",
                scheduled_time=now - timedelta(days=2),
                duration_minutes=30,
            ),
            Meeting(
                meeting_code=generate_meeting_code(),
                title="Instant Meeting",
                description=None,
                host_name="Guest Host",
                meeting_type="instant",
                scheduled_time=now - timedelta(days=5),
                duration_minutes=None,
            ),
        ]

        db.add_all(upcoming_meetings + past_meetings)
        db.commit()

        # refresh to make sure we have the DB-assigned id before using it as a foreign key
        design_review = past_meetings[0]
        db.refresh(design_review)

        db.add_all([
            Participant(meeting_id=design_review.id, display_name="Aditi Sharma"),
            Participant(meeting_id=design_review.id, display_name="Rohan Verma"),
        ])
        db.commit()

        print("Database seeded successfully.")

    except Exception as e:
        db.rollback()
        print(f"Seeding failed: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    seed()