# schemas/UserSchema.py
from pydantic import BaseModel
from datetime import date
from typing import Optional

# ---------------------------
# User-related schemas
# ---------------------------

class UserCreate(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ---------------------------
# Todo-related schemas
# ---------------------------

class TodoCreate(BaseModel):
    title: str
    category: str
    due_date: date


class TodoOut(BaseModel):
    id: int
    title: str
    category: str
    due_date: date
    completed: bool

    class Config:
        from_attributes = True