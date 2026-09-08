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

    const password = document.getElementById("loginPassword");
    const passwordToggle = document.getElementById("passwordToggle");

    if (password && passwordToggle) {

        passwordToggle.addEventListener("click", function () {

            if (password.type === "password") {
                password.type = "text";
            } else {
                password.type = "password";
            }

        });

    }

});