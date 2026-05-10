## High-Level View of How Dashboard Works in the System
 
- The admin can view and monitor all posts in the dashboard
- If a post gets flagged, the system reveals the student’s real name so the admin
  
## How the Supabase WebSocket is embedded in our dashboard system for real-time communication
Subscription is established via api call `/realtime/v1/websocket`

<img width="800" alt="image" src="https://github.com/user-attachments/assets/9a0c7065-20ea-4a23-93f9-f3c97fcd5ddc" />

### Centralized WebSocket Architecture
`some modules still in progress`

<img width="300"  alt="image" src="https://github.com/user-attachments/assets/9feead98-2c3e-466d-965e-a7b74178df9c" />

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

## How it works ?
### Supabase realtime channel
`Mood space` 
##### INCOMPLETE
- not enough arbitrary student data
- no daily refresh
- no date filtering
<img width="500" alt="image" src="https://github.com/user-attachments/assets/fa3df29c-f4c3-4ddb-a9de-f83bb857c78f" />

---


