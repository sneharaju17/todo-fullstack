from transformers import pipeline

# ✅ (Optional now, not used but safe to keep)
generator = pipeline(
    "text-generation",
    model="distilgpt2"
)

def generate_answer(context, question):
    lines = context.split("\n")

    tasks = []

    task = None
    category = None
    due = None

    for line in lines:
        line = line.strip()

        if line.lower().startswith("task:"):
            task = line.replace("Task:", "").strip()

        elif line.lower().startswith("category:"):
            category = line.replace("Category:", "").strip()

        elif line.lower().startswith("due date:"):
            due = line.replace("Due Date:", "").strip()

            # ✅ when all 3 found → create task
            if task and category and due:

                # 🔥 REMOVE DUMMY DATA
                if task.lower() == "string":
                    task = None
                    category = None
                    due = None
                    continue

                tasks.append(f"- {task} ({category}, {due})")

                # reset for next block
                task = None
                category = None
                due = None

    # ✅ remove duplicates
    unique_tasks = list(dict.fromkeys(tasks))

    return "\n".join(unique_tasks) if unique_tasks else "No tasks found"