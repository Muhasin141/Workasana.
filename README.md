# WorkAsana

WorkAsana is a full-stack project management web application built using the MERN Stack that helps teams manage tasks, assign owners, track progress across different teams and projects, and analyze productivity through visual reports. The system is designed to provide a structured, collaborative workflow for teams to manage their daily operations effectively.

---
## Demo Link

[Live Demo](https://workasana-wx7v.vercel.app/login)

## Quick Start

---

``` 
git clone https://github.com/Muhasin141/Workasana.git
cd Workasana
npm install
npm run dev   # or `npm start`
```
---

# WorkAsana

WorkAsana is a full-stack project management web application built using the MERN Stack that helps teams manage tasks, assign owners, track progress across different teams and projects, and analyze productivity through visual reports. The system is designed to provide a structured, collaborative workflow for teams to manage their daily operations effectively.

---
## Demo Link

[Live Demo](https://workasana-app.vercel.app/)

## Quick Start

---

git clone https://github.com/YourUsername/WorkAsana.git cd WorkAsana npm install npm run dev # or npm start

---
## Technologies 
- React JS
- React Router
- Node JS
- Express 
- MongoDB
- Chart.js
- JWT Authentication
- CSS / Bootstrap
---

## Demo Video

Watch a walkthrough (5-7 minutes) of all the major features of this app:
[Video Link](https://drive.google.com/file/d/your-video-id/view?usp=drivesdk)

---
## Features 

**Authentication**
- Secure User Signup and Login
- JWT-based protection for task and report routes
- Automatic redirection for unauthenticated users

**Task Management**
- Create tasks with specific Projects, Teams, and Owners
- Multi-select tag system (e.g., "Urgent", "Bug")
- Track "Time to Complete" and dynamic status updates (To Do, In Progress, etc.)

**Views & Filtering**
- Project View: Tasks grouped by specific projects
- Team View: Tasks grouped by department (Sales, Marketing, Dev, Finance)
- URL-based filtering for easy sharing and navigation

**Reports & Analytics**
Includes visual dashboards using Chart.js:
- Total Work Done Last Week (Bar/Pie charts)
- Total Days of Pending Work (Sum calculation)
- Tasks Closed by Team/Owner/Project

---
## API References 

### ***POST /auth/signup***
Create a new account<br>
Sample Response:<br>
```{"message": "User created successfully"}```

### ***POST /auth/login***
Login and receive JWT token<br>
Sample Response:<br>
```{"token": "your_jwt_token_string"}```

### ***GET /tasks***
Fetch all tasks with support for query filters (team, project, owner, tags)<br>
Sample Response:<br>
```[{ "name": "Design UI", "project": "Web App", "team": "Design", "status": "In Progress" }, ....]```

### ***POST /tasks***
Create a new task<br>
Sample Response:<br>
```{"name": "Task Name", "project": "ID", "team": "ID", "timeToComplete": 3}```

### ***PUT /tasks/:id***
Update task details or status <br>
Sample Response:<br>
```{"_id": "id", "status": "Completed", "updatedAt": "timestamp"}```

### ***DELETE /tasks/:id***
Remove a task <br>
Sample Response:<br>
```{"message": "Task deleted successfully"}```

### ***GET /report/last-week***
Fetch tasks completed in the last 7 days<br>
Sample Response:<br>
```{"total": 10, "tasks": [...]}```

### ***GET /report/pending***
Calculate total man-days of work remaining<br>
Sample Response:<br>
```{"totalPendingDays": 25}```

### ***GET /report/closed-tasks***
Get productivity stats by Team, Owner, or Project<br>
Sample Response:<br>
```{"byTeam": {"Development": 5, "Marketing": 2}, "byOwner": {...}}```

## Contact 

For bugs or feature requests, please reach out to muhasinalikhan@gmail.com
