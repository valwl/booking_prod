# Booking Platform — Distributed Full-Stack Booking System



Production-style apartment booking platform inspired by Airbnb / Booking.com.



The system is designed with domain separation, lifecycle management, asynchronous processing, and real-time updates in mind.



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



The architecture emphasizes:



- Domain-driven separation

- Thin API layer

- Business logic isolation

- Event-driven async processing

- Real-time communication

- Containerized infrastructure



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



- Registration / Login

- JWT-based auth (access + refresh)

- Token rotation logic

- Password change

- User settings

- Portfolio management



Authentication uses:

- Django REST Framework

- Simple JWT



---



# 🏗 Backend Architecture



Built with:



- Django REST Framework

- Celery

- Redis

- Django Channels

- Daphne (ASGI server)

- Docker & Docker Compose



### Architectural Style



- Domain-based separation

- Thin View layer

- Service-level business logic

- Async task processing

- Event-driven webhook handling

- Real-time WebSocket updates



---



# ⚡ Async & Real-Time Layer



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



Built with:



- React

- Redux Toolkit

- React Router

- Axios

- Date Picker



### Structure



Feature-based domain organization:



features/

    booking/

    apartment/

    user/



Layers:



- redux/

- components/

- hooks/

- pages/

- ui/



### Global State



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



Services:



- Backend (DRF)

- Redis

- Celery worker

- Celery Beat

- Daphne ASGI server



Benefits:



- Reproducible environment

- Clear service separation

- Production-style deployment readiness



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



# 📊 Trade-offs & Design Decisions



### Why WebSockets instead of polling?

To provide real-time booking status updates without unnecessary API requests.



### Why Celery?

To isolate time-based and background operations from synchronous API logic.



### Why Redis?

As broker for Celery and Channels layer.



### Why Domain Separation?

To reduce coupling and increase maintainability.



### Trade-offs

- Increased architectural complexity

- Async flow requires careful orchestration

- More moving parts compared to monolithic sync apps



---



# 🛠 Setup Instructions



## 1️⃣ Clone repository



git clone <repo_url>



## 2️⃣ Run with Docker



docker-compose up --build



Services will start:



- Backend

- Redis

- Celery worker

- Celery Beat

- Daphne



## 3️⃣ Frontend



cd frontend  

npm install  

npm run dev



---



# 🧪 Future Improvements



- Add database-level locking strategies

- Increase automated test coverage

- Introduce event-driven architecture abstraction

- Add email notification service

- Add caching layer for apartment listing

- Implement CQRS for booking domain



---



# 🎯 Interview Talking Points



When discussing this project in interviews:



- Explain booking lifecycle as a state machine

- Describe race condition prevention strategy

- Explain webhook idempotency handling

- Discuss distributed consistency challenges

- Describe separation of concerns

- Explain async task orchestration

- Discuss trade-offs of real-time architecture



---



# 📌 Summary



This project demonstrates:



- Backend domain architecture

- Async event-driven design

- Real-time communication

- Payment integration

- Containerized infrastructure

- Full-stack lifecycle management



The system goes beyond CRUD and reflects production-level architectural thinking.