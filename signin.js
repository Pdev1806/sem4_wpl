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

        return function () {
            count++;
            return count;
        };
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

    form.querySelectorAll("input[type='email'], input[type='password']").forEach(function (input) {
        input.addEventListener("input", function () {
            clearError(input);
        });
    });

    form.addEventListener("reset", function () {
        form.querySelectorAll("input[type='email'], input[type='password']").forEach(clearError);
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const attempts = trackAttempts();
        alert("Login attempt: " + attempts);
        const email    = form.querySelector("input[type='email']");
        const password = form.querySelector("input[type='password']");

        let valid = true;

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

        const passwordPattern = /^(?=.*[0-9]).{6,}$/;
        if (password.value.trim() === "") {
            showError(password, "Password is required.");
            valid = false;
        } else if (!passwordPattern.test(password.value.trim())) {
            showError(password, "Password must be at least 6 characters and contain a number.");
            valid = false;
        } else {
            clearError(password);
        }

        if (valid) {
            window.location.href = "watch.htm";
        }
    });

});