# Service Management System

A microservices-based Service Management System that enables customers to book home services, administrators to manage services and assignments, and technicians to accept and complete jobs. The platform is designed for scalability, modularity, and real-world service workflows.

---

## 📌 Features

* **Customer Service Booking:** Manage dates, time slots, services, and categories.
* **Admin Management Dashboard:** Service catalog control, technician approval, and job assignments.
* **Technician Workflow:** Accept, start, and complete jobs in real-time.
* **Role-Based Access Control (RBAC):** Secure access levels for Admin, Customer, and Technician.
* **Event-Driven Notifications:** Asynchronous communication using **RabbitMQ**.
* **Containerized Deployment:** Orchestrated using **Docker & Docker Compose**.
* **CI/CD Pipeline:** Fully automated via **Jenkins**, **SonarQube**, and **JaCoCo**.

---

## 🧱 Architecture Overview

* **Architecture Style:** Microservices
* **Communication:** * **Synchronous:** REST APIs
    * **Asynchronous:** RabbitMQ
* **Deployment:** Docker containers (cloud-agnostic)
* **Data Isolation:** Each service maintains its own MongoDB database (No shared storage).

### Core Services
* **API Gateway:** Single entry point for routing requests.
* **Auth Service:** Registration, login, and internal user validation.
* **Booking Service:** Lifecycle of bookings (Create, Reschedule, Cancel).
* **Service Management:** Service catalog and category availability.
* **Technician Service:** Onboarding, document upload, and skill tracking.
* **Assignment Service:** Core logic for job distribution and status updates.
* **Notification Service:** RabbitMQ consumer for real-time alerts.
<img width="940" height="506" alt="image" src="https://github.com/user-attachments/assets/38087224-693f-43a1-9cd4-9ff5f92cd6ba" />

---

## ⚙️ Technology Stack

### Backend
* **Java 17**
* **Spring Boot** (Web, Data MongoDB, Validation, Security)
* **MongoDB** (Database-per-service)
* **RabbitMQ** (Messaging)

### Frontend
* **Angular**
* **Angular Material**
* **RxJS**

### DevOps & Testing
* **Docker & Docker Compose**
* **Jenkins** (CI/CD)
* **SonarQube** (Code Quality)
* **JaCoCo** (Code Coverage)
* **JUnit 5 & Mockito** (Backend Testing)
* **Jasmine & Karma** (Frontend Testing)

---

## 🔐 User Roles

| Role | Responsibilities |
| :--- | :--- |
| **Admin** | Manage catalog, approve technicians, assign/reassign jobs. |
| **Customer** | Book services, view history, reschedule or cancel. |
| **Technician** | Manage profile, accept jobs, and update job progress. |

---

## 🚀 CI/CD Pipeline (Jenkins)

1.  **Checkout:** Pulls source code from GitHub.
2.  **Build:** Compiles and packages using `mvn package`.
3.  **Static Analysis:** Code quality check via **SonarQube**.
4.  **Coverage:** Generates **JaCoCo** reports.
5.  **Deployment:** * Stops and removes old containers.
    * Builds new Docker images.
    * Runs `docker compose up`.
<img width="1024" height="1536" alt="Jenkins Pipeline Workflow" src="https://github.com/user-attachments/assets/7316415e-f598-4d0e-9e5d-e3271c2eb409" />
<img width="940" height="677" alt="image" src="https://github.com/user-attachments/assets/030474ec-c48b-46de-85f1-54e53404fb9e" />

---

## ▶️ Running the Project Locally

### Prerequisites
* Java 17
* Node.js & Angular CLI
* Docker & Docker Compose

### Steps
1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/service-management-system.git](https://github.com/your-username/service-management-system.git)
    cd service-management-system
    ```
2.  **Build the backend**
    ```bash
    mvn clean package
    ```
3.  **Launch services**
    ```bash
    docker compose up --build
    ```
4.  **Launch frontend**
    ```bash
    cd frontend
    npm install
    ng serve
    ```

---

## 📊 Database Design

Each service is mapped to a dedicated database:
* `auth_db` → users
* `booking_db` → customer-bookings
* `service_management` → services
* `technician_db` → technicians
* `assignment_db` → assignments
* `notification_db` → notification logs
<img width="940" height="1252" alt="image" src="https://github.com/user-attachments/assets/42257b75-fa7f-48e6-87f6-515163a14b21" />

---

## 🔮 Future Scope
* **Payments:** Integration with UPI, Cards, and Wallets.
* **Smart Assignment:** Auto-assignment based on GPS location.
* **Reviews:** Rating system for technicians.
* **Scaling:** Migration to **Kubernetes (K8s)**.
* **Mobile:** Dedicated Android and iOS applications.

---

## 📘 Learnings
* Implemented a fully decoupled Microservices architecture.
* Handled inter-service communication using both REST and RabbitMQ.
* Automated the full SDLC with a Jenkins-based CI/CD pipeline.
* Ensured 80%+ code coverage using JaCoCo and unit testing best practices.

---
**License:** This project is developed for academic and learning purposes.
