"""
Quick test script to verify the price estimation fix
Run this from the LS_Backend directory:
python manage.py shell < test_price_estimation.py
"""

from core.pricing_utils import calculate_distance, get_price_breakdown

# Test with the pincodes from the error report
pickup_pincode = '221106'  # Varanasi
delivery_pincode = '110008'  # Delhi
weight = 10
package_type = 'Electronics'

print("\n" + "="*70)
print("TESTING PRICE ESTIMATION FIX")
print("="*70)

print(f"\nTest Case:")
print(f"  Pickup Pincode: {pickup_pincode}")
print(f"  Delivery Pincode: {delivery_pincode}")
print(f"  Weight: {weight} kg")
print(f"  Package Type: {package_type}")

# Test distance calculation
print(f"\n1. Testing distance calculation...")
distance = calculate_distance(pickup_pincode, delivery_pincode)

if distance:
    print(f"   ✓ Distance calculated successfully: {distance} km")
    
    # Test price breakdown
    print(f"\n2. Testing price breakdown...")
    breakdown = get_price_breakdown(distance, weight, package_type)
    
    if breakdown:
        print(f"   ✓ Price breakdown generated successfully:")
        print(f"     - Base Rate: ₹{breakdown['base_rate']}")
        print(f"     - Distance: {breakdown['distance_km']} km × ₹{breakdown['distance_cost']/breakdown['distance_km']:.0f}/km = ₹{breakdown['distance_cost']}")
        print(f"     - Weight: {breakdown['weight_kg']} kg × ₹{breakdown['weight_cost']/breakdown['weight_kg']:.0f}/kg = ₹{breakdown['weight_cost']}")
        print(f"     - Package Surcharge: ₹{breakdown['package_surcharge']}")
        print(f"     - TOTAL PRICE: ₹{breakdown['total_price']}")
    else:
        print(f"   ✗ Failed to generate price breakdown")
else:
    print(f"   ✗ Failed to calculate distance")

print("\n" + "="*70)
