package main

import (
	"context"
	"fmt"
	"os"

	traintravel "github.com/example/train-travel-go"
)

func main() {
	client := traintravel.NewClient(os.Getenv("TRAIN_TRAVEL_TOKEN"))
	booking, err := client.Bookings.Create(context.Background(), traintravel.CreateBookingRequest{
		TripID:        "4f4e4e1-c824-4d63-b37a-d8d698862f1d",
		PassengerName: "John Doe",
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(booking.ID)
}
