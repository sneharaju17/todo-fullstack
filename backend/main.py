from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models, schemas
from database import engine, get_db
from auth import hash_password, verify_password, create_access_token, get_current_user
from routes.auth_routes import router as auth_router

# ✅ RAG + LLM imports
from rag_service import store_todos, query_rag
from llm_service import generate_answer

app = FastAPI()

# Include auth routes
app.include_router(auth_router)

# Create tables
models.Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Home
# ---------------------------
@app.get("/")
def home():
    return {"message": "API running"}

# ---------------------------
# Signup
# ---------------------------
@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if len(user.password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password too long")

    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = models.User(
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Signup successful"}

# ---------------------------
# Login
# ---------------------------
@app.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    access_token = create_access_token({"user_id": db_user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email
        }
    }

# ---------------------------
# TODOS
# ---------------------------
@app.post("/todos")
def create_todo(
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_todo = models.Todo(
        title=todo.title,
        category=todo.category,
        due_date=todo.due_date,
        owner_id=current_user.id
    )

    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return new_todo


@app.get("/todos")
def get_todos(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Todo).filter(
        models.Todo.owner_id == current_user.id
    ).all()


# ---------------------------
# GET SINGLE TODO ✅ ADD THIS
# ---------------------------
@app.get("/todos/{todo_id}")
def get_single_todo(
    todo_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.owner_id == current_user.id
    ).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    return todo
@app.put("/todos/{todo_id}")
def update_todo(
    todo_id: int,
    updated_todo: schemas.TodoCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.owner_id == current_user.id
    ).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    todo.title = updated_todo.title
    todo.category = updated_todo.category
    todo.due_date = updated_todo.due_date

    db.commit()
    db.refresh(todo)

    return {"message": "Todo updated"}


@app.delete("/todos/{todo_id}")
def delete_todo(
    todo_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    todo = db.query(models.Todo).filter(
        models.Todo.id == todo_id,
        models.Todo.owner_id == current_user.id
    ).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()

    return {"message": "Todo deleted"}

# ---------------------------
# 🔥 AI QUERY (RAG + LLM)
# ---------------------------
@app.post("/ai-query")
def ai_query(
    question: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1️⃣ Fetch todos
    todos = db.query(models.Todo).filter(
        models.Todo.owner_id == current_user.id
    ).all()

    if not todos:
        return {"answer": "No tasks found"}

    # 2️⃣ Store in vector DB
    store_todos(todos)

    # 3️⃣ Get relevant context
    context = query_rag(question)

    # ✅ DEBUG HERE
    print("CONTEXT 👉", context)

    # 4️⃣ Generate AI answer
    answer = generate_answer(context, question)

    return {"answer": answer}