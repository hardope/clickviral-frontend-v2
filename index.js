document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.getElementById('nav-search-icon');
    const menuIcon = document.getElementById('nav-menu-icon');
    const searchForm = document.getElementById('search-form');
    const sidebar = document.getElementById('sidebar');
    const sidebar_return = document.getElementById('sidebar-return');
    const main = document.getElementById('main');

    loadPage('templates/home.html');
    document.querySelector('#home').classList.add('active');

    searchIcon.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action of the search icon
        searchForm.classList.toggle('active');
    });

    menuIcon.addEventListener('click', function(event) {
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active')
            main.style.display = 'block'
        }
        event.preventDefault(); // Prevent the default action of the menu icon
        sidebar.classList.toggle('active');
        main.style.display = 'none'
    });

    sidebar_return.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action of the sidebar return icon
        sidebar.classList.remove('active');
        main.style.display = 'block';
    });        

    // Close the search form if clicked outside of it
    document.addEventListener('click', function(event) {
        if (!searchForm.contains(event.target) && !searchIcon.contains(event.target)) {
            searchForm.classList.remove('active');
        }
    });

    document.querySelectorAll('.nav-items').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            if (this.classList.contains('active')) return;
            const url = `templates/${this.getAttribute('id')}`;
            document.querySelector('.nav-items.active').classList.remove('active');
            this.classList.add('active');
            loadPage(url);
        });
    });

    if (!IsAuthenticated()) {
        window.location.href = '/auth';
    }
});
