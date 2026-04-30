import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export interface Props {
  title: string;
  latitude: number;
  longitude: number;
}
export default function MapPicker({ title, latitude, longitude }: Props) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      className="h-64 w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]}>
        <Popup> {title} </Popup>
      </Marker>
    </MapContainer>
  );
}
