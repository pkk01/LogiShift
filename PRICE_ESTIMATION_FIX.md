# Price Estimation Fix - Documentation

## Problem

The frontend was getting a 400 Bad Request error when trying to estimate delivery prices:

```
Error: Unable to calculate distance. Please check the pincodes.
Pincodes: 221106 (Varanasi) → 110008 (Delhi)
```

## Root Cause

The backend's distance calculation was failing because:

1. OpenRouteService API's geocoding might not have data for specific Indian pincodes
2. There was no fallback mechanism when the API request failed
3. The system couldn't calculate prices without distance data

## Solution Implemented

### 1. **Pincode Database** (`core/pincode_database.py`)

- Created a comprehensive mapping of Indian pincodes to their geographic coordinates
- Includes major cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune)
- Includes the specific pincodes mentioned in the error: **221106** (Varanasi) and **110008** (Delhi)
- Provides fallback data when external APIs fail

### 2. **Enhanced Geocoding** (in `core/pricing_utils.py`)

- Modified `geocode_pincode()` to use a two-tier approach:
  - **First**: Try OpenRouteService API (for new/updated data)
  - **Second**: Fallback to local database if API fails
- Handles API errors gracefully and attempts database lookup

### 3. **Haversine Distance Calculation**

- Added `haversine_distance()` function for coordinate-based distance calculation
- Uses the Haversine formula: accurate geographic distance between two points
- Multiplies result by 1.3 to approximate actual road distances (roads aren't straight)
- Serves as final fallback when routing API fails

### 4. **Improved `calculate_distance()` Function**

- Now uses three-tier fallback strategy:
  1.  OpenRouteService Directions API (most accurate, real routing)
  2.  Haversine formula with database coordinates (fast, reasonable accuracy)
  3.  Returns `None` only if coordinates cannot be obtained at all

## Technical Details

### Coordinates for Test Pincodes

- **221106** (Varanasi): (83.0123, 25.2856) - longitude, latitude
- **110008** (Delhi): (77.2314, 28.5698)
- **Distance**: ~900 km (approximate straight-line + 30% for road variations)

### Haversine Formula

```
Formula: a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
         c = 2 × asin(√a)
         d = R × c  (R = 6371 km for Earth's radius)
         road_distance ≈ d × 1.3
```

## How It Works Now

### When User Requests Price Estimate:

1. Frontend sends: `{pickup_pincode: '221106', delivery_pincode: '110008', weight: 10, package_type: 'Electronics'}`
2. Backend receives request → Validates data
3. Calls `calculate_distance()`:
   - **Geocoding**: Gets (longitude, latitude) for each pincode
     - Tries OpenRouteService API
     - Falls back to database if API unavailable
   - **Distance**: Calculates distance
     - Tries OpenRouteService routing
     - Falls back to Haversine formula with coordinates
4. Calls `get_price_breakdown()`:
   - Uses calculated distance to compute: base_rate + distance_cost + weight_cost + package_surcharge
5. Returns JSON response with full price breakdown

## Price Calculation Formula

```
Total Price = Base Rate + (Distance × Per-KM Rate) + (Weight × Per-KG Rate) + Package Surcharge

Example (from settings.py):
- Base Rate: ₹50
- Per-KM Rate: ₹5
- Per-KG Rate: ₹10
- Electronics Surcharge: ₹100

For 221106 → 110008, 10 kg, Electronics:
Distance ≈ 900 km
= 50 + (900 × 5) + (10 × 10) + 100
= 50 + 4500 + 100 + 100
= ₹4,750
```

## Files Modified

### New Files

- `core/pincode_database.py` - Pincode to coordinates mapping
- `test_price_estimation.py` - Test script to verify the fix

### Modified Files

- `core/pricing_utils.py`:
  - Added import for pincode database and math module
  - Enhanced `geocode_pincode()` with fallback logic
  - Added `haversine_distance()` function
  - Updated `calculate_distance()` with three-tier fallback strategy

## Testing the Fix

### Option 1: Manual Frontend Test

1. Navigate to New Delivery page
2. Enter pincodes (e.g., 221106 → 110008)
3. Enter weight and package type
4. Price estimate should now appear without errors

### Option 2: Test Script

```bash
cd LS_Backend
python manage.py shell < test_price_estimation.py
```

This will output:

- Distance calculation result
- Full price breakdown with itemized costs

### Option 3: Direct API Test

```bash
curl -X POST http://localhost:8000/api/estimate-price/ \
  -H "Content-Type: application/json" \
  -d '{
    "pickup_pincode": "221106",
    "delivery_pincode": "110008",
    "weight": 10,
    "package_type": "Electronics"
  }'
```

## Adding More Pincodes

To add new pincodes to the database, edit `core/pincode_database.py`:

```python
PINCODE_COORDINATES = {
    # Existing entries...
    '123456': (longitude, latitude),  # Add your pincode here
}
```

Get coordinates from:

- Google Maps (search pincode, note lat/lon in URL)
- OpenStreetMap
- Any geocoding service

## Fallback Strategy Priority

1. **Real-time**: OpenRouteService API (best accuracy)
2. **Fast**: Local Database + Haversine (good accuracy for known pincodes)
3. **Error**: Returns 400 Bad Request (only if coordinates unavailable)

## Benefits

✅ **Robust**: Works even when external APIs are slow or unavailable
✅ **Fast**: Database lookups are instant
✅ **Accurate**: Haversine formula provides reasonable distance estimates
✅ **Scalable**: Easy to add more pincodes to database
✅ **User-Friendly**: Price estimates work reliably

## Troubleshooting

### Issue: Still getting "Unable to calculate distance" error

**Solution**:

1. Check if pincode is in `core/pincode_database.py`
2. Add missing pincode with correct coordinates
3. Verify OpenRouteService API key in `.env`

### Issue: Distance seems incorrect

**Solution**:

1. This is normal - Haversine calculates straight-line distance
2. Road distance is typically 20-50% longer than straight-line
3. Formula multiplies by 1.3 to approximate road distance
4. OpenRouteService API will provide more accurate routing when available

## Configuration

Check `logistics/settings.py` for pricing configuration:

```python
PRICE_BASE_RATE = 50  # Base delivery fee
PRICE_PER_KM_RATE = 5  # Per kilometer charge
PRICE_PER_KG_RATE = 10  # Per kilogram charge

PACKAGE_SURCHARGES = {
    'Small': 0,
    'Medium': 50,
    'Large': 100,
    'Fragile': 200,
    'Electronics': 100,  # Example surcharge
}
```
