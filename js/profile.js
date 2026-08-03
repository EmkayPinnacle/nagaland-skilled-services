import { db } from "./firebase.js";

import { getProfileImage } from "./utils.js";

import {
    doc,
    getDoc,
    updateDoc,
    increment,
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    onSnapshot,
    orderBy
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ================= GET ID =================

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

const container = document.getElementById("profileContainer");

// ================================
// Track Customer Interaction
// ================================

async function trackInteraction(type) {

    try {

        const docRef = doc(db, "professionals", id);

        if (type === "call") {

            await updateDoc(docRef, {

                callClicks: increment(1)

            });

        }

        if (type === "whatsapp") {

            await updateDoc(docRef, {

                whatsappClicks: increment(1)

            });

        }

    }

    catch (error) {

        console.error("Interaction Tracking Error:", error);

    }

}


async function loadProfile() {

    const docRef = doc(db, "professionals", id);

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {

        container.innerHTML = `

        <div class="text-center py-5">

            <h3>Professional not found.</h3>

        </div>

        `;

        return;

    }

    const professional = docSnap.data();

    container.innerHTML = `

    <div class="row">

        <div class="col-lg-4">

            <div class="card shadow-sm border-0 rounded-4 text-center p-4">

                <img
src="${professional.photoUrl || getProfileImage(professional.profession)}"
class="rounded-circle mx-auto mb-4"
width="180"
                
                >

                <h2>${professional.fullName}</h2>

                <span class="badge bg-success fs-6">

                    ✔ Verified Professional

                </span>

                <p class="mt-3 text-muted">

                    ${professional.profession}

                </p>

                <p>

                    📍 ${professional.district}

                </p>

                <p>

                    ${professional.experience} Years Experience

                </p>

            </div>

        </div>

        <div class="col-lg-8">

            <div class="card shadow-sm border-0 rounded-4 p-4">

                <h3>About</h3>

                <p>

                    ${professional.bio || "No bio available."}

                </p>

                <hr>

                <div class="row">

                    <div class="col-md-6 mb-4">

                        <h5>Profession</h5>

                        <p>${professional.profession}</p>

                    </div>

                    <div class="col-md-6 mb-4">

                        <h5>Experience</h5>

                        <p>${professional.experience} Years</p>

                    </div>

                    <div class="col-md-6 mb-4">

                        <h5>District</h5>

                        <p>${professional.district}</p>

                    </div>

                    <div class="col-md-6 mb-4">

                        <h5>Areas Served</h5>

                        <p>${professional.areas || "-"}</p>

                    </div>

                </div>

                <hr>

                <div class="d-grid gap-3 d-md-flex">

                    <a
    href="#"
    id="callBtn"
    class="btn btn-warning btn-lg">

                        📞 Call Now

                    </a>

                    <a
    href="#"
    id="whatsappBtn"
    class="btn btn-success btn-lg">

                        💬 WhatsApp

                    </a>

                </div>

                <hr class="my-4">

                <h4>

                    ⭐ <span id="averageRating">0.0</span>

                    <span class="fs-6 text-muted">

                        (<span id="reviewCount">0</span> Reviews)

                    </span>

                </h4>

                <div id="reviewsContainer">

                    <div class="text-muted">

                        No reviews yet.

                    </div>

                </div>

            </div>

        </div>

    </div>

    `;

    // ================================
// Call Button Analytics
// ================================

const callBtn = document.getElementById("callBtn");

callBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    await trackInteraction("call");

    window.location.href = `tel:${professional.mobile}`;

});


// ================================
// WhatsApp Analytics
// ================================

const whatsappBtn = document.getElementById("whatsappBtn");

whatsappBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    await trackInteraction("whatsapp");

    window.open(
        `https://wa.me/91${professional.whatsapp}`,
        "_blank"
    );

});

    loadReviews();

    initializeReviewSystem();

}

async function loadReviews() {

    const reviewsContainer = document.getElementById("reviewsContainer");
    const averageRating = document.getElementById("averageRating");
    const reviewCount = document.getElementById("reviewCount");

    const q = query(

        collection(db, "reviews"),

        where("professionalId", "==", id)

    );

    const snapshot = await getDocs(q);

    reviewsContainer.innerHTML = "";

    if (snapshot.empty) {

        averageRating.textContent = "0.0";
        reviewCount.textContent = "0";

        reviewsContainer.innerHTML = `

            <div class="alert alert-light border">

                No reviews yet. Be the first to review!

            </div>

        `;

        return;

    }

    let totalRating = 0;
    let totalReviews = 0;

    const reviews = [];

    snapshot.forEach((docSnap) => {

        reviews.push(docSnap.data());

    });

    reviews.sort((a, b) => {

        if (!a.createdAt || !b.createdAt) return 0;

        return b.createdAt.seconds - a.createdAt.seconds;

    });

    reviews.forEach((review) => {

        totalRating += review.rating;
        totalReviews++;

        const stars =
            "★".repeat(review.rating) +
            "☆".repeat(5 - review.rating);

        reviewsContainer.innerHTML += `

            <div class="card shadow-sm mb-3 border-0">

                <div class="card-body">

                    <div class="d-flex justify-content-between">

                        <h6 class="fw-bold mb-1">

                            ${review.reviewerName}

                        </h6>

                        <span class="text-warning">

                            ${stars}

                        </span>

                    </div>

                    <p class="mb-0 mt-2">

                        ${review.comment}

                    </p>

                </div>

            </div>

        `;

    });

    averageRating.textContent =
        (totalRating / totalReviews).toFixed(1);

    reviewCount.textContent = totalReviews;

}

function initializeReviewSystem() {

    const reviewForm = document.getElementById("reviewForm");

    const reviewerName = document.getElementById("reviewerName");

    const reviewerMobile = document.getElementById("reviewerMobile");

    const comment = document.getElementById("comment");

    const stars = document.querySelectorAll(".star");

    const ratingInput = document.getElementById("rating");

    stars.forEach((star) => {

        star.addEventListener("click", () => {

            const value = Number(star.dataset.value);

            ratingInput.value = value;

            stars.forEach((s) => {

                if (Number(s.dataset.value) <= value) {

                    s.textContent = "★";
                    s.classList.add("text-warning");

                } else {

                    s.textContent = "☆";
                    s.classList.remove("text-warning");

                }

            });

        });

    });

    reviewForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (ratingInput.value === "") {

            alert("Please select a rating.");

            return;

        }

        const q = query(

            collection(db, "reviews"),

            where("professionalId", "==", id),

            where("reviewerMobile", "==", reviewerMobile.value)

        );

        const existing = await getDocs(q);

        if (!existing.empty) {

            alert("You have already reviewed this professional.");

            return;

        }

        // Save Review

await addDoc(

    collection(db, "reviews"),

    {

        professionalId: id,

        reviewerName: reviewerName.value,

        reviewerMobile: reviewerMobile.value,

        rating: Number(ratingInput.value),

        comment: comment.value,

        createdAt: serverTimestamp()

    }

);

// ================= UPDATE PROFESSIONAL RATING =================

const reviewsQuery = query(

    collection(db, "reviews"),

    where("professionalId", "==", id)

);

const reviewsSnapshot = await getDocs(reviewsQuery);

let totalStars = 0;
let totalReviews = 0;

reviewsSnapshot.forEach((docSnap) => {

    totalStars += docSnap.data().rating;

    totalReviews++;

});

const averageRating = totalStars / totalReviews;

await updateDoc(

    doc(db, "professionals", id),

    {

        averageRating: Number(averageRating.toFixed(1)),

        reviewCount: totalReviews

    }

);

        reviewForm.reset();

        ratingInput.value = "";

        stars.forEach((star) => {

            star.textContent = "☆";
            star.classList.remove("text-warning");

        });

        await loadReviews();

        alert("⭐⭐⭐⭐⭐ Thank you for your review!");

    });

}

loadProfile();