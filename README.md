# CivicConnect – BMC/TMC Complaint Management System
> **Full Stack Java Programming (FSJP) College Mini Project**
> An integrated Civic Grievance Redressal and Municipal Complaint Management Platform for Brihanmumbai Municipal Corporation (BMC) & Thane Municipal Corporation (TMC).

---

## 1. Project Overview

**CivicConnect** is a full-stack municipal grievance management system developed to bridge the communication gap between citizens and municipal corporations (BMC and TMC). The system enables citizens to easily report urban civic problems (such as garbage overflow, potholes, broken streetlights, contaminated water, clogged drains, and illegal construction) with geolocation and photo attachments, while giving municipal officers a centralized analytics and operations dashboard to assign, track, update, and resolve civic complaints.

```
+---------------------------------------------------------------------------------------------------+
|                                         CIVICCONNECT WORKFLOW                                     |
+---------------------------------------------------------------------------------------------------+
|  Citizen Registers/Logs in                                                                        |
|         │                                                                                         |
|         ▼                                                                                         |
|  Citizen Submits Complaint (Category, Priority, BMC/TMC, Location, Photo, Coordinates)            |
|         │                                                                                         |
|         ▼                                                                                         |
|  System Generates Unique Complaint ID (e.g. CMP-2026-0001) & Stores in MySQL Database             |
|         │                                                                                         |
|         ▼                                                                                         |
|  Municipal Admin Reviews on Dashboard & Assigns Department (Roads/Waste/Water) + Field Officer    |
|         │                                                                                         |
|         ▼                                                                                         |
|  Field Officer Dispatches Crew & Updates Lifecycle Status (In Progress -> Resolved)              |
|         │                                                                                         |
|         ▼                                                                                         |
|  Citizen Tracks Live Progress via Public Tracker / Citizen Portal & Leaves 5-Star Feedback        |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Technology Stack

### Backend
* **Java**: OpenJDK 17+ (Compatible up to latest OpenJDK 26)
* **Framework**: Spring Boot 3.2+
* **Modules**:
  * Spring Web (RESTful API Architecture)
  * Spring Data JPA & Hibernate ORM
  * Spring Security 6 with JWT (JSON Web Tokens) & BCrypt Hashing
  * Bean Validation (Jakarta Validation)
* **Database**: MySQL 8.0+ (with optional H2 in-memory test profile)
* **Build Tool**: Apache Maven 3.9+

### Frontend
* **Library**: React 18
* **Build Tool**: Vite 5
* **Styling**: Tailwind CSS 3 with custom Municipal Theme
* **Icons**: Lucide React
* **Charts**: Chart.js & React-Chartjs-2
* **HTTP Client**: Axios with centralized API interceptor
* **Routing**: React Router DOM v6

---

## 3. Key Features

### For Citizens
1. **User Authentication**: Secure signup and login with BCrypt encrypted passwords and JWT tokens.
2. **Citizen Dashboard**: Summary KPI cards (Total Filed, Under Review, In Progress, Resolved, Rejected) and recent complaints list.
3. **Complaint Submission**:
   * Selection between **BMC (Mumbai)** and **TMC (Thane)**.
   * 12 distinct civic categories (Potholes, Garbage, Water Supply, Drainage, Streetlights, etc.).
   * Priority selection (Low, Medium, High, Urgent).
   * Real photo file upload with preview.
   * GPS Coordinates auto-detection via browser geolocation.
4. **Public Complaint Tracker**: Public search by Complaint ID (e.g. `CMP-2026-0001`) with visual step-by-step progress timeline.
5. **My Complaints & Details**: View status history, assigned municipal department, assigned officer contact, and official remarks.
6. **Citizen Feedback**: 5-star rating and satisfaction review on resolved complaints.

### For Municipal Officers & Admins
1. **Operations Command Dashboard**:
   * Real-time KPI metrics (Total, Submitted, Under Review, In Progress, Resolved, Urgent Priority).
   * Interactive Charts: Complaints by Category, Status distribution, BMC vs TMC breakdown, and Department workload.
2. **Comprehensive Complaint Management**:
   * Full-text search by ID, Citizen Name, Location, or Keyword.
   * Multi-criteria filtering by Status, Category, Priority, Corporation (BMC/TMC), and Department.
   * Pagination support.
3. **Status Workflow Management**: Update complaint status (`SUBMITTED` ➔ `UNDER_REVIEW` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `RESOLVED` ➔ `CLOSED` / `REJECTED`) with official resolution remarks.
4. **Department & Officer Routing**: Assign complaints to specific departments and municipal field officers.
5. **Department & Officer CRUD**: Manage municipal departments and add/edit officer profiles.

---

## 4. Complaint Categories & Lifecycle Statuses

### Categories
1. Garbage & Waste
2. Potholes & Roads
3. Streetlights
4. Water Supply
5. Drainage & Sewage
6. Sanitation
7. Public Toilets
8. Traffic & Parking
9. Illegal Construction
10. Tree & Garden Issues
11. Public Property Damage
12. Other Civic Issues

### Status Badges
* `SUBMITTED` (Blue)
* `UNDER_REVIEW` (Yellow/Amber)
* `ASSIGNED` (Indigo)
* `IN_PROGRESS` (Orange)
* `RESOLVED` (Emerald Green)
* `REJECTED` (Red/Rose)
* `CLOSED` (Slate Gray)

---

## 5. Database Schema (`civic_complaint_management`)

```
+------------------+         +-----------------------+         +----------------------+
|      users       |         |      complaints       |         |     departments      |
+------------------+         +-----------------------+         +----------------------+
| id (PK)          |<---+    | id (PK)               |    +--->| id (PK)              |
| name             |    |    | complaint_number (UQ) |    |    | name                 |
| email (UQ)       |    +----| citizen_id (FK)       |    |    | municipal_corporation|
| password (hash)  |         | title                 |    |    +----------------------+
| phone            |         | description           |    |               ^
| role             |         | category              |    |               |
| created_at       |         | status                |    |               | (FK)
+------------------+         | priority              |    |               |
                             | municipal_corporation |    |    +----------------------+
                             | location              |    |    |       officers       |
                             | area                  |    |    +----------------------+
                             | pincode               |    |    | id (PK)              |
                             | image_url             |    |    | name                 |
                             | latitude              |    |    | email (UQ)           |
                             | longitude             |    |    | phone                |
                             | department_id (FK)----+----+    | department_id (FK)---+
                             | assigned_officer_id(FK)-------->| created_at           |
                             | resolution_remarks    |         +----------------------+
                             | created_at            |
                             | updated_at            |
                             | resolved_at           |
                             +-----------------------+
                                  |              |
                                  | (1:N)        | (1:1)
                                  v              v
                     +--------------------+  +--------------------+
                     | complaint_history  |  |      feedback      |
                     +--------------------+  +--------------------+
                     | id (PK)            |  | id (PK)            |
                     | complaint_id (FK)  |  | complaint_id (FK)  |
                     | old_status         |  | rating (1 to 5)   |
                     | new_status         |  | comment            |
                     | comment            |  | citizen_id (FK)    |
                     | updated_by         |  | created_at         |
                     | created_at         |  +--------------------+
                     +--------------------+
```

---

## 6. REST API Endpoints Catalog

| Method | Endpoint | Access | Description |
|---|---|---|---|
| **POST** | `/api/auth/register` | Public | Register new Citizen account |
| **POST** | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| **GET** | `/api/auth/me` | Authenticated | Get current authenticated user profile |
| **POST** | `/api/complaints` | Citizen | Submit a new complaint |
| **GET** | `/api/complaints` | Authenticated | Search & filter complaints (paginated) |
| **GET** | `/api/complaints/{id}` | Authenticated | Get complaint details by ID |
| **GET** | `/api/complaints/track/{complaintNumber}` | Public | Publicly track complaint by `CMP-YYYY-XXXX` |
| **GET** | `/api/complaints/my` | Citizen | Get current citizen's submitted complaints |
| **PUT** | `/api/complaints/{id}` | Citizen/Admin | Update complaint information |
| **DELETE** | `/api/complaints/{id}` | Citizen/Admin | Delete complaint |
| **PUT** | `/api/admin/complaints/{id}/status` | Admin | Update complaint status & record audit remark |
| **PUT** | `/api/admin/complaints/{id}/assign` | Admin | Assign department and officer |
| **GET** | `/api/admin/dashboard` | Admin | Fetch summary KPIs and analytics chart data |
| **GET** | `/api/departments` | Public/Auth | List all municipal departments |
| **POST** | `/api/departments` | Admin | Create a new department |
| **PUT** | `/api/departments/{id}` | Admin | Edit department |
| **DELETE** | `/api/departments/{id}` | Admin | Delete department |
| **GET** | `/api/officers` | Public/Auth | List municipal officers |
| **POST** | `/api/officers` | Admin | Register new officer |
| **POST** | `/api/feedback` | Citizen | Submit post-resolution rating & comment |
| **POST** | `/api/upload` | Authenticated | Upload complaint photo evidence |

---

## 7. Demo Login Credentials

The application automatically seeds realistic sample complaints and demo accounts on first launch:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin / Municipal Officer** | `admin@civicconnect.com` | `admin123` | Full Admin Dashboard, Assignment & Status Updates |
| **Citizen (Rahul Sharma)** | `citizen@civicconnect.com` | `citizen123` | Submit Grievance, My Complaints, Feedback |
| **Citizen (Priya Patil)** | `priya@civicconnect.com` | `citizen123` | Submit Grievance, My Complaints |

**Sample Trackable Complaint IDs**:
* `CMP-2026-0001` (Garbage Overflow in Naupada, TMC - In Progress)
* `CMP-2026-0002` (Deep Potholes on WEH Bandra, BMC - Resolved with 5-Star Feedback)
* `CMP-2026-0003` (Streetlights Dark on Ghodbunder Road, TMC - Assigned)
* `CMP-2026-0005` (Drainage Overflow near Kurla Station, BMC - Resolved)

---

## 8. Installation & Setup Instructions

### Prerequisites
* **Java 17 or newer** (`java -version`)
* **Maven 3.8+** (`mvn -version`)
* **Node.js 18+ and npm** (`node -v`, `npm -v`)
* **MySQL Server** (Optional for local mode; Spring Boot includes auto-configuration)

---

### Step 1: MySQL Database Setup (Optional if using MySQL)
1. Start your MySQL service.
2. Open MySQL client or phpMyAdmin and execute:
```sql
CREATE DATABASE civic_complaint_management;
```
3. Update your credentials in `backend/src/main/resources/application.properties` or provide environment variables:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/civic_complaint_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

---

### Step 2: Run Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```
*(To run with instant In-Memory H2 profile for lab demonstration without configuring MySQL, run `mvn spring-boot:run -Dspring-boot.run.profiles=dev`)*

The backend will start on **`http://localhost:8080`**.

---

### Step 3: Run Frontend (React + Vite)

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **`http://localhost:5173`**.

---

## 9. Project Directory Structure

```
mini project of FSJP/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/civicconnect/
│           │   ├── CivicConnectApplication.java
│           │   ├── config/
│           │   │   ├── SecurityConfig.java
│           │   │   ├── JwtAuthenticationFilter.java
│           │   │   ├── JwtService.java
│           │   │   ├── WebConfig.java
│           │   │   └── DataInitializer.java
│           │   ├── controller/
│           │   │   ├── AuthController.java
│           │   │   ├── ComplaintController.java
│           │   │   ├── AdminController.java
│           │   │   ├── DepartmentController.java
│           │   │   ├── OfficerController.java
│           │   │   ├── FeedbackController.java
│           │   │   └── FileUploadController.java
│           │   ├── dto/
│           │   │   ├── AuthRequest.java
│           │   │   ├── AuthResponse.java
│           │   │   ├── RegisterRequest.java
│           │   │   ├── ComplaintRequest.java
│           │   │   ├── ComplaintResponse.java
│           │   │   ├── StatusUpdateRequest.java
│           │   │   ├── AssignRequest.java
│           │   │   ├── FeedbackRequest.java
│           │   │   ├── DashboardStatsDTO.java
│           │   │   ├── DepartmentDTO.java
│           │   │   └── OfficerDTO.java
│           │   ├── entity/
│           │   │   ├── Role.java
│           │   │   ├── ComplaintCategory.java
│           │   │   ├── ComplaintStatus.java
│           │   │   ├── Priority.java
│           │   │   ├── MunicipalCorporation.java
│           │   │   ├── User.java
│           │   │   ├── Department.java
│           │   │   ├── Officer.java
│           │   │   ├── Complaint.java
│           │   │   ├── ComplaintHistory.java
│           │   │   └── Feedback.java
│           │   ├── exception/
│           │   │   ├── ResourceNotFoundException.java
│           │   │   ├── BadRequestException.java
│           │   │   ├── ApiResponse.java
│           │   │   └── GlobalExceptionHandler.java
│           │   ├── repository/
│           │   │   ├── UserRepository.java
│           │   │   ├── DepartmentRepository.java
│           │   │   ├── OfficerRepository.java
│           │   │   ├── ComplaintRepository.java
│           │   │   ├── ComplaintHistoryRepository.java
│           │   │   └── FeedbackRepository.java
│           │   └── service/
│           │       ├── AuthService.java
│           │       ├── ComplaintService.java
│           │       ├── DepartmentService.java
│           │       ├── OfficerService.java
│           │       ├── FeedbackService.java
│           │       └── FileStorageService.java
│           └── resources/
│               ├── application.properties
│               ├── application-dev.properties
│               └── schema.sql
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── PriorityBadge.jsx
│       │   ├── StatCard.jsx
│       │   └── VisualTimeline.jsx
│       └── pages/
│           ├── HomePage.jsx
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── TrackComplaintPage.jsx
│           ├── citizen/
│           │   ├── CitizenDashboard.jsx
│           │   ├── SubmitComplaintPage.jsx
│           │   ├── MyComplaintsPage.jsx
│           │   └── ComplaintDetailsPage.jsx
│           └── admin/
│               ├── AdminDashboard.jsx
│               ├── AdminComplaintsPage.jsx
│               ├── AdminComplaintDetailsPage.jsx
│               ├── ManageDepartmentsPage.jsx
│               └── ManageOfficersPage.jsx
└── README.md
```

---

## 10. Future Improvements
* SMS/WhatsApp notifications integration using Twilio or Gov SMS Gateway.
* AI image recognition to automatically categorize potholes or waste upon photo upload.
* Integrated Ward Heatmap with Leaflet/Google Maps.
