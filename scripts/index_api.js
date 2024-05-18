$(document).ready(function() {
    if (IsAuthenticated()) {
        GetMe();
    }
});

function GetMe () {
    $.ajax({
        url: `${API()}/user/me`,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${Token()}`
        },
        success: function(data) {
            if (data.status != 'success') {
                Notify('error', "Your Session Has Expired", 'Auth');
                setInterval(() => {
                    window.location.href = '/auth';
                }, 3000);
                return;
            }
            Notify('success', `Welcome, ${data.data.username}`, 'Auth');
        },
        error: function() {
            Notify('error', 'An Error Occured Check Your Internet Connection', 'Auth');
        }
    });
}