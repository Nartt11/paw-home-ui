import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export interface Props {
  title: string;
  latitude: number;
  longitude: number;
}

function hasValidCoordinates(latitude: unknown, longitude: unknown) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)
  );
}

export default function MapPicker({ title, latitude, longitude }: Props) {
  if (!hasValidCoordinates(latitude, longitude)) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-muted/20 px-4 text-center text-sm text-muted-foreground">
        Chưa có tọa độ hợp lệ để hiển thị bản đồ.
      </div>
    );
  }

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
