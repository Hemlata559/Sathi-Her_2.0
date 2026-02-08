const axios = require("axios");//Axios lets your backend talk to the outside world. Without it, your maps feature cannot exist.



module.exports.getAddressCoordinate = async (address) => {
  if (!address) {
    throw new Error("Address is required");
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;//It builds a URL that asks OpenStreetMap’s Nominatim server:
  //“Give me the latitude and longitude for this address.”


  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Sathi-Her-College-Project"
      }
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("Coordinates not found");
    }

    return {
      lat: parseFloat(response.data[0].lat),
      lng: parseFloat(response.data[0].lon)
    };
  } catch (error) {
    console.error("Geocoding error:", error.message);
    throw error;
  }
};

module.exports.getDistanceTime = async (originCoords, destinationCoords) => {
    if (!originCoords || !destinationCoords) {
        throw new Error('Origin and destination coordinates are required');
    }

    const { lat: srcLat, lng: srcLng } = originCoords;
    const { lat: destLat, lng: destLng } = destinationCoords;

    const url = `https://router.project-osrm.org/route/v1/driving/${srcLng},${srcLat};${destLng},${destLat}?overview=false`;

    try {
        const response = await axios.get(url);

        if (!response.data.routes || response.data.routes.length === 0) {
            throw new Error('No routes found');
        }

        const route = response.data.routes[0];

        return {
            distance: {
                text: (route.distance / 1000).toFixed(2) + " km",
                 value: route.distance
            },
            duration: {
            text: Math.ceil(route.duration / 60) + " mins",
             value: route.duration
            }
        };

    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input || input.length < 3) {
    throw new Error('Input must be at least 3 characters');
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    input
  )}&addressdetails=1&limit=5&countrycodes=in&viewbox=76.84,28.88,77.35,28.40
    &bounded=1`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Sathi-Her-College-Project'
      }
    });

    return response.data.map(place => place.display_name);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch autocomplete suggestions');
  }
};