from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str
    icon: str | None = None
    color: str | None = None
    parent_id: int | None = None


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
