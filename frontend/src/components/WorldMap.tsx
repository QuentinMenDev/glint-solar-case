import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import LocationMarker from "./LocationMarker"

const WorldMap = () => {
	return (
		<MapContainer
			center={[51.505, -0.09]}
			zoom={13}
			scrollWheelZoom={false}
			style={{ height: "100%", width: "100%" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<LocationMarker />
		</MapContainer>
	)
}

export default WorldMap
