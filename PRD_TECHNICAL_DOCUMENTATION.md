# Product Requirement Document (PRD) & Technical Architecture
## Real-Time Property Rental, Maintenance & Amenity Management Platform (PropSync)

---

### 1. Executive Summary & Problem Statement

Traditional rental and property management systems rely heavily on manual coordination (phone calls, unorganized messaging, offline paper schedules), leading to:
- Lack of real-time maintenance request tracking
- Poor visibility of issue status between tenants and property owners
- Amenity booking conflicts due to untracked shared facility schedules
- Delayed issue resolution exceeding acceptable SLA windows

**PropSync** is a centralized digital web platform designed to streamline rental operations for tenants, property managers, and facility staff. The system provides real-time maintenance request tracking, transparent communication, and conflict-free amenity booking with defined check-in and check-out timings.

---

### 2. Primary & Secondary Objectives

#### Primary Objectives
- **Centralize Information**: Aggregate property details, tenant units, maintenance requests, and amenity schedules into a single digital platform.
- **Real-Time Maintenance Tracking**: Enable live status updates (Pending $\rightarrow$ In Progress $\rightarrow$ Completed) with timestamped audit logs.
- **Conflict-Free Amenity Management**: Prevent double-booking for shared amenities using a collision detection engine.
- **Transparent Communication**: Provide real-time dashboards for tenants and managers.

#### Key Performance Indicators (KPI Targets)
- **Maintenance Resolution Time**: $\le 48$ hours average
- **Request Completion Rate**: $\ge 90\%$
- **Amenity Booking Conflicts**: $0$ (Zero double bookings)
- **System Response Latency**: $\le 2$ seconds
- **User Satisfaction Score**: $\ge 4.0 / 5.0$

---

### 3. System Architecture & Tech Stack

The system follows a modern **MERN Stack** architecture augmented with **WebSockets** for real-time synchronization:

```
[ Frontend Client ] <---> [ Socket.io / WebSockets ] <---> [ Backend API Server ] <---> [ Database Engine ]
React (Vite) / Tailwind        Real-Time State Sync           Express.js / Node.js        MongoDB / In-Memory
```

- **Frontend**: React 18, Tailwind CSS, Glassmorphic Styling, Lucide Icons
- **Backend Server**: Node.js, Express.js
- **Real-Time Layer**: Socket.io (Broadcasting ticket status changes & amenity reservations live across all connected clients)
- **Database Engine**: MongoDB (Mongoose models + DBStore fallback engine for zero-dependency instant execution)

---

### 4. Functional Modules & Workflows

#### 4.1 Maintenance Management Module
- **Request Creation**: Tenants submit tickets with title, category (Plumbing, Electrical, HVAC, Carpentry, Appliance, General), priority level (Low, Medium, High, Emergency), unit number, and detailed description.
- **Live Status Transition**: Property managers/staff can dispatch staff and transition status (`Pending` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`).
- **Audit Logs**: Every status change generates an immutable log entry with timestamp and staff notes.
- **Resolution Tracking**: Automatically computes resolution duration upon ticket completion to verify the $\le 48\text{h}$ SLA.

#### 4.2 Amenity Booking & Collision Prevention Engine
- **Availability Matrix**: Displays operating hours, maximum capacity, and live status for all property amenities.
- **Slot Reservation**: Users pick reservation date, check-in time, check-out time, and guest count.
- **Conflict Prevention Algorithm**:
  $$\text{Overlap} = (T_{\text{checkin, new}} < T_{\text{checkout, existing}}) \land (T_{\text{checkin, existing}} < T_{\text{checkout, new}})$$
  If an overlap is detected on the same date for the same amenity, the system rejects the booking with an HTTP 409 status and displays a visual warning, ensuring **0 booking conflicts**.

#### 4.3 Interactive Real-Time Dashboards
- **Operations Center**: Displays active tickets count, KPI metrics, amenity usage, and real-time activity stream.
- **Role Switcher**: Instant switching between **Tenant View** and **Property Manager View** for demonstration and testing.
- **Analytics & SLA Audit**: Metrics page evaluating actual system metrics against KPI targets.

---

### 5. Core Data Schemas

#### User Schema
```json
{
  "id": "String",
  "name": "String",
  "email": "String",
  "role": "tenant | manager | staff",
  "propertyId": "String",
  "unitNumber": "String",
  "avatar": "String"
}
```

#### Maintenance Request Schema
```json
{
  "id": "String",
  "requestId": "String (MR-2026-XXX)",
  "propertyId": "String",
  "propertyName": "String",
  "unitNumber": "String",
  "tenantId": "String",
  "tenantName": "String",
  "title": "String",
  "issueDescription": "String",
  "category": "String",
  "priority": "Low | Medium | High | Emergency",
  "status": "Pending | In Progress | Completed",
  "assignedStaff": "String",
  "createdDate": "ISO Timestamp",
  "resolutionDate": "ISO Timestamp | null",
  "statusLogs": [
    { "status": "String", "timestamp": "ISO Timestamp", "note": "String" }
  ]
}
```

#### Amenity Booking Schema
```json
{
  "id": "String",
  "bookingId": "String (BK-XXXX)",
  "amenityId": "String",
  "amenityName": "String",
  "userId": "String",
  "userName": "String",
  "unitNumber": "String",
  "bookingDate": "YYYY-MM-DD",
  "checkInTime": "HH:MM",
  "checkOutTime": "HH:MM",
  "guestsCount": "Number",
  "status": "Confirmed | Cancelled"
}
```

---

### 6. Verification & Delivery Files

The project files are created in `d:\Flutter Projects\property_management_platform`:
1. `index.html`: Standalone production web app bundle (Open directly in any web browser to test all real-time features instantly).
2. `server/`: Complete MERN Node.js + Express + Socket.io + Mongoose backend REST API server.
3. `client/`: Complete React (Vite) + Tailwind + Glassmorphism frontend source code.
4. `PRD_TECHNICAL_DOCUMENTATION.md`: Technical documentation and project requirements guide.
