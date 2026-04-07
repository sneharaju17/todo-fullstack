from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import ForgotPasswordRequest, ResetPasswordRequest
from auth_utils import hash_password
import secrets
import logging

# --- Logging setup ---
logging.basicConfig(level=logging.INFO)

router = APIRouter()
reset_tokens = {}  # Temporary in-memory token store (for demo)

# --- Forgot Password ---
@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # 1️⃣ Check if user exists
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2️⃣ Generate token
    token = secrets.token_urlsafe(32)
    reset_tokens[token] = user.id

    # 3️⃣ Create reset link
    reset_link = f"http://localhost:5173/reset-password/{token}"

    # 4️⃣ Log reset link (terminal will show immediately)
    logging.info(f"Reset link (local dev): {reset_link}")

    return {"message": "Password reset link sent successfully ✅"}

# --- Reset Password ---
@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    # 1️⃣ Check if token is valid
    user_id = reset_tokens.get(req.token)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    # 2️⃣ Fetch user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 3️⃣ Update password
    user.password = hash_password(req.new_password)
    db.commit()

    # 4️⃣ Remove token from memory
    del reset_tokens[req.token]

    # 5️⃣ Return success message
    return {"message": "Password reset successfully ✅"}