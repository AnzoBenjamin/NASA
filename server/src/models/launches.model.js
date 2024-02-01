const axios = require("axios");
const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const DEFAULT_FLIGHT_NUMBER = 100;

const SPACE_X_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading api data...");
  const response = await axios.post(SPACE_X_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  const launchesDoc = response.data.docs;

  for (const launchDoc of launchesDoc) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => payload.customers);
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    };
    await saveLaunch(launch)
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Data already exists");
    return;
  }
  await populateLaunches()
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  } else return latestLaunch.flightNumber;
}

async function getAllLaunches(limit, skip) {
  return await launches.find({}, { __id: 0, __v: 0 }).skip(skip).limit(limit).sort({flightNumber: 1});
}

async function scheduleNewLaunch(launch) {
  const flightNumber = await getLatestFlightNumber();
  const latestFlightNumber = flightNumber + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["NASA"],
    flightNumber: latestFlightNumber,
  });
  await saveLaunch(newLaunch);
}

async function saveLaunch(launch) {
  const planet = planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planets were found");
  }
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function abortLaunchWithID(launchID) {
  return await launches.updateOne(
    { flightNumber: launchID },
    { upcoming: false, success: false }
  );
}
async function findLaunch(filter) {
  return launches.findOne(filter);
}
async function existsLaunchWithID(launchID) {
  return await findLaunch({ flightNumber: launchID });
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithID,
  abortLaunchWithID,
  loadLaunchesData,
};