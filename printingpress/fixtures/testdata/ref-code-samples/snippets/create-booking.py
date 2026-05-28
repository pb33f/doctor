import os

from train_travel import TrainTravelClient


client = TrainTravelClient(token=os.environ["TRAIN_TRAVEL_TOKEN"])

booking = client.bookings.create(
    trip_id="4f4e4e1-c824-4d63-b37a-d8d698862f1d",
    passenger_name="John Doe",
    extras={"has_bicycle": False, "has_dog": True},
)

print(f"booking created: {booking.id}")
