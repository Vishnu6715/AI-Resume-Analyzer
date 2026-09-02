# AI Resume Analyzer

AI Resume Analyzer is a full-stack web application developed to analyze and manage resumes through a simple and user-friendly interface.

The application allows users to create an account, log in, analyze their resume, view analysis results, and check their previous analysis history.

## Live Demo

**Website:**  
https://ai-resume-analyzer-frontend-zq1o.onrender.com

## Features

- User Registration
- User Login
- Resume Analysis
- Resume Analysis Dashboard
- Analysis History
- REST API Integration
- PostgreSQL Database
- Responsive User Interface
- CORS Configuration
- Cloud Deployment

## Technologies Used

### Frontend
- Angular
- TypeScript
- HTML
- CSS
- RxJS

### Backend
- Java
- Spring Boot
- Spring Data JPA
- REST API
- Maven

### Database
- PostgreSQL

### Deployment
- Render
- GitHub

## Project Structure

```text
AI-Resume-Analyzer/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   ├── history/
│   │   │   ├── app.routes.ts
│   │   │   └── app.ts
│   │   ├── main.ts
│   │   └── index.html
│   ├── public/
│   ├── angular.json
│   └── package.json
│
└── backend/
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/resume/analyzer/
    │       │       ├── AnalyzerApplication.java
    │       │       ├── AuthController.java
    │       │       ├── ResumeController.java
    │       │       ├── ResumeAnalysis.java
    │       │       ├── ResumeAnalysisRepository.java
    │       │       ├── ResumeAnalysisResponse.java
    │       │       ├── User.java
    │       │       ├── UserRepository.java
    │       │       └── config/
    │       │           └── CorsConfig.java
    │       │
    │       └── resources/
    │           └── application.properties
    │
    ├── pom.xml
    └── Dockerfile
```

## Running the Project Locally

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend runs at:

```text
http://localhost:4200
```

### Backend

For Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

## Database Configuration

The application uses PostgreSQL.

Configure the following environment variables before running the backend:

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
```

## Deployment

The complete application is deployed on Render.

- **Frontend:** Angular Static Site
- **Backend:** Spring Boot Web Service
- **Database:** PostgreSQL

## Author

**VISHNU KUMAR V**

BE.ECE Student  
Interested in Software Development, Full-Stack Development and AI/ML.
