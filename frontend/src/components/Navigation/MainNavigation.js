import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
import { useContext } from "react";
import authContext from "../../context/auth-context";

function MainNavigation() {
	const auth = useContext(authContext);
	return (
		<header className="main-navigation">
			<div className="main-navigation__logo">
				<h1>Easy Event</h1>
			</div>
			<nav className="main-navigation__items">
				<ul>
					{!auth.token && (
						<li>
							<NavLink to="/auth">Authentication</NavLink>
						</li>
					)}
					<li>
						<NavLink to="/events">Events</NavLink>
					</li>
					{auth.token && (
						<React.Fragment>
							<li>
								<NavLink to="/bookings">Bookings</NavLink>
							</li>
							<li>
								<button onClick={auth.logout}>Logout</button>
							</li>
						</React.Fragment>
					)}
				</ul>
			</nav>
		</header>
	);
}

export default MainNavigation;
