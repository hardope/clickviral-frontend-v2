function API() {
	return "https://clickviral-backend.hardope.tech";
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

function LogOut() {
	sessionStorage.removeItem("token");
	window.location.href = "/auth";
}