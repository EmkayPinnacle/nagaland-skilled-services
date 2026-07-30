import { db } from "./firebase.js";
import { getProfileImage } from "./utils.js";
import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ================= ELEMENTS =================

const container = document.getElementById("professionalsContainer");
const searchInput = document.getElementById("searchInput");
const districtFilter = document.getElementById("districtFilter");
const professionFilter = document.getElementById("professionFilter");
const pagination = document.getElementById("pagination");



// ================= DATA =================

let allProfessionals = [];
let filteredProfessionals = [];

const professionalsPerPage = 10;
let currentPage = 1;

// ================= STAR RATING =================

function getStars(rating) {

    if (!rating) {

        return "☆☆☆☆☆";

    }

    const fullStars = Math.round(rating);

    return "★".repeat(fullStars) +
           "☆".repeat(5 - fullStars);

}

// ================= PAGE CLICK =================

pagination.addEventListener("click", (e) => {

    e.preventDefault();

    if (!e.target.dataset.page) return;

    const totalPages = Math.ceil(
        filteredProfessionals.length / professionalsPerPage
    );

    if (e.target.dataset.page === "prev") {

        if (currentPage > 1) currentPage--;

    }

    else if (e.target.dataset.page === "next") {

        if (currentPage < totalPages) currentPage++;

    }

    else {

        currentPage = Number(e.target.dataset.page);

    }

    displayProfessionals();

});


// ================= LOAD PROFESSIONALS =================

async function loadProfessionals() {

    allProfessionals = [];

    const q = query(
        collection(db, "professionals"),
        where("status", "==", "Verified")
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {

        allProfessionals.push({
            id: doc.id,
            ...doc.data()
        });

    });

    filteredProfessionals = [...allProfessionals];

    currentPage = 1;

    displayProfessionals();

}

// ================= DISPLAY PROFESSIONALS =================

function displayProfessionals() {

    container.innerHTML = "";

    if (filteredProfessionals.length === 0) {

        container.innerHTML = `

        <div class="col-12 text-center py-5">

            <h4>No professionals found</h4>

            <p class="text-muted">

                Try changing your search or filters.

            </p>

        </div>

        `;

        pagination.innerHTML = "";

        return;

    }

    const start = (currentPage - 1) * professionalsPerPage;

    const end = start + professionalsPerPage;

    const pageProfessionals = filteredProfessionals.slice(start, end);

    pageProfessionals.forEach((professional) => {

        container.innerHTML += `

        <div class="col-md-6 col-lg-4">

            <div class="professional-card">

                <img
                    src="${professional.photoUrl || getProfileImage(professional.profession)}"
                    class="professional-photo">

                <div class="verified">

                    ✔ Verified

                </div>

                <h4>${professional.fullName}</h4>

                <p class="profession">

                    ${professional.profession}

                </p>

                <div class="rating">

                    ${getStars(professional.averageRating)}

                    <br>

                    <small>

                        ${professional.averageRating ?? "New"}

                        (${professional.reviewCount ?? 0} Reviews)

                    </small>

                </div>

                <p class="location">

                    📍 ${professional.district}

                </p>

                <div class="skills">

                    <span>

                        ${professional.experience} Years Experience

                    </span>

                </div>

                <a
                    href="professional-profile.html?id=${professional.id}"
                    class="btn btn-warning w-100 mt-4">

                    View Profile

                </a>

            </div>

        </div>

        `;

    });

    displayPagination();

}

// ================= PAGINATION =================

function displayPagination() {

    pagination.innerHTML = "";

    const totalPages = Math.ceil(
        filteredProfessionals.length / professionalsPerPage
    );

    if (totalPages <= 1) return;

    // Previous Button

    pagination.innerHTML += `

        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">

            <a class="page-link" href="#" data-page="prev">

                Previous

            </a>

        </li>

    `;

    // Page Numbers

    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `

            <li class="page-item ${currentPage === i ? "active" : ""}">

                <a class="page-link"

                   href="#"

                   data-page="${i}">

                    ${i}

                </a>

            </li>

        `;

    }

    // Next Button

    pagination.innerHTML += `

        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">

            <a class="page-link" href="#" data-page="next">

                Next

            </a>

        </li>

    `;

}

// ================= FILTERS =================

function applyFilters() {

    const search = searchInput.value.toLowerCase().trim();

    const district = districtFilter.value;

    const profession = professionFilter.value;

    filteredProfessionals = allProfessionals.filter((professional) => {

        const matchesSearch =

            professional.fullName.toLowerCase().includes(search) ||

            professional.profession.toLowerCase().includes(search);

        const matchesDistrict =

            district === "All Districts" ||

            district === "" ||

            professional.district === district;

        const matchesProfession =

            profession === "All Professions" ||

            profession === "" ||

            professional.profession === profession;

        return (

            matchesSearch &&

            matchesDistrict &&

            matchesProfession

        );

    });

    currentPage = 1;

    displayProfessionals();

}

// ================= EVENTS =================

searchInput.addEventListener("input", applyFilters);

districtFilter.addEventListener("change", applyFilters);

professionFilter.addEventListener("change", applyFilters);

// ================= START =================

loadProfessionals();