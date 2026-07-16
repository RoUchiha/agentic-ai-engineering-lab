FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml ./
COPY agent_api ./agent_api
RUN pip install --no-cache-dir .
EXPOSE 8000
CMD ["uvicorn", "agent_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
