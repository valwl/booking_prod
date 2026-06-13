# Booking Platform — Distributed Full-Stack Booking System



Production-style apartment booking platform with asynchronous booking workflows, payment processing, 
and real-time status updates.


The system is designed with domain separation, lifecycle management, asynchronous processing,
and real-time updates in mind.

---


# 🚀 Project Overview

This project implements a full-stack booking system where users can:

- Register and authenticate via JWT
- Create and manage apartments
- Book available dates
- Process payments via Stripe
- Receive real-time booking status updates
- Leave reviews
- Manage profile settings

---


# 🧱 Core Domain Design

The backend is separated into three main domains:


## 1️⃣ Apartment Domain

Responsible for:

- Apartment CRUD
- Permission-based access control
- Owner restrictions
- Review system

Key principles:

- Only apartment owners can update/delete
- Reviews are linked to completed bookings
- Clean separation from booking lifecycle

---


## 2️⃣ Booking Domain (Core Lifecycle Engine)

Booking is the central lifecycle entity of the system.

It behaves as a state machine:

PENDING → PAID → COMPLETED  

       ↘ CANCELLED

### Booking Flow

1. User creates booking → status = PENDING
2. Stripe checkout session is initiated
3. Celery schedules auto-cancel task (30 minutes)
4. WebSocket connection opens for real-time updates
5. Stripe webhook confirms payment
6. Status → PAID
7. Cancel task is revoked
8. Celery Beat later marks booking → COMPLETED

### Key Responsibilities

- Prevent double-booking
- Validate date ranges
- Ensure atomic state transitions
- Handle async payment confirmation
- Synchronize distributed components

---



## 3️⃣ User Domain

Custom authentication system:

- Authentication and authorization 
- JWT token lifecycle
- User profile manager


Authentication uses:

- Django REST Framework
- Simple JWT

---


# 🏗 Backend Architecture

Backend Components:

- Django REST Framework — REST API and domain layer
- PostgreSQL — primary data store
- Redis — message broker and channel layer
- Celery — background task execution
- Celery Beat — scheduled workflows
- Django Channels — WebSocket communication
- Daphne — ASGI application server



### Architectural Style

The backend follows a layered architecture:

- API layer handles request validation and serialization
- Service layer contains business workflows
- Domain models enforce business rules
- Background workers execute asynchronous tasks
- Webhooks integrate external payment events
- WebSockets synchronize state with connected clients

---

# ⚡ Async & Real-Time Layer

The booking lifecycle involves delayed actions, external payment confirmation, and real-time client updates.
To support these requirements, the system uses Celery, Stripe webhooks, and WebSockets.

## Celery

Used for:

- Auto-cancel unpaid bookings after 30 minutes
- Scheduled status transitions (via Celery Beat)


Ensures:

- Time-based logic is decoupled from request cycle
- Background processing reliability



## Stripe Webhooks

Stripe confirms payment asynchronously.

Webhook responsibilities:

- Validate event authenticity
- Ensure idempotent processing
- Update booking state atomically
- Trigger WebSocket notification


## WebSockets

Implemented using Django Channels.

Used for:

- Live booking status updates
- Client synchronization during payment lifecycle

---


# 💻 Frontend Architecture

## Built with:

- React
- Redux Toolkit
- React Router
- Axios
- Date Picker


## Features:

- Authentication
- Apartment management
- Booking workflows
- Real-time booking updates


## Global State

Redux manages:

- Authentication state
- Booking lifecycle state
- WebSocket state
- Timer provider state


WebSocket provider activates after booking creation and remains active until payment success or cancellation.

---


# 🔐 Security & Data Integrity

- JWT authentication (access + refresh tokens)
- Permission-based access control
- Booking date validation
- Atomic state updates
- Stripe webhook signature verification
- Cancel-task revocation after successful payment

---


# 🐳 Infrastructure

Fully containerized:

The application runs as a multi-service Docker Compose environment:

- Frontend
- Backend API
- PostgreSQL
- Redis
- Celery Worker
- Celery Beat

---


# 🧠 Engineering Challenges

This project addresses several non-trivial challenges:


### 1️⃣ Preventing Double Booking

Ensuring overlapping date validation at the database level.


### 2️⃣ Race Conditions

Handling potential conflicts between:

- Stripe webhook confirmation
- Scheduled auto-cancel task


### 3️⃣ Distributed State Synchronization

Keeping consistency between:

- Backend state
- Celery tasks
- WebSocket updates
- Client UI state


### 4️⃣ Idempotent Webhook Handling

Ensuring repeated webhook events do not corrupt booking state.

---


# Design Decisions

- WebSockets were chosen for real-time booking updates.
- Celery handles delayed and scheduled operations.
- Redis acts as a broker for asynchronous communication.


# 🛠 Setup Instructions


## 1️⃣ Clone repository

git clone <repo_url>


## 2️⃣ Run with Docker

docker-compose up --build

Services will start:

- Backend
- Postgres
- Redis
- Celery worker
- Celery Beat
- frontend


---


# 🧪 Future Improvements

- Increase automated test coverage
- Add email notification workflows
- Improve caching and performance optimization

---


# 📌 Summary

This project demonstrates:

- Backend domain architecture
- Async event-driven design
- Real-time communication
- Payment integration
- Containerized infrastructure
- Full-stack lifecycle management

