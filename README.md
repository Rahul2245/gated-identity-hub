# Gated Digital Identity Hub 🔐 [Work In Progress]

A personal API gateway and digital identity proxy. This project is currently in development and acts as a sandbox to deeply learn the internal mechanics of OAuth 2.0, JSON Web Tokens (JWT), and secure session management. 

Once complete, it will pull my private data from third-party services (like GitHub and Spotify) and expose it through my own API, protected by custom Role-Based Access Control (RBAC) and passwordless magic link authentication.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Auth & Security:** `jsonwebtoken`, `bcrypt`, cookie-parser
* **Frontend:** Vanilla HTML/JS (Minimal UI for testing API endpoints)

## 🗺️ Project Roadmap

This project is being built in phases to isolate and master specific authentication concepts:

- [ ] **Phase 1: Foundation**
  - Initialize Express server and basic routing.
  - Set up PostgreSQL database connection and user schemas.
- [ ] **Phase 2: External OAuth Client**
  - Implement Authorization Code Flow with GitHub.
  - Implement Authorization Code Flow with Spotify.
  - Securely store and rotate external refresh tokens.
- [ ] **Phase 3: Internal JWT Issuer**
  - Build magic link generation and validation.
  - Issue JWT Access Tokens and hashed Refresh Tokens.
  - Enforce strict `HttpOnly`, `Secure`, and `SameSite` cookie policies.
- [ ] **Phase 4: Middleware & RBAC**
  - Create custom auth middleware to verify JWT signatures.
  - Implement Role-Based Access Control (`public`, `recruiter`, `admin`).
- [ ] **Phase 5: Session Management**
  - Implement token refresh logic (seamless new access tokens).
  - Build an admin "Kill Switch" to manually revoke database refresh tokens.

