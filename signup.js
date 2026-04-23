document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    // IIFE
    (function(){
        console.log("Signup Page Loaded");
    })();

    // Closure (signup attempts)
    function signupCounter(){
        let count = 0;
        return function(){
            count++;
            return count;
        }
    }

    const trackSignup = signupCounter();

    // Function Constructor
    function User(name, mobile, email, password) {
        this.name = name;
        this.mobile = mobile;
        this.email = email;
        this.password = password;

        this.getUserDetails = function () {
            return this.name + " | " + this.email;
        };
    }

    // this + call
    function displayUser(prefix) {
        console.log(prefix + this.name + " - " + this.email);
    }

    // Rest Parameter
    function sumDigits(){
        let sum = 0;
        for(let i=0;i<arguments.length;i++){
            sum += arguments[i];
        }
        return sum;
    }

    // Spread
    function showMax(){
        const nums = [10,20,30];
        console.log("Max:", Math.max.apply(null, nums));
    }

    function showError(input, message) {
        input.classList.add("error-border");
        input.nextElementSibling.textContent = message;
    }

    function clearError(input) {
        input.classList.remove("error-border");
        input.nextElementSibling.textContent = "";
    }

    const allInputs = form.querySelectorAll("input[type='text'], input[type='tel'], input[type='email'], input[type='password']");

    allInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            clearError(input);
        });
    });

    form.addEventListener("reset", function () {
        allInputs.forEach(clearError);
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Closure usage
        const attempts = trackSignup();
        alert("Signup attempt: " + attempts);

        const name            = form.querySelector("input[type='text']");
        const mobile          = form.querySelector("input[type='tel']");
        const email           = form.querySelector("input[type='email']");
        const password        = form.querySelector("#password");
        const confirmPassword = form.querySelector("#confirm-password");

        let valid = true;

        const nameVal = name.value.trim();
        if (nameVal === "") {
            showError(name, "Name is required.");
            valid = false;
        } else if (nameVal.length < 10) {
            showError(name, "Name must be at least 10 characters.");
            valid = false;
        } else if (nameVal.length > 50) {
            showError(name, "Name must be no more than 50 characters.");
            valid = false;
        } else {
            clearError(name);
        }

        const mobilePattern = /^[0-9]{10}$/;
        if (mobile.value.trim() === "") {
            showError(mobile, "Mobile number is required.");
            valid = false;
        } else if (!mobilePattern.test(mobile.value.trim())) {
            showError(mobile, "Mobile number must be exactly 10 digits.");
            valid = false;
        } else {
            clearError(mobile);
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === "") {
            showError(email, "Email address is required.");
            valid = false;
        } else if (!emailPattern.test(email.value.trim())) {
            showError(email, "Please enter a valid email address.");
            valid = false;
        } else {
            clearError(email);
        }

        const passwordPattern = /^(?=.*[0-9])(?=.*[A-Z]).{6,}$/;
        if (password.value.trim() === "") {
            showError(password, "Password is required.");
            valid = false;
        } else if (!passwordPattern.test(password.value.trim())) {
            showError(password, "Password must be 6+ characters with a number and an uppercase letter.");
            valid = false;
        } else {
            clearError(password);
        }

        if (confirmPassword.value.trim() === "") {
            showError(confirmPassword, "Please confirm your password.");
            valid = false;
        } else if (confirmPassword.value !== password.value) {
            showError(confirmPassword, "Passwords do not match.");
            valid = false;
        } else {
            clearError(confirmPassword);
        }

        if (valid) {

            const user = new User(
                name.value,
                mobile.value,
                email.value,
                password.value
            );

            localStorage.setItem("username", user.name);
            localStorage.setItem("userEmail", user.email);

            console.log(user.getUserDetails());

            displayUser.call(user, "User: ");

            // Rest + Spread usage
            console.log("Sum:", sumDigits(1,2,3,4));
            showMax();

            window.location.href = "watch.htm";
        }
    });

});