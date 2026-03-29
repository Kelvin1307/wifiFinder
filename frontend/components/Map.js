import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

export default function Map({ userLocation, wifiSpots }) {
  return (
    <MapContainer
      center={userLocation}
      zoom={16}
      style={{ height: "90vh", width: "100%" }}
    >
      {/* Map tiles */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location */}
      <Marker position={userLocation}>
        <Popup>📍 You are here</Popup>
      </Marker>

      {/* 200m radius circle */}
      <Circle center={userLocation} radius={200} />

      {/* WiFi Spots */}
      {Array.isArray(wifiSpots) &&
  wifiSpots.map((spot, index) => (
        <Marker key={index} position={[spot.lat, spot.lng]}>
          <Popup>
            📶 {spot.name}
            <br />
            Lat: {spot.lat}
            <br />
            Lng: {spot.lng}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}