from datetime import datetime
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Notification, User, Delivery


STATUS_COPY = {
    'Picked Up': 'Picked up by your driver. You can follow the live progress in Deliveries.',
    'In Transit': 'In transit to your city hub. We will keep you posted as it moves.',
    'Out for Delivery': 'Out for delivery today. Keep your phone available for coordination.',
    'Delivered': 'Delivered successfully. Thank you for choosing LogiShift.',
    'Cancelled': 'Shipment cancelled per request. Need help? Contact support anytime.',
    'Delayed': 'Running a bit behind schedule. We will update you with the next milestone.',
    'Pending': 'Shipment booked. We will notify you as soon as pickup is confirmed.',
}


def delivery_status_message(status: str) -> str:
    return STATUS_COPY.get(status, f'Status update: {status}. Track the latest in Deliveries.')


def serialize_notification(notification: Notification):
    return {
        "id": str(notification.id),
        "recipient_id": notification.recipient_id,
        "recipient_role": notification.recipient_role,
        "title": notification.title,
        "message": notification.message,
        "notification_type": notification.notification_type,
        "related_delivery_id": notification.related_delivery_id,
        "related_user_id": notification.related_user_id,
        "action_url": notification.action_url,
        "is_read": notification.is_read,
        "created_at": notification.created_at.isoformat() if notification.created_at else None,
        "updated_at": notification.updated_at.isoformat() if notification.updated_at else None,
    }


def push_realtime_notification(recipient_id: str, notification: Notification):
    channel_layer = get_channel_layer()
    if not channel_layer:
        return
    unread_count = Notification.objects(recipient_id=recipient_id, is_read='false').count()
    payload = {
        "type": "notification",
        "notification": serialize_notification(notification),
        "unread_count": unread_count,
    }
    try:
        async_to_sync(channel_layer.group_send)(
            f"user_{recipient_id}",
            {
                "type": "notification.message",
                "data": payload,
            },
        )
    except Exception:
        # Avoid crashing primary flow if WebSocket layer is unavailable
        pass

def create_notification(recipient_id, recipient_role, title, message, notification_type='info', 
                       related_delivery_id=None, related_user_id=None, action_url=None):
    """
    Create and save a notification to the database
    """
    notification = Notification(
        recipient_id=recipient_id,
        recipient_role=recipient_role,
        title=title,
        message=message,
        notification_type=notification_type,
        related_delivery_id=related_delivery_id,
        related_user_id=related_user_id,
        action_url=action_url,
        is_read='false'
    )
    notification.save()
    push_realtime_notification(recipient_id, notification)
    return notification


def notify_admin_on_delivery_created(user_id, delivery_id, user_name):
    """Notify admin when user creates a delivery"""
    admins = User.objects(role='admin')
    for admin in admins:
        create_notification(
            recipient_id=str(admin.id),
            recipient_role='admin',
            title='New Delivery Created',
            message=f'{user_name} has created a new delivery',
            notification_type='info',
            related_delivery_id=delivery_id,
            related_user_id=user_id,
            action_url=f'/admin/deliveries'
        )


def notify_user_on_delivery_updated(user_id, delivery_id, status):
    """Notify user when their delivery status is updated"""
    create_notification(
        recipient_id=user_id,
        recipient_role='user',
        title='Delivery Status Updated',
        message=delivery_status_message(status),
        notification_type='important' if status in ['Delivered', 'Cancelled'] else 'info',
        related_delivery_id=delivery_id,
        action_url=f'/deliveries'
    )


def notify_admin_on_delivery_cancelled(user_id, delivery_id, user_name, reason=None):
    """Notify admin when user cancels a delivery"""
    admins = User.objects(role='admin')
    for admin in admins:
        message = f'{user_name} has cancelled a delivery'
        if reason:
            message += f': {reason}'
        create_notification(
            recipient_id=str(admin.id),
            recipient_role='admin',
            title='Delivery Cancelled',
            message=message,
            notification_type='warning',
            related_delivery_id=delivery_id,
            related_user_id=user_id,
            action_url=f'/admin/deliveries'
        )


def notify_driver_on_assignment(driver_id, delivery_id, user_name):
    """Notify driver when assigned to a delivery"""
    create_notification(
        recipient_id=driver_id,
        recipient_role='driver',
        title='New Delivery Assigned',
        message=f'You have been assigned to a new delivery from {user_name}',
        notification_type='important',
        related_delivery_id=delivery_id,
        action_url=f'/driver/dashboard'
    )


def notify_user_on_driver_assignment(user_id, delivery_id, driver_name):
    """Notify user when driver is assigned to their delivery"""
    create_notification(
        recipient_id=user_id,
        recipient_role='user',
        title='Driver Assigned',
        message=f'{driver_name} has been assigned to your delivery',
        notification_type='success',
        related_delivery_id=delivery_id,
        action_url=f'/deliveries'
    )


def notify_admin_on_profile_update(admin_id, user_id, user_name, field):
    """Notify admin when a user updates their profile"""
    create_notification(
        recipient_id=admin_id,
        recipient_role='admin',
        title='User Profile Updated',
        message=f'{user_name} has updated their {field}',
        notification_type='info',
        related_user_id=user_id,
        action_url=f'/admin/users'
    )


def notify_admin_on_delivery_delivered(user_id, delivery_id, driver_name):
    """Notify admin when a delivery is marked as delivered"""
    admins = User.objects(role='admin')
    for admin in admins:
        create_notification(
            recipient_id=str(admin.id),
            recipient_role='admin',
            title='Delivery Completed',
            message=f'{driver_name} has marked a delivery as delivered',
            notification_type='success',
            related_delivery_id=delivery_id,
            action_url=f'/admin/deliveries'
        )


def notify_user_on_delivery_delivered(user_id, delivery_id, driver_name):
    """Notify user when their delivery is delivered"""
    create_notification(
        recipient_id=user_id,
        recipient_role='user',
        title='Delivery Completed',
        message=f'Your delivery has been completed by {driver_name}',
        notification_type='success',
        related_delivery_id=delivery_id,
        action_url=f'/deliveries'
    )
