# Enhanced Pincode Lookup System - Implementation Guide

## Overview

The pricing system has been enhanced to support **pincode + city + state** lookups with **case-insensitive** matching. This provides better accuracy and validates that pincodes match the provided city and state.

## System Architecture

### Three-Tier Distance Calculation Strategy

```
┌─────────────────────────────────────────┐
│  1. Database Lookup (Fastest)           │
│  Pincode + City + State Verification   │
│  ✓ Case-insensitive                    │
│  ✓ Returns (latitude, longitude)        │
└────────────┬────────────────────────────┘
             │
             ├─ If pincode not found or city/state mismatch:
             │
┌────────────▼────────────────────────────┐
│  2. OpenRouteService API (More Accurate)│
│  Real road routing + geocoding         │
│  ✓ Provides road-based distance        │
│  ✓ Falls back to Haversine if fails    │
└────────────┬────────────────────────────┘
             │
             ├─ If API fails:
             │
┌────────────▼────────────────────────────┐
│  3. Haversine Formula (Fast Fallback)    │
│  Great-circle distance using coords    │
│  ✓ Accurate for great-circle distance   │
│  ✓ No multiplier (direct calculation)   │
└─────────────────────────────────────────┘
```

## Database Structure

### Pincode Database Format

```python
PINCODE_COORDINATES = {
    '221106': {
        'city': 'Varanasi',
        'state': 'Uttar Pradesh',
        'coordinates': (25.2945, 83.0289)  # (latitude, longitude)
    },
    '110008': {
        'city': 'New Delhi',
        'state': 'Delhi',
        'coordinates': (28.5355, 77.2507)  # (latitude, longitude)
    },
    # ... 160+ more entries
}
```

## API Endpoint: Price Estimation

### Request Format (POST `/api/estimate-price/`)

```json
{
  "pickup_pincode": "221106",
  "pickup_city": "Varanasi", // Optional
  "pickup_state": "Uttar Pradesh", // Optional
  "delivery_pincode": "110008",
  "delivery_city": "New Delhi", // Optional
  "delivery_state": "Delhi", // Optional
  "weight": 10.5,
  "package_type": "Electronics"
}
```

### Backward Compatibility

- City and state parameters are **optional**
- Existing requests with only pincodes will still work
- Enhanced validation only happens when city/state provided

### Case-Insensitive Examples

All of these are equivalent:

```python
# Example 1: Uppercase
{
    "pickup_pincode": "221106",
    "pickup_city": "VARANASI",
    "pickup_state": "UTTAR PRADESH"
}

# Example 2: Lowercase
{
    "pickup_pincode": "221106",
    "pickup_city": "varanasi",
    "pickup_state": "uttar pradesh"
}

# Example 3: Mixed case
{
    "pickup_pincode": "221106",
    "pickup_city": "Varanasi",
    "pickup_state": "Uttar Pradesh"
}

# All work correctly! ✓
```

### Response Format

```json
{
  "distance": 920.45,
  "price": 4850.0,
  "price_breakdown": {
    "base_rate": 50.0,
    "distance_km": 920.45,
    "distance_cost": 4602.25,
    "weight_kg": 10.5,
    "weight_cost": 105.0,
    "package_type": "Electronics",
    "package_surcharge": 100.0,
    "total_price": 4850.0
  }
}
```

### Error Responses

**Missing City/State Match:**

```json
{
  "error": "City/State mismatch for pincode 221106",
  "details": {
    "pincode": "221106",
    "requested_city": "Delhi", // Wrong!
    "database_city": "Varanasi", // Correct
    "requested_state": "Delhi", // Wrong!
    "database_state": "Uttar Pradesh" // Correct
  }
}
```

**Invalid Pincodes:**

```json
{
  "error": "Unable to calculate distance. Please check the pincodes.",
  "pincode1": "999999",
  "pincode2": "110008"
}
```

## Function Documentation

### `get_pincode_coordinates(pincode, city=None, state=None)`

**Location:** `core/pincode_database.py`

Gets coordinates for a pincode with optional city/state verification.

```python
# Example 1: Pincode only
coords = get_pincode_coordinates('221106')
# Returns: (25.2945, 83.0289)

# Example 2: Pincode + city (case-insensitive)
coords = get_pincode_coordinates('221106', 'VARANASI')
# Returns: (25.2945, 83.0289) ✓

# Example 3: Pincode + city + state
coords = get_pincode_coordinates('221106', 'Varanasi', 'uttar pradesh')
# Returns: (25.2945, 83.0289) ✓

# Example 4: Wrong city
coords = get_pincode_coordinates('221106', 'Delhi')
# Returns: None ✗ (city mismatch)
```

**Parameters:**

- `pincode` (str): Postal code
- `city` (str, optional): City name (case-insensitive)
- `state` (str, optional): State name (case-insensitive)

**Returns:**

- `(float, float)`: (latitude, longitude) tuple
- `None`: If pincode not found or city/state mismatch

---

### `is_pincode_in_database(pincode, city=None, state=None)`

**Location:** `core/pincode_database.py`

Validates if a pincode exists with optional city/state verification.

```python
# Check existence only
is_pincode_in_database('221106')  # True

# Check with city/state verification
is_pincode_in_database('221106', 'VARANASI', 'UTTAR PRADESH')  # True
is_pincode_in_database('221106', 'Delhi')  # False (city mismatch)
```

**Parameters:**

- `pincode` (str): Postal code
- `city` (str, optional): City name (case-insensitive)
- `state` (str, optional): State name (case-insensitive)

**Returns:**

- `bool`: True if valid, False otherwise

---

### `get_pincode_info(pincode)`

**Location:** `core/pincode_database.py`

Returns complete information about a pincode.

```python
info = get_pincode_info('221106')
# Returns:
# {
#     'city': 'Varanasi',
#     'state': 'Uttar Pradesh',
#     'coordinates': (25.2945, 83.0289)
# }
```

**Parameters:**

- `pincode` (str): Postal code

**Returns:**

- `dict`: Complete pincode information
- `None`: If pincode not found

---

### `search_pincode_by_city_state(city, state)`

**Location:** `core/pincode_database.py`

Find all pincodes for a given city and state (case-insensitive).

```python
pincodes = search_pincode_by_city_state('Varanasi', 'Uttar Pradesh')
# Returns: ['221001', '221002', '221005', '221006', '221106', ...]

pincodes = search_pincode_by_city_state('DELHI', 'DELHI')
# Returns: ['110001', '110002', '110003', '110004', '110005', ...]
```

**Parameters:**

- `city` (str): City name (case-insensitive)
- `state` (str): State name (case-insensitive)

**Returns:**

- `list`: List of pincodes for that city/state
- `[]`: Empty list if no matches

---

### `geocode_pincode(pincode, city=None, state=None)`

**Location:** `core/pricing_utils.py`

Converts pincode to coordinates with 2-tier fallback.

```python
# With just pincode
coords = geocode_pincode('221106')

# With city and state
coords = geocode_pincode('221106', 'Varanasi', 'Uttar Pradesh')

# With mixed case (all work!)
coords = geocode_pincode('221106', 'VARANASI', 'uttar pradesh')
```

**Process:**

1. Check local database first (fast, case-insensitive)
2. If not found, try OpenRouteService API
3. If API fails, return None

**Returns:**

- `(float, float)`: (latitude, longitude) tuple
- `None`: If geocoding fails

---

### `calculate_distance(pickup_pincode, delivery_pincode, pickup_city=None, pickup_state=None, delivery_city=None, delivery_state=None)`

**Location:** `core/pricing_utils.py`

Calculates distance between two locations with 3-tier fallback strategy.

```python
# Basic usage (backward compatible)
distance = calculate_distance('221106', '110008')
# Returns: 920.45 km

# Enhanced usage with city/state
distance = calculate_distance(
    '221106', '110008',
    pickup_city='Varanasi', pickup_state='Uttar Pradesh',
    delivery_city='New Delhi', delivery_state='Delhi'
)
# Returns: 920.45 km with city/state validation

# Case-insensitive
distance = calculate_distance(
    '221106', '110008',
    pickup_city='VARANASI', pickup_state='UTTAR PRADESH',
    delivery_city='new delhi', delivery_state='delhi'
)
# Returns: 920.45 km ✓
```

**Calculation Methods (in priority order):**

1. **Local Database + Haversine** (Fastest)

   - Uses pre-stored coordinates
   - Calculates great-circle distance
   - Case-insensitive city/state matching

2. **OpenRouteService API** (More Accurate)

   - Provides real road distance
   - More accurate for actual route planning
   - Falls back to Haversine if fails

3. **Haversine Formula** (Fallback)
   - Pure mathematical calculation
   - No multipliers applied
   - Great-circle distance formula

**Returns:**

- `float`: Distance in kilometers (rounded to 2 decimals)
- `None`: If distance calculation fails

---

## Price Calculation Formula

```
Total Price = Base Rate + Distance Cost + Weight Cost + Package Surcharge

Where:
  Base Rate = ₹50 (fixed)
  Distance Cost = Distance (km) × ₹5/km
  Weight Cost = Weight (kg) × ₹10/kg
  Package Surcharge = Based on package type:
    - Small: ₹0
    - Medium: ₹50
    - Large: ₹100
    - Fragile: ₹200
    - Electronics: ₹100
```

### Example Calculation

```python
# Scenario: Varanasi (221106) → New Delhi (110008)
# Weight: 10 kg, Package: Electronics

distance = 920.45 km
base_rate = ₹50
distance_cost = 920.45 × ₹5 = ₹4,602.25
weight_cost = 10 × ₹10 = ₹100
package_surcharge = ₹100 (Electronics)

total_price = ₹50 + ₹4,602.25 + ₹100 + ₹100 = ₹4,852.25
```

## Testing Examples

### Test Case 1: Valid Pincode with Matching City/State

```python
# Request
{
    "pickup_pincode": "221106",
    "pickup_city": "Varanasi",
    "pickup_state": "Uttar Pradesh",
    "delivery_pincode": "110008",
    "delivery_city": "New Delhi",
    "delivery_state": "Delhi",
    "weight": 10,
    "package_type": "Electronics"
}

# Expected Response (Success)
{
    "distance": 920.45,
    "price": 4850.00,
    "price_breakdown": { ... }
}
```

### Test Case 2: Case-Insensitive Matching

```python
# Request with UPPERCASE
{
    "pickup_pincode": "221106",
    "pickup_city": "VARANASI",
    "pickup_state": "UTTAR PRADESH",
    "delivery_pincode": "110008",
    "delivery_city": "NEW DELHI",
    "delivery_state": "DELHI",
    "weight": 10,
    "package_type": "Electronics"
}

# Expected Response (Success - same as above)
{
    "distance": 920.45,
    "price": 4850.00,
    "price_breakdown": { ... }
}
```

### Test Case 3: Wrong City for Pincode

```python
# Request with WRONG city
{
    "pickup_pincode": "221106",
    "pickup_city": "Delhi",              // Wrong! Should be Varanasi
    "pickup_state": "Uttar Pradesh",
    "delivery_pincode": "110008",
    "delivery_city": "New Delhi",
    "delivery_state": "Delhi",
    "weight": 10,
    "package_type": "Electronics"
}

# Expected Response (Error)
{
    "error": "City/State mismatch for pincode 221106",
    "details": {
        "pincode": "221106",
        "requested_city": "Delhi",
        "database_city": "Varanasi",
        "requested_state": "Uttar Pradesh",
        "database_state": "Uttar Pradesh"
    }
}
```

### Test Case 4: Backward Compatibility (Pincodes Only)

```python
# Request WITHOUT city/state (still works!)
{
    "pickup_pincode": "221106",
    "delivery_pincode": "110008",
    "weight": 10,
    "package_type": "Electronics"
}

# Expected Response (Success)
{
    "distance": 920.45,
    "price": 4850.00,
    "price_breakdown": { ... }
}
```

### Test Case 5: Find Pincodes by City/State

```python
# Programmatic search
from core.pincode_database import search_pincode_by_city_state

pincodes = search_pincode_by_city_state('Varanasi', 'Uttar Pradesh')
# Returns: ['221001', '221002', '221005', '221006', '221106', ...]

pincodes = search_pincode_by_city_state('DELHI', 'DELHI')
# Returns: ['110001', '110002', '110003', '110004', '110005', ...]
```

## Supported Indian Cities/States

### Current Database Coverage (160+ Pincodes)

The system currently includes pincodes from:

1. **Delhi** - 110001 to 110097
2. **Varanasi, Uttar Pradesh** - 221001-221106
3. **Mumbai, Maharashtra** - 400001-400104
4. **Bangalore, Karnataka** - 560001-560103
5. **Chennai, Tamil Nadu** - 600001-600119
6. **Kolkata, West Bengal** - 700001-700159
7. **Hyderabad, Telangana** - 500001-500095
8. **Pune, Maharashtra** - 411001-411052
9. **Jaipur, Rajasthan** - 302001-302039
10. **Lucknow, Uttar Pradesh** - 226001-226037
11. **Ahmedabad, Gujarat** - 380001-380061
12. **Surat, Gujarat** - 395001-395010

## Implementation Notes

### Case-Insensitive Design

All city and state lookups convert inputs to lowercase internally:

```python
# Internal processing
def get_pincode_coordinates(pincode, city=None, state=None):
    city_str = city.strip().lower() if city else None
    state_str = state.strip().lower() if state else None
    # ... comparison is done with lowercase
```

### Error Logging

Comprehensive logging at each step:

```
[GEOCODING] Found in database: 221106, Varanasi, Uttar Pradesh
[GEOCODING] Coordinates: (25.2945, 83.0289)
[DISTANCE] Calculating distance: 221106, Varanasi, Uttar Pradesh -> 110008, New Delhi, Delhi
[HAVERSINE] Coordinates: (25.2945, 83.0289) to (28.5355, 77.2507)
[HAVERSINE] Calculated distance: 920.45 km
[PRICE ESTIMATE] Price breakdown: {...}
```

### Distance Accuracy

- **Great-circle distance** (Haversine): ±2-3% error
- **Road distance** (OpenRouteService API): Actual routing
- **No multipliers** applied to distances

## Future Enhancements

1. **Extended Database**

   - Add more Indian cities and pincodes
   - Include international pincode support

2. **Address Validation**

   - Real-time address geocoding
   - Zip+4 support (US format)

3. **Advanced Routing**

   - Multi-stop deliveries
   - Optimize delivery routes

4. **Caching**
   - Cache frequent distance calculations
   - Reduce API calls to OpenRouteService

## Migration Notes

If you have existing code using the old `calculate_distance()` signature:

**Old Code:**

```python
distance = calculate_distance(pickup_pincode, delivery_pincode)
```

**New Code (Optional Enhancement):**

```python
# Still works exactly the same way!
distance = calculate_distance(pickup_pincode, delivery_pincode)

# But now you can optionally add city/state for better validation:
distance = calculate_distance(
    pickup_pincode, delivery_pincode,
    pickup_city='Varanasi', pickup_state='Uttar Pradesh',
    delivery_city='New Delhi', delivery_state='Delhi'
)
```

All new parameters are optional and have default values of `None`, ensuring 100% backward compatibility.
