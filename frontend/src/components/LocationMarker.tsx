import { type FC, useState } from "react"
import { Marker, Popup, useMapEvents } from "react-leaflet"
import type { ApiResponse } from "../types"

interface Props {
	callback: (data: ApiResponse) => void
}
const LocationMarker: FC<Props> = ({ callback }) => {
	const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 })
	const [locationData, setLocationData] = useState<ApiResponse | null>(null)

	const getLocationData = async (lng: number, lat: number) => {
		// TODO: change url to match your backend
		const response = await fetch("http://localhost:5000/get_location_data", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				lat: lat,
				lng: lng,
			}),
		})
		const data = await response.json()
		return data as ApiResponse
	}

	const map = useMapEvents({
		async click(e) {
			setPosition(e.latlng)
			map.flyTo(e.latlng, map.getZoom())

			const res = await getLocationData(e.latlng.lng, e.latlng.lat)
			setLocationData(res)
			callback(res)
		},
	})

	return (
		position && (
			<Marker position={[position.lat, position.lng]}>
				<Popup>
					<div>
						<h3>Latitude: {position.lat.toFixed(1)}</h3>
						<h3>Longitude: {position.lng.toFixed(1)}</h3>

						<hr />

						<h3>Data:</h3>
						{locationData?.hmax ? (
							<div>
								<p>{locationData.date}</p>
								<p>Max Wave Height: {locationData.hmax} m</p>
								<p>Mean Wave Direction: {locationData.mwd}° (True)</p>
								<p>Mean Wave Period: {locationData.mwp} s</p>
								<p>Peak Wave Period: {locationData.tmax} s</p>
								<p>Significant Wave Height: {locationData.swh} m</p>
							</div>
						) : (
							<p>No wave height data available</p>
						)}
					</div>
				</Popup>
			</Marker>
		)
	)
}

export default LocationMarker
