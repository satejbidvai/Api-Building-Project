import React from "react";
import "./EventList.css";
import EventItem from "./EventItem/EventItem";

function EventList({ events, authUserId, onViewDetail }) {
	const eventList = events.map((event) => {
		return (
			<EventItem
				key={event._id}
				eventId={event._id}
				title={event.title}
				userId={authUserId}
				price={event.price}
				date={event.date}
				creatorId={event.creator._id}
				onDetail={onViewDetail}
			/>
		);
	});

	return <ul className="events__list">{eventList}</ul>;
}

export default EventList;
