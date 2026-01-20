# API URL Configuration - Deployment Ready ✅

## Summary of Changes

### Frontend Changes

#### 1. Created Central API Configuration

- **File**: `LS_Frontend/src/utils/apiBase.ts`
- **Purpose**: Single source of truth for API URL resolution
- **Logic**:
  - Checks `VITE_API_BASE_URL` environment variable first
  - Falls back to localhost for local development
  - Uses Render backend URL for production deployment

#### 2. Updated All Components to Use apiUrl Helper

Updated **25+ files** to use the centralized `apiUrl()` helper:

**Authentication & User Management:**

- `Login.tsx` - Login endpoint
- `Register.tsx` - Registration endpoint
- `Profile.tsx` - Profile fetch and update
- `Dashboard.tsx` - Profile data

**Deliveries:**

- `Track.tsx` - Tracking by number/phone
- `NewDelivery.tsx` - Create/update deliveries + price estimation
- `Deliveries.tsx` - Delivery list and cancellation
- `OrderHistory.tsx` - Order history and cancellation
- `driver/DriverDashboard.tsx` - Driver deliveries and status updates

**Admin Pages:**

- `admin/AdminDashboard.tsx` - Stats fetching
- `admin/AdminUsers.tsx` - User management
- `admin/AdminDeliveries.tsx` - Delivery and driver management
- `admin/AdminProfile.tsx` - User profile management

**Support System:**

- `SupportFAQ.tsx` - FAQ retrieval
- `SupportAgentRegister.tsx` - Agent registration
- `AdminSupportManagement.tsx` - Ticket management
- `AgentDashboard.tsx` - Agent tickets
- `TicketDetailView.tsx` - Ticket details
- `SupportTicketForm.tsx` - Ticket creation
- `CustomerTicketsList.tsx` - Customer tickets
- `notificationService.ts` - Notification service

#### 3. Vite Configuration

- **File**: `LS_Frontend/vite.config.ts`
- Updated proxy to respect `VITE_API_BASE_URL` environment variable

#### 4. Environment Configuration

- **File**: `LS_Frontend/.env.example`
- Template for setting up API URL in different environments

### Backend Changes

#### Updated CORS and Frontend URL

- **File**: `LS_Backend/logistics/settings.py`
- Added production URLs to default CORS allowed origins:
  - `https://logi-shift-inky.vercel.app` (Vercel frontend)
  - `https://logishift.onrender.com` (Render backend)
- Updated default `FRONTEND_URL` to production Vercel URL

## Deployment URLs

- **Backend**: https://logishift.onrender.com
- **Frontend**: https://logi-shift-inky.vercel.app

## Environment Setup

### For Local Development

1. **Frontend** (`LS_Frontend/`):

   ```bash
   # Create .env file (optional, defaults to localhost)
   echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env

   # Or leave .env empty to use localhost by default
   ```

2. **Backend** (`LS_Backend/`):

   ```bash
   # In .env file, add:
   FRONTEND_URL=http://localhost:3000
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

3. **Start Development Servers**:

   ```bash
   # Terminal 1 - Backend
   cd LS_Backend
   python manage.py runserver

   # Terminal 2 - Frontend
   cd LS_Frontend
   npm run dev
   ```

### For Production Deployment

#### Vercel (Frontend)

1. Go to Vercel project settings → Environment Variables
2. Add:
   ```
   VITE_API_BASE_URL=https://logishift.onrender.com/api
   ```
3. Redeploy the frontend

#### Render (Backend)

1. Go to Render dashboard → Environment Variables
2. Ensure these are set:
   ```
   FRONTEND_URL=https://logi-shift-inky.vercel.app
   CORS_ALLOWED_ORIGINS=https://logi-shift-inky.vercel.app,https://logishift.onrender.com,http://localhost:3000,http://localhost:5173
   ```
3. Redeploy if needed

## How It Works

### Frontend API Resolution Flow

```typescript
// apiBase.ts logic
const resolvedBaseUrl =
  import.meta.env.VITE_API_BASE_URL || // 1. Check env variable
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000/api" // 2. Use localhost if on dev
    : "https://logishift.onrender.com/api"); // 3. Use Render for prod

export const apiUrl = (path = ""): string => {
  return `${API_BASE_URL}${path}`;
};
```

### Usage in Components

**Before:**

```typescript
axios.post("/api/login/", { email, password });
```

**After:**

```typescript
import { apiUrl } from "../utils/apiBase";
axios.post(apiUrl("/login/"), { email, password });
```

## Testing Checklist

### Local Development

- [ ] Login works on `localhost:3000`
- [ ] Registration works
- [ ] Delivery creation works
- [ ] Tracking works
- [ ] Support tickets work
- [ ] Admin dashboard loads

### Production (Vercel)

- [ ] Login works on `logi-shift-inky.vercel.app`
- [ ] Registration works
- [ ] Delivery creation works
- [ ] Tracking works
- [ ] Support tickets work
- [ ] Admin dashboard loads
- [ ] Check browser console for 404 errors

## Troubleshooting

### Issue: Getting 404 errors on deployed site

**Solution**: Ensure `VITE_API_BASE_URL` is set in Vercel environment variables and redeploy

### Issue: CORS errors

**Solution**: Check that Vercel URL is in backend's `CORS_ALLOWED_ORIGINS`

### Issue: Local development broken

**Solution**: Remove or comment out `VITE_API_BASE_URL` in local `.env` file

### Issue: Still seeing localhost in production

**Solution**:

1. Clear browser cache
2. Check that apiUrl is being used (not hardcoded URLs)
3. Verify environment variable is set in Vercel

## Files Changed

### Frontend (26 files)

- `src/utils/apiBase.ts` ✨ NEW
- `src/pages/Login.tsx`
- `src/pages/Register.tsx`
- `src/pages/Track.tsx`
- `src/pages/Profile.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/OrderHistory.tsx`
- `src/pages/Deliveries.tsx`
- `src/pages/NewDelivery.tsx`
- `src/pages/SupportFAQ.tsx`
- `src/pages/SupportAgentRegister.tsx`
- `src/pages/AdminSupportManagement.tsx`
- `src/pages/driver/DriverDashboard.tsx`
- `src/pages/admin/AdminDashboard.tsx`
- `src/pages/admin/AdminUsers.tsx`
- `src/pages/admin/AdminDeliveries.tsx`
- `src/pages/admin/AdminProfile.tsx`
- `src/components/AgentDashboard.tsx`
- `src/components/TicketDetailView.tsx`
- `src/components/SupportTicketForm.tsx`
- `src/components/CustomerTicketsList.tsx`
- `src/services/notificationService.ts`
- `vite.config.ts`
- `.env.example` ✨ NEW

### Backend (1 file)

- `logistics/settings.py`

---

**Status**: ✅ Ready for deployment
**Next Step**: Redeploy frontend and backend, then test all features on production URLs
