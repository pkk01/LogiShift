# 📧 Email Notification System - LogiShift

## Overview

LogiShift now features a comprehensive email notification system that sends beautifully designed HTML emails to users for various events throughout the delivery lifecycle. All emails are branded with the LogiShift colors and include animations for a professional user experience.

## ✨ Features

### 1. **Booking Confirmation Email**

Sent automatically when a user creates a new delivery order.

**Triggers:**

- User submits a new delivery booking through the frontend

**Email Content:**

- ✅ Booking confirmation with tracking number
- 📦 Complete delivery details (pickup, delivery addresses, package type, weight)
- 💰 Price breakdown
- 🔗 Direct link to track the delivery
- Animated elements and branded design

### 2. **Status Update Email**

Sent when admin or driver changes the delivery status.

**Triggers:**

- Admin updates delivery status from admin panel
- Driver updates delivery status (Picked Up, In Transit, Out for Delivery, Delivered)

**Email Content:**

- 📍 Current status with visual badge
- 📦 Delivery details
- 👤 Driver information (if assigned)
- 🎉 Special celebration design for "Delivered" status
- 🔗 Track delivery link
- Animated status indicators

### 3. **Driver Assignment Email**

Sent when admin assigns a driver to a delivery.

**Triggers:**

- Admin assigns a driver to a pending delivery

**Email Content:**

- 🚗 Driver details (name and contact number)
- 📦 Delivery information
- 📅 Scheduled pickup date
- 🔗 Track delivery link
- Professional and informative design

## 🎨 Email Design

All emails feature:

- **Brand Colors:** Blue gradient header (#2563eb to #1d4ed8)
- **Animations:** Fade-in, slide-in, and pulse effects
- **Responsive Design:** Works perfectly on mobile and desktop
- **Professional Layout:** Clean, modern, and easy to read
- **LogiShift Branding:** Consistent with the website design

## 🛠️ Technical Implementation

### Email Configuration

**File:** `LS_Backend/logistics/settings.py`

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', 'prathamdowork@gmail.com')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', 'xrvx ifxb weco tfva')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'LogiShift <prathamdowork@gmail.com>')
EMAIL_SUBJECT_PREFIX = '[LogiShift] '
```

### Environment Variables

Add to `.env` file:

```env
EMAIL_HOST_USER=prathamdowork@gmail.com
EMAIL_HOST_PASSWORD=xrvx ifxb weco tfva
DEFAULT_FROM_EMAIL=LogiShift <prathamdowork@gmail.com>
```

### Email Utility Functions

**File:** `LS_Backend/core/email_utils.py`

Contains:

- `send_html_email()` - Core function to send HTML emails
- `get_email_template_base()` - Base HTML template with LogiShift branding
- `send_booking_confirmation_email()` - Booking confirmation emails
- `send_status_update_email()` - Status update emails
- `send_driver_assigned_email()` - Driver assignment emails

### Integration Points

**File:** `LS_Backend/core/views.py`

#### 1. Booking Confirmation

```python
class DeliveryListCreateView(APIView):
    def post(self, request):
        # ... create delivery ...

        # Send booking confirmation email
        if user and user.email:
            send_booking_confirmation_email(
                user_email=user.email,
                user_name=user.name,
                delivery_data={...}
            )
```

#### 2. Status Updates (Admin)

```python
class AdminDeliveryUpdateView(APIView):
    def put(self, request, delivery_id):
        # ... update status ...

        # Send status update email
        if user and user.email:
            send_status_update_email(
                user_email=user.email,
                user_name=user.name,
                delivery_data={...},
                old_status=old_status,
                new_status=new_status
            )
```

#### 3. Status Updates (Driver)

```python
class DriverDeliveryStatusUpdateView(APIView):
    def put(self, request, delivery_id):
        # ... update status ...

        # Send status update email
        if user and user.email:
            send_status_update_email(...)
```

#### 4. Driver Assignment

```python
class AdminDeliveryAssignDriverView(APIView):
    def post(self, request, delivery_id):
        # ... assign driver ...

        # Send driver assignment email
        if user and user.email:
            send_driver_assigned_email(
                user_email=user.email,
                user_name=user.name,
                delivery_data={...},
                driver_name=driver.name,
                driver_contact=driver.contact_number
            )
```

## 📧 Gmail App Password Setup

The system uses Gmail's SMTP server with an App Password for security.

### How to Create a Gmail App Password:

1. **Enable 2-Step Verification:**

   - Go to Google Account Settings
   - Security → 2-Step Verification
   - Enable it

2. **Create App Password:**

   - Go to Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Enter "LogiShift" as the name
   - Click Generate
   - Copy the 16-character password

3. **Add to .env:**
   ```env
   EMAIL_HOST_PASSWORD=your-16-char-app-password
   ```

**Current Configuration:**

- Email: `prathamdowork@gmail.com`
- App Password: `xrvx ifxb weco tfva`

## 🎯 Email Flow

### New Booking Flow

```
User Creates Booking
      ↓
Delivery Saved to DB
      ↓
Booking Confirmation Email Sent ✉️
      ↓
User Receives Email with Tracking Number
```

### Status Update Flow

```
Admin/Driver Updates Status
      ↓
Status Updated in DB
      ↓
Status Update Email Sent ✉️
      ↓
User Receives Email with New Status
```

### Driver Assignment Flow

```
Admin Assigns Driver
      ↓
Driver ID Updated in DB
      ↓
Driver Assignment Email Sent ✉️
      ↓
User Receives Email with Driver Info
```

## 🔍 Testing

### Test Email Functionality

1. **Start Backend Server:**

   ```bash
   cd LS_Backend
   python manage.py runserver
   ```

2. **Create a Test Booking:**

   - Register/login as a user
   - Create a new delivery with your email
   - Check your inbox for confirmation email

3. **Test Status Updates:**

   - Login as admin
   - Update delivery status
   - Check user email for status update

4. **Test Driver Assignment:**
   - Login as admin
   - Create a driver account
   - Assign driver to delivery
   - Check user email for driver info

### Email Testing Endpoints

All emails are triggered through existing API endpoints:

- **POST** `/api/deliveries/` - Triggers booking confirmation
- **PUT** `/api/admin/deliveries/{id}/` - Triggers status update
- **POST** `/api/admin/deliveries/{id}/assign-driver/` - Triggers driver assignment
- **PUT** `/api/driver/deliveries/{id}/status/` - Triggers status update

## 🎨 Customization

### Modify Email Templates

Edit `LS_Backend/core/email_utils.py`:

**Change Colors:**

```python
# Header gradient
background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);

# Status badges
.status-confirmed {
    background: #d1fae5;
    color: #065f46;
}
```

**Add New Animations:**

```css
@keyframes yourAnimation {
  from {
    ...;
  }
  to {
    ...;
  }
}
```

**Update Frontend URL:**

```python
# Change localhost:5173 to your production URL
<a href="http://localhost:5173/track?tracking={tracking_number}">
```

### Add New Email Types

1. Create new function in `email_utils.py`:

```python
def send_custom_email(user_email, user_name, data):
    content = """
        <div class="greeting">Hello {user_name}! 👋</div>
        <!-- Your custom content -->
    """
    html_content = get_email_template_base().format(
        title="Your Title",
        content=content
    )
    return send_html_email(user_email, "Subject", html_content)
```

2. Call it from views:

```python
from .email_utils import send_custom_email

# In your view
send_custom_email(user.email, user.name, data)
```

## 📊 Email Status Badges

The system includes animated status badges:

- **Pending** - Yellow badge with ⏳
- **Confirmed/Scheduled** - Green badge with ✓
- **In Transit/Out for Delivery** - Blue badge with 🚚
- **Delivered** - Green badge with ✅ (+ celebration animation)
- **Cancelled** - Red badge with ❌

## 🚀 Production Deployment

### Update URLs for Production

In `email_utils.py`, replace:

```python
http://localhost:5173
```

with your production domain:

```python
https://yourdomain.com
```

### Secure Email Credentials

Use environment variables in production:

```env
EMAIL_HOST_USER=${EMAIL_HOST_USER}
EMAIL_HOST_PASSWORD=${EMAIL_HOST_PASSWORD}
```

### Email Deliverability

For production:

1. Use a professional email service (SendGrid, AWS SES, Mailgun)
2. Set up SPF, DKIM, and DMARC records
3. Monitor email delivery rates
4. Implement email bounce handling

## 🐛 Troubleshooting

### Email Not Sending

1. **Check Gmail App Password:**

   - Verify password is correct
   - Ensure 2-step verification is enabled

2. **Check Environment Variables:**

   ```bash
   python manage.py shell
   >>> from django.conf import settings
   >>> print(settings.EMAIL_HOST_USER)
   >>> print(settings.EMAIL_HOST_PASSWORD)
   ```

3. **Check Logs:**

   - Look for email errors in console
   - Emails fail silently by default (in try-except blocks)

4. **Test SMTP Connection:**
   ```python
   from django.core.mail import send_mail
   send_mail('Test', 'Message', 'from@email.com', ['to@email.com'])
   ```

### Email in Spam Folder

- Use a professional email service
- Set up SPF records
- Add unsubscribe link
- Warm up the sending domain

### Styling Issues

- Test in multiple email clients (Gmail, Outlook, Apple Mail)
- Use inline styles (already implemented)
- Avoid complex CSS animations in some email clients
- Use tables for layout if needed

## 📝 Notes

- All emails include fallback plain text content
- Email sending errors don't block the request (fail silently)
- Emails are sent synchronously (consider async for production)
- HTML is inline-styled for email client compatibility
- Tracking links include the tracking number as query parameter

## 🎉 Features for Future Enhancement

- [ ] Email templates with Django template system
- [ ] Async email sending with Celery
- [ ] Email queue system
- [ ] Email open tracking
- [ ] Link click tracking
- [ ] Unsubscribe functionality
- [ ] Email preferences per user
- [ ] SMS notifications integration
- [ ] Push notifications
- [ ] Email analytics dashboard

## 📞 Support

For issues or questions:

- Check the troubleshooting section
- Review Django email documentation
- Test with a different email provider
- Check Gmail security settings

---

**Created:** January 4, 2026  
**Last Updated:** January 4, 2026  
**Version:** 1.0
