# Notification System Implementation Guide

## Overview

A comprehensive real-time notification system has been implemented for LogiShift. The system automatically creates and manages notifications for important events across different user roles (Admin, User, Driver).

## Architecture

### Backend Components

#### 1. **Notification Model** (`LS_Backend/core/models.py`)

```python
class Notification(Document):
    recipient_id: User ID receiving notification
    recipient_role: admin/user/driver
    title: Notification title
    message: Notification content
    notification_type: info/warning/important/success
    related_delivery_id: Optional delivery reference
    related_user_id: Optional user reference
    is_read: Read status (true/false)
    action_url: Link to navigate on click
    created_at: Timestamp
    updated_at: Last update timestamp
```

#### 2. **Notification Utilities** (`LS_Backend/core/notification_utils.py`)

Helper functions to create notifications:

- `notify_admin_on_delivery_created()` - User creates delivery
- `notify_user_on_delivery_updated()` - Admin updates delivery status
- `notify_admin_on_delivery_cancelled()` - User cancels delivery
- `notify_driver_on_assignment()` - Driver assigned to delivery
- `notify_user_on_driver_assignment()` - User notified of driver assignment
- `notify_admin_on_delivery_delivered()` - Delivery marked complete
- `notify_user_on_delivery_delivered()` - User notified of completion

#### 3. **API Endpoints** (`LS_Backend/core/urls.py`)

All endpoints require authentication with valid JWT token.

```
GET    /api/notifications/                    # Get all notifications
GET    /api/notifications/<id>/               # Get single notification
POST   /api/notifications/<id>/read/          # Mark as read
POST   /api/notifications/read-all/           # Mark all as read
DELETE /api/notifications/<id>/delete/        # Delete notification
GET    /api/notifications/unread-count/       # Get unread count
```

**Query Parameters:**

- `limit`: Number of notifications to fetch (default: 20)
- `unread_only`: Filter only unread (true/false)

### Frontend Components

#### 1. **Notification Service** (`LS_Frontend/src/services/notificationService.ts`)

Provides methods to interact with notification API:

- `getNotifications(limit, unreadOnly)` - Fetch notifications
- `getUnreadCount()` - Get unread count
- `markAsRead(notificationId)` - Mark single as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification(notificationId)` - Delete notification

#### 2. **Notification Dropdown Component** (`LS_Frontend/src/components/NotificationDropdown.tsx`)

Dropdown panel showing:

- List of notifications with color coding by type
- Unread badge counter
- "Mark as read" and "Delete" actions
- "Mark All Read" button
- Real-time unread count
- Relative timestamps (e.g., "5m ago")

#### 3. **Navbar Integration** (`LS_Frontend/src/components/Navbar.tsx`)

- Bell icon in navbar (visible when authenticated)
- Badge showing unread count
- Auto-refreshes unread count every 30 seconds
- Opens/closes notification dropdown on click

## Automatic Notification Triggers

### When User Creates Delivery

- **Admin receives**: "New Delivery Created" notification
- Type: `info`
- Contains delivery reference and user name

### When Admin Updates Delivery Status

- **User receives**: "Delivery Status Updated" notification
- Type: `important` (if Delivered/Cancelled), `info` (otherwise)
- Shows new status

### When Admin Assigns Driver

- **Driver receives**: "New Delivery Assigned" notification
  - Type: `important`
  - Contains user name and delivery reference
- **User receives**: "Driver Assigned" notification
  - Type: `success`
  - Contains driver name

### When Delivery is Marked Delivered

- **Admin receives**: "Delivery Completed" notification
  - Type: `success`
  - Contains driver name
- **User receives**: "Delivery Completed" notification
  - Type: `success`
  - Contains driver name

### When User Cancels Delivery

- **Admin receives**: "Delivery Cancelled" notification
  - Type: `warning`
  - Contains user name

## Notification Types & Colors

| Type        | Color  | Use Case                                |
| ----------- | ------ | --------------------------------------- |
| `info`      | Blue   | General information                     |
| `warning`   | Yellow | Delivery cancellation, risks            |
| `important` | Red    | Critical updates, delivery completion   |
| `success`   | Green  | Successful actions, delivery assignment |

## Frontend Usage

### Getting Notifications

```typescript
import notificationService from "@/services/notificationService";

// Get all notifications
const data = await notificationService.getNotifications(20, false);
console.log(data.notifications); // Array of notifications
console.log(data.unread_count); // Number

// Get unread count
const count = await notificationService.getUnreadCount();
```

### Marking as Read

```typescript
// Single notification
await notificationService.markAsRead(notificationId);

// All notifications
await notificationService.markAllAsRead();
```

### Deleting Notifications

```typescript
await notificationService.deleteNotification(notificationId);
```

## Testing the System

### 1. Backend Testing

```bash
# Test creating a delivery (should create admin notification)
curl -X POST http://localhost:8000/api/deliveries/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup_address": "123 Main St",
    "delivery_address": "456 Oak Ave",
    "weight": "5kg",
    "package_type": "Medium",
    "pickup_date": "2025-12-31T10:00:00Z"
  }'

# Get notifications
curl -X GET http://localhost:8000/api/notifications/ \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Mark as read
curl -X POST http://localhost:8000/api/notifications/NOTIF_ID/read/ \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 2. Frontend Testing

1. Login with Admin account
2. See notification bell in navbar
3. Have a User create a new delivery
4. Admin should see "New Delivery Created" notification in dropdown
5. Click on notification to mark as read
6. Badge counter should decrease
7. Test other triggers by updating delivery status, assigning drivers, etc.

## Database Indexes

Notifications collection has indexes on:

- `recipient_id` - Fast lookups by recipient
- `is_read` - Efficient filtering for unread
- `created_at` - Sorting by date

## Performance Considerations

1. **Polling Interval**: Frontend polls unread count every 30 seconds (adjustable)
2. **Limit**: Default fetch limit is 20 notifications per request
3. **Database**: MongoDB indexes ensure fast queries
4. **Response**: Full notification list includes unread_count for UI badge

## Future Enhancements

1. **WebSocket Support** - Real-time notifications without polling
   ```bash
   pip install channels channels-redis
   ```
2. **Email Notifications** - Send important notifications via email

   ```bash
   pip install django-anymail
   ```

3. **Push Notifications** - Browser/mobile push notifications

   ```bash
   pip install django-push-notifications
   ```

4. **Notification Preferences** - Users control which notifications they receive

5. **Notification History** - Archive and search past notifications

6. **Sound Alerts** - Optional sound for important notifications

## Troubleshooting

### Notifications Not Appearing

1. Check that user is authenticated (valid JWT token)
2. Verify notification was created in MongoDB
3. Check browser console for API errors
4. Ensure CORS is configured properly

### Unread Count Not Updating

1. Clear localStorage and re-login
2. Check that notification status is 'false' not 'False'
3. Verify poll interval is working (30 seconds)
4. Check network tab for API response

### Migration Issues

If database schema issues occur:

```bash
# Restart MongoDB connection
# Clear notification collection if needed
# Re-run application
```

## Files Modified/Created

### Backend

- ✅ `core/models.py` - Added Notification model
- ✅ `core/serializers.py` - Added NotificationSerializer
- ✅ `core/views.py` - Added notification endpoints & integration
- ✅ `core/urls.py` - Added notification routes
- ✅ `core/notification_utils.py` - Created utility functions

### Frontend

- ✅ `services/notificationService.ts` - Created service
- ✅ `components/NotificationDropdown.tsx` - Created component
- ✅ `components/Navbar.tsx` - Added bell icon & dropdown

## Support

For issues or questions:

1. Check the test cases above
2. Review API responses for errors
3. Examine browser console and network tab
4. Check MongoDB for notification records
5. Verify JWT tokens are valid

---

**Implementation Date**: December 30, 2025
**Status**: ✅ Complete and ready for use
