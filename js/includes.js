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

// ================================
// Load Shared Legal Content
// ================================

async function loadLegalContent() {

    const placeholder = document.getElementById("legal-content");

    if (!placeholder) return;

    const response = await fetch("components/legal-content.html");

    const html = await response.text();

    placeholder.innerHTML = html;

}

loadLegalContent();

// ================================
// Load Legal Content into Modal
// ================================

async function loadLegalModal() {

    const placeholder = document.getElementById("legal-content-modal");
    console.log("Modal Placeholder:", placeholder);

    if (!placeholder) return;

    const response = await fetch("components/legal-content.html");

    const html = await response.text();

    placeholder.innerHTML = html;

}

loadLegalModal();