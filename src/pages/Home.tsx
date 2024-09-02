import { useEffect, useState } from "react"
import api from "../api";

const Home = () => {

	const [userData, setUserData] = useState<any>(null);

	useEffect(() => {
		const user = () => {
			api.get("/user/me")
				.then((res) => {
					setUserData(res.data.data);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		user();
	}, []);


	return (
		<>
			{
				userData ? (
					<div style={
						{
							display: "flex",
							flexDirection: "column",
							alignItems: "center"
						}
					}>
						<p>Welcome {userData.email}</p>
						<p>Your ID is {userData.id}</p>
					</div>
				) : (
					<div>
						<p>Welcome</p>
						<p>Loading...</p>
					</div>
				)
			}
			<h1>Home</h1>
		</>
	)
}

export default Home