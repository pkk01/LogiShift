from django.urls import path
from .views import (
    RegisterView, LoginView, ProfileView,
    DeliveryListCreateView, DeliveryDetailView, DeliveryEditView, DeliveryCancelView,
    AdminUsersView, AdminUserDetailView, AdminDeliveriesView, AdminDeliveryUpdateView, AdminDeliveryAssignDriverView,
    DriverDeliveriesView, DriverDeliveryStatusUpdateView,
    TrackDeliveryView, TrackDeliveryByPhoneView, ReviewListCreateView, DeliveryReviewsView,
    NotificationsView, NotificationDetailView, MarkNotificationAsReadView, MarkAllNotificationsAsReadView,
    DeleteNotificationView, UnreadNotificationCountView
)

urlpatterns = [
        # Authentication
    path('register/', RegisterView.as_view(), name='register'),

    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Delivery Management
    path('deliveries/', DeliveryListCreateView.as_view(), name='deliveries'),
    path('deliveries/<str:delivery_id>/', DeliveryDetailView.as_view(), name='delivery-detail'),
    path('deliveries/<str:delivery_id>/edit/', DeliveryEditView.as_view(), name='delivery-edit'),
    path('deliveries/<str:delivery_id>/cancel/', DeliveryCancelView.as_view(), name='delivery-cancel'),
    
    # Admin
    path('admin/users/', AdminUsersView.as_view(), name='admin-users'),
    path('admin/users/<str:user_id>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/deliveries/', AdminDeliveriesView.as_view(), name='admin-deliveries'),
    path('admin/delivery/<str:delivery_id>/', AdminDeliveryUpdateView.as_view(), name='admin-delivery-update'),
    path('admin/delivery/<str:delivery_id>/assign-driver/', AdminDeliveryAssignDriverView.as_view(), name='admin-delivery-assign-driver'),
    
    # Driver
    path('driver/deliveries/', DriverDeliveriesView.as_view(), name='driver-deliveries'),
    path('driver/deliveries/<str:delivery_id>/status/', DriverDeliveryStatusUpdateView.as_view(), name='driver-delivery-status'),
    
    # Tracking (Public)
    path('track/<str:tracking_number>/', TrackDeliveryView.as_view(), name='track-delivery'),
    path('track-by-phone/<str:phone_number>/', TrackDeliveryByPhoneView.as_view(), name='track-by-phone'),
    
    # Reviews
    path('reviews/', ReviewListCreateView.as_view(), name='reviews'),
    path('deliveries/<str:delivery_id>/reviews/', DeliveryReviewsView.as_view(), name='delivery-reviews'),
    
    # Notifications
    path('notifications/', NotificationsView.as_view(), name='notifications'),
    path('notifications/unread-count/', UnreadNotificationCountView.as_view(), name='unread-count'),
    path('notifications/read-all/', MarkAllNotificationsAsReadView.as_view(), name='mark-all-read'),
    path('notifications/<str:notification_id>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('notifications/<str:notification_id>/read/', MarkNotificationAsReadView.as_view(), name='mark-read'),
    path('notifications/<str:notification_id>/delete/', DeleteNotificationView.as_view(), name='delete-notification'),
]
