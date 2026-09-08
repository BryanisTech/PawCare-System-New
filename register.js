document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // MOBILE MENU
    // =====================================================

    const menuButton = document.getElementById("registerMenuButton");
    const mobileMenu = document.getElementById("registerMobileMenu");

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", function () {
            mobileMenu.classList.toggle("hidden");
        });

        mobileMenu.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {
                mobileMenu.classList.add("hidden");
            });

        });

    }


    // =====================================================
    // PASSWORD SHOW / HIDE
    // =====================================================

    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword =
        document.getElementById("toggleConfirmPassword");


    function togglePasswordVisibility(input) {

        if (input.type === "password") {
            input.type = "text";
        } else {
            input.type = "password";
        }

    }


    if (togglePassword) {

        togglePassword.addEventListener("click", function () {
            togglePasswordVisibility(password);
        });

    }


    if (toggleConfirmPassword) {

        toggleConfirmPassword.addEventListener("click", function () {
            togglePasswordVisibility(confirmPassword);
        });

    }


    // =====================================================
    // PET PHOTO UPLOAD
    // =====================================================

    const petPhoto = document.getElementById("petPhoto");
    const choosePhotoButton =
        document.getElementById("choosePhotoButton");

    const photoFileName =
        document.getElementById("photoFileName");

    const photoPreview =
        document.getElementById("photoPreview");

    const photoPreviewContainer =
        document.getElementById("photoPreviewContainer");


    if (choosePhotoButton && petPhoto) {

        choosePhotoButton.addEventListener("click", function () {
            petPhoto.click();
        });

    }


    if (petPhoto) {

        petPhoto.addEventListener("change", function () {

            const file = petPhoto.files[0];

            if (!file) {
                return;
            }


            // Only allow image files
            if (!file.type.startsWith("image/")) {

                alert("Please choose an image file.");

                petPhoto.value = "";
                return;
            }


            photoFileName.textContent = file.name;


            // Create preview
            const reader = new FileReader();

            reader.onload = function (event) {

                photoPreview.src = event.target.result;

                photoPreviewContainer.classList.remove("hidden");

            };

            reader.readAsDataURL(file);

        });

    }


    // =====================================================
    // PASSWORD VALIDATION
    // =====================================================

    const passwordError =
        document.getElementById("passwordError");

    const confirmPasswordError =
        document.getElementById("confirmPasswordError");


    function makeRed(input) {

        input.classList.remove(
            "border-gray-300",
            "border-green-500"
        );

        input.classList.add(
            "border-red-500",
            "ring-1",
            "ring-red-200"
        );

    }


    function makeNormal(input) {

        input.classList.remove(
            "border-red-500",
            "border-green-500",
            "ring-1",
            "ring-red-200",
            "ring-green-100"
        );

        input.classList.add("border-gray-300");

    }


    function makeGreen(input) {

        input.classList.remove(
            "border-gray-300",
            "border-red-500",
            "ring-red-200"
        );

        input.classList.add(
            "border-green-500",
            "ring-1",
            "ring-green-100"
        );

    }


    function validatePassword() {

        const value = password.value;

        if (value.length === 0) {

            makeNormal(password);
            passwordError.classList.add("hidden");

            return false;

        }


        if (value.length < 8) {

            makeRed(password);

            passwordError.textContent =
                "Password must contain at least 8 characters.";

            passwordError.classList.remove("hidden");

            return false;

        }


        makeNormal(password);
        passwordError.classList.add("hidden");

        return true;

    }


    function validateConfirmPassword() {

        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;


        // Nothing typed yet
        if (confirmValue.length === 0) {

            makeNormal(confirmPassword);
            confirmPasswordError.classList.add("hidden");

            return false;

        }


        // Passwords do not match
        if (passwordValue !== confirmValue) {

            makeRed(confirmPassword);

            confirmPasswordError.textContent =
                "Passwords do not match.";

            confirmPasswordError.classList.remove("hidden");

            return false;

        }


        // Matching but password itself is too short
        if (passwordValue.length < 8) {

            makeRed(confirmPassword);

            confirmPasswordError.textContent =
                "Password must contain at least 8 characters.";

            confirmPasswordError.classList.remove("hidden");

            return false;

        }


        // Correct match
        makeGreen(confirmPassword);

        confirmPasswordError.classList.add("hidden");

        return true;

    }


    // Check password while typing
    password.addEventListener("input", function () {

        validatePassword();

        // If user already typed confirm password,
        // re-check it when original password changes.
        if (confirmPassword.value.length > 0) {
            validateConfirmPassword();
        }

    });


    // Check confirmation while typing
    confirmPassword.addEventListener(
        "input",
        validateConfirmPassword
    );


    // =====================================================
    // FORM VALIDATION
    // =====================================================

    const registerForm =
        document.getElementById("registerForm");

    const terms =
        document.getElementById("terms");

    const termsError =
        document.getElementById("termsError");


    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        let formIsValid = true;


        // -------------------------------------------------
        // CHECK NORMAL REQUIRED FIELDS
        // -------------------------------------------------

        const requiredFields =
            registerForm.querySelectorAll(
                ".form-input[required]"
            );


        requiredFields.forEach(function (field) {

            if (!field.value.trim()) {

                makeRed(field);

                formIsValid = false;

            } else {

                makeNormal(field);

            }

        });


        // -------------------------------------------------
        // PASSWORD EMPTY
        // -------------------------------------------------

        if (password.value.trim() === "") {

            makeRed(password);

            passwordError.textContent =
                "Password is required.";

            passwordError.classList.remove("hidden");

            formIsValid = false;

        } else if (!validatePassword()) {

            formIsValid = false;

        }


        // -------------------------------------------------
        // CONFIRM PASSWORD EMPTY
        // -------------------------------------------------

        if (confirmPassword.value.trim() === "") {

            makeRed(confirmPassword);

            confirmPasswordError.textContent =
                "Please confirm your password.";

            confirmPasswordError.classList.remove("hidden");

            formIsValid = false;

        } else if (!validateConfirmPassword()) {

            formIsValid = false;

        }


        // -------------------------------------------------
        // TERMS
        // -------------------------------------------------

        if (!terms.checked) {

            termsError.classList.remove("hidden");
            formIsValid = false;

        } else {

            termsError.classList.add("hidden");

        }


        // -------------------------------------------------
        // STOP IF INVALID
        // -------------------------------------------------

        if (!formIsValid) {

            const firstError =
                registerForm.querySelector(
                    ".border-red-500"
                );

            if (firstError) {

                firstError.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                firstError.focus();

            }

            return;

        }


        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        alert("Account information is valid!");

        /*
            Backend/database integration will go here later.

            For example:
            fetch(...)
        */

    });


    // =====================================================
    // REMOVE RED BORDER WHEN USER FIXES NORMAL INPUTS
    // =====================================================

    const normalInputs =
        registerForm.querySelectorAll(".form-input");


    normalInputs.forEach(function (input) {

        input.addEventListener("input", function () {

            if (input.value.trim()) {
                makeNormal(input);
            }

        });

        input.addEventListener("change", function () {

            if (input.value) {
                makeNormal(input);
            }

        });

    });


    // Remove Terms error once checked
    terms.addEventListener("change", function () {

        if (terms.checked) {
            termsError.classList.add("hidden");
        }

    });

});