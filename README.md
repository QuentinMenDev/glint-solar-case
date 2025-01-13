# glint-solar-case

## Getting started

The project has a backend and a frontend that work together.

### Frontend

#### Prerequisites

- (optional but recommended) [nvm](https://github.com/nvm-sh/nvm)
- [Nodejs 22+](https://nodejs.org/en)

#### Installation

In the `frontend` folder, run the following command:

```sh
npm install
```

#### Usage

To start the frontend, run `npm run dev` in the console in the `frontend` folder location. The project is then accessible by default at http://localhost:5173/.

### Backend

#### Prerequisites

- [Python 3.12+](https://www.python.org/downloads/)
- [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html)

#### Installation

If you don't have a venv, create one with the following command in your `backend` fodler (the `py` command might be different based on your setup and operating system):

```sh
py -3 -m venv .venv
```

The activate it using the command `venv/Scripts/activate` (for Windows). MacOS should be `source ./venv/bin/activate`

In the `backend` folder, run the following command:

```sh
pip install -r requirements.txt
```

#### Usage

To start the backend, run `py main.py` (or your pyhton command based on your setup) in the console in the `backend` folder location. The project is then accessible by default at http://localhost:5000. A `Hello World!` should great you if everything worked well.

## Answers to questions:

1. max hmax at (0.000, 0.000) on 2019-01-01 was: 2.080878104192001
2. See project
3. The naïve approach would be to first get the full list of data points for the specified location, without taking into consideration the year. Then, one would need to get the max value of `hmax` from that list. it can be achieved through the use of 

```py
with xr.open_dataset("data.nc", engine="netcdf4") as ds:
    hmax_at_location = ds["hmax"].sel(longitude=lng, latitude=lat, method="nearest")
    max_hmax = hmax_at_location.max(dim="time")
```

This approach would work for small datasets but would start being a bottleneck for bigger sets as the function needs to loop through bigger and bigger amounts of rows. As I haven't had the possibility to do benchmarks, I can't say when that slowdown would appear.
Another problem is the number of requests and computations needed each time someone makes a request. A caching strategy would be a good option to mitigate the server load by saving the result of the request and reusing it every time it is asked. Even though it would create a cost in storage size as it would grow over time, it should in theory be cheaper than the cost of running the calculation for each request.