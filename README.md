# LogiShift - Logistics Management System

A full-stack logistics management system with real-time notifications and delivery tracking.

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB Atlas account

### Environment Setup

The project uses a single `.env` file in the root directory for all configuration. This file contains:

- **Django Settings**: SECRET_KEY, DEBUG, ALLOWED_HOSTS
- **MongoDB Configuration**: Database connection URI and database name
- **CORS Settings**: Allowed origins for frontend access
- **JWT Configuration**: Token lifetime settings
- **Frontend Settings**: API endpoints and backend URL

**Important**: The `.env` file contains sensitive credentials and is already configured with your MongoDB connection. Keep this file secure and never commit it to version control (it's already in `.gitignore`).

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd LS_Backend
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations (if needed):

   ```bash
   python manage.py migrate
   ```

4. Start the Django server:
   ```bash
   python manage.py runserver 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd LS_Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
logiShift-logistic MS/
├── .env                          # Environment variables (DO NOT COMMIT)
├── LS_Backend/                   # Django backend
│   ├── core/                     # Core app with models, views, serializers
│   ├── logistics/                # Main Django project settings
│   └── requirements.txt          # Python dependencies
└── LS_Frontend/                  # React + TypeScript frontend
    ├── src/
    │   ├── components/           # Reusable components
    │   ├── pages/                # Page components
    │   └── services/             # API services
    └── package.json              # Node dependencies
```

## 🔧 Configuration

All sensitive configuration is stored in the `.env` file:

- **SECRET_KEY**: Django secret key for cryptographic signing
- **DEBUG**: Development mode flag
- **MONGODB_URI**: MongoDB Atlas connection string with credentials
- **CORS_ALLOWED_ORIGINS**: Frontend URLs allowed to access the API
- **JWT_ACCESS_TOKEN_LIFETIME**: Access token expiration time (in seconds)
- **JWT_REFRESH_TOKEN_LIFETIME**: Refresh token expiration time (in seconds)

To modify any configuration, edit the `.env` file directly.

## 📝 Features

- User authentication with JWT
- Real-time notifications via WebSockets
- Delivery tracking and management
- Admin dashboard
- Driver management
- Order history

## 🔐 Security Notes

- Never commit the `.env` file
- Rotate credentials regularly
- Use strong, unique values for SECRET_KEY
- Set DEBUG=False in production
- Limit ALLOWED_HOSTS in production
