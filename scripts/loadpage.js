const contentDiv = document.getElementById('content');
const loader = document.getElementById('loader');

function loadPage(url) {
    showLoader(); // Show loader while content is loading
    fetch(url)
        .then(response => response.text())
        .then(html => {

            if (!html) {
                contentDiv.innerHTML = '<h1>Page not found</h1>';
                hideLoader(); // Hide loader in case of error
                return;
            }

            contentDiv.innerHTML = html;
            hideLoader(); // Hide loader once content is loaded
        })
        .catch(error => {

            contentDiv.innerHTML = '<h1>Page not found</h1>';
            
            hideLoader(); // Hide loader in case of error
    });
}

function showLoader() {
    loader.style.display = 'block';
}
function hideLoader() {
    loader.style.display = 'none';
}