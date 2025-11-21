FROM python:3.11-slim

WORKDIR /app

COPY main.py .

# Install runtime dependencies
RUN pip install --no-cache-dir fastapi uvicorn[standard] requests qdrant-client

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
