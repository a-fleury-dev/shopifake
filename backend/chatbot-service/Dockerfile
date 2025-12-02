FROM python:3.11-slim

WORKDIR /app

COPY . .

# Install runtime dependencies
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
 && pip install --no-cache-dir --timeout 120 fastapi uvicorn[standard] requests qdrant-client openai

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
