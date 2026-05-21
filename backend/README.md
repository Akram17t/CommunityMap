# CommunityMap Backend

Express.js API server for CommunityMap application.

## 📋 Features

- **Authentication**: JWT-based auth with login, register, and profile
- **Reports**: Create, list, and view road condition reports
- **Upvotes**: Users can upvote/downvote reports
- **Admin Dashboard**: Verify reports, update status, view statistics
- **Image Upload**: S3 integration for report photos (optional)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 16+
- (Optional) AWS S3 bucket for image uploads

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Set up database (run from project root):
```bash
docker-compose up -d
```

4. Run migrations:
```bash
# Database schema is in /database/schema.sql
# Seed data is in /database/seed.sql
```

5. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:4000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Reports

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reports` | List all reports (public) | No |
| GET | `/api/reports/:id` | Get report details | No |
| POST | `/api/reports` | Create new report | Yes |
| GET | `/api/reports/user/me` | Get user's reports | Yes |
| POST | `/api/reports/:id/upvote` | Upvote a report | Yes |
| DELETE | `/api/reports/:id/upvote` | Remove upvote | Yes |

### Admin (requires admin role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/admin/all` | List all reports |
| GET | `/api/reports/admin/stats` | Get dashboard statistics |
| PATCH | `/api/reports/:id/verify` | Verify/unverify report |
| PATCH | `/api/reports/:id/status` | Update report status |

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.js      # Main config
│   │   └── database.js   # PostgreSQL pool
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.js
│   │   └── report.controller.js
│   ├── middleware/       # Express middleware
│   │   └── index.js      # Auth, validation, error handling
│   ├── routes/           # API routes
│   │   ├── auth.routes.js
│   │   └── report.routes.js
│   ├── services/         # Business logic
│   │   ├── auth.service.js
│   │   └── report.service.js
│   ├── utils/            # Utility functions
│   │   ├── auth.js       # Password & JWT
│   │   ├── response.js   # API response formatter
│   │   └── s3.js         # AWS S3 helper
│   ├── validators/       # Input validation
│   │   └── index.js
│   └── index.js          # Entry point
├── .env.example
├── .gitignore
└── package.json
```

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `BACKEND_PORT` | Server port | `4000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `communitymap` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `JWT_SECRET` | JWT signing secret | - |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |
| `AWS_REGION` | AWS region | `ap-southeast-3` |
| `AWS_S3_BUCKET` | S3 bucket name | - |
| `AWS_ACCESS_KEY_ID` | AWS access key | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | - |

## 🧪 Testing

Run tests (when implemented):
```bash
npm test
```

## 📝 Notes

- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt (10 rounds)
- Reports have status workflow: `new` → `verified` → `in_progress` → `resolved`
- Upvotes are unique per user per report
- All status changes are logged in `report_status_logs` table

## 👨‍💻 Developer

**Backend**: Argha

Focus areas:
- Express API architecture
- Authentication & security
- Database queries & optimization
- Business logic implementation
