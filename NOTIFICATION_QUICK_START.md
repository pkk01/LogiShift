# Notification System - Quick Start

## ✅ What's Been Implemented

A complete notification system with:

- **Backend API** - 6 notification endpoints with MongoDB
- **Frontend UI** - Bell icon in navbar with dropdown panel
- **Auto-Triggers** - Notifications sent on delivery creation, cancellation, status updates, driver assignment, and completion
- **Real-time Updates** - Unread count refreshes every 30 seconds
- **Role-based** - Different notifications for Admin, User, and Driver roles

## 🚀 How to Use

### Backend Setup (Already Done)

```bash
# No additional dependencies needed - uses existing Django/MongoDB setup
# Just restart your backend server:
python manage.py runserver
```

### Frontend Usage (Already Done)

The notification system is automatically integrated into your navbar. Just:

1. Rebuild your frontend (if needed)
2. Login as any user
3. See the bell icon in the top navbar
4. Notifications appear automatically when events occur

## 📝 Test it Out

### Test Flow 1: User Creates Delivery

1. Login as **User** account
2. Create a new delivery (go to "New Delivery")
3. Logout
4. Login as **Admin** account
5. Look for bell icon in navbar
6. Click bell → See "New Delivery Created" notification
7. Click "Read" button to mark as read
8. Unread count should decrease

### Test Flow 2: Admin Assigns Driver

1. Login as **Admin**
2. Go to "Manage Deliveries"
3. Find a delivery in "Pending" or "Scheduled" status
4. Click to edit and assign a driver
5. Check the driver's account (login as driver)
6. Driver should see "New Delivery Assigned" notification

### Test Flow 3: Delivery Completion

1. Login as **Admin**
2. Go to "Manage Deliveries"
3. Update a delivery status to "Delivered"
4. Both Admin and the User should receive notifications
5. Check both accounts to verify

## 🔔 Notification Types

| Trigger               | Who Gets It | Title                   | Type      |
| --------------------- | ----------- | ----------------------- | --------- |
| User creates delivery | Admin       | New Delivery Created    | info      |
| Admin changes status  | User        | Delivery Status Updated | important |
| Admin assigns driver  | Driver      | New Delivery Assigned   | important |
| Driver assigned       | User        | Driver Assigned         | success   |
| Delivery delivered    | Admin       | Delivery Completed      | success   |
| Delivery delivered    | User        | Delivery Completed      | success   |
| User cancels delivery | Admin       | Delivery Cancelled      | warning   |

## 🎨 Features

- ✅ Bell icon badge showing unread count
- ✅ Color-coded notifications (blue, yellow, red, green)
- ✅ Relative timestamps ("5m ago", "2h ago")
- ✅ Mark single or all as read
- ✅ Delete individual notifications
- ✅ Dark mode support
- ✅ Responsive dropdown panel
- ✅ Auto-refreshing unread count

## 📊 Checking Notifications in Database

```python
# In Python/Django shell:
from core.models import Notification

# Get all notifications for a user
notifications = Notification.objects(recipient_id="USER_ID").order_by('-created_at')

# Count unread
unread = Notification.objects(recipient_id="USER_ID", is_read='false').count()

# Delete old notifications (optional)
Notification.objects(created_at__lt=some_date).delete()
```

## 🔧 API Endpoints (for reference)

```
GET    /api/notifications/                    # List all
GET    /api/notifications/<id>/               # Get one
POST   /api/notifications/<id>/read/          # Mark read
POST   /api/notifications/read-all/           # Mark all read
DELETE /api/notifications/<id>/delete/        # Delete
GET    /api/notifications/unread-count/       # Get count
```

All endpoints require JWT authentication token in header:

```
Authorization: Bearer YOUR_TOKEN
```

## ⚙️ Configuration

### Change Poll Interval (default: 30 seconds)

Edit `Navbar.tsx`:

```typescript
const interval = setInterval(fetchUnreadCount, 60000); // 60 seconds
```

### Change Fetch Limit (default: 20 notifications)

Edit `NotificationDropdown.tsx`:

```typescript
await notificationService.getNotifications(50, false); // Fetch 50 instead
```

## 🐛 Troubleshooting

**Notifications not appearing?**

1. Ensure you're logged in with JWT token
2. Check Network tab in browser DevTools
3. Verify user IDs match in database
4. Look at Django console for errors

**Unread count not updating?**

1. Check if browser tab has focus
2. Clear localStorage: `localStorage.clear()` and re-login
3. Check if polling is running (Network tab)
4. Verify notification `is_read` field is 'false' or 'true' (strings)

**Notifications showing for wrong user?**

1. Verify `recipient_id` is correctly set
2. Check JWT token user_id claim matches
3. Look at MongoDB to confirm notification recipient_id

## 📱 Mobile/Responsive

The notification dropdown is fully responsive:

- Adjusts width on smaller screens (max-w-full)
- Scrollable list with overflow handling
- Touch-friendly button sizes
- Works in dark and light modes

## 🔐 Security Notes

- All endpoints require authentication
- Notifications are user-scoped (can only see own)
- Marked as read/deleted only by notification owner
- No data leakage between users
- JWT tokens validate user identity

## 📈 Future Improvements

If you want to add later:

1. **WebSocket** - Real-time instead of polling
2. **Email** - Send important notifications via email
3. **Sound** - Alert sound for important notifications
4. **Desktop Push** - Browser notifications
5. **History** - Archive old notifications
6. **Preferences** - User control which notifications

## ✨ That's It!

The notification system is **fully functional and ready to use**.

Just:

1. Restart your backend (if needed)
2. Test by creating deliveries, assigning drivers, etc.
3. Watch notifications appear in real-time!

For detailed API documentation, see `NOTIFICATION_SYSTEM_GUIDE.md`
