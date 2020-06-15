import React, { useState, useRef, useContext, useEffect } from "react";
import "./Events.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import authContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

function EventsPage() {
	const auth = useContext(authContext);

	const [creating, setCreating] = useState(false);
	const [events, setEvents] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);

	const startCreateEventHandler = () => {
		setCreating(true);
	};

	const modalCancelHandler = () => {
		setCreating(false);
		setSelectedEvent(null);
	};

	const modalConfirmHandler = () => {
		setCreating(false);

		const title = titleRef.current.value;
		const price = +priceRef.current.value;
		const date = dateRef.current.value;
		const description = descriptionRef.current.value;

		if (
			title.trim().length === 0 ||
			price <= 0 ||
			date.trim().length === 0 ||
			description.trim().length === 0
		) {
			return;
		}

		const reqBody = {
			query: `
                    mutation {
                       createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"})
                       {
                           _id
						   title
						   description
						   date
						   price
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
				setEvents([
					...events,
					{
						_id: resData.data.createEvent._id,
						title: resData.data.createEvent.title,
						description: resData.data.createEvent.description,
						date: resData.data.createEvent.date,
						price: resData.data.createEvent.price,
						creator: {
							_id: auth.userId
						}
					}
				]);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const titleRef = useRef(null);
	const priceRef = useRef(null);
	const dateRef = useRef(null);
	const descriptionRef = useRef(null);

	const fetchEvents = () => {
		setIsLoading(true);
		const reqBody = {
			query: `
					query {
					   events {
						   _id
						   title
						   description
						   date
						   price
						   creator {
							   _id
							   email
						   }
					   }
					}
				`
		};

		fetch("http://localhost:8000/graphql", {
			method: "POST",
			body: JSON.stringify(reqBody),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("Failed!");
				}
				return res.json();
			})
			.then((resData) => {
				const allEvents = resData.data.events;
				setEvents(allEvents);
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	const showDetailHandler = (eventId) => {
		setSelectedEvent(events.find((e) => e._id === eventId));
	};

	const bookEventHandler = () => {
		if (!auth.token) {
			setSelectedEvent(null);
			return;
		}
		const reqBody = {
			query: `
					mutation {
					   bookEvent (eventId: "${selectedEvent._id}")
					   {
						   _id
						   createdAt
						   updatedAt
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
				console.log(resData.data);
				setSelectedEvent(null);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<React.Fragment>
			{(creating || selectedEvent) && <Backdrop />}
			{creating && (
				<Modal
					title="Add Event"
					canCancel
					canConfirm
					onCancel={modalCancelHandler}
					onConfirm={modalConfirmHandler}
					confirmText="Confirm"
				>
					<form>
						<div className="form-control">
							<label htmlFor="title">Title</label>
							<input type="text" id="title" ref={titleRef} />
						</div>
						<div className="form-control">
							<label htmlFor="price">Price</label>
							<input type="number" id="price" ref={priceRef} />
						</div>
						<div className="form-control">
							<label htmlFor="date">Date</label>
							<input
								type="datetime-local"
								id="date"
								ref={dateRef}
							/>
						</div>
						<div className="form-control">
							<label htmlFor="description">Description</label>
							<textarea
								id="description"
								rows="4"
								ref={descriptionRef}
							/>
						</div>
					</form>
				</Modal>
			)}
			{selectedEvent && (
				<Modal
					title={selectedEvent.title}
					canCancel
					canConfirm
					onCancel={modalCancelHandler}
					onConfirm={bookEventHandler}
					confirmText={auth.token ? "Book" : "Confirm"}
				>
					<h1>{selectedEvent.title}</h1>
					<h2>
						${selectedEvent.price} -{" "}
						{new Date(selectedEvent.date).toLocaleDateString()}
					</h2>
					<p>{selectedEvent.description}</p>
				</Modal>
			)}
			{auth.token && (
				<div className="events-control">
					<p>Share your own Events!!</p>
					<button className="btn" onClick={startCreateEventHandler}>
						Create Event
					</button>
				</div>
			)}
			{isLoading ? (
				<Spinner />
			) : (
				<EventList
					events={events}
					authUserId={auth.userId}
					onViewDetail={showDetailHandler}
				/>
			)}
		</React.Fragment>
	);
}

export default EventsPage;
