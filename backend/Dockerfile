FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

WORKDIR /app/booking_project

EXPOSE 8080

CMD ["daphne", "-b", "0.0.0.0", "-p", "8080", "booking_project.asgi:application"]