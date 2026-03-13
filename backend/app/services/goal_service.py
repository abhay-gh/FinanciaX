from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.goal import Goal, GoalStatus
from app.schemas.goal import GoalCreate, GoalUpdate


class GoalService:
    def __init__(self, db: Session):
        self.db = db

    def list_by_user(self, user_id: int) -> list[dict]:
        goals = list(self.db.scalars(select(Goal).where(Goal.user_id == user_id)))
        return [self._enrich(g) for g in goals]

    def _enrich(self, goal: Goal) -> dict:
        pct = float(goal.current_amount / goal.target_amount * 100) if goal.target_amount else 0.0
        return {
            "id": goal.id, "name": goal.name, "description": goal.description,
            "target_amount": float(goal.target_amount),
            "current_amount": float(goal.current_amount),
            "target_date": goal.target_date, "status": goal.status,
            "icon": goal.icon, "user_id": goal.user_id,
            "progress_pct": round(min(pct, 100.0), 2),
            "created_at": goal.created_at, "updated_at": goal.updated_at,
        }

    def get(self, goal_id: int, user_id: int) -> Goal | None:
        return self.db.scalar(
            select(Goal).where(Goal.id == goal_id, Goal.user_id == user_id)
        )

    def create(self, user_id: int, data: GoalCreate) -> Goal:
        goal = Goal(user_id=user_id, **data.model_dump())
        self.db.add(goal)
        self.db.commit()
        self.db.refresh(goal)
        return goal

    def update(self, goal: Goal, data: GoalUpdate) -> Goal:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(goal, field, value)
        if goal.current_amount >= goal.target_amount:
            goal.status = GoalStatus.COMPLETED
        self.db.commit()
        self.db.refresh(goal)
        return goal

    def delete(self, goal: Goal) -> None:
        self.db.delete(goal)
        self.db.commit()
