from config import app
from flask import request, jsonify
import xarray as xr
import numpy as np


def longitude_modulo(value):
    new_longitude = ((value + 180) % 360) - 180
    if new_longitude == -180:
        new_longitude = 179.5
    return new_longitude


@app.route("/")
def index():
    return "Hello World!"


@app.route("/get_location_data", methods=["POST"])
def get_location_data():
    request_data = request.json

    lng = request_data.get("lng", 0)
    lat = request_data.get("lat", 0)
    date = request_data.get("date", np.datetime64("2019-01-01"))

    if lat == "" or lng == "":
        return (
            jsonify({"message": "Please provide a valid latitude and longitude."}),
            400,
        )
    if lat < -90 or lat > 90:
        return (
            jsonify(
                {
                    "message": "Passed latitude out of boundaries. A latitude has to be between -90 and 90 in value."
                }
            ),
            400,
        )
    if lat < -60 or lat > 70:
        return (
            jsonify(
                {"message": "No values available outside the latitude range -60 to 70."}
            ),
            400,
        )

    # Format longitude, latitude and date
    date_from = np.datetime64(date)
    date_to = date_from + np.timedelta64(1, "D") - np.timedelta64(1, "s")
    # Round to 1 decimal place as the coordinates are stored in the dataset with 1 decimal place
    lng = round(longitude_modulo(lng), 1)
    lat = round(lat, 1)

    with xr.open_dataset("data/waves_2019-01-01.nc", engine="netcdf4") as ds:
        """
        table format:
        Coordinates:
            longitude  float32          -180.0 -179.5 -179.0 ... 179.0 179.5
            latitude   float32          70.0 69.5 69.0 68.5 ... -59.0 -59.5 -60.0
            time       datetime64[ns]   2019-01-01 ... 2019-01-01T23:00:00
        Data variables:
            hmax       float64 --> wave height (m)
            mwd        float64 --> mean wave direction (True degrees)
            mwp        float64 --> mean wave period (s)
            tmax       float64 --> peak wave period (s)
            swh        float64 --> significant wave height (m)
        """
        # Select the data for the given location and date
        location_data = ds.sel(longitude=0, latitude=0, method="nearest")
        day_data = location_data.sel(time=slice(date_from, date_to)) # Select the data for the given date, can be used later to do range of dates
        # Find the table index of the maximum hmax value
        max_hmax_index = day_data["hmax"].argmax().item()
        max_hmax_time = day_data["time"].isel(time=max_hmax_index)
        # Get the values of the maximum hmax
        max_hmax_values = day_data.sel(time=max_hmax_time)

    if np.isnan(max_hmax_values["hmax"].values):
        return (
            jsonify({"message": "No data available for the given location and date."}),
            404,
        )

    return jsonify(
        {
            "location": {"lng": lng, "lat": lat},
            "date": date.astype(str),
            "hmax": max_hmax_values["hmax"].values.tolist(),
            "mwd": max_hmax_values["mwd"].values.tolist(),
            "mwp": max_hmax_values["mwp"].values.tolist(),
            "tmax": max_hmax_values["tmax"].values.tolist(),
            "swh": max_hmax_values["swh"].values.tolist(),
        }
    )


# Run the app only if the script is run directly and not imported
if __name__ == "__main__":
    app.run(debug=True)
