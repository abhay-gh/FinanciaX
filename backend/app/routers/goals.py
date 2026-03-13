from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.goal_service import GoalService
from app.schemas.goal import GoalCreate, GoalUpdate
from app.models.user import User

router = APIRouter(prefix="/goals", tags=["goals"])


def _svc(db: Session = Depends(get_db)) -> GoalService:
    return GoalService(db)


@router.get("/")
def list_goals(current_user: User = Depends(get_current_user), svc: GoalService = Depends(_svc)):
    return svc.list_by_user(current_user.id)


@router.post("/", status_code=201)
def create_goal(data: GoalCreate, current_user: User = Depends(get_current_user), svc: GoalService = Depends(_svc)):
    return svc.create(current_user.id, data)


@router.patch("/{goal_id}")
def update_goal(goal_id: int, data: GoalUpdate, current_user: User = Depends(get_current_user), svc: GoalService = Depends(_svc)):
    g = svc.get(goal_id, current_user.id)
    if not g:
        raise HTTPException(404, "Goal not found")
    return svc.update(g, data)


@router.delete("/{goal_id}", status_code=204)
def delete_goal(goal_id: int, current_user: User = Depends(get_current_user), svc: GoalService = Depends(_svc)):
    g = svc.get(goal_id, current_user.id)
    if not g:
        raise HTTPException(404, "Goal not found")
    svc.delete(g)
