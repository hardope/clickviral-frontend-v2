function Alert(type, message, title) {
    Swal.fire({
        title: title,
        text: message,
        icon: type,
        confirmButtonText: 'OK'
    });
}

function Notify(type, message, title) {
    toastr[type](message, title);
}

// Usage 
// Alert('success', 'Logged In', 'Auth');

// Notify('success', 'Logged In', 'Auth');