#include <cstdlib>
#include <iostream>
#include <string>

#include "train_travel.hpp"

int main() {
  train_travel::Client client(std::getenv("TRAIN_TRAVEL_TOKEN"));

  train_travel::CreateBookingRequest request{
      .trip_id = "4f4e4e1-c824-4d63-b37a-d8d698862f1d",
      .passenger_name = "John Doe",
      .has_bicycle = false,
      .has_dog = true,
  };

  auto booking = client.bookings().create(request);
  std::cout << "booking created: " << booking.id() << std::endl;
  return 0;
}
