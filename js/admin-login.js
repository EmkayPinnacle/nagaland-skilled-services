import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Login Successful!");
        sessionStorage.setItem("adminLoggedIn", "true");
        window.location.href = "admin-dashboard.html";

    }

    catch (error) {

        console.error(error);

        alert("Invalid Email or Password");

    }

});