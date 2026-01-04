"""
Test script to verify email configuration
Run this script to test if email sending is working correctly
"""
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'logistics.settings')
django.setup()

from core.email_utils import (
    send_booking_confirmation_email,
    send_status_update_email,
    send_driver_assigned_email
)


def test_booking_confirmation():
    """Test booking confirmation email"""
    print("\n" + "="*60)
    print("Testing Booking Confirmation Email...")
    print("="*60)
    
    result = send_booking_confirmation_email(
        user_email="prathamdowork@gmail.com",  # Change to your test email
        user_name="Test User",
        delivery_data={
            'tracking_number': 'LS1234567890',
            'pickup_address': '123 Main St, Mumbai, Maharashtra 400001',
            'delivery_address': '456 Park Ave, Delhi, Delhi 110001',
            'package_type': 'Electronics',
            'weight': 5.5,
            'distance': 1400,
            'pickup_date': '15 January 2026',
            'price': 7125.00
        }
    )
    
    if result:
        print("✅ Booking confirmation email sent successfully!")
    else:
        print("❌ Failed to send booking confirmation email")
    
    return result


def test_status_update():
    """Test status update email"""
    print("\n" + "="*60)
    print("Testing Status Update Email...")
    print("="*60)
    
    result = send_status_update_email(
        user_email="prathamdowork@gmail.com",  # Change to your test email
        user_name="Test User",
        delivery_data={
            'tracking_number': 'LS1234567890',
            'pickup_address': '123 Main St, Mumbai, Maharashtra 400001',
            'delivery_address': '456 Park Ave, Delhi, Delhi 110001',
            'driver_name': 'Rajesh Kumar',
            'driver_contact': '+91 98765 43210'
        },
        old_status='Pending',
        new_status='In Transit'
    )
    
    if result:
        print("✅ Status update email sent successfully!")
    else:
        print("❌ Failed to send status update email")
    
    return result


def test_driver_assignment():
    """Test driver assignment email"""
    print("\n" + "="*60)
    print("Testing Driver Assignment Email...")
    print("="*60)
    
    result = send_driver_assigned_email(
        user_email="prathamdowork@gmail.com",  # Change to your test email
        user_name="Test User",
        delivery_data={
            'tracking_number': 'LS1234567890',
            'pickup_address': '123 Main St, Mumbai, Maharashtra 400001',
            'delivery_address': '456 Park Ave, Delhi, Delhi 110001',
            'pickup_date': '15 January 2026'
        },
        driver_name='Rajesh Kumar',
        driver_contact='+91 98765 43210'
    )
    
    if result:
        print("✅ Driver assignment email sent successfully!")
    else:
        print("❌ Failed to send driver assignment email")
    
    return result


def test_delivered_status():
    """Test delivered status email (special design)"""
    print("\n" + "="*60)
    print("Testing Delivered Status Email...")
    print("="*60)
    
    result = send_status_update_email(
        user_email="prathamdowork@gmail.com",  # Change to your test email
        user_name="Test User",
        delivery_data={
            'tracking_number': 'LS1234567890',
            'pickup_address': '123 Main St, Mumbai, Maharashtra 400001',
            'delivery_address': '456 Park Ave, Delhi, Delhi 110001',
            'driver_name': 'Rajesh Kumar',
            'driver_contact': '+91 98765 43210'
        },
        old_status='Out for Delivery',
        new_status='Delivered'
    )
    
    if result:
        print("✅ Delivered status email sent successfully!")
    else:
        print("❌ Failed to send delivered status email")
    
    return result


def main():
    """Run all email tests"""
    print("\n" + "="*60)
    print("🚚 LogiShift Email System Test Suite")
    print("="*60)
    print("\nThis will send test emails to: prathamdowork@gmail.com")
    print("Make sure to check your inbox (and spam folder)!\n")
    
    input("Press Enter to start testing...")
    
    results = []
    
    # Test 1: Booking Confirmation
    results.append(("Booking Confirmation", test_booking_confirmation()))
    
    # Test 2: Status Update
    results.append(("Status Update", test_status_update()))
    
    # Test 3: Driver Assignment
    results.append(("Driver Assignment", test_driver_assignment()))
    
    # Test 4: Delivered Status
    results.append(("Delivered Status", test_delivered_status()))
    
    # Summary
    print("\n" + "="*60)
    print("📊 Test Results Summary")
    print("="*60)
    
    success_count = sum(1 for _, result in results if result)
    total_count = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:.<40} {status}")
    
    print("="*60)
    print(f"Total: {success_count}/{total_count} tests passed")
    print("="*60)
    
    if success_count == total_count:
        print("\n🎉 All email tests passed! Check your inbox.")
    else:
        print("\n⚠️  Some tests failed. Check the error messages above.")
        print("\nTroubleshooting tips:")
        print("1. Verify EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env")
        print("2. Check that Gmail app password is correct")
        print("3. Ensure 2-step verification is enabled on Gmail")
        print("4. Check for any firewall or network restrictions")
    
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTest cancelled by user.")
    except Exception as e:
        print(f"\n❌ Error running tests: {str(e)}")
        import traceback
        traceback.print_exc()
