$(document).ready(function() {

    if (IsAuthenticated()) {
        Notify('info', 'You are already signed in', 'Auth');
        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
    }

    const sign_in_btn = $("#sign-in-btn");
    const sign_up_btn = $("#sign-up-btn");
    const container = $(".container");

    sign_up_btn.on('click', function() {
        container.addClass("sign-up-mode");
    });

    sign_in_btn.on('click', function() {
        container.removeClass("sign-up-mode");
    });

    $("#sign-in-form").submit(function(e) {
        let email = $("#sign-in-form .email").val();
        let password = $("#sign-in-form .password").val();
        Login(email, password);
        e.preventDefault();
    });

    $("#sign-up-form").submit(function(e) {
        SignUp();
        e.preventDefault();
    });

});

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
		if (data.status === "unauthorized") {
			Notify('error', "Invalid Credentials", 'Auth');
			return;
		} else if (data.status === "unauthorized-inactive") {
			Notify('error', "Account is not activated", 'Auth');
			Notify('info', "Activating Account...", 'Auth');
			InitiateActivateAccount(email);
			return;
		} else if (data.status === "success - otp") {
			Notify('info', 'Two Factor Authentication', 'Auth');
			GetLogInOTP(email);
			return;
		} else if (data.status === "success") {
			Notify('success', 'You have successfully signed in!', 'Auth');
			sessionStorage.setItem("token", data.data.token);
			setTimeout(() => {
				window.location.href = "/";
			}, 3000);
			return;
		} else {
			Notify('error', data.message, 'Auth');
			return;
		}
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
	})
}

function openOtpPopup() {
	$('#otp-popup').fadeIn();
	$('#otp-input').val('');
}

// Function to close the OTP popup
function closeOtpPopup() {
	$('#otp-popup').fadeOut();
}

function openEmailPopup() {
	$('#email-popup').fadeIn();
}

function closeEmailPopup() {
	$('#email-popup').fadeOut();
}

// Event handler for the OTP submit button

function GetSignUpOTP (id, email, password) {
    //get OTP FROM USER

    openOtpPopup();

	$('#otp_popup_form').submit(function(e) {
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

function GetLogInOTP(email) {
	//get OTP FROM USER

	openOtpPopup();

	$('#otp_popup_form').submit(function(e) {
		const inputOtp = $('#otp-input').val();
		if (inputOtp.length === 6 ){
			otp = inputOtp;
			fetch(`${API()}/user/two-factor-login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
					otp: otp,
				}),
			})
			.then((response) => response.json())
			.then((data) => {
				if (data.status != "success") {
					Notify('error', data.message, 'Auth');
					return;
				}
				closeOtpPopup();
				sessionStorage.setItem("token", data.data.token);
				Notify('success', 'You have successfully signed in!', 'Auth');
				setInterval(() => {
					window.location.href = "/";
				}, 3000);
			})
			.catch((error) => {
				console.error("Error:", error);
				Notify('error', 'An Error Occured Check Your In', 'Auth');
			});
		} else {
		  	Notify('error', 'Invalid OTP', 'Auth');
		}
		e.preventDefault();
	});
}

function InitiateActivateAccount(email){
	user_id = '';
	fetch(`${API()}/user/find-account`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email,
		}),
	})
	.then((response) => response.json())
	.then((data) => {
		if (data.status != "success") {
			Notify('error', data.message, 'Auth');
			return;
		}
		user_id = data.data;
		fetch(`${API()}/user/send-verification-email/${user_id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
			}),
		})
		.then((response) => response.json())
		.then((data) => {
			if (data.status != "success") {
				Notify('error', data.message, 'Auth');
				return;
			}
			Notify('info', 'Check your email for OTP to activate your account', 'Auth');
		})
		.catch((error) => {
			console.error("Error:", error);
			Notify('error', 'An Error Occured Check Your In', 'Auth');
		});
		openOtpPopup();
		$('#otp_popup_form').submit(function(e) {
			const inputOtp = $('#otp-input').val();
			if (inputOtp.length === 6 ){
				otp = inputOtp;
				fetch(`${API()}/user/verify/${user_id}`, {
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
					closeOtpPopup();
					Notify('success', 'You have successfully activated your account!', 'Auth');
					$('#sign-in-form').submit()
				})
			} else {
				Notify('error', 'Invalid OTP', 'Auth');
			}
			e.preventDefault();
		});
	})
}

function openPasswordPopup() {
	$('#password-popup').fadeIn();
}

function closePasswordPopup() {
	$('#password-popup').fadeOut();
}

function forgotPassword() {
	openEmailPopup();

	$('#email_popup_form').submit(function(e) {
		const email = $('#email-input').val();
		otp = ''
		
		fetch(`${API()}/user/send-reset-password-otp`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
			}),
		})
		.then((response) => response.json())
		.then((data) => {
			if (data.status != "success") {
				Notify('error', data.message, 'Auth');
				return;
			}
			Notify('info', 'Check your email for OTP to reset your password', 'Auth');
			closeEmailPopup();
			openOtpPopup();
			$('#otp_popup_form').submit(function(e) {
				const inputOtp = $('#otp-input').val();
				if (inputOtp.length === 6 ){
					otp = inputOtp;
					fetch(`${API()}/user/verify-otp`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email: email,
							otp: otp,
							purpose: 'forgot_password'
						}),
					})
					.then((response) => response.json())
					.then((data) => {
						if (data.status != "success") {
							Notify('error', data.message, 'Auth');
							return;
						}
						closeOtpPopup();
						openPasswordPopup();
						$('#password_popup_form').submit(function(e) {
							const password = $('#password-input').val();
							const confirm_password = $('#confirm-password-input').val();
							if (password != confirm_password) {
								Notify('error', 'Passwords do not match', 'Auth');
							} else {
								fetch(`${API()}/user/reset-password`, {
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										email: email,
										password: password,
										otp: otp,
									}),
								})
								.then((response) => response.json())
								.then((data) => {
									if (data.status != "success") {
										Notify('error', data.message, 'Auth');
										return;
									}
									closePasswordPopup();
									Notify('success', 'You have successfully reset your password!', 'Auth');
									Login(email, password);
								})
							}
							e.preventDefault();
						})
					})
				} else {
					Notify('error', 'Invalid OTP', 'Auth');
				}
				e.preventDefault();
			});
		});
		e.preventDefault();
	})
}