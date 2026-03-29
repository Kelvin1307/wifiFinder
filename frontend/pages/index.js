import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [wifiSpots, setWifiSpots] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setUserLocation([lat, lng]);

      const res = await fetch(
        `http://localhost:5000/nearby-wifi?lat=${lat}&lng=${lng}`
      );

      const data = await res.json();

      // 🔥 FIX: ensure it's always an array
      if (Array.isArray(data)) {
        setWifiSpots(data);
      } else {
        console.error("Backend error:", data);
        setWifiSpots([]); // prevent crash
      }
    });
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>📶 WiFi Map</h2>

      {userLocation ? (
        <Map userLocation={userLocation} wifiSpots={wifiSpots} />
      ) : (
        <p style={{ textAlign: "center" }}>Getting location...</p>
      )}
    </div>
  );
}