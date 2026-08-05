import { db } from "./firebase.js";
import { getProfileImage } from "./utils.js";
import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const container = document.getElementById("featuredProfessionals");

// ================= STAR FUNCTION =================

function getStars(rating) {

    if (!rating) {

        return "☆☆☆☆☆";

    }

    const fullStars = Math.round(rating);

    return "★".repeat(fullStars) +
           "☆".repeat(5 - fullStars);

}

// ================= LOAD PROFESSIONALS =================

async function loadFeaturedProfessionals() {

    const q = query(
        collection(db, "professionals"),
        where("status", "==", "Verified")
    );

    const snapshot = await getDocs(q);

    let professionals = [];

    snapshot.forEach((docSnap) => {

        professionals.push({

            id: docSnap.id,
            ...docSnap.data()

        });

    });

    // Sort by rating (highest first)

    professionals.sort((a, b) => {

        return (b.averageRating || 0) - (a.averageRating || 0);

    });

    // Show only Top 3

    professionals = professionals.slice(0, 3);

    container.innerHTML = "";

    professionals.forEach((professional) => {

        container.innerHTML += `

        <div class="col-lg-4">

            <div class="professional-card">

                <img
                    src="${professional.photoUrl || getProfileImage(professional.profession)}"
                    class="professional-photo">

                <div class="verified">

                    ✔ Verified

                </div>

                <h4>

                    ${professional.fullName}

                </h4>

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

                        ${professional.experience} Years

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

}

loadFeaturedProfessionals();