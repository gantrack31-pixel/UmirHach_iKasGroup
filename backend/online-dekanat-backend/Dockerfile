FROM python:3.13-slim-bookworm AS build
ENV PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential pkg-config libtesseract-dev libleptonica-dev curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
WORKDIR /build
COPY requirements.txt ./
RUN python -m pip install --upgrade pip \
    && python -m pip install --index-url https://download.pytorch.org/whl/cpu "torch==2.14.1" \
    && python -m pip install -r requirements.txt \
    && python -m pip check
RUN mkdir -p /build/tessdata \
    && curl --fail --location --retry 3 \
       https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/4.1.0/rus.traineddata \
       --output /build/tessdata/rus.traineddata \
    && echo 'e16e5e036cce1d9ec2b00063cf8b54472625b9e14d893a169e2b0dedeb4df225  /build/tessdata/rus.traineddata' | sha256sum --check

FROM python:3.13-slim-bookworm
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 \
    QUESTION_MODEL_CACHE=/app/models/llm HF_HUB_DISABLE_XET=1
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr libgomp1 ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --uid 10001 app
COPY --from=build /opt/venv /opt/venv
WORKDIR /app
COPY --from=build --chown=app:app /build/tessdata /app/models/tessdata
COPY --chown=app:app main.py ./
COPY --chown=app:app services ./services
RUN mkdir -p /app/models/llm && chown app:app /app/models/llm
USER app
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
