function API() {
	return "https://clickviral-v2.onrender.com";
	// return "http://localhost:5000"
}

function IsAuthenticated() {
	if (sessionStorage.getItem("token")) {
		return true;
	}
	return false;
}

function Token() {
	return sessionStorage.getItem("token");
}

function Login(email, password) {
	Notify('info', 'Signing You In...', 'Auth');
	fetch(`${API()}/user/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email,
			password: password,
		}),
	})
	.then((response) => response.json())
	.then((data) => {
		if (data.status != "success") {
			Notify('error', "Invalid Credentials", 'Auth');
			return;
		}
		Notify('success', 'You have successfully signed in!', 'Auth');
		sessionStorage.setItem("token", data.data.token);
		setTimeout(() => {
			window.location.href = "/";
		}, 3000);
	})
	.catch((error) => {
		console.error("Error:", error);
		Notify('error', 'An Error Occured Check Your In', 'Auth');
	});
}

function LogOut() {
	sessionStorage.removeItem("token");
	window.location.href = "/auth";
}
