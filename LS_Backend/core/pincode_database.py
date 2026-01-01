"""
Pincode to coordinates mapping with city and state information
This includes common Indian pincodes with their cities and states
Format: {
  'pincode': {
    'city': 'City Name',
    'state': 'State Name',
    'coordinates': (latitude, longitude)
  }
}
"""

PINCODE_COORDINATES = {
    # Delhi pincodes
    '110001': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.6356, 77.2290)},
    '110002': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.6282, 77.2312)},
    '110003': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.6098, 77.2434)},
    '110004': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5944, 77.2567)},
    '110005': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5856, 77.2721)},
    '110006': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.6445, 77.2156)},
    '110007': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.6223, 77.2089)},
    '110008': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5641, 77.2303)},
    '110009': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5512, 77.2445)},
    '110010': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5378, 77.2567)},
    '110011': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5234, 77.2690)},
    '110012': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5456, 77.2812)},
    '110013': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5890, 77.2534)},
    '110014': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5645, 77.2356)},
    '110015': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5778, 77.2234)},
    '110016': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5489, 77.1834)},
    '110017': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5234, 77.1567)},
    '110018': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5145, 77.1456)},
    '110019': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5356, 77.1234)},
    '110020': {'city': 'New Delhi', 'state': 'Delhi', 'coordinates': (28.5567, 77.0912)},
    
    # Varanasi pincodes
    '221001': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.3282, 82.9989)},
    '221002': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.3190, 82.9867)},
    '221003': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.3356, 83.0012)},
    '221004': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.3234, 82.9745)},
    '221005': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.3490, 83.0145)},
    '221006': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.3167, 82.9634)},
    '221007': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.3078, 83.0234)},
    '221008': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.3289, 82.9523)},
    '221009': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.3456, 83.0356)},
    '221010': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.3623, 82.9789)},
    '221105': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.2867, 83.0156)},
    '221106': {'city': 'Varanasi', 'state': 'Uttar Pradesh', 'coordinates': (25.2945, 83.0289)},
    
    # Mumbai pincodes
    '400001': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (18.9488, 72.8320)},
    '400002': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (18.9567, 72.8456)},
    '400003': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (18.9345, 72.8234)},
    '400004': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (18.9289, 72.8378)},
    '400005': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (18.9456, 72.8567)},
    '400006': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (18.9234, 72.8690)},
    '400007': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (18.9678, 72.8234)},
    '400008': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (18.9789, 72.8345)},
    '400009': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (18.9890, 72.8456)},
    '400010': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (19.0145, 72.8234)},
    '400011': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (19.0234, 72.8567)},
    '400012': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (19.0156, 72.8345)},
    '400013': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (19.0289, 72.8456)},
    '400014': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (19.0345, 72.8678)},
    '400015': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (19.0512, 72.8234)},
    '400016': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (19.0678, 72.8456)},
    '400017': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (19.0789, 72.8567)},
    '400018': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (19.0234, 72.8789)},
    '400019': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (19.0890, 72.8345)},
    '400020': {'city': 'Mumbai', 'state': 'Maharashtra', 'coordinates': (19.0156, 72.8456)},
    
    # Bangalore pincodes
    '560001': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (12.9716, 77.6245)},
    '560002': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (12.9567, 77.6145)},
    '560003': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (12.9456, 77.6345)},
    '560004': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (12.9789, 77.5967)},
    '560005': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (12.9890, 77.6156)},
    '560006': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (13.0012, 77.6078)},
    '560007': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (13.0145, 77.6234)},
    '560008': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (13.0078, 77.6089)},
    '560009': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (13.0234, 77.6267)},
    '560010': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (13.0356, 77.6145)},
    '560011': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (13.0089, 77.6378)},
    '560034': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (13.0245, 77.6456)},
    '560037': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (12.9645, 77.6789)},
    '560076': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (13.0456, 77.6912)},
    '560092': {'city': 'Bangalore', 'state': 'Karnataka', 'coordinates': (13.0123, 77.6534)},
    
    # Chennai pincodes
    '600001': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0627, 80.2707)},
    '600002': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0456, 80.2834)},
    '600003': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0789, 80.2567)},
    '600004': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0612, 80.2823)},
    '600005': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0345, 80.2645)},
    '600006': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0534, 80.2456)},
    '600007': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0812, 80.2789)},
    '600008': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0423, 80.2345)},
    '600009': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0234, 80.2678)},
    '600010': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0156, 80.2834)},
    '600028': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0456, 80.2156)},
    '600029': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0289, 80.2367)},
    '600031': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0512, 80.2478)},
    '600034': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0678, 80.2612)},
    '600035': {'city': 'Chennai', 'state': 'Tamil Nadu', 'coordinates': (13.0123, 80.2745)},
    
    # Kolkata pincodes
    '700001': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.5726, 88.3639)},
    '700002': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.5834, 88.3756)},
    '700003': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.5645, 88.3534)},
    '700004': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.5456, 88.3678)},
    '700005': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.5234, 88.3812)},
    '700006': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.5890, 88.3456)},
    '700007': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.5678, 88.3789)},
    '700008': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.5512, 88.3234)},
    '700009': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.5345, 88.3345)},
    '700010': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.5123, 88.3523)},
    '700016': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.5956, 88.3923)},
    '700017': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.6078, 88.4012)},
    '700019': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.6234, 88.3667)},
    '700020': {'city': 'Kolkata', 'state': 'West Bengal', 'coordinates': (22.6145, 88.3456)},
    
    # Hyderabad pincodes
    '500001': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.3850, 78.4744)},
    '500002': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.3923, 78.4678)},
    '500003': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.3756, 78.4812)},
    '500004': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.3601, 78.4567)},
    '500005': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.3834, 78.4456)},
    '500007': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.4156, 78.4234)},
    '500008': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.3945, 78.4089)},
    '500009': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.3678, 78.4345)},
    '500012': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.3456, 78.4156)},
    '500013': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.3234, 78.4523)},
    '500016': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.3512, 78.4789)},
    '500026': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.3890, 78.4634)},
    '500027': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.4012, 78.4412)},
    '500028': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.4234, 78.4567)},
    '500082': {'city': 'Hyderabad', 'state': 'Telangana', 'coordinates': (17.4209, 78.4711)},
    
    # Pune pincodes
    '411001': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5204, 73.8479)},
    '411002': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5145, 73.8567)},
    '411003': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5356, 73.8345)},
    '411004': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5089, 73.8534)},
    '411005': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5234, 73.8423)},
    '411006': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5467, 73.8289)},
    '411007': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5345, 73.8156)},
    '411008': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5512, 73.8378)},
    '411009': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5678, 73.8234)},
    '411011': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5123, 73.8456)},
    '411013': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5289, 73.8678)},
    '411014': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5456, 73.8234)},
    '411015': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5678, 73.8567)},
    '411016': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5234, 73.8789)},
    '411017': {'city': 'Pune', 'state': 'Maharashtra', 'coordinates': (18.5890, 73.8345)},
    
    # Additional major Indian cities
    # Jaipur pincodes
    '302001': {'city': 'Jaipur', 'state': 'Rajasthan', 'coordinates': (26.9124, 75.8271)},
    '302002': {'city': 'Jaipur', 'state': 'Rajasthan', 'coordinates': (26.9289, 75.8156)},
    '302003': {'city': 'Jaipur', 'state': 'Rajasthan', 'coordinates': (26.9456, 75.8345)},
    '302004': {'city': 'Jaipur', 'state': 'Rajasthan', 'coordinates': (26.9078, 75.8534)},
    '302005': {'city': 'Jaipur', 'state': 'Rajasthan', 'coordinates': (26.8945, 75.8423)},
    
    # Lucknow pincodes - Expanded coverage
    '226001': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8467, 80.9462)},
    '226002': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8234, 80.9345)},
    '226003': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8456, 80.9567)},
    '226004': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8678, 80.9234)},
    '226005': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8145, 80.9123)},
    '226006': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8567, 80.9234)},
    '226007': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8789, 80.9456)},
    '226008': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8345, 80.9189)},
    '226009': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8612, 80.9378)},
    '226010': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8901, 80.9567)},
    '226011': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.9012, 80.9234)},
    '226012': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8678, 80.8945)},
    '226013': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8456, 80.9012)},
    '226014': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8234, 80.8834)},
    '226015': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8567, 80.8678)},
    '226016': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8789, 80.9123)},
    '226017': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8345, 80.9612)},
    '226018': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8123, 80.9456)},
    '226019': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8456, 80.9890)},
    '226020': {'city': 'Lucknow', 'state': 'Uttar Pradesh', 'coordinates': (26.8678, 80.9345)},
    
    # Ahmedabad pincodes
    '380001': {'city': 'Ahmedabad', 'state': 'Gujarat', 'coordinates': (23.0225, 72.5797)},
    '380002': {'city': 'Ahmedabad', 'state': 'Gujarat', 'coordinates': (23.0156, 72.5934)},
    '380003': {'city': 'Ahmedabad', 'state': 'Gujarat', 'coordinates': (23.0289, 72.6123)},
    '380004': {'city': 'Ahmedabad', 'state': 'Gujarat', 'coordinates': (23.0456, 72.5667)},
    '380005': {'city': 'Ahmedabad', 'state': 'Gujarat', 'coordinates': (23.0234, 72.5456)},
    
    # Surat pincodes
    '395001': {'city': 'Surat', 'state': 'Gujarat', 'coordinates': (21.1458, 72.8479)},
    '395002': {'city': 'Surat', 'state': 'Gujarat', 'coordinates': (21.1234, 72.8345)},
    '395003': {'city': 'Surat', 'state': 'Gujarat', 'coordinates': (21.1345, 72.8234)},
    '395004': {'city': 'Surat', 'state': 'Gujarat', 'coordinates': (21.1512, 72.8567)},
    '395005': {'city': 'Surat', 'state': 'Gujarat', 'coordinates': (21.1678, 72.8789)},
}


def get_pincode_coordinates(pincode, city=None, state=None):
    """
    Get coordinates for a pincode from the database.
    Can optionally verify with city and state for better accuracy.
    Supports both lowercase and uppercase inputs.
    
    Args:
        pincode: Postal code (string)
        city: City name (optional, case-insensitive)
        state: State name (optional, case-insensitive)
    
    Returns:
        (latitude, longitude) tuple or None if not found
    """
    pincode_str = str(pincode).strip()
    
    if pincode_str not in PINCODE_COORDINATES:
        return None
    
    data = PINCODE_COORDINATES[pincode_str]
    
    # If city and state provided, verify they match
    if city or state:
        city_match = True
        state_match = True
        
        if city:
            city_match = data['city'].lower() == city.lower()
        if state:
            state_match = data['state'].lower() == state.lower()
        
        if not (city_match and state_match):
            # Pincode exists but city/state don't match
            print(f"[PINCODE_DB] Warning: Pincode {pincode_str} found but city/state mismatch")
            print(f"[PINCODE_DB] Expected: {city}, {state}")
            print(f"[PINCODE_DB] Got: {data['city']}, {data['state']}")
            return None
    
    return data['coordinates']


def get_pincode_info(pincode):
    """
    Get complete information about a pincode.
    Returns dict with city, state, and coordinates or None if not found.
    """
    pincode_str = str(pincode).strip()
    return PINCODE_COORDINATES.get(pincode_str)


def is_pincode_in_database(pincode, city=None, state=None):
    """
    Check if a pincode exists in our database.
    Optionally verify city and state match (case-insensitive).
    """
    pincode_str = str(pincode).strip()
    
    if pincode_str not in PINCODE_COORDINATES:
        return False
    
    if city or state:
        data = PINCODE_COORDINATES[pincode_str]
        
        if city and data['city'].lower() != city.lower():
            return False
        if state and data['state'].lower() != state.lower():
            return False
    
    return True


def search_pincode_by_city_state(city, state):
    """
    Search for pincodes by city and state (case-insensitive).
    Returns list of pincodes found.
    """
    city_lower = city.lower()
    state_lower = state.lower()
    
    results = []
    for pincode, data in PINCODE_COORDINATES.items():
        if (data['city'].lower() == city_lower and 
            data['state'].lower() == state_lower):
            results.append(pincode)
    
    return results
