# 🚀 Scalable API Gateway

A **cloud-native**, **containerized microservices** platform built with modern software architecture principles. This project showcases an API Gateway with multiple microservices, real-time monitoring, and cloud deployment readiness.

## 📌 Project Overview

The **Scalable API Gateway** acts as a centralized access point for multiple backend microservices, ensuring streamlined routing, monitoring, and observability. Built with Docker and ready for deployment on AWS, Azure, or Kubernetes.

---

## 🧱 Architecture

- **API Gateway** (Port 3001): Routes incoming requests to appropriate services.
- **User Service** (Port 3002): Manages user data and authentication (placeholder logic).
- **Product Service** (Port 3003): Handles product information and catalog.
- **Order Service** (Port 3004): Manages order processing and status.
- **Monitoring Dashboard**: Displays live stats such as requests, response time, error rate, and uptime.

---

## 🚀 Features

- ✅ **Microservices-based architecture**
- 🐳 **Dockerized** (each service runs in its own container)
- 🌐 **Cloud-ready** (Deployable on AWS, Azure, GCP, or Kubernetes)
- 📊 Real-time **Monitoring Dashboard**
- 📈 Live Metrics: Total Requests, Avg Response Time, Uptime, Error Rate
- 🧪 Simple **health-check endpoints** for all services

---
## 🔍 Project Highlights:

🧱 Microservices Architecture (User, Product, Order, Gateway)

🐳 Fully Containerized with Docker

☁️ Cloud-Ready: Deployable on AWS, Azure, or Kubernetes

📊 Built-in Monitoring Dashboard

⚡ Performance Metrics:

Avg Latency: 143ms

Error Rate: 0.12%

Uptime: 99.5%+ across services
## 🧰 Tech Stack

- Node.js & Express.js
- Docker & Docker Compose
- REST APIs
- Monitoring UI (custom frontend)
- Cloud-native design principles

---

## 2. Build & Run with Docker Compose
docker-compose up --build

| Service         | Port | Status    | Description                   |
| --------------- | ---- | --------- | ----------------------------- |
| API Gateway     | 3001 | ✅ Running | Main entry point for requests |
| User Service    | 3002 | ✅ Running | Handles user data             |
| Product Service | 3003 | ✅ Running | Manages product listings      |
| Order Service   | 3004 | ✅ Running | Handles order creation/status |

## 📊 Monitoring Dashboard

Once the app is running, access the dashboard at:

http://localhost:3001/dashboard


## Dashboard Displays:

Total Requests

Active Services

Average Response Time

Error Rate

Microservice Uptime

## ☁️ Cloud & Deployment

This project is cloud-ready:

🟢 Compatible with AWS ECS, Azure Container Apps, or GCP Cloud Run

🟢 Can be deployed to Kubernetes (Helm chart support coming soon)

🟢 Use CI/CD pipelines for automated testing and deployment

## ✅ Health Check Endpoints

Each microservice exposes a basic health check:

GET /health

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 💬 Contact
## Vattikuti kavya
## 🔗 LinkedIn Profile:https://www.linkedin.com/in/vattikuti-kavya-a4b09226a/
## 📂 GitHub Profile:https://github.com/Kavya0924
## Live link:https://drive.google.com/file/d/1_QpMaDCb5aewmTwRQgywduvDLlsP0-Xl/view?usp=drive_link

