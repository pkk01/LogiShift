# 📧 Email System - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### 1. **Verify Configuration** ✓

Email settings are already configured! Check `.env`:

```env
EMAIL_HOST_USER=prathamdowork@gmail.com
EMAIL_HOST_PASSWORD=xrvx ifxb weco tfva
DEFAULT_FROM_EMAIL=LogiShift <prathamdowork@gmail.com>
```

### 2. **Test Email System** 📨

Run the test script:

```bash
cd LS_Backend
python test_email_system.py
```

This will send 4 test emails:

- ✅ Booking confirmation
- 📦 Status update
- 🚗 Driver assignment
- 🎉 Delivery completed

### 3. **How It Works** 🔄

Emails are sent automatically when:

| Event                 | Trigger                                          | Email Type           |
| --------------------- | ------------------------------------------------ | -------------------- |
| User books delivery   | POST `/api/deliveries/`                          | Booking Confirmation |
| Admin updates status  | PUT `/api/admin/deliveries/{id}/`                | Status Update        |
| Driver updates status | PUT `/api/driver/deliveries/{id}/status/`        | Status Update        |
| Admin assigns driver  | POST `/api/admin/deliveries/{id}/assign-driver/` | Driver Assignment    |

### 4. **Email Features** ✨

All emails include:

- 🎨 LogiShift branded design (blue gradient header)
- 🎬 Smooth animations (fade-in, slide-in, pulse)
- 📱 Responsive layout (works on mobile & desktop)
- 🔗 Direct tracking links
- 📦 Complete delivery details
- 💰 Price information
- 👤 Driver info (when assigned)

## 📧 Email Examples

### 1. Booking Confirmation Email

**Subject:** `[LogiShift] Booking Confirmed - Your Delivery is Scheduled! 🚚`

**Content:**

- Greeting with user name
- Tracking number in large, styled box
- Complete booking details
- Total price
- Track delivery button

### 2. Status Update Email

**Subject:** `[LogiShift] 📦 Status Update: In Transit - LS1234567890`

**Content:**

- Status emoji and message
- Animated status badge
- Previous vs current status
- Delivery details
- Driver info (if available)
- Track delivery button

### 3. Driver Assignment Email

**Subject:** `[LogiShift] 🚗 Driver Assigned - LS1234567890`

**Content:**

- Driver name and contact
- Delivery details
- Pickup schedule
- Track delivery button

### 4. Delivered Email (Special)

**Subject:** `[LogiShift] 🎉 Delivered: Delivered - LS1234567890`

**Content:**

- Celebration animation 🎉
- Special green gradient design
- Rate delivery button
- Thank you message

## 🧪 Testing Guide

### Test Full Flow:

1. **Create User Account**

   - Register at: `http://localhost:5173/register`
   - Use your real email to receive emails

2. **Book a Delivery**

   - Login and go to: `http://localhost:5173/new-delivery`
   - Fill in delivery details
   - Submit booking
   - **Check email:** Booking confirmation

3. **Assign Driver (Admin)**

   - Login as admin
   - Go to: `http://localhost:5173/admin/deliveries`
   - Assign a driver to the delivery
   - **Check email:** Driver assignment notification

4. **Update Status (Admin)**

   - Change status to "In Transit"
   - **Check email:** Status update

5. **Mark Delivered (Admin/Driver)**
   - Change status to "Delivered"
   - **Check email:** Delivery completed with celebration

## 🎨 Customization

### Change Email Colors

Edit `LS_Backend/core/email_utils.py`:

```python
# Blue theme (default)
background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);

# Green theme
background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);

# Purple theme
background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
```

### Change Frontend URL

Find and replace in `email_utils.py`:

```python
http://localhost:5173  →  https://yourdomain.com
```

### Add Your Logo

Replace the emoji logo in `get_email_template_base()`:

```python
<div class="logo">🚚 LogiShift</div>
# Replace with:
<img src="https://yoursite.com/logo.png" alt="LogiShift" style="height: 40px;">
```

## 📊 Email Design Breakdown

```
┌─────────────────────────────────────┐
│   📧 EMAIL STRUCTURE                │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │   HEADER (Blue Gradient)      │ │
│  │   🚚 LogiShift                │ │
│  │   LOGISTICS MANAGEMENT SYSTEM │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   BODY (White Background)     │ │
│  │                               │ │
│  │   • Greeting                  │ │
│  │   • Main Message              │ │
│  │   • Tracking Number Box       │ │
│  │   • Info Boxes (Details)      │ │
│  │   • CTA Button                │ │
│  │   • Additional Info           │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   FOOTER (Light Gray)         │ │
│  │                               │ │
│  │   Links | Help | Contact      │ │
│  │   © 2026 LogiShift            │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

## 🐛 Common Issues

### Email Not Received

1. **Check spam folder** 📁
2. **Verify email in user account**
3. **Check console for errors**
4. **Run test script to debug:**
   ```bash
   python test_email_system.py
   ```

### Gmail Security Block

If Gmail blocks the login:

1. Check "Less secure app access" is enabled
2. Verify app password is correct (16 chars)
3. Try generating a new app password

### Email Shows Plain Text

Some email clients don't support HTML:

- Plain text fallback is provided
- Users should use modern email clients

## 📝 Code Examples

### Send Custom Email

```python
from core.email_utils import send_html_email, get_email_template_base

content = """
    <div class="greeting">Hello User! 👋</div>
    <div class="message">Your custom message here.</div>
"""

html = get_email_template_base().format(
    title="Custom Email",
    content=content
)

send_html_email(
    to_email="user@example.com",
    subject="Custom Subject",
    html_content=html
)
```

### Check Email Configuration

```python
from django.conf import settings

print(f"Email User: {settings.EMAIL_HOST_USER}")
print(f"Email Host: {settings.EMAIL_HOST}")
print(f"From Email: {settings.DEFAULT_FROM_EMAIL}")
```

## 🔐 Security Notes

- ✅ App password used (not main Gmail password)
- ✅ Credentials stored in `.env` (not in code)
- ✅ TLS encryption enabled
- ✅ Fail silently (errors don't expose system info)

## 📚 Additional Resources

- **Full Documentation:** `EMAIL_SYSTEM_GUIDE.md`
- **Test Script:** `LS_Backend/test_email_system.py`
- **Email Functions:** `LS_Backend/core/email_utils.py`
- **Integration:** `LS_Backend/core/views.py`

## ✅ Checklist

Before deploying:

- [ ] Test all email types
- [ ] Verify tracking links work
- [ ] Check emails in different clients (Gmail, Outlook, Apple Mail)
- [ ] Update frontend URL to production
- [ ] Set up proper email service for production
- [ ] Add SPF records for production domain
- [ ] Monitor email delivery rates

## 🎯 Next Steps

1. **Test the system** → Run `python test_email_system.py`
2. **Book a test delivery** → Check inbox
3. **Update a status** → Verify email received
4. **Customize colors** → Match your brand
5. **Deploy to production** → Update URLs

---

**Need Help?** Check `EMAIL_SYSTEM_GUIDE.md` for detailed documentation.

**Ready to Test?** Run: `python LS_Backend/test_email_system.py`
