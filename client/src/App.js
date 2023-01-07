import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import EmailVerify from "./components/EmailVerification";
import Tasks from "./components/Tasks"
import CodeEditor from "./components/Editor"
import Dummy from "./pages/Dummy"

function App() {
	const user = localStorage.getItem("token");
	console.log("user is ", user)

	return (
		<Routes>

			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/users/:id/verify/:token" element={<EmailVerify />} />
			<Route path="/dummy" element={<Dummy />} />

			{user ? 
			<>
				<Route path="/tasks" exact element={<Tasks />} />
				<Route path="/editor" exact element={<CodeEditor />} />
				<Route path="*" exact element={<Main />} />
				<Route path="/tasks" exact element={<Tasks />} />
			</> 
			: 	<Route path="*" element={<Navigate replace to="/login" />} />}


		</Routes>
	);
}

export default App;
