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
					<div>
						<h1>Welcome {userData.email}</h1>
						<p>Your ID is {userData.id}</p>
					</div>
				) : (
					<div>
						<h1>Welcome</h1>
						<p>Loading...</p>
					</div>
				)
			}
		</>
	)
}

export default Home