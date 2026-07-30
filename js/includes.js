// ================================
// Load Shared Navbar
// ================================

async function loadNavbar() {

    const placeholder = document.getElementById("navbar-placeholder");

    if (!placeholder) return;

    const response = await fetch("components/navbar.html");

    const html = await response.text();

    placeholder.innerHTML = html;

}

loadNavbar();


// ================================
// Load Shared Footer
// ================================

async function loadFooter() {

    const placeholder = document.getElementById("footer-placeholder");

    if (!placeholder) return;

    const response = await fetch("components/footer.html");

    const html = await response.text();

    placeholder.innerHTML = html;

}

loadFooter();