"""Точка входа FastAPI; бизнес-логика пока не подключена."""

from fastapi import FastAPI

app = FastAPI(
    title="Онлайн-деканат API",
    description="Каркас API для командной разработки.",
    version="0.1.0",
)


@app.get("/api/v1/health", tags=["health"])
def health_check() -> dict[str, str]:
    """Проверка доступности сервера; готовность OCR/LLM пока не проверяется."""
    return {"status": "ok"}


# TODO: подключить роутер анализа после утверждения контракта API.
# TODO: не фиксировать схему results.json до получения спецификации организаторов.