# Nexus — Management System

A full-stack content and user management platform built with React and Node.js. Nexus provides role-based access control, group management, and a shared content library for organizations.

---

## Features

- **Authentication** — Secure cookie-based login and logout using JWT access tokens
- **Role-Based Access Control** — Admin and User roles with distinct permissions and views
- **User Management** — Admins can create users, assign roles, and manage group membership
- **Group Management** — Create and manage organizational groups; assign users to groups
- **Content Library** — Create, view, update, and delete content items scoped to groups or globally
- **Admin Dashboard** — Live stats for total users, groups, and content items with a recent users table
- **Responsive UI** — Dark-themed interface built with Tailwind CSS v4

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP client |
| Lucide React | Iconography |
| React Hot Toast | Notifications |
| Vite | Build tool and dev server |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express v5 | REST API server |
| MongoDB + Mongoose | Database |
| JSON Web Tokens | Authentication |
| bcrypt | Password hashing |
| cookie-parser | HTTP cookie handling |
| dotenv | Environment variables |
| nodemon | Development server |

---

## Project Structure

```
Nexus/
├── backend/
│   └── src/
│       ├── controllers/        # Route handlers (auth, user, group, content, stats)
│       ├── db/                 # MongoDB connection
│       ├── models/             # Mongoose schemas (User, Group, Content)
│       ├── routes/             # Express routers
│       ├── utils/              # asyncHandler, ApiError, ApiResponse, middleware
│       ├── app.js              # Express app setup and global error handler
│       ├── index.js            # Server entry point
│       └── seed.js             # Database seeding script
│
└── frontend/
    └── src/
        ├── components/
        │   ├── common/         # Reusable UI (Button, Card, Input, Badge)
        │   └── layout/         # Navbar, Layout wrapper
        ├── context/            # AuthContext (global auth state)
        ├── pages/              # Dashboard, ContentPage, GroupsPage, SettingsPage, LoginPage, SignupPage
        ├── api.js              # Axios instance with base URL
        └── App.jsx             # Routes and protected route logic
```
---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive access token cookie |
| POST | `/api/v1/auth/logout` | Clear the access token cookie |
| GET | `/api/v1/auth/profile` | Get the current user's profile |

### Users *(Admin only)*
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/user` | Get all users |
| POST | `/api/v1/user` | Create a new user |
| PATCH | `/api/v1/user/:id/group` | Assign a user to a group |
| DELETE | `/api/v1/user/:id` | Delete a user |

### Groups
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/group` | Get all groups with members and content counts |
| POST | `/api/v1/group` | Create a new group |
| PATCH | `/api/v1/group/:id` | Update a group |
| DELETE | `/api/v1/group/:id` | Delete a group and unassign all members |

### Content
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/content` | Get content (filtered by role/group) |
| POST | `/api/v1/content` | Create a content item |
| PATCH | `/api/v1/content/:id` | Update a content item |
| DELETE | `/api/v1/content/:id` | Delete a content item |

### Stats *(Admin only)*
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/stats` | Get aggregate counts for the dashboard |

---

## Authentication Flow

1. User submits credentials via the Login page.
2. On success, the server sets an `httpOnly` cookie containing a signed JWT access token.
3. All subsequent API requests automatically include this cookie.
4. On token expiry or a `401` response, the user is redirected to the Login page.
5. Logout clears the cookie server-side.

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the backend server listens on |
| `MONGODB_URI` | Full MongoDB connection string |
| `CORS_ORIGIN` | Allowed frontend origin for CORS |
| `ACCESS_TOKEN_SECRET` | Secret key for signing JWT tokens |
| `ACCESS_TOKEN_EXPIRY` | Token lifespan (e.g. `1d`, `7d`) |
