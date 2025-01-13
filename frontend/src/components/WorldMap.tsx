import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useState } from "react"
import type { ApiResponse } from "../types"
import LocationMarker from "./LocationMarker"
import "./WorldMap.css"

const WorldMap = () => {
	// TODO: create Context instead of passing callback as prop
	const [positionData, setPositionData] = useState<ApiResponse | null>(null)

	return (
		<div
			style={{ height: "100%", width: "100%", display: "flex", gap: "25px" }}
		>
			<div style={{ flexBasis: "80%" }}>
				<MapContainer
					center={[51.505, -0.09]}
					zoom={13}
					style={{ height: "100%", width: "100%" }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<LocationMarker callback={setPositionData} />
				</MapContainer>
			</div>
			<div style={{ flexBasis: "20%", textAlign: "center" }}>
				<h3>Wave data</h3>
				{!positionData?.hmax ? (
					<div>No wave height data available</div>
				) : (
					<>
						<div> {positionData.date}</div>
						<div>
							True position: {positionData.location.lat}°{" "}
							{positionData.location.lng}°
						</div>

						<hr />

						<div className="wave-data">
							<b>Max Wave Height:</b> {positionData.hmax} m
						</div>
						<div className="wave-data">
							<b>Mean Wave Direction:</b> {positionData.mwd}° (True)
						</div>
						<div className="wave-data">
							<b>Mean Wave Period:</b> {positionData.mwp} s
						</div>
						<div className="wave-data">
							<b>Peak Wave Period:</b> {positionData.tmax} s
						</div>
						<div className="wave-data">
							<b>Significant Wave Height:</b> {positionData.swh} m
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default WorldMap
