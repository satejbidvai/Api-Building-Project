import React from "react";
import "./EventItem.css";

function EventItem(props) {
	return (
		<li className="events__list-item" key={props.eventId}>
			<div>
				<h1>{props.title}</h1>
				<h2>
					${props.price} - {new Date(props.date).toLocaleDateString()}
				</h2>
			</div>
			<div>
				{props.userId === props.creatorId ? (
					<p>You own this event!</p>
				) : (
					<button
						className="btn"
						onClick={props.onDetail.bind(this, props.eventId)}
					>
						View Details
					</button>
				)}
			</div>
		</li>
	);
}

export default EventItem;
