document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // MOBILE MENU
    // =========================

    const menuButton = document.getElementById("loginMenuButton");
    const mobileMenu = document.getElementById("loginMobileMenu");

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", function () {
            mobileMenu.classList.toggle("hidden");
        });

    }


    // =========================
    // PASSWORD SHOW / HIDE
    // =========================

   const password = document.getElementById("password");
const passwordToggle = document.getElementById("togglePassword");
const passwordEye = document.getElementById("passwordEye");

if (password && passwordToggle && passwordEye) {

    passwordToggle.addEventListener("click", function () {

        if (password.type === "password") {

            // SHOW PASSWORD
            password.type = "text";

            passwordEye.classList.remove("fa-eye");
            passwordEye.classList.add("fa-eye-slash");

            passwordToggle.setAttribute("aria-label", "Hide password");

        } else {

            // HIDE PASSWORD
            password.type = "password";

            passwordEye.classList.remove("fa-eye-slash");
            passwordEye.classList.add("fa-eye");

            passwordToggle.setAttribute("aria-label", "Show password");

        }

    });

}

});