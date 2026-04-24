function greet(city){
    return this.name + " login from " + city;
}
const person = { name:"User" };
console.log(
    greet.call(person,"Mumbai"),
    greet.apply(person,["Delhi"]),
    greet.bind(person,"Pune")()
);

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    function loginAttempts() {
        let count = 0;
        return function () { count++; return count; };
    }
    const trackAttempts = loginAttempts();

    function showError(input, message) {
        input.classList.add("error-border");
        input.nextElementSibling.textContent = message;
    }
    function clearError(input) {
        input.classList.remove("error-border");
        input.nextElementSibling.textContent = "";
    }

    form.querySelectorAll("input[type='email'], input[type='password']").forEach(function(input) {
        input.addEventListener("input", function() { clearError(input); });
    });
    form.addEventListener("reset", function() {
        form.querySelectorAll("input[type='email'], input[type='password']").forEach(clearError);
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const attempts = trackAttempts();
        alert("Login attempt: " + attempts);

        const emailInput    = form.querySelector("input[type='email']");
        const passwordInput = form.querySelector("input[type='password']");
        let valid = true;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === "") {
            showError(emailInput, "Email address is required.");
            valid = false;
        } else if (!emailPattern.test(emailInput.value.trim())) {
            showError(emailInput, "Please enter a valid email address.");
            valid = false;
        } else {
            clearError(emailInput);
        }

        const passwordPattern = /^(?=.*[0-9]).{6,}$/;
        if (passwordInput.value.trim() === "") {
            showError(passwordInput, "Password is required.");
            valid = false;
        } else if (!passwordPattern.test(passwordInput.value.trim())) {
            showError(passwordInput, "Password must be at least 6 characters and contain a number.");
            valid = false;
        } else {
            clearError(passwordInput);
        }

        if (valid) {
            const storedEmail    = localStorage.getItem("userEmail");
            const storedPassword = localStorage.getItem("userPassword");
            const storedName     = localStorage.getItem("username");

            if (!storedEmail || !storedPassword) {
                showError(emailInput, "No account found. Please sign up first.");
                valid = false;
            } else if (emailInput.value.trim() !== storedEmail) {
                showError(emailInput, "Email not found. Please check or sign up.");
                valid = false;
            } else if (passwordInput.value.trim() !== storedPassword) {
                showError(passwordInput, "Incorrect password.");
                valid = false;
            } else {
                localStorage.setItem("username", storedName);
                window.location.href = "watch.htm";
            }
        }
    });

});
