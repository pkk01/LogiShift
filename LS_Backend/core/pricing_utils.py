"""
Utility functions for price calculation and distance calculation using OpenRouteService API
Supports pincode or city/state-based location with dropdown-driven inputs for better accuracy
"""
import requests
from django.conf import settings
import math


def geocode_pincode(pincode=None, city=None, state=None):
    """
    Convert location details to coordinates using city + state only.
    PRIMARY: OpenRouteService Geocoding (city/state text search)
    Ignores address lines and pincode for calculation purposes.
    
    Args:
        pincode: Postal code (string) - ignored for distance calculation
        city: City name (required, case-insensitive)
        state: State name (required, case-insensitive)
    
    Returns:
        (latitude, longitude) tuple or None if geocoding fails
    """
    try:
        # Enforce city/state presence for calculation
        if not city or not state:
            print("[GEOCODING] Missing city/state; distance calculation requires both.")
            return None

        ors_api_key = settings.OPENROUTE_API_KEY

        # Build address text using only city and state (ignore pincode and address lines)
        city_clean = str(city).strip()
        state_clean = str(state).strip()
        query_text = f"{city_clean}, {state_clean}, India"

        # PRIMARY: OpenRouteService Geocoding
        try:
            url = "https://api.openrouteservice.org/geocode/search"
            params = {
                'api_key': ors_api_key,
                'text': query_text,
                'boundary.country': 'IND'
            }

            print(f"[GEOCODING] Requesting coordinates from ORS for: {query_text}")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()

            data = response.json()
            features = data.get('features', [])
            if features:
                coords = features[0]['geometry']['coordinates']  # [lon, lat]
                lat_lon = (coords[1], coords[0])
                print(f"[GEOCODING] Got coordinates from ORS for {query_text}: {lat_lon}")
                return lat_lon

            print(f"[GEOCODING] No results from ORS for: {query_text}")
        except Exception as api_error:
            print(f"[GEOCODING] ORS API request failed: {type(api_error).__name__}: {str(api_error)}")
            print(f"[GEOCODING] Falling back to database...")

        print(f"[GEOCODING] Location not found in ORS: {query_text}")
        return None

    except Exception as e:
        print(f"[GEOCODING ERROR] {pincode}, {city}, {state}: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return None
def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two coordinates using Haversine formula
    Returns accurate great-circle distance in kilometers
    """
    from math import radians, sin, cos, sqrt, atan2
    
    # Earth's radius in kilometers
    R = 6371.0
    
    # Convert degrees to radians
    lat1_rad = radians(float(lat1))
    lon1_rad = radians(float(lon1))
    lat2_rad = radians(float(lat2))
    lon2_rad = radians(float(lon2))
    
    # Differences
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    # Haversine formula
    a = sin(dlat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    
    # Calculate great-circle distance (this is the actual distance between two points on Earth)
    distance_km = R * c
    
    print(f"[HAVERSINE] Coordinates: ({lat1}, {lon1}) to ({lat2}, {lon2})")
    print(f"[HAVERSINE] Calculated distance: {distance_km:.2f} km")
    return round(distance_km, 2)




def calculate_distance(pickup_pincode, delivery_pincode, pickup_city=None, pickup_state=None, 
                      delivery_city=None, delivery_state=None):
    """
    Calculate distance between two locations using city + state only.
    
    Strategy:
    1. PRIMARY: OpenRouteService Directions API (real road distance with dropdown city/state)
    2. FALLBACK: Haversine formula with coordinates from ORS geocoding
    
    Supports optional city and state for better location verification (case-insensitive).
    
    Args:
        pickup_pincode: Pickup location pincode (ignored for calculation)
        delivery_pincode: Delivery location pincode (ignored for calculation)
        pickup_city: Pickup city (required, case-insensitive)
        pickup_state: Pickup state (required, case-insensitive)
        delivery_city: Delivery city (required, case-insensitive)
        delivery_state: Delivery state (required, case-insensitive)
    
    Returns:
        distance in kilometers or None if calculation fails
    """
    try:
        location_str = f"{pickup_city}, {pickup_state} -> {delivery_city}, {delivery_state}"
        
        print(f"[DISTANCE] Calculating distance: {location_str}")
        
        # First, geocode using city/state only
        pickup_coords = geocode_pincode(None, pickup_city, pickup_state)
        delivery_coords = geocode_pincode(None, delivery_city, delivery_state)
        
        print(f"[DISTANCE] Pickup coords: {pickup_coords}, Delivery coords: {delivery_coords}")
        
        if not pickup_coords or not delivery_coords:
            print(f"[DISTANCE] Could not geocode one or both locations")
            return None
        
        # Try OpenRouteService Directions API first
        try:
            url = "https://api.openrouteservice.org/v2/directions/driving-car"
            headers = {
                'Authorization': settings.OPENROUTE_API_KEY,
                'Content-Type': 'application/json'
            }

            # Note: ORS expects [lon, lat]
            body = {
                'coordinates': [
                    [pickup_coords[1], pickup_coords[0]],
                    [delivery_coords[1], delivery_coords[0]]
                ]
            }

            print(f"[DISTANCE] Requesting ORS route from {pickup_coords} to {delivery_coords}")
            response = requests.post(url, headers=headers, json=body, timeout=10)
            response.raise_for_status()

            data = response.json()
            print(f"[DISTANCE] ORS response received")

            if data.get('routes') and len(data['routes']) > 0:
                # Distance is in meters, convert to kilometers
                distance_km = data['routes'][0]['summary']['distance'] / 1000
                print(f"[DISTANCE] Calculated distance using ORS: {distance_km} km")
                return round(distance_km, 2)

            print(f"[DISTANCE] No routes found in ORS response, falling back to Haversine")
        except Exception as api_error:
            print(f"[DISTANCE] ORS request failed: {type(api_error).__name__}: {str(api_error)}")
            print(f"[DISTANCE] Falling back to Haversine formula")
        
        # Fallback: Use Haversine formula with coordinates
        # Coordinates are (latitude, longitude) from geocoding
        pickup_lat, pickup_lon = pickup_coords
        delivery_lat, delivery_lon = delivery_coords
        distance_km = haversine_distance(pickup_lat, pickup_lon, delivery_lat, delivery_lon)
        print(f"[DISTANCE] Calculated distance using Haversine: {distance_km} km")
        return distance_km
        
    except Exception as e:
        print(f"[DISTANCE ERROR] {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


def calculate_price(distance_km, weight_kg, package_type):
    """
    Calculate delivery price using realistic slab-based pricing (Delhivery/Ekar model).
    Uses distance tiers and weight slabs for more accurate pricing.
    
    Distance Slabs (in INR):
    - 0-10 km: ₹30
    - 10-25 km: ₹50
    - 25-50 km: ₹70
    - 50-100 km: ₹100
    - 100+ km: ₹100 + ₹1.5 per additional km
    
    Weight Slabs (in INR):
    - 0-1 kg: ₹0 (included in base)
    - 1-2 kg: ₹30
    - 2-5 kg: ₹50
    - 5-10 kg: ₹80
    - 10-20 kg: ₹120
    - 20+ kg: ₹150 + ₹5 per additional kg
    
    Args:
        distance_km: Distance in kilometers
        weight_kg: Weight in kilograms
        package_type: Type of package (Small, Medium, Large, Fragile, Electronics)
    
    Returns:
        Calculated price in INR (float)
    """
    # Base pickup + delivery charge
    base_rate = 40
    
    # Distance slab pricing
    if distance_km <= 10:
        distance_cost = 30
    elif distance_km <= 25:
        distance_cost = 50
    elif distance_km <= 50:
        distance_cost = 70
    elif distance_km <= 100:
        distance_cost = 100
    else:
        # Above 100 km: ₹100 + ₹1.5 per additional km
        distance_cost = 100 + ((distance_km - 100) * 1.5)
    
    # Weight slab pricing
    if weight_kg <= 1:
        weight_cost = 0  # Included in base rate
    elif weight_kg <= 2:
        weight_cost = 30
    elif weight_kg <= 5:
        weight_cost = 50
    elif weight_kg <= 10:
        weight_cost = 80
    elif weight_kg <= 20:
        weight_cost = 120
    else:
        # Above 20 kg: ₹150 base + ₹5 per additional kg
        weight_cost = 150 + ((weight_kg - 20) * 5)
    
    # Get package type surcharge (default to 0 if type not found)
    surcharge = settings.PACKAGE_SURCHARGES.get(package_type, 0)
    
    # Calculate total price
    total_price = base_rate + distance_cost + weight_cost + surcharge
    
    print(f"[PRICE CALC] Distance: {distance_km}km → ₹{distance_cost}, Weight: {weight_kg}kg → ₹{weight_cost}, Base: ₹{base_rate}, Surcharge: ₹{surcharge} = Total: ₹{round(total_price, 2)}")
    
    return round(total_price, 2)


def get_price_breakdown(distance_km, weight_kg, package_type):
    """
    Get detailed price breakdown using slab-based pricing for transparency
    
    Returns:
        Dictionary with price breakdown components
    """
    # Base pickup + delivery charge
    base_rate = 40
    
    # Distance slab pricing
    if distance_km <= 10:
        distance_cost = 30
    elif distance_km <= 25:
        distance_cost = 50
    elif distance_km <= 50:
        distance_cost = 70
    elif distance_km <= 100:
        distance_cost = 100
    else:
        distance_cost = 100 + ((distance_km - 100) * 1.5)
    
    # Weight slab pricing
    if weight_kg <= 1:
        weight_cost = 0
    elif weight_kg <= 2:
        weight_cost = 30
    elif weight_kg <= 5:
        weight_cost = 50
    elif weight_kg <= 10:
        weight_cost = 80
    elif weight_kg <= 20:
        weight_cost = 120
    else:
        weight_cost = 150 + ((weight_kg - 20) * 5)
    
    surcharge = settings.PACKAGE_SURCHARGES.get(package_type, 0)
    total_price = base_rate + distance_cost + weight_cost + surcharge
    
    return {
        'base_rate': base_rate,
        'distance_km': distance_km,
        'distance_cost': round(distance_cost, 2),
        'weight_kg': weight_kg,
        'weight_cost': round(weight_cost, 2),
        'package_type': package_type,
        'package_surcharge': surcharge,
        'total_price': round(total_price, 2)
    }
