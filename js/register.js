import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", async (event) => {

    event.preventDefault();

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

        status: "Pending",

        createdAt: serverTimestamp()

    };

    try {

        await addDoc(collection(db, "professionals"), data);

        alert("Application Submitted Successfully!");

        console.log("Saved to Firestore");

    }

    catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

});