
// ================= SECURITY =================

if (sessionStorage.getItem("adminLoggedIn") !== "true") {

    window.location.href = "admin-login.html";

}

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "admin-login.html";
        return;

    }

    // Replace this with your admin email

    if (user.email !== "pinnacleskills7@gmail.com") {

        alert("Access Denied");

        auth.signOut();

        window.location.href = "admin-login.html";

    }

});

// ================= DOM =================

const container = document.getElementById("applicationsContainer");
const searchInput = document.getElementById("searchInput");
const exportBtn = document.getElementById("exportBtn");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const verifiedCount = document.getElementById("verifiedCount");
const rejectedCount = document.getElementById("rejectedCount");

// ================= VARIABLES =================

let professionals = [];

let professionChart = null;
let districtChart = null;

// ================= TOAST =================

function showToast(message) {

    document.getElementById("toastMessage").textContent = message;

    const toast = new bootstrap.Toast(
        document.getElementById("successToast")
    );

    toast.show();

}

// ================= CHARTS =================

function drawCharts() {

    const professionCounts = {};
    const districtCounts = {};

    professionals.forEach((professional) => {

        professionCounts[professional.profession] =
            (professionCounts[professional.profession] || 0) + 1;

        districtCounts[professional.district] =
            (districtCounts[professional.district] || 0) + 1;

    });

    if (professionChart) {

        professionChart.destroy();

    }

    if (districtChart) {

        districtChart.destroy();

    }

    professionChart = new Chart(

        document.getElementById("professionChart"),

        {

            type: "pie",

            data: {

                labels: Object.keys(professionCounts),

                datasets: [{

                    data: Object.values(professionCounts)

                }]

            }

        }

    );

    districtChart = new Chart(

        document.getElementById("districtChart"),

        {

            type: "bar",

            data: {

                labels: Object.keys(districtCounts),

                datasets: [{

                    label: "Professionals",

                    data: Object.values(districtCounts)

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        }

    );

}

// ================= DISPLAY APPLICATIONS =================

function displayApplications(list) {

    container.innerHTML = "";

    list.forEach((professional) => {

        container.innerHTML += `

        <div class="card shadow-sm mb-4">

            <div class="card-body">

                <div class="d-flex justify-content-between align-items-start">

                    <div>

                        <h4 class="mb-1">

                            ${professional.fullName}

                        </h4>

                        <p class="mb-1">

                            <strong>Profession:</strong>
                            ${professional.profession}

                        </p>

                        <p class="mb-1">

                            <strong>District:</strong>
                            ${professional.district}

                        </p>

                        <p class="mb-2">

                            <strong>Experience:</strong>
                            ${professional.experience} Years

                        </p>

                        <span class="badge ${
                            professional.status === "Verified"
                                ? "bg-success"
                                : professional.status === "Rejected"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                        }">

                            ${professional.status}

                        </span>

                    </div>

                    <div class="text-end">

                        <button
                            class="btn btn-primary btn-sm viewBtn mb-2"
                            data-id="${professional.id}">

                            View Details

                        </button>

                        <br>

                        ${
                            professional.status === "Pending"
                            ? `
                            <button
                                class="btn btn-success btn-sm approveBtn"
                                data-id="${professional.id}">

                                Approve

                            </button>

                            <button
                                class="btn btn-danger btn-sm rejectBtn"
                                data-id="${professional.id}">

                                Reject

                            </button>
                            `
                            : ""
                        }

                        <br>

                        <button
                            class="btn btn-outline-danger btn-sm mt-2 deleteBtn"
                            data-id="${professional.id}">

                            🗑 Delete

                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}


// ================= LOAD APPLICATIONS =================

// ================= LOAD APPLICATIONS =================

async function loadApplications() {

    professionals = [];

    const q = query(
        collection(db, "professionals"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    let total = 0;
    let pending = 0;
    let verified = 0;
    let rejected = 0;

    snapshot.forEach((docSnap) => {

        const professional = {
            id: docSnap.id,
            ...docSnap.data()
        };

        professionals.push(professional);

        total++;

        if (professional.status === "Pending") pending++;
        if (professional.status === "Verified") verified++;
        if (professional.status === "Rejected") rejected++;

    });

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    verifiedCount.textContent = verified;
    rejectedCount.textContent = rejected;

    displayApplications(professionals);

    drawCharts();

}


// ================= BUTTON ACTIONS =================

document.addEventListener("click", async (e) => {

    // VIEW DETAILS

    if (e.target.classList.contains("viewBtn")) {

        const id = e.target.dataset.id;

        const professional = professionals.find(p => p.id === id);

        document.getElementById("modalBody").innerHTML = `

        <table class="table table-bordered">

            <tr><th>Full Name</th><td>${professional.fullName}</td></tr>

            <tr><th>Mobile</th><td>${professional.mobile || "-"}</td></tr>

            <tr><th>WhatsApp</th><td>${professional.whatsapp || "-"}</td></tr>

            <tr><th>Email</th><td>${professional.email || "-"}</td></tr>

            <tr><th>Profession</th><td>${professional.profession}</td></tr>

            <tr><th>Experience</th><td>${professional.experience} Years</td></tr>

            <tr><th>District</th><td>${professional.district}</td></tr>

            <tr><th>Areas Served</th><td>${professional.areas || "-"}</td></tr>

            <tr><th>Address</th><td>${professional.address || "-"}</td></tr>

            <tr><th>Bio</th><td>${professional.bio || "-"}</td></tr>

        </table>

        `;

        new bootstrap.Modal(
            document.getElementById("detailsModal")
        ).show();

    }

    // APPROVE

    if (e.target.classList.contains("approveBtn")) {

        await updateDoc(
            doc(db, "professionals", e.target.dataset.id),
            {
                status: "Verified"
            }
        );

        showToast("Professional Approved!");

    }

    // REJECT

    if (e.target.classList.contains("rejectBtn")) {

        await updateDoc(
            doc(db, "professionals", e.target.dataset.id),
            {
                status: "Rejected"
            }
        );

        showToast("Professional Rejected!");

    }

    // DELETE

    if (e.target.classList.contains("deleteBtn")) {

        if (!confirm("Delete this application permanently?"))
            return;

        await deleteDoc(
            doc(db, "professionals", e.target.dataset.id)
        );

        showToast("Application Deleted!");

    }

});

// ================= SEARCH =================

searchInput.addEventListener("input", () => {

    const search = searchInput.value.toLowerCase();

    const filtered = professionals.filter((professional) => {

        return (

            professional.fullName.toLowerCase().includes(search) ||

            professional.profession.toLowerCase().includes(search) ||

            professional.district.toLowerCase().includes(search)

        );

    });

    displayApplications(filtered);

});

// ================= FILTER BUTTONS =================

document.querySelectorAll(".filterBtn").forEach((button) => {

    button.addEventListener("click", () => {

        const status = button.dataset.status;

        if (status === "All") {

            displayApplications(professionals);

            return;

        }

        const filtered = professionals.filter((professional) =>

            professional.status === status

        );

        displayApplications(filtered);

    });

});

// ================= EXPORT =================

exportBtn.addEventListener("click", () => {

    const data = professionals.map((professional) => ({

        Name: professional.fullName,

        Profession: professional.profession,

        District: professional.district,

        Experience: professional.experience,

        Mobile: professional.mobile,

        WhatsApp: professional.whatsapp,

        Email: professional.email,

        Status: professional.status

    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Professionals"

    );

    XLSX.writeFile(

        workbook,

        "Professionals.xlsx"

    );

});

// ================= REALTIME =================

const q = query(

    collection(db, "professionals"),

    orderBy("createdAt", "desc")

);

onSnapshot(q, () => {

    loadApplications();

});

// ================= LOGOUT =================

import { signOut }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

document.getElementById("logoutBtn").addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "admin-login.html";

});