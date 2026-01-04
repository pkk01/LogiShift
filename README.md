# LogiShift - Logistics Management System

> A production-ready full-stack logistics management platform with real-time delivery tracking, intelligent price estimation, and comprehensive role-based dashboards.

[![Backend](https://img.shields.io/badge/Backend-Django%20REST-092E20?style=flat-square)](https://www.django-rest-framework.org/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=flat-square)](https://react.dev/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square)](https://www.mongodb.com/)
[![Real-time](https://img.shields.io/badge/Real--time-WebSockets-FF6D00?style=flat-square)](https://channels.readthedocs.io/)

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)
- [Security](#security)
- [Contributing](#contributing)

## 🎯 Overview

LogiShift is a comprehensive logistics management system designed for real-world operations. It enables seamless coordination between shippers, drivers, and administrators with intelligent routing, real-time tracking, and automated notifications.

**Key Capabilities:**

- 📦 End-to-end delivery management with status tracking
- 💰 Dynamic price estimation based on distance, weight, and package type
- 🔔 Real-time notifications for all stakeholders
- 🗺️ Pincode-based delivery coverage database
- 📊 Role-based dashboards (Admin, Driver, Customer)
- 🔐 JWT-based authentication with refresh token rotation

## 🛠️ Tech Stack

### Backend

- **Framework**: Django 4.x + Django REST Framework
- **Database**: MongoDB (NoSQL document store)
- **Real-time**: Django Channels (WebSocket support)
- **Authentication**: JWT tokens with automatic refresh
- **Task Queue**: Celery (for async operations)
- **API Documentation**: DRF API Schema

### Frontend

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **Icons**: Lucide React (100+ responsive icons)
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6
- **Build Tool**: Vite (next-generation bundler)
- **Package Manager**: npm/yarn

### Infrastructure

- **Local Dev**: Docker Compose ready
- **Python Version**: 3.8+
- **Node Version**: 16+

## ✨ Features

### 🚀 Core Functionality

- **Delivery Management**: Create, track, and manage shipments in real-time
- **Intelligent Pricing**: AI-driven price calculation based on multiple factors
- **Driver Dashboard**: Streamlined assignment view with quick status updates
- **Admin Panel**: Complete system visibility and management controls
- **Customer Portal**: Easy shipment creation and tracking

### 🔔 Real-time Updates

- WebSocket-based notifications
- Instant delivery status updates
- Email and in-app notifications
- Custom notification preferences

### � Email Notification System

- **Automated HTML Emails**: Beautiful, branded emails for all events
- **Booking Confirmations**: Instant confirmation with tracking number
- **Status Updates**: Real-time delivery progress notifications
- **Driver Assignments**: Notification when driver is assigned
- **Delivery Completion**: Celebration email with feedback request
- **Professional Design**: Animated, responsive HTML templates
- **LogiShift Branding**: Consistent colors and styling

**Email Features:**

- 🎨 Blue gradient header with LogiShift branding
- 🎬 Smooth CSS animations (fade-in, slide-in, pulse)
- 📱 Responsive design for mobile and desktop
- 🔗 Direct tracking links in every email
- 💰 Price breakdown and delivery details
- 👤 Driver information when assigned

> 📚 **Documentation:** See [EMAIL_QUICK_START.md](EMAIL_QUICK_START.md) and [EMAIL_SYSTEM_GUIDE.md](EMAIL_SYSTEM_GUIDE.md)

### �📍 Location Services

- Pincode-based coverage validation
- Distance calculation
- Service area management
- Multi-city support (120+ cities)

### 📊 Analytics & Reporting

- Role-specific dashboards with KPIs
- Delivery metrics and trends
- Driver performance analytics
- Revenue tracking

## 🚀 Quick Start

### Prerequisites

- **Python** 3.8 or higher
- **Node.js** 16 or higher
- **MongoDB** Atlas account (free tier available)
- **Git** for version control
- **npm** or **yarn** package manager

### 1. Clone & Setup

```bash
# Clone the repository
git clone <repository-url>
cd logiShift-logistic-MS

# Create and configure environment file
cp .env.example .env  # Configure with your credentials
```

### 2. Backend Setup

```bash
# Navigate to backend
cd LS_Backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional for admin access)
python manage.py createsuperuser

# Start development server
python manage.py runserver 8000
```

**Backend runs at**: `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend
cd LS_Frontend

# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```

**Frontend runs at**: `http://localhost:3000`

### 4. Test Email System (Optional)

```bash
# Test email notifications
cd LS_Backend
python test_email_system.py

# This will send test emails to verify your email configuration
# Check your inbox for 4 different types of emails:
# - Booking confirmation
# - Status update
# - Driver assignment
# - Delivery completed
```

> 📧 **Email Setup:** The system is pre-configured with Gmail SMTP. See [EMAIL_QUICK_START.md](EMAIL_QUICK_START.md) for details.

### 5. Verify Installation

- Open `http://localhost:3000` in your browser
- Register a new account or use existing credentials
- Explore the role-specific dashboards

## 📁 Project Structure

```
logiShift-logistic-MS/
│
├── 📄 .env                          # Environment variables (sensitive - not in git)
├── 📄 README.md                     # Project documentation
├── 📄 requirements.txt              # Python dependencies list
│
├── 📂 LS_Backend/                   # Django REST API
│   ├── 📂 core/                     # Main application
│   │   ├── 📄 models.py             # Database models (User, Delivery, Payment, Notification)
│   │   ├── 📄 views.py              # API endpoints
│   │   ├── 📄 serializers.py        # Request/response serialization
│   │   ├── 📄 urls.py               # URL routing
│   │   ├── 📄 authentication.py     # JWT token management
│   │   ├── 📄 consumers.py          # WebSocket handlers
│   │   ├── 📄 pricing_utils.py      # Price calculation engine
│   │   ├── 📄 pincode_database.py   # Location coverage data
│   │   ├── 📄 notification_utils.py # Notification triggers
│   │   └── 📂 migrations/           # Database migrations
│   ├── 📂 logistics/                # Django project settings
│   │   ├── 📄 settings.py           # Configuration
│   │   ├── 📄 urls.py               # Root URL configuration
│   │   ├── 📄 wsgi.py               # WSGI entry point
│   │   ├── 📄 asgi.py               # ASGI for WebSockets
│   │   └── 📄 routing.py            # WebSocket routes
│   ├── 📄 manage.py                 # Django CLI tool
│   └── 📄 requirements.txt          # Backend dependencies
│
├── 📂 LS_Frontend/                  # React + TypeScript Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/           # Reusable UI components
│   │   │   ├── 📄 Navbar.tsx        # Header navigation
│   │   │   ├── 📄 Footer.tsx        # Footer
│   │   │   ├── 📄 NotificationDropdown.tsx
│   │   │   └── 📄 DeliveryStatusTimeline.tsx
│   │   ├── 📂 pages/                # Page-level components
│   │   │   ├── 📄 Landing.tsx       # Home page (public)
│   │   │   ├── 📄 Dashboard.tsx     # Main dashboard (auth required)
│   │   │   ├── 📄 Login.tsx         # Authentication
│   │   │   ├── 📄 Register.tsx      # User registration
│   │   │   ├── 📄 NewDelivery.tsx   # Create shipment
│   │   │   ├── 📄 Track.tsx         # Public tracking
│   │   │   └── 📂 admin/            # Admin-only pages
│   │   │       ├── 📄 AdminDeliveries.tsx
│   │   │       ├── 📄 AdminUsers.tsx
│   │   │       └── 📄 AdminProfile.tsx
│   │   ├── 📂 services/             # API integration
│   │   │   └── 📄 notificationService.ts
│   │   ├── 📂 utils/                # Helper utilities
│   │   │   ├── 📄 priceFormat.ts
│   │   │   ├── 📄 dateFormat.ts
│   │   │   ├── 📄 phoneFormat.ts
│   │   │   └── 📄 indiaLocations.ts
│   │   ├── 📄 App.tsx               # Root component with routing
│   │   ├── 📄 main.tsx              # Entry point
│   │   └── 📄 index.css             # Global styles
│   ├── 📄 vite.config.ts            # Vite build configuration
│   ├── 📄 tsconfig.json             # TypeScript configuration
│   ├── 📄 tailwind.config.js        # Tailwind CSS setup
│   ├── 📄 package.json              # Frontend dependencies
│   └── 📄 index.html                # HTML template
│
└── 📂 Documentation/                # Additional guides
    ├── 📄 DELIVERY_WORKFLOW_GUIDE.md
    ├── 📄 NOTIFICATION_SYSTEM_GUIDE.md
    ├── 📄 PRICE_ESTIMATION_FIX.md
    └── 📄 QUICK_REFERENCE.md
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logisticsdb
MONGODB_DB_NAME=logisticsdb

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# JWT Tokens
JWT_ACCESS_TOKEN_LIFETIME=3600
JWT_REFRESH_TOKEN_LIFETIME=604800

# Frontend API
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

### Key Configuration Details

| Variable                    | Purpose                      | Example                           |
| --------------------------- | ---------------------------- | --------------------------------- |
| `SECRET_KEY`                | Django cryptographic signing | 40+ random characters             |
| `MONGODB_URI`               | Database connection          | `mongodb+srv://user:pass@host/db` |
| `JWT_ACCESS_TOKEN_LIFETIME` | Token expiry in seconds      | `3600` (1 hour)                   |
| `CORS_ALLOWED_ORIGINS`      | Frontend domains             | `http://localhost:3000`           |

> ⚠️ **Security**: Never commit `.env` to version control. It's already listed in `.gitignore`.

## 🏗️ Architecture

### System Design

```
┌─────────────────┐
│   Browser       │
│  (React App)    │
└────────┬────────┘
         │ HTTP/WebSocket
         ▼
┌─────────────────────────┐
│   Frontend (Vite)       │
│  - Components           │
│  - State Management     │
│  - Routing              │
└────────┬────────────────┘
         │ REST API / WS
         ▼
┌─────────────────────────┐
│   Django REST API       │
│  - Authentication       │
│  - Business Logic       │
│  - WebSocket Handler    │
└────────┬────────────────┘
         │ Query/Command
         ▼
┌─────────────────────────┐
│   MongoDB              │
│  - Users               │
│  - Deliveries          │
│  - Notifications       │
└─────────────────────────┘
```

### Role-Based Access Control

- **Customer**: Create shipments, track deliveries, view history
- **Driver**: View assigned deliveries, update status, manage proofs
- **Admin**: System-wide visibility, user management, analytics

## 📡 API Documentation

### Key Endpoints

**Authentication**

```
POST   /api/auth/register/     # Create account
POST   /api/auth/login/        # Get JWT tokens
POST   /api/auth/refresh/      # Refresh access token
```

**Deliveries**

```
GET    /api/deliveries/        # List user's deliveries
POST   /api/deliveries/        # Create new delivery
GET    /api/deliveries/<id>/   # Get delivery details
PUT    /api/deliveries/<id>/   # Update delivery
GET    /api/track/<tracking>/  # Public tracking
```

**Admin**

```
GET    /api/admin/deliveries/  # All system deliveries
GET    /api/admin/users/       # All users
```

Full API documentation available at `/api/schema/` when backend is running.

## 🔧 Development Guide

### Running Tests

```bash
# Backend tests
cd LS_Backend
python manage.py test core

# Frontend tests
cd LS_Frontend
npm run test
```

### Code Style & Linting

```bash
# Format Python code
cd LS_Backend
black .

# Lint frontend
cd LS_Frontend
npm run lint
```

### Hot Reload Development

Both backend and frontend support hot reload:

- Backend: Django development server auto-reloads on file changes
- Frontend: Vite provides instant module replacement (HMR)

### Database Management

```bash
# Create new migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database (development only)
python manage.py flush
```

## 🔐 Security

### Best Practices

✅ **DO**

- Use strong, unique SECRET_KEY (50+ characters)
- Rotate JWT tokens regularly
- Enable HTTPS in production
- Validate all user inputs
- Use CORS whitelist for frontend domains
- Keep dependencies updated (`pip list --outdated`)

❌ **DON'T**

- Commit `.env` files to version control
- Use DEBUG=True in production
- Hard-code credentials in source code
- Allow CORS from `*` (wildcard)
- Share SECRET_KEY or database credentials
- Use default/weak passwords

### Deployment Checklist

- [ ] Set `DEBUG=False`
- [ ] Use environment-specific `.env` files
- [ ] Enable HTTPS/SSL
- [ ] Set up proper CORS origins
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting
- [ ] Enable CSRF protection
- [ ] Test authentication flow
- [ ] Document deployment process

## 🤝 Contributing

### Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open Pull Request with description

### Code Conventions

- **Python**: Follow PEP 8, use type hints
- **TypeScript**: Use strict mode, proper typing
- **Components**: Functional components with hooks
- **Commits**: Clear, descriptive messages

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📞 Support & Feedback

For issues, feature requests, or feedback:

- Open an [Issue](https://github.com/your-repo/issues)
- Submit a [Pull Request](https://github.com/your-repo/pulls)
- Contact: [your-email@example.com]

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

**Built with ❤️ for efficient logistics management**
