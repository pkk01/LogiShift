"""
Email notification utilities for LogiShift
Sends HTML-formatted emails to users for various events
"""
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
import logging

# Get frontend URL from settings
FRONTEND_URL = settings.FRONTEND_URL

logger = logging.getLogger(__name__)


def send_html_email(to_email, subject, html_content, text_content=None):
    """
    Send an HTML email with fallback text content
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML content
        text_content: Plain text fallback (optional)
    """
    try:
        print(f"[EMAIL UTILS] Starting email send process...")
        print(f"[EMAIL UTILS] To: {to_email}")
        print(f"[EMAIL UTILS] Subject: {subject}")
        print(f"[EMAIL UTILS] Email backend: {settings.EMAIL_BACKEND}")
        print(f"[EMAIL UTILS] SMTP Host: {settings.EMAIL_HOST}")
        print(f"[EMAIL UTILS] SMTP User: {settings.EMAIL_HOST_USER}")
        
        subject = f"{settings.EMAIL_SUBJECT_PREFIX}{subject}"
        from_email = settings.DEFAULT_FROM_EMAIL
        
        # Create email message
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content or "Please view this email in an HTML-capable email client.",
            from_email=from_email,
            to=[to_email]
        )
        
        # Attach HTML content
        msg.attach_alternative(html_content, "text/html")
        
        print(f"[EMAIL UTILS] Sending email via SMTP...")
        # Send email
        msg.send(fail_silently=False)
        
        print(f"[EMAIL UTILS] ✅ Email sent successfully to {to_email}: {subject}")
        logger.info(f"Email sent successfully to {to_email}: {subject}")
        return True
        
    except Exception as e:
        print(f"[EMAIL UTILS] ❌ Failed to send email to {to_email}: {str(e)}")
        print(f"[EMAIL UTILS] Error type: {type(e).__name__}")
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def get_email_template_base(frontend_url=None):
    """Returns the base HTML template structure with LogiShift branding"""
    if frontend_url is None:
        frontend_url = FRONTEND_URL
    
    # Pre-format the footer links with frontend_url
    footer_links = f"""
                <a href="{frontend_url}/track">Track Order</a> |
                <a href="{frontend_url}/deliveries">My Deliveries</a> |
                <a href="{frontend_url}/profile">Account</a>
    """
    
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        @keyframes fadeIn {{
            from {{ opacity: 0; transform: translateY(20px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}
        @keyframes slideIn {{
            from {{ transform: translateX(-20px); opacity: 0; }}
            to {{ transform: translateX(0); opacity: 1; }}
        }}
        @keyframes pulse {{
            0%, 100% {{ transform: scale(1); }}
            50% {{ transform: scale(1.05); }}
        }}
        body {{
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f9fafb;
            line-height: 1.6;
        }}
        .email-container {{
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            animation: fadeIn 0.6s ease-out;
        }}
        .email-header {{
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }}
        .logo {{
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
            animation: slideIn 0.8s ease-out;
        }}
        .logo-subtitle {{
            font-size: 14px;
            opacity: 0.9;
            letter-spacing: 2px;
        }}
        .email-body {{
            padding: 40px 30px;
        }}
        .greeting {{
            font-size: 24px;
            color: #1e293b;
            margin-bottom: 20px;
            font-weight: 600;
        }}
        .message {{
            color: #64748b;
            font-size: 16px;
            margin-bottom: 30px;
        }}
        .info-box {{
            background: #f1f5f9;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
            animation: slideIn 0.8s ease-out;
        }}
        .info-box h3 {{
            margin: 0 0 15px 0;
            color: #1e293b;
            font-size: 18px;
        }}
        .info-row {{
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }}
        .info-row:last-child {{
            border-bottom: none;
        }}
        .info-label {{
            color: #64748b;
            font-weight: 500;
        }}
        .info-value {{
            color: #1e293b;
            font-weight: 600;
        }}
        .status-badge {{
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            animation: pulse 2s infinite;
        }}
        .status-pending {{
            background: #fef3c7;
            color: #92400e;
        }}
        .status-confirmed {{
            background: #d1fae5;
            color: #065f46;
        }}
        .status-in-transit {{
            background: #dbeafe;
            color: #1e40af;
        }}
        .status-delivered {{
            background: #d1fae5;
            color: #065f46;
        }}
        .cta-button {{
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: #ffffff !important;
            padding: 14px 32px;
            text-decoration: none !important;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
            font-size: 16px;
            border: none;
        }}
        .cta-button:hover {{
            transform: translateY(-2px);
        }}
        .tracking-number {{
            background: #eff6ff;
            border: 2px dashed #2563eb;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin: 25px 0;
        }}
        .tracking-number-label {{
            color: #64748b;
            font-size: 14px;
            margin-bottom: 8px;
        }}
        .tracking-number-value {{
            color: #2563eb;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
        }}
        .email-footer {{
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }}
        .footer-links {{
            margin: 15px 0;
        }}
        .footer-links a {{
            color: #2563eb;
            text-decoration: none;
            margin: 0 10px;
        }}
        .divider {{
            height: 1px;
            background: #e2e8f0;
            margin: 30px 0;
        }}
        .highlight {{
            color: #2563eb;
            font-weight: 600;
        }}
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">🚚 LogiShift</div>
            <div class="logo-subtitle">LOGISTICS MANAGEMENT SYSTEM</div>
        </div>
        
        <div class="email-body">
            {content}
        </div>
        
        <div class="email-footer">
            <div class="footer-links">""" + footer_links + """
            </div>
            <p>© 2026 LogiShift. All rights reserved.</p>
            <p style="font-size: 12px; color: #94a3b8;">
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
"""


def send_booking_confirmation_email(user_email, user_name, delivery_data):
    """
    Send booking confirmation email to user
    
    Args:
        user_email: User's email address
        user_name: User's name
        delivery_data: Dictionary with delivery details
    """
    
    content = f"""
        <div class="greeting">Hello {user_name}! 👋</div>
        <div class="message">
            Your delivery has been successfully booked with LogiShift. We're excited to serve you!
        </div>
        
        <div class="tracking-number">
            <div class="tracking-number-label">Your Tracking Number</div>
            <div class="tracking-number-value">{delivery_data.get('tracking_number', 'N/A')}</div>
        </div>
        
        <div class="info-box">
            <h3>📦 Booking Details</h3>
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="status-badge status-confirmed">✓ Confirmed</span>
            </div>
            <div class="info-row">
                <span class="info-label">Pickup Location:</span>
                <span class="info-value">{delivery_data.get('pickup_address', 'N/A')}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Delivery Location:</span>
                <span class="info-value">{delivery_data.get('delivery_address', 'N/A')}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Package Type:</span>
                <span class="info-value">{delivery_data.get('package_type', 'N/A')}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Weight:</span>
                <span class="info-value">{delivery_data.get('weight', 'N/A')} kg</span>
            </div>
            <div class="info-row">
                <span class="info-label">Distance:</span>
                <span class="info-value">{delivery_data.get('distance', 'N/A')} km</span>
            </div>
            <div class="info-row">
                <span class="info-label">Pickup Date:</span>
                <span class="info-value">{delivery_data.get('pickup_date', 'N/A')}</span>
            </div>
        </div>
        
        <div class="info-box" style="border-left-color: #22c55e;">
            <h3>💰 Payment Details</h3>
            <div class="info-row">
                <span class="info-label">Total Amount:</span>
                <span class="info-value highlight" style="font-size: 24px;">₹{delivery_data.get('price', 0):.2f}</span>
            </div>
        </div>
        
        <div style="text-align: center;">
            <a href="{FRONTEND_URL}/track?tracking={delivery_data.get('tracking_number', '')}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none !important; border-radius: 8px; font-weight: 600; margin: 20px 0; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                Track Your Delivery 📍
            </a>
        </div>
        
        <div class="divider"></div>
        
        <div class="message" style="margin-bottom: 0;">
            <strong>What's Next?</strong><br>
            Our team will review your booking and assign a driver shortly. You'll receive another email once a driver is assigned to your delivery.
        </div>
    """
    
    html_content = get_email_template_base().format(
        title="Booking Confirmed - LogiShift",
        content=content
    )
    
    text_content = f"""
Hello {user_name}!

Your delivery has been successfully booked with LogiShift.

Tracking Number: {delivery_data.get('tracking_number', 'N/A')}
Status: Confirmed

Booking Details:
- Pickup: {delivery_data.get('pickup_address', 'N/A')}
- Delivery: {delivery_data.get('delivery_address', 'N/A')}
- Package Type: {delivery_data.get('package_type', 'N/A')}
- Weight: {delivery_data.get('weight', 'N/A')} kg
- Distance: {delivery_data.get('distance', 'N/A')} km
- Pickup Date: {delivery_data.get('pickup_date', 'N/A')}

Total Amount: ₹{delivery_data.get('price', 0):.2f}

Track your delivery: {FRONTEND_URL}/track?tracking={delivery_data.get('tracking_number', '')}

Thank you for choosing LogiShift!
"""
    
    return send_html_email(
        to_email=user_email,
        subject="Booking Confirmed - Your Delivery is Scheduled! 🚚",
        html_content=html_content,
        text_content=text_content
    )


def send_status_update_email(user_email, user_name, delivery_data, old_status, new_status):
    """
    Send status update email to user
    
    Args:
        user_email: User's email address
        user_name: User's name
        delivery_data: Dictionary with delivery details
        old_status: Previous status
        new_status: New status
    """
    
    # Determine status badge class and emoji
    status_info = {
        'Pending': ('status-pending', '⏳', 'Your order is pending confirmation'),
        'Scheduled': ('status-confirmed', '📅', 'Your order has been scheduled'),
        'Picked Up': ('status-in-transit', '📦', 'Your package has been picked up'),
        'In Transit': ('status-in-transit', '🚚', 'Your package is on the way'),
        'Out for Delivery': ('status-in-transit', '🛵', 'Your package is out for delivery'),
        'Delivered': ('status-delivered', '✅', 'Your package has been delivered'),
        'Cancelled': ('status-pending', '❌', 'Your order has been cancelled'),
    }
    
    status_class, emoji, status_message = status_info.get(new_status, ('status-pending', '📦', 'Status updated'))
    
    # Special content for delivered status
    if new_status == 'Delivered':
        special_content = """
            <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); padding: 30px; border-radius: 8px; text-align: center; margin: 25px 0;">
                <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
                <div style="font-size: 24px; color: #065f46; font-weight: bold; margin-bottom: 10px;">
                    Delivery Completed!
                </div>
                <div style="color: #047857;">
                    Thank you for choosing LogiShift. We hope you're satisfied with our service!
                </div>
            </div>
            
            <div class="message">
                <strong>Rate Your Experience</strong><br>
                We'd love to hear your feedback! Please take a moment to rate your delivery experience.
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="{FRONTEND_URL}/deliveries" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none !important; border-radius: 8px; font-weight: 600; margin: 20px 0; font-size: 16px;">
                    Rate Delivery ⭐
                </a>
            </div>
        """
    else:
        special_content = f"""
            <div class="message">
                Your delivery status has been updated. You can track your package in real-time using the tracking number below.
            </div>
        """
    
    content = f"""
        <div class="greeting">Hello {user_name}! 👋</div>
        
        <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 64px; margin-bottom: 15px;">{emoji}</div>
            <div style="font-size: 20px; color: #1e293b; font-weight: 600; margin-bottom: 10px;">
                {status_message}
            </div>
            <span class="status-badge {status_class}" style="animation: pulse 2s infinite;">
                {new_status}
            </span>
        </div>
        
        {special_content}
        
        <div class="tracking-number">
            <div class="tracking-number-label">Tracking Number</div>
            <div class="tracking-number-value">{delivery_data.get('tracking_number', 'N/A')}</div>
        </div>
        
        <div class="info-box">
            <h3>📦 Delivery Details</h3>
            <div class="info-row">
                <span class="info-label">Previous Status:</span>
                <span class="info-value">{old_status}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Current Status:</span>
                <span class="info-value highlight">{new_status}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Pickup Location:</span>
                <span class="info-value">{delivery_data.get('pickup_address', 'N/A')}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Delivery Location:</span>
                <span class="info-value">{delivery_data.get('delivery_address', 'N/A')}</span>
            </div>
            {f'''<div class="info-row">
                <span class="info-label">Driver:</span>
                <span class="info-value">{delivery_data.get('driver_name', 'Not assigned')}</span>
            </div>''' if delivery_data.get('driver_name') else ''}
            {f'''<div class="info-row">
                <span class="info-label">Driver Contact:</span>
                <span class="info-value">{delivery_data.get('driver_contact', 'N/A')}</span>
            </div>''' if delivery_data.get('driver_contact') else ''}
        </div>
        
        <div style="text-align: center;">
            <a href="{FRONTEND_URL}/track?tracking={delivery_data.get('tracking_number', '')}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none !important; border-radius: 8px; font-weight: 600; margin: 20px 0; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                Track Your Delivery 📍
            </a>
        </div>
        
        <div class="divider"></div>
        
        <div class="message" style="margin-bottom: 0; font-size: 14px;">
            <strong>Need Help?</strong><br>
            If you have any questions or concerns about your delivery, please don't hesitate to contact our support team.
        </div>
    """
    
    html_content = get_email_template_base().format(
        title=f"Status Update: {new_status} - LogiShift",
        content=content
    )
    
    text_content = f"""
Hello {user_name}!

Your delivery status has been updated.

Tracking Number: {delivery_data.get('tracking_number', 'N/A')}
Previous Status: {old_status}
Current Status: {new_status}

{status_message}

Delivery Details:
- Pickup: {delivery_data.get('pickup_address', 'N/A')}
- Delivery: {delivery_data.get('delivery_address', 'N/A')}
{f"- Driver: {delivery_data.get('driver_name', 'Not assigned')}" if delivery_data.get('driver_name') else ''}
{f"- Driver Contact: {delivery_data.get('driver_contact', 'N/A')}" if delivery_data.get('driver_contact') else ''}

Track your delivery: {FRONTEND_URL}/track?tracking={delivery_data.get('tracking_number', '')}

Thank you for choosing LogiShift!
"""
    
    subject_prefix = "🎉 Delivered" if new_status == 'Delivered' else "📦 Status Update"
    
    return send_html_email(
        to_email=user_email,
        subject=f"{subject_prefix}: {new_status} - {delivery_data.get('tracking_number', '')}",
        html_content=html_content,
        text_content=text_content
    )


def send_driver_assigned_email(user_email, user_name, delivery_data, driver_name, driver_contact):
    """
    Send email when driver is assigned to delivery
    
    Args:
        user_email: User's email address
        user_name: User's name
        delivery_data: Dictionary with delivery details
        driver_name: Name of assigned driver
        driver_contact: Driver's contact number
    """
    
    content = f"""
        <div class="greeting">Hello {user_name}! 👋</div>
        
        <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 64px; margin-bottom: 15px;">🚗</div>
            <div style="font-size: 20px; color: #1e293b; font-weight: 600; margin-bottom: 10px;">
                Driver Assigned to Your Delivery!
            </div>
        </div>
        
        <div class="message">
            Great news! A driver has been assigned to your delivery. Your package will be picked up soon.
        </div>
        
        <div class="tracking-number">
            <div class="tracking-number-label">Tracking Number</div>
            <div class="tracking-number-value">{delivery_data.get('tracking_number', 'N/A')}</div>
        </div>
        
        <div class="info-box" style="border-left-color: #22c55e;">
            <h3>👤 Driver Information</h3>
            <div class="info-row">
                <span class="info-label">Driver Name:</span>
                <span class="info-value highlight">{driver_name}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Contact Number:</span>
                <span class="info-value highlight">{driver_contact}</span>
            </div>
        </div>
        
        <div class="info-box">
            <h3>📦 Delivery Details</h3>
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="status-badge status-confirmed">Scheduled</span>
            </div>
            <div class="info-row">
                <span class="info-label">Pickup Location:</span>
                <span class="info-value">{delivery_data.get('pickup_address', 'N/A')}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Delivery Location:</span>
                <span class="info-value">{delivery_data.get('delivery_address', 'N/A')}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Pickup Date:</span>
                <span class="info-value">{delivery_data.get('pickup_date', 'N/A')}</span>
            </div>
        </div>
        
        <div style="text-align: center;">
            <a href="{FRONTEND_URL}/track?tracking={delivery_data.get('tracking_number', '')}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none !important; border-radius: 8px; font-weight: 600; margin: 20px 0; font-size: 16px;">
                Track Your Delivery 📍
            </a>
        </div>
        
        <div class="divider"></div>
        
        <div class="message" style="margin-bottom: 0;">
            <strong>What's Next?</strong><br>
            Your driver will pick up the package at the scheduled time. You'll receive updates as your delivery progresses. Feel free to contact your driver if you have any questions.
        </div>
    """
    
    html_content = get_email_template_base().format(
        title="Driver Assigned - LogiShift",
        content=content
    )
    
    text_content = f"""
Hello {user_name}!

Great news! A driver has been assigned to your delivery.

Tracking Number: {delivery_data.get('tracking_number', 'N/A')}

Driver Information:
- Name: {driver_name}
- Contact: {driver_contact}

Delivery Details:
- Status: Scheduled
- Pickup: {delivery_data.get('pickup_address', 'N/A')}
- Delivery: {delivery_data.get('delivery_address', 'N/A')}
- Pickup Date: {delivery_data.get('pickup_date', 'N/A')}

Track your delivery: {FRONTEND_URL}/track?tracking={delivery_data.get('tracking_number', '')}

Thank you for choosing LogiShift!
"""
    
    return send_html_email(
        to_email=user_email,
        subject=f"🚗 Driver Assigned - {delivery_data.get('tracking_number', '')}",
        html_content=html_content,
        text_content=text_content
    )
