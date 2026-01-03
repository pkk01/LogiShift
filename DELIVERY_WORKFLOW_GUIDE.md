# Delivery Lifecycle & Tracking Guide

A concise map of how deliveries move through the system across roles (user, admin, driver), what APIs exist, and which parts of the frontend/backed to check when you need to trace behavior.

## Core Objects

- Delivery fields: status, tracking_number, pickup_address, delivery_address, weight, package_type, pickup_date, delivery_date (set when delivered), driver_id, distance, price, timestamps. See [LS_Backend/core/models.py](LS_Backend/core/models.py).
- Notification fields: recipient_id/role, title, message, notification_type, related_delivery_id, is_read, action_url. See [LS_Backend/core/models.py](LS_Backend/core/models.py) and helpers in [LS_Backend/core/notification_utils.py](LS_Backend/core/notification_utils.py).

## Status Flow

- Typical progression: Pending → Scheduled (driver assigned) → Picked Up → In Transit → Out for Delivery → Delivered.
- Exceptions: Cancelled (user until pickup) and Delayed (admin-only informational).
- Driver updates allowed: Out for Delivery, Delivered, Cancelled via [DriverDeliveryStatusUpdateView in LS_Backend/core/views.py](LS_Backend/core/views.py).
- Admin updates allowed: any status via [AdminDeliveryUpdateView](LS_Backend/core/views.py). Delivered stamps delivery_date when missing.

## Role Capabilities & Key Endpoints

**User**

- Create delivery & auto price calc: `POST /api/deliveries/` ([DeliveryListCreateView](LS_Backend/core/views.py)). Distance uses city/state dropdowns; falls back to 0 when missing.
- Edit before pickup: `PUT /api/deliveries/<id>/` ([DeliveryEditView](LS_Backend/core/views.py)). Recalculates price when weight/package/address change and pincodes provided.
- Cancel before pickup: `POST /api/deliveries/<id>/cancel/`.
- Track: `GET /api/track/<tracking_number>/` and `GET /api/track/phone/<phone_number>/` ([TrackDeliveryView, TrackDeliveryByPhoneView](LS_Backend/core/views.py)).
- Reviews: `GET/POST /api/reviews/` and `GET /api/deliveries/<id>/reviews/`.

**Admin**

- List deliveries: `GET /api/admin/deliveries/` ([AdminDeliveriesView](LS_Backend/core/views.py)).
- Update status: `PUT /api/admin/deliveries/<id>/` ([DeliveryStatusUpdateSerializer](LS_Backend/core/serializers.py)).
- Assign driver: `POST /api/admin/deliveries/<id>/assign-driver/` ([AdminDeliveryAssignDriverView](LS_Backend/core/views.py)). Sets status to Scheduled if Pending.
- Manage users: `GET/PUT /api/admin/users/<id>/`, list via `GET /api/admin/users/`.

**Driver**

- See assigned jobs: `GET /api/driver/deliveries/` with optional status filter.
- Update delivery status (limited set): `PUT /api/driver/deliveries/<id>/status/` ([DriverDeliveryStatusUpdateView](LS_Backend/core/views.py)).

**Shared Utility**

- Price estimate (pre-create): `POST /api/estimate-price/` ([PriceEstimateView](LS_Backend/core/views.py)) uses city/state to call `calculate_distance` in [LS_Backend/core/pricing_utils.py](LS_Backend/core/pricing_utils.py), then `get_price_breakdown`.

## Notifications & Realtime

- Creation helpers in [notification_utils.py](LS_Backend/core/notification_utils.py) fire on: delivery create, cancel, status change, driver assignment, delivered.
- WebSocket push (Channels) via `push_realtime_notification`; falls back silently if channel layer absent.
- REST endpoints: `/api/notifications/`, `/api/notifications/<id>/`, `/api/notifications/<id>/read/`, `/api/notifications/read-all/`, `/api/notifications/<id>/delete/`, `/api/notifications/unread-count/` ([NotificationsView\* variants in LS_Backend/core/views.py](LS_Backend/core/views.py)).

## Frontend Touchpoints

- Delivery creation and list: [LS_Frontend/src/pages/NewDelivery.tsx](LS_Frontend/src/pages/NewDelivery.tsx), [LS_Frontend/src/pages/Deliveries.tsx](LS_Frontend/src/pages/Deliveries.tsx), admin views under [LS_Frontend/src/pages/admin](LS_Frontend/src/pages/admin).
- Tracking (public): [LS_Frontend/src/pages/Track.tsx](LS_Frontend/src/pages/Track.tsx).
- Driver dashboard: [LS_Frontend/src/pages/driver/DriverDashboard.tsx](LS_Frontend/src/pages/driver/DriverDashboard.tsx).
- Notifications UI: [LS_Frontend/src/components/NotificationDropdown.tsx](LS_Frontend/src/components/NotificationDropdown.tsx) with polling and badge in [Navbar.tsx](LS_Frontend/src/components/Navbar.tsx); API wrapper in [LS_Frontend/src/services/notificationService.ts](LS_Frontend/src/services/notificationService.ts).

## Smoke Tests (happy path)

1. User creates delivery → admin receives notification → delivery appears in admin list as Pending.
2. Admin assigns driver → status becomes Scheduled → driver sees job → user gets driver assigned notification.
3. Driver sets Out for Delivery → user sees status update; optional Delayed/Cancelled handled.
4. Driver sets Delivered → delivery_date set, price remains unchanged, both admin/user get success notifications.
5. Tracking page shows status and driver contact for public tracking number and for phone lookup.

## Operational Notes

- City/state are required for accurate distance; missing values default distance to 0 which lowers price. Validate dropdowns on the frontend when possible.
- Cancellations blocked after pickup; enforce in UI to avoid 400s.
- Notification writes are best-effort; main flows should not break if Channels/Redis is unavailable.
- Consider adding indexes on deliveries by status/driver if query volume grows; currently all sorts happen in-memory after MongoEngine query.
