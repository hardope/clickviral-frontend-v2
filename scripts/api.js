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

function SignUp() {
	Notify('info', 'Creating Your Account...', 'Auth');
	const email = $("#sign-up-form .email").val();
	const username = $("#username").val();
	const password = $("#sign-up-form .password").val();
	const first_name = $("#first_name").val();
	const last_name = $("#last_name").val();
	const confirm_password = $("#confirm_password").val();
	
	if (password != confirm_password) {
		Notify('error', 'Passwords do not match', 'Auth');
		return;
	}

	fetch(`${API()}/user/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email,
			username: username,
			password: password,
			first_name: first_name,
			last_name: last_name,
		}),
	})
	.then((response) => response.json())
	.then((data) => {
		if (data.status != "success") {
			Notify('error', data.message, 'Auth');
			return;
		}
		Notify('success', 'You have successfully signed up!', 'Auth');
		GetSignUpOTP(data.data.id, email, password);
		sessionStorage.setItem("token", data.token);
	})
}

function LogOut() {
	sessionStorage.removeItem("token");
	window.location.href = "/auth";
}

function openOtpPopup() {
	$('#otp-popup').fadeIn();
	$('#otp-input').val('');
}

// Function to close the OTP popup
function closeOtpPopup() {
	$('#otp-popup').fadeOut();
}

  // Event handler for the OTP submit button

function GetSignUpOTP (id, email, password) {
    //get OTP FROM USER

    openOtpPopup();

	$('#popup_form').submit(function(e) {
        const inputOtp = $('#otp-input').val();
        if (inputOtp.length === 6 ){
			otp = inputOtp;
			fetch(`${API()}/user/verify/${id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					otp: otp,
				}),
			})
			.then((response) => response.json())
			.then((data) => {
				if (data.status != "success") {
					Notify('error', data.message, 'Auth');
					return;
				}
				Login(email, password);
				closeOtpPopup();
				Notify('success', 'You have successfully verified your account!', 'Auth');
			})
        } else {
          	Notify('error', 'Invalid OTP', 'Auth');
        }
		e.preventDefault();
    });
}