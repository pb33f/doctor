import { TrainTravelSDK } from "train-travel-sdk";

const trainTravelSDK = new TrainTravelSDK({
  oAuth2: process.env["TRAINTRAVELSDK_O_AUTH2"] ?? "",
});

async function run() {
  const result = await trainTravelSDK.bookings.createJson({
    tripId: "4f4e4e1-c824-4d63-b37a-d8d698862f1d",
    passengerName: "John Doe",
  });

  console.log(result);
}

run();
