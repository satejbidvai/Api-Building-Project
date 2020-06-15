import React, { useState, useEffect, useContext } from "react";
import authContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/BookingList";

function BookingsPage() {
	const auth = useContext(authContext);

	const [isLoading, setIsLoading] = useState(false);
	const [bookings, setBookings] = useState([]);

	useEffect(() => {
		const fetchBookings = () => {
			setIsLoading(true);
			const reqBody = {
				query: `
						query {
							bookings {
								_id
								createdAt
								event {
									_id
									title
								}
							}
						}
					`
			};

			fetch("http://localhost:8000/graphql", {
				method: "POST",
				body: JSON.stringify(reqBody),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${auth.token}`
				}
			})
				.then((res) => {
					if (res.status !== 200 && res.status !== 201) {
						throw new Error("Failed!");
					}
					return res.json();
				})
				.then((resData) => {
					const allBookings = resData.data.bookings;
					setBookings(allBookings);
					setIsLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setIsLoading(false);
				});
		};
		fetchBookings();
	}, [auth.token]);

	const deleteBookingHandler = (bookingId) => {
		setIsLoading(true);
		const reqBody = {
			query: `
						mutation {
							cancelBooking(bookingId: "${bookingId}")
							{
								_id
								title
							}
						}
					`
		};

		fetch("http://localhost:8000/graphql", {
			method: "POST",
			body: JSON.stringify(reqBody),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${auth.token}`
			}
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("Failed!");
				}
				return res.json();
			})
			.then((resData) => {
				const updatedBookings = bookings.filter((booking) => {
					return booking._id !== bookingId;
				});
				setBookings(updatedBookings);
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

	return (
		<React.Fragment>
			{isLoading ? (
				<Spinner />
			) : (
				<BookingList
					bookings={bookings}
					onDelete={deleteBookingHandler}
				/>
			)}
		</React.Fragment>
	);
}

export default BookingsPage;
