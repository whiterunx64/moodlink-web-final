## High-Level View of How Dashboard Works in the System
 
- The admin can view and monitor all posts in the dashboard
- If a post gets flagged, the system reveals the student’s real name so the admin
  
## How the Supabase WebSocket is embedded in our dashboard system for real-time communication
Subscription is established via api call `/realtime/v1/websocket`

<img width="800" alt="image" src="https://github.com/user-attachments/assets/9a0c7065-20ea-4a23-93f9-f3c97fcd5ddc" />

### Centralized WebSocket Architecture
`some modules still in progress`

<img width="300" alt="image" src="https://github.com/user-attachments/assets/892d3b4b-ed1e-4e71-84c1-c15cd1ea2d65" />

`supabase-ws.js`

#### posts
- MoodSpace updates feed with student data (insert, update, delete)
- Metrics counts logs and flagged posts (date-filtered)
#### students

- Metrics counts total students
#### appointments

- Metrics counts escalation requests 


---
## Dashboard Schema

`Mood Space Table submodule`

<img width="400" alt="image" src="https://github.com/user-attachments/assets/82959ccb-1f9e-43c1-9f23-a54b16b88bfc" />

---

`Metrics Table submodule`

<img width="400" alt="image" src="https://github.com/user-attachments/assets/1895257c-3fb6-462d-a1ea-a7f20b6e5647" />

---

`Appointment statistic`

<img width="400" alt="image" src="https://github.com/user-attachments/assets/07a65371-fe8f-42a2-983c-92b53c6d3f0e" />

---

## How it works ?
### Supabase realtime channel
##### INCOMPLETE
`Mood space` 
##### Orchestrates live post updates with date based filtering

<img width="1100" alt="image" src="https://github.com/user-attachments/assets/679b209d-b2e0-4e35-b177-c0b77527546c" />



---

`Metrics`
##### The system collects counts for logs, students, flagged posts, and requests.

<img width="1100" alt="image" src="https://github.com/user-attachments/assets/86be8223-55d1-4c1a-8699-1b29322c3298" />

---


