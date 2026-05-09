## High-Level View of How Authentication Works in the System
 
shows how the Supabase handles login, how Laravel verifies the token, and how the laravel session is created and kept using cookies.

---

### Overall Authentication Flow


<img width="1512" height="1424" alt="High-Level Auth Flow" src="https://github.com/user-attachments/assets/1704fa33-1dbd-494b-9770-c311fc542b78" />


---

### Frontend Login Flow

The frontend starts the login process and handles user input.

- Reads email and password from the form  
- Validates input using Zod  
- Sends credentials to Supabase  
- Receives a JWT access token on success  
- Sends the token to the backend to start a session  

<img width="1258" height="1678" alt="Frontend Login Flow" src="https://github.com/user-attachments/assets/a0bcbf36-9f7c-4d82-ba95-d959b9683e3e" />

---

### Middleware: VerifySupabaseToken

This middleware checks if the incoming token is valid before continuing.

- Gets the token from the request  
- Sends it to Supabase `/auth/v1/user`  
- Confirms if the token is valid  
- Reads user data from the response  
- Attaches the user data to the request  
- Blocks the request if the token is invalid  

<img width="1646" height="1854" alt="Token Verification Middleware" src="https://github.com/user-attachments/assets/cf166b45-de7e-43dd-bef6-ba364a69275e" />

---

### Controller: Laravel Session Establishment

After verification, the backend creates a session.

- Reads user data from the middleware  
- Regenerates the session ID  
- Stores user data in the session  
- Sends back a `laravel_session` cookie  


<img width="1104" height="1678" alt="Session Controller Flow" src="https://github.com/user-attachments/assets/471aca21-34a6-4f7e-86b0-d5965a68eaed" />
