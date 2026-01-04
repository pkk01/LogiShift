# 🔍 Email Troubleshooting Guide

## Issue: Emails Not Being Sent When Placing Orders

### ✅ Quick Diagnosis Steps

#### Step 1: Check Backend Console Output

When you place an order, watch your Django console (where you ran `python manage.py runserver`). You should see:

```
============================================================
[EMAIL] Attempting to send booking confirmation email
[EMAIL] To: user@example.com
[EMAIL] User: John Doe
[EMAIL] Tracking: LS1234567890
============================================================

[EMAIL UTILS] Starting email send process...
[EMAIL UTILS] To: user@example.com
[EMAIL UTILS] Subject: Booking Confirmed - Your Delivery is Scheduled! 🚚
[EMAIL UTILS] Email backend: django.core.mail.backends.smtp.EmailBackend
[EMAIL UTILS] SMTP Host: smtp.gmail.com
[EMAIL UTILS] SMTP User: prathamdowork@gmail.com
[EMAIL UTILS] Sending email via SMTP...
[EMAIL UTILS] ✅ Email sent successfully!

[EMAIL] ✅ Booking confirmation email sent successfully!
```

If you see errors, note what they say!

---

## 🔧 Common Issues & Solutions

### Issue 1: No Email Output in Console

**Symptom:** You don't see ANY email-related messages in console

**Cause:** Backend server might not be restarted after code changes

**Solution:**

```bash
# Stop the server (Ctrl+C)
cd LS_Backend
python manage.py runserver
```

---

### Issue 2: "Authentication Failed" Error

**Symptom:** Console shows:

```
SMTPAuthenticationError: (535, b'5.7.8 Username and Password not accepted')
```

**Cause:** Gmail app password is incorrect or not set

**Solution:**

1. Check `.env` file has correct credentials:

   ```env
   EMAIL_HOST_USER=prathamdowork@gmail.com
   EMAIL_HOST_PASSWORD=xrvx ifxb weco tfva
   ```

2. Restart the Django server after changing `.env`

3. Verify Gmail settings:
   - 2-Step Verification is enabled
   - App password is generated
   - Using app password (not regular password)

---

### Issue 3: "Connection Refused" Error

**Symptom:** Console shows:

```
ConnectionRefusedError: [Errno 111] Connection refused
```

**Cause:** Network/firewall blocking SMTP connection

**Solution:**

1. Check internet connection
2. Disable VPN temporarily
3. Check firewall settings allow port 587
4. Try using port 465 with SSL:
   ```python
   # In settings.py (temporary test)
   EMAIL_PORT = 465
   EMAIL_USE_SSL = True
   EMAIL_USE_TLS = False
   ```

---

### Issue 4: "No user found" Warning

**Symptom:** Console shows:

```
[EMAIL] ⚠️ No user found - cannot send email
```

**Cause:** User object not retrieved properly

**Solution:** Check user authentication in the request

---

### Issue 5: "User has no email address" Warning

**Symptom:** Console shows:

```
[EMAIL] ⚠️ User John has no email address
```

**Cause:** User registered without email or email is blank

**Solution:**

1. Check user profile in database
2. Update user email:
   ```bash
   python manage.py shell
   >>> from core.models import User
   >>> user = User.objects(email='user@example.com').first()
   >>> user.email = 'correct@email.com'
   >>> user.save()
   ```

---

### Issue 6: Settings Not Configured Error

**Symptom:**

```
django.core.exceptions.ImproperlyConfigured: Requested setting EMAIL_HOST_USER, but settings are not configured
```

**Cause:** Django settings module not loaded

**Solution:** Make sure you're running the server properly:

```bash
cd LS_Backend
python manage.py runserver
```

---

## 🧪 Manual Testing

### Test 1: Run Email Test Script

```bash
cd LS_Backend
python test_email_system.py
```

**Expected Output:**

```
============================================================
🚚 LogiShift Email System Test Suite
============================================================

This will send test emails to: prathamdowork@gmail.com
Make sure to check your inbox (and spam folder)!

Press Enter to start testing...
```

If this works, emails are configured correctly!

---

### Test 2: Django Shell Test

```bash
cd LS_Backend
python manage.py shell
```

Then run:

```python
from django.core.mail import send_mail
from django.conf import settings

print("Email User:", settings.EMAIL_HOST_USER)
print("Email Password Set:", bool(settings.EMAIL_HOST_PASSWORD))
print("Frontend URL:", settings.FRONTEND_URL)

# Try sending a test email
result = send_mail(
    '[LogiShift] Test Email',
    'This is a test email.',
    settings.DEFAULT_FROM_EMAIL,
    ['prathamdowork@gmail.com'],
    fail_silently=False
)
print("Email sent:", result == 1)
```

**Expected Output:**

```
Email User: prathamdowork@gmail.com
Email Password Set: True
Frontend URL: http://localhost:3000
Email sent: True
```

---

### Test 3: Check Environment Variables

```bash
cd LS_Backend
python manage.py shell
```

```python
import os
from dotenv import load_dotenv

load_dotenv()
print("EMAIL_HOST_USER:", os.getenv('EMAIL_HOST_USER'))
print("EMAIL_HOST_PASSWORD:", os.getenv('EMAIL_HOST_PASSWORD')[:4] + '****')
print("FRONTEND_URL:", os.getenv('FRONTEND_URL'))
```

---

## 📋 Checklist

Before asking for help, verify:

- [ ] Backend server is running (`python manage.py runserver`)
- [ ] Server was restarted after code changes
- [ ] `.env` file exists in project root
- [ ] `.env` has EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
- [ ] User account has a valid email address
- [ ] Internet connection is working
- [ ] No VPN blocking SMTP connection
- [ ] Checked backend console for error messages
- [ ] Tried running `python test_email_system.py`
- [ ] Checked spam folder in email

---

## 🔍 Debug Mode

### Enable Detailed Email Logging

Add to `settings.py`:

```python
# Email Debug Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.core.mail': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

Restart server and watch console for detailed SMTP logs.

---

## 📞 Getting Help

If emails still don't work, provide:

1. **Console output** when placing an order
2. **Output from** `python test_email_system.py`
3. **Error messages** (full traceback)
4. **Environment info:**

   ```bash
   python --version
   pip list | grep Django
   ```

5. **Settings verification:**
   ```bash
   python manage.py shell
   >>> from django.conf import settings
   >>> print(settings.EMAIL_HOST_USER)
   >>> print(bool(settings.EMAIL_HOST_PASSWORD))
   ```

---

## 🎯 Expected Behavior

When working correctly:

1. **User places order** → Frontend sends POST to `/api/deliveries/`
2. **Backend receives request** → Creates delivery in database
3. **Backend attempts email** → Console shows email attempt
4. **SMTP connection** → Connects to Gmail
5. **Email sent** → Success message in console
6. **User receives email** → Inbox (or spam) has booking confirmation

---

## ⚡ Quick Fix Commands

### Restart Everything

```bash
# Terminal 1 - Backend
cd LS_Backend
python manage.py runserver

# Terminal 2 - Frontend
cd LS_Frontend
npm run dev
```

### Test Immediately

```bash
cd LS_Backend
python test_email_system.py
```

### Check Logs

Watch the console where Django is running when you place an order.

---

**Updated:** January 4, 2026  
**Status:** Enhanced with detailed logging and troubleshooting
