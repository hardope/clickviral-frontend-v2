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
