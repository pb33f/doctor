import { TrainTravelSDK } from "train-travel-sdk";

const trainTravelSDK = new TrainTravelSDK({
  oAuth2: process.env["TRAINTRAVELSDK_O_AUTH2"] ?? "",
});

async function run() {
  const payload = new TextEncoder().encode(
    "{\"trip_id\":\"4f4e4e1-c824-4d63-b37a-d8d698862f1d\",\"passenger_name\":\"John Doe\"}",
  );
  const result = await trainTravelSDK.bookings.createRaw(bytesToStream(payload));

  console.log(result);
}

run();
