import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


// ================================
// Cloudinary Configuration
// ================================

const CLOUD_NAME = "u6mqjpm6";
const UPLOAD_PRESET = "nss_uploads";

// ================================
// Upload Profile Photo to Cloudinary
// ================================

async function uploadProfilePhoto(file) {

    if (!file) {
        return "";
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error("Image upload failed.");
    }

    const result = await response.json();

    return result.secure_url;
}

const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", async (event) => {

    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Uploading...";

    // Get selected profile photo
const profilePhoto = document.getElementById("profilePhoto").files[0];

// Upload profile photo to Cloudinary
const photoUrl = await uploadProfilePhoto(profilePhoto);

    const data = {

        fullName: document.getElementById("fullName").value,

        mobile: document.getElementById("mobile").value,

        email: document.getElementById("email").value,

        whatsapp: document.getElementById("whatsapp").value,

        profession: document.getElementById("profession").value,

        experience: document.getElementById("experience").value,

        bio: document.getElementById("bio").value,

        district: document.getElementById("district").value,

        areas: document.getElementById("areas").value,

        address: document.getElementById("address").value,

        photoUrl: photoUrl,

        status: "Pending",

        createdAt: serverTimestamp()

    };

    try {

        await addDoc(collection(db, "professionals"), data);

        alert("Application Submitted Successfully!");
        
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit";

        console.log("Saved to Firestore");

    }

    catch (error) {

        console.error(error);

        alert("Something went wrong.");

        submitBtn.disabled = false;
        submitBtn.innerText = "Submit";

    }

});