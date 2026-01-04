# 🔧 Frontend URL Configuration Update

## ✅ Changes Made

### Problem Fixed

- All email templates were using hardcoded `http://localhost:5173`
- Correct frontend URL is `http://localhost:3000`
- URLs were not easily configurable for production deployment

### Solution Implemented

Created a centralized `FRONTEND_URL` configuration that:

- Uses environment variable for easy configuration
- Defaults to `http://localhost:3000` for development
- Can be easily changed for production deployment
- No more hardcoded URLs in code

---

## 📝 Files Modified

### 1. **Backend Settings** (`LS_Backend/logistics/settings.py`)

```python
# Frontend URL Configuration
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
```

### 2. **Email Utils** (`LS_Backend/core/email_utils.py`)

```python
# Get frontend URL from settings
FRONTEND_URL = settings.FRONTEND_URL

# Updated in all email templates:
# - Booking confirmation
# - Status updates
# - Driver assignment
# - Footer links (Track Order, My Deliveries, Account)
```

**Before:**

```python
<a href="http://localhost:5173/track?tracking={tracking_number}">
```

**After:**

```python
<a href="{FRONTEND_URL}/track?tracking={tracking_number}">
```

### 3. **Environment Files**

**.env**

```env
# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**.env.example**

```env
# Frontend URL (change for production)
FRONTEND_URL=http://localhost:3000
```

---

## 🎯 Benefits

### 1. **No More Hardcoding**

All frontend URLs now use the `FRONTEND_URL` configuration from environment variables.

### 2. **Easy Production Deployment**

Just change the `.env` file:

```env
# Production
FRONTEND_URL=https://yourdomain.com
```

### 3. **Centralized Configuration**

One place to change the URL - it updates everywhere:

- All email templates
- All tracking links
- All navigation links

### 4. **No Code Changes Needed**

Change URLs without modifying Python code - just update `.env` file.

---

## 📧 Updated Email Links

All emails now use the configured `FRONTEND_URL`:

| Link Type     | URL Pattern                                       | Usage                            |
| ------------- | ------------------------------------------------- | -------------------------------- |
| Track Order   | `{FRONTEND_URL}/track?tracking={tracking_number}` | Main tracking link in all emails |
| My Deliveries | `{FRONTEND_URL}/deliveries`                       | Footer link, rate delivery       |
| Account       | `{FRONTEND_URL}/profile`                          | Footer link                      |
| Track Page    | `{FRONTEND_URL}/track`                            | Footer navigation                |

---

## 🧪 Testing

### Verify Configuration

```python
# Django shell
from django.conf import settings
print(settings.FRONTEND_URL)
# Should output: http://localhost:3000
```

### Test Emails

```bash
cd LS_Backend
python test_email_system.py
```

Check that all links in emails point to `http://localhost:3000`

---

## 🚀 Production Deployment

### Step 1: Update .env

```env
FRONTEND_URL=https://yourdomain.com
```

### Step 2: Restart Backend

```bash
cd LS_Backend
python manage.py runserver
```

### Step 3: Test Email Links

All email links will now automatically point to your production domain.

---

## 📊 Configuration Reference

### Development (Current)

```env
FRONTEND_URL=http://localhost:3000
```

- Local development
- Testing on localhost
- Default configuration

### Production (Future)

```env
FRONTEND_URL=https://logishift.com
# or
FRONTEND_URL=https://app.logishift.com
```

- Live deployment
- Real domain
- SSL enabled

### Staging (Optional)

```env
FRONTEND_URL=https://staging.logishift.com
```

- Pre-production testing
- QA environment

---

## ✅ Verification Checklist

- [x] `FRONTEND_URL` added to `settings.py`
- [x] `FRONTEND_URL` added to `.env`
- [x] `FRONTEND_URL` added to `.env.example`
- [x] All email templates updated
- [x] Booking confirmation uses variable URL
- [x] Status update uses variable URL
- [x] Driver assignment uses variable URL
- [x] Footer links use variable URL
- [x] Plain text emails use variable URL
- [x] No hardcoded `localhost:5173` in backend code

---

## 🔍 Quick Find & Replace Reference

If you ever need to update other URLs:

### Environment Variable

```python
# settings.py
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
```

### Usage in Code

```python
# Import settings
from django.conf import settings

# Use the configured URL
frontend_url = settings.FRONTEND_URL
tracking_url = f"{settings.FRONTEND_URL}/track?tracking={tracking_number}"
```

### Usage in Email Templates

```python
# In email_utils.py
FRONTEND_URL = settings.FRONTEND_URL

# In HTML strings
f'<a href="{FRONTEND_URL}/track">Track Order</a>'
```

---

## 💡 Best Practices

### DO ✅

- Use `FRONTEND_URL` from settings
- Update `.env` file for different environments
- Test emails after changing configuration
- Document any new frontend URLs

### DON'T ❌

- Hardcode URLs in Python code
- Forget to update `.env.example`
- Mix different URL patterns
- Skip testing after URL changes

---

## 📚 Related Files

- `LS_Backend/logistics/settings.py` - Configuration
- `LS_Backend/core/email_utils.py` - Email templates
- `.env` - Environment variables
- `.env.example` - Example configuration

---

**Updated:** January 4, 2026  
**Status:** ✅ Complete  
**Frontend URL:** `http://localhost:3000` (configurable via `.env`)
