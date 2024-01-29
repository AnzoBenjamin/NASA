const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const DEFAULT_FLIGHT_NUMBER = 100;

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  } else return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launches.find({}, { __id: 0, __v: 0 });
}

async function scheduleNewLaunch(launch) {
  const flightNumber = (await getLatestFlightNumber());
  const latestFlightNumber = flightNumber + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: latestFlightNumber
  });
  await saveLaunch(newLaunch);
}

async function saveLaunch(launch) {
  const planet = planets.findOneAndUpdate({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planets were found");
  }
  await launches.updateOne(
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

async function existsLaunchWithID(launchID) {
  return await launches.findOne({ flightNumber: launchID });
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithID,
  abortLaunchWithID,
};
