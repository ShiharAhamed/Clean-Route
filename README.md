# CleanRoute LK 🇱🇰

A lightweight waste collection schedule management and issue tracking system designed for Sri Lankan communities. Built for a 4-hour mini hackathon.

---
## Live Frontend
https://clean-route-khaki.vercel.app/

## Live Backend
https://clean-route-production.up.railway.app/


## 👥 Team Workload & Component Separation

| Developer | Component | Key Responsibility |
| :--- | :--- | :--- |
| **Dev 1** | **Collection Schedule Management** | Manage and display waste collection schedules by area, day, time, and type. |
| **Dev 2** | **Waste Issue Reporting** | Citizen portal to report missed collections, overflowing waste, and illegal dumping. |
| **Dev 3** | **Collection Task Management** | Municipal dashboard to process reports, update statuses, and add resolution notes. |
| **Dev 4** | **Community Status & Dashboard** | High-level metrics, report status distribution, and area breakdowns. |

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite, Axios, Pure CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **API**: RESTful JSON API

---

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```


### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```


---

## 📡 API Contract

### Schedules
- `GET /api/schedules` - List all schedules
- `GET /api/schedules/:id` - Get schedule by ID
- `POST /api/schedules` - Create a schedule
- `PUT /api/schedules/:id` - Update a schedule
- `DELETE /api/schedules/:id` - Delete a schedule

### Reports
- `GET /api/reports` - List all reports (supports filtering)
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Submit a new report
- `PUT /api/reports/:id` - Update report status / resolution
- `DELETE /api/reports/:id` - Delete a report

### Statistics
- `GET /api/stats` - Summary statistics for dashboard
