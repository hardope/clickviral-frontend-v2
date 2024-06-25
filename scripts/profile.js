$(document).ready(function() {

    console.log("Profile Page");

    let urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('username');

    fetch(`${API()}/user/username/${username}`)
    .then(response => response.json())
    .then(data => {
        // Use the data here
        if (data.status == "not_found") {
            $('body').text('<h1>404 - User Not Found</h1>')
        }
        data = data.data;
        $('title').text(`ClickViral - ${data.first_name} ${data.last_name}`);
        $('#name').text(`${data.first_name} ${data.last_name}`);
        $('#username').text(`@${data.username}`);
        $('#bio').text(data.bio);

        $('#og-title').attr('content', `ClickViral - ${data.first_name} ${data.last_name}`);
        $('#og-desc').attr('content', data.bio);
        $('#og-url').attr('content', `${window.location.href}`);

    })
    .catch(error => {
        // Handle the error here
        $('body').html('<h1>404 - User Not Found</h1>');
    });
});