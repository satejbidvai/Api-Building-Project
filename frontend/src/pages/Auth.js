import React, { useRef, useState, useContext } from "react";

import "./Auth.css";
import authContext from "../context/auth-context";

function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);

	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const auth = useContext(authContext);

	const switchModeHandler = () => {
		setIsLogin((prevIsLogin) => !prevIsLogin);
	};

	const submitHandler = (event) => {
		event.preventDefault();

		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		if (email.trim().length === 0 || password.trim().length === 0) {
			return;
		}

		let reqBody = {
			query: `
                query {
                    login(email: "${email}", password: "${password}")
                    {
                        userId
                        token
                        tokenExpiration
                    }
                }    
            `
		};

		if (!isLogin) {
			reqBody = {
				query: `
                    mutation {
                       createUser(userInput: {email: "${email}", password: "${password}"})
                       {
                           _id
                           email
                       }
                    }
                `
			};
		}

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
				if (resData.data.login.token) {
					auth.login(
						resData.data.login.token,
						resData.data.login.userId,
						resData.data.login.tokenExpiration
					);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<form className="auth-form" onSubmit={submitHandler}>
			<div className="form-control">
				<label htmlFor="email">E-Mail</label>
				<input type="email" id="email" ref={emailRef} />
			</div>
			<div className="form-control">
				<label htmlFor="password">Password</label>
				<input type="password" id="password" ref={passwordRef} />
			</div>
			<div className="form-actions">
				<button type="button" onClick={switchModeHandler}>
					Switch to {isLogin ? "SignUp" : "Login"}
				</button>
				<button type="submit">Submit</button>
			</div>
		</form>
	);
}

export default AuthPage;
