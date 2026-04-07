from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document

# ✅ Embedding
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# ✅ Global DB (create once)
vector_db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embedding
)

# ---------------------------
# Store TODOS
# ---------------------------
def store_todos(todos):
    docs = []

    for todo in todos:
        print("TODO:", todo.title, todo.category, todo.due_date)

        # ✅ SIMPLE FORMAT (VERY IMPORTANT)
        text = f"TODO: {todo.title} {todo.category} {todo.due_date}"

        docs.append(Document(page_content=text))

    # ❌ DO NOT DELETE COLLECTION
    # ❌ DO NOT RECREATE DB

    if docs:
        vector_db.add_documents(docs)


# ---------------------------
# Query RAG
# ---------------------------
def query_rag(question: str):
    results = vector_db.similarity_search(question, k=3)

    print("RESULTS 👉", results)   # 👈 DEBUG

    context = "\n".join([doc.page_content for doc in results])

    return context