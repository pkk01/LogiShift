from mongoengine import Document, StringField, DateTimeField
from datetime import datetime

class User(Document):
    email = StringField(required=True, unique=True)
    password_hash = StringField(required=True)
    name = StringField(required=True)
    role = StringField(default='user')  # user/admin
    address = StringField()
    contact_number = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'users'}


class Delivery(Document):
    user_id = StringField(required=True)  # Reference to User
    status = StringField(default='Pending')  # Pending, In Progress, Delivered
    driver_id = StringField()  # Reference to User with role=driver
    pickup_address = StringField(required=True)
    delivery_address = StringField(required=True)
    weight = StringField()  # e.g., "5kg"
    package_type = StringField()  # Small, Medium, Large
    pickup_date = DateTimeField(required=True)
    delivery_date = DateTimeField()
    tracking_number = StringField(unique=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'deliveries'}


class Payment(Document):
    user_id = StringField(required=True)  # Reference to User
    delivery_id = StringField(required=True)  # Reference to Delivery
    amount = StringField(required=True)
    payment_status = StringField(default='Pending')  # Paid, Pending, Failed
    payment_date = DateTimeField(default=datetime.utcnow)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'payments'}


class Review(Document):
    delivery_id = StringField(required=True)  # Reference to Delivery
    user_id = StringField(required=True)  # Reference to User
    rating = StringField(required=True)  # 1-5
    comment = StringField()
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'reviews'}


class Notification(Document):
    recipient_id = StringField(required=True)  # User receiving the notification
    recipient_role = StringField(required=True)  # admin/user/driver
    title = StringField(required=True)
    message = StringField(required=True)
    notification_type = StringField(default='info')  # info/warning/important/success
    related_delivery_id = StringField()  # Reference to Delivery (if applicable)
    related_user_id = StringField()  # Reference to User who triggered the notification
    is_read = StringField(default='false')
    action_url = StringField()  # URL to navigate to on click
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'notifications', 'indexes': ['recipient_id', 'is_read', 'created_at']}
