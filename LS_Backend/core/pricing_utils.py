"""
Utility functions for price calculation and distance calculation using Google Maps API
Supports pincode-based location with optional city and state for better accuracy
"""
import requests
from django.conf import settings
from .pincode_database import get_pincode_coordinates, is_pincode_in_database, get_pincode_info
import math


def geocode_pincode(pincode, city=None, state=None):
    """
    Convert pincode to coordinates using multiple strategies.
    PRIMARY: Google Maps Geocoding API (supports all Indian pincodes)
    FALLBACK: City+State search if pincode not found
    FALLBACK: Local database (for faster lookup of known pincodes)
    Supports pincode + optional city and state (case-insensitive)
    
    Args:
        pincode: Postal code (string)
        city: City name (optional, case-insensitive)
        state: State name (optional, case-insensitive)
    
    Returns:
        (latitude, longitude) tuple or None if geocoding fails
    """
    try:
        pincode_str = str(pincode).strip()
        google_api_key = settings.GOOGLE_MAPS_API_KEY
        
        # Build address for API - try pincode first
        address = f"{pincode_str}"
        if city:
            address += f", {city}"
        if state:
            address += f", {state}"
        address += ", India"
        
        # PRIMARY: Try Google Maps Geocoding API first (supports all Indian pincodes)
        try:
            url = "https://maps.googleapis.com/maps/api/geocode/json"
            params = {
                'address': address,
                'key': google_api_key
            }
            
            print(f"[GEOCODING] Requesting coordinates from Google Maps for: {address}")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            print(f"[GEOCODING] Google Maps Response status: {data.get('status')}")
            
            if data.get('status') == 'OK' and data.get('results') and len(data['results']) > 0:
                location = data['results'][0]['geometry']['location']
                lat_lon = (location['lat'], location['lng'])
                print(f"[GEOCODING] Got coordinates from Google Maps for {address}: {lat_lon}")
                return lat_lon
            
            # If pincode not found but we have city+state, try broader search
            if city and state:
                print(f"[GEOCODING] No results for pincode {pincode_str}, trying city+state search...")
                city_address = f"{city}, {state}, India"
                params['address'] = city_address
                
                response = requests.get(url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()
                
                if data.get('status') == 'OK' and data.get('results') and len(data['results']) > 0:
                    location = data['results'][0]['geometry']['location']
                    lat_lon = (location['lat'], location['lng'])
                    print(f"[GEOCODING] Got coordinates from Google Maps for {city_address}: {lat_lon}")
                    return lat_lon
            
            print(f"[GEOCODING] No results from Google Maps for: {address}")
        except Exception as api_error:
            print(f"[GEOCODING] Google Maps API request failed: {type(api_error).__name__}: {str(api_error)}")
            print(f"[GEOCODING] Falling back to local database...")
        
        # FALLBACK: Try local database for known pincodes
        fallback_coords = get_pincode_coordinates(pincode_str, city, state)
        if fallback_coords:
            pincode_info = get_pincode_info(pincode_str)
            print(f"[GEOCODING] Found in database: {pincode_str}, {pincode_info['city']}, {pincode_info['state']}")
            print(f"[GEOCODING] Coordinates: {fallback_coords}")
            return fallback_coords
        
        print(f"[GEOCODING] Pincode {pincode_str} not found in Google Maps or database")
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
    Calculate distance between two pincodes using three-tier fallback strategy.
    
    Strategy:
    1. PRIMARY: Google Maps Directions API (real road distance for all pincodes)
    2. FALLBACK: Haversine formula with coordinates from Google Maps geocoding
    3. FALLBACK: Local database coordinates (for pincodes not found via API)
    
    Supports optional city and state for better location verification (case-insensitive).
    
    Args:
        pickup_pincode: Pickup location pincode
        delivery_pincode: Delivery location pincode
        pickup_city: Pickup city (optional, case-insensitive)
        pickup_state: Pickup state (optional, case-insensitive)
        delivery_city: Delivery city (optional, case-insensitive)
        delivery_state: Delivery state (optional, case-insensitive)
    
    Returns:
        distance in kilometers or None if calculation fails
    """
    try:
        location_str = f"{pickup_pincode}"
        if pickup_city:
            location_str += f", {pickup_city}"
        if pickup_state:
            location_str += f", {pickup_state}"
        location_str += f" -> {delivery_pincode}"
        if delivery_city:
            location_str += f", {delivery_city}"
        if delivery_state:
            location_str += f", {delivery_state}"
        
        print(f"[DISTANCE] Calculating distance: {location_str}")
        
        # First, geocode both pincodes with optional city/state
        pickup_coords = geocode_pincode(pickup_pincode, pickup_city, pickup_state)
        delivery_coords = geocode_pincode(delivery_pincode, delivery_city, delivery_state)
        
        print(f"[DISTANCE] Pickup coords: {pickup_coords}, Delivery coords: {delivery_coords}")
        
        if not pickup_coords or not delivery_coords:
            print(f"[DISTANCE] Could not geocode one or both locations")
            return None
        
        # Try Google Maps Directions API first
        try:
            url = "https://maps.googleapis.com/maps/api/directions/json"
            google_api_key = settings.GOOGLE_MAPS_API_KEY
            
            params = {
                'origin': f"{pickup_coords[0]},{pickup_coords[1]}",
                'destination': f"{delivery_coords[0]},{delivery_coords[1]}",
                'mode': 'driving',
                'key': google_api_key
            }
            
            print(f"[DISTANCE] Requesting route from {pickup_coords} to {delivery_coords}")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            print(f"[DISTANCE] Google Maps Directions Response status: {data.get('status')}")
            
            if data.get('status') == 'OK' and data.get('routes') and len(data['routes']) > 0:
                # Distance is in meters, convert to kilometers
                distance_m = data['routes'][0]['legs'][0]['distance']['value']
                distance_km = distance_m / 1000
                print(f"[DISTANCE] Calculated distance using Google Maps: {distance_km} km")
                return round(distance_km, 2)
            
            print(f"[DISTANCE] No routes found in Google Maps response, falling back to Haversine")
        except Exception as api_error:
            print(f"[DISTANCE] Google Maps API request failed: {type(api_error).__name__}: {str(api_error)}")
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
    Calculate delivery price based on distance, weight, and package type
    
    Formula: Base Rate + (Distance × Per Km Rate) + (Weight × Per Kg Rate) + Package Type Surcharge
    
    Args:
        distance_km: Distance in kilometers
        weight_kg: Weight in kilograms
        package_type: Type of package (Small, Medium, Large, Fragile, Electronics)
    
    Returns:
        Calculated price in INR (float)
    """
    base_rate = settings.PRICE_BASE_RATE
    per_km_rate = settings.PRICE_PER_KM_RATE
    per_kg_rate = settings.PRICE_PER_KG_RATE
    
    # Get package type surcharge (default to 0 if type not found)
    surcharge = settings.PACKAGE_SURCHARGES.get(package_type, 0)
    
    # Calculate total price
    distance_cost = distance_km * per_km_rate if distance_km else 0
    weight_cost = weight_kg * per_kg_rate if weight_kg else 0
    
    total_price = base_rate + distance_cost + weight_cost + surcharge
    
    return round(total_price, 2)


def get_price_breakdown(distance_km, weight_kg, package_type):
    """
    Get detailed price breakdown for transparency
    
    Returns:
        Dictionary with price breakdown
    """
    base_rate = settings.PRICE_BASE_RATE
    per_km_rate = settings.PRICE_PER_KM_RATE
    per_kg_rate = settings.PRICE_PER_KG_RATE
    surcharge = settings.PACKAGE_SURCHARGES.get(package_type, 0)
    
    distance_cost = distance_km * per_km_rate if distance_km else 0
    weight_cost = weight_kg * per_kg_rate if weight_kg else 0
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
