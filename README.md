## High-Level View of How Dashboard Works in the System
 
- The admin can view and monitor all posts in the dashboard
- If a post gets flagged, the system reveals the student’s real name so the admin
  
## How the Supabase WebSocket is embedded in our dashboard system for real-time communication
Subscription is established via api call `/realtime/v1/websocket`

<img width="800" alt="image" src="https://github.com/user-attachments/assets/9a0c7065-20ea-4a23-93f9-f3c97fcd5ddc" />

### Centralized WebSocket Architecture

- Event bus handles and distributes realtime events across multiple submodules
<img width="300" alt="image" src="https://github.com/user-attachments/assets/44bb9f5a-e806-4fdb-9f47-1160c2c95f19" />


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

<img width="300" alt="image" src="https://github.com/user-attachments/assets/07a65371-fe8f-42a2-983c-92b53c6d3f0e" />

`mood trend`

<img width="300" alt="image" src="https://github.com/user-attachments/assets/7a4d5dfc-98b7-4054-a7d3-fb963192e698" />


---

## How it works ?
### Supabase realtime channel
##### INCOMPLETE
`Mood space` 
##### Orchestrates live post updates with date based filtering

<img width="1100" alt="image" src="https://github.com/user-attachments/assets/58ee40e8-2028-410c-9c3a-f2b57d0d74ce" />

---

`Metrics`
##### The system collects counts for logs, students, flagged posts, and requests.

<img width="1100" alt="image" src="https://github.com/user-attachments/assets/fa5effb1-f18d-42a4-b153-9ce5969d42ba" />

---

`Mood Trend`
##### The system aggregates mood data over time to generate visual insights and trend charts

<img width="1100" alt="image" src="https://github.com/user-attachments/assets/cbbb2286-d041-45d3-8454-793a0ae796c2" />


---


