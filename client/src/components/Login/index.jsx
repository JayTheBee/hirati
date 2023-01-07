import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/auth`;
			axios.defaults.withCredentials = true;
			// const { data: res } = await axios.post(url, data)  // what??
			const userResp = await axios.post(url, data)  
			console.log("axios res is ", userResp.data)  //userResp should be in a context state when necessary
			localStorage.setItem("token", userResp.data);	//dont use localstorage at all, just use state
			window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	const handleGoogle = async (e) => {
		// e.preventDefault();
		window.open(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/auth/google`, "_self");
		// try {
		// 	console.log(profile);
		// 	exit();
		// 	const { data: res } = await axios.post(url, data);
		// 	localStorage.setItem("token", res.data);
		// 	window.location = "/";
		// } catch (error) {
		// 	if (
		// 		error.response &&
		// 		error.response.status >= 400 &&
		// 		error.response.status <= 500
		// 	) {
		// 		setError(error.response.data.message);
		// 	}
		// }
	};




	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sign In
						</button>
					</form>
					<button  className={styles.green_btn} onClick={handleGoogle}>
						Open with google
					</button>
				</div>
				<div className={styles.right}>
					<h1>New User?</h1>
					<Link to="/signup">
						<button type="button" className={styles.white_btn}>
						Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
