export interface ApiResponse {
	location: {
		lat: number
		lng: number
	}
	date: string
	hmax: number
	mwd: number
	mwp: number
	tmax: number
	swh: number
}
