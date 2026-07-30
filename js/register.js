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
// Compress Image Before Upload
// ================================

async function compressImage(file) {

    return new Promise((resolve) => {

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (event) => {

            const img = new Image();

            img.src = event.target.result;

            img.onload = () => {

                const canvas = document.createElement("canvas");

                const MAX_SIZE = 800;

                let width = img.width;
                let height = img.height;

                if (width > height) {

                    if (width > MAX_SIZE) {

                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;

                    }

                } else {

                    if (height > MAX_SIZE) {

                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;

                    }

                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(

                    (blob) => {

                        resolve(blob);

                    },

                    "image/jpeg",

                    0.75

                );

            };

        };

    });

}

// ================================
// Upload Profile Photo to Cloudinary
// ================================

async function uploadProfilePhoto(file) {

    if (!file) {
        return "";
    }

    // Compress image before uploading
    const compressedImage = await compressImage(file);

    console.log(
    "Compressed Image Size:",
    (compressedImage.size / 1024).toFixed(2),
    "KB"
);

    const formData = new FormData();

        formData.append("file", compressedImage, "profile.jpg");

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