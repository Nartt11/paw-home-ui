"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Optional: Fix for default marker icons not showing

export default function Map() {
  return (
    <MapContainer
      center={[10.8702, 106.8029]}
      zoom={13}
      scrollWheelZoom={false}
      className="w-full h-screen"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[10.8702, 106.8029]}>
        <Popup>A sample marker.</Popup>
      </Marker>
    </MapContainer>
  );
}
