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
        email=$("#sign-in-form .email").val();
        password=$("#sign-in-form .password").val();
        Login(email, password);
        e.preventDefault();
    });
});