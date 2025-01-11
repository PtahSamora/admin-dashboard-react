import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const RouteMap = ({ origin, destination }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [directions, setDirections] = useState(null);
  const [eta, setEta] = useState(""); // State to store the ETA
  const [error, setError] = useState(null);
  const [isRequestingDirections, setIsRequestingDirections] = useState(false);

  const handleDirectionsCallback = useCallback((result, status) => {
    if (status === "OK") {
      setDirections(result);
      setIsRequestingDirections(false);

      // Extract ETA (duration) from the directions result
      if (result.routes && result.routes[0].legs && result.routes[0].legs[0].duration) {
        setEta(result.routes[0].legs[0].duration.text); // Example: "15 mins"
      }
    } else {
      setError(`Failed to fetch directions: ${status}`);
      setIsRequestingDirections(false);
    }
  }, []);

  useEffect(() => {
    if (origin && destination) {
      setIsRequestingDirections(true);
      setDirections(null); // Clear previous directions when inputs change
      setError(null); // Clear any previous errors
      setEta(""); // Clear previous ETA
    }
  }, [origin, destination]);

  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: -25.7461, lng: 28.1881 }} // Default center point (e.g., Pretoria)
        zoom={12}
      >
        {origin && destination && isRequestingDirections && (
          <DirectionsService
            options={{
              origin,
              destination,
              travelMode: "DRIVING",
            }}
            callback={handleDirectionsCallback}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Display ETA */}
      {eta && (
        <div style={{ marginTop: "16px", fontWeight: "bold" }}>
          Estimated Time of Arrival (ETA): {eta}
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

// Add PropTypes validation
RouteMap.propTypes = {
  origin: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
};

export default RouteMap;
