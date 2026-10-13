
document.addEventListener("DOMContentLoaded", function () {
    // 1. GET ELEMENTS
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        console.error("Registration form not found.");
        return;
    }

    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const addressInput = document.getElementById("address");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const petNameInput = document.getElementById("petName");
    const petTypeInput = document.getElementById("petType");
    const breedInput = document.getElementById("breed");
    const genderInput = document.getElementById("gender");
    const birthdayInput = document.getElementById("birthday");
    const petPhotoInput = document.getElementById("petPhoto");

    const termsCheckbox = document.getElementById("terms");
    const termsError = document.getElementById("termsError");

    // 2. MODAL ELEMENTS
    const registerMessageModal =
        document.getElementById("registerMessageModal");
    const registerModalTitle =
        document.getElementById("registerModalTitle");
    const registerModalMessage =
        document.getElementById("registerModalMessage");
    const registerModalIcon =
        document.getElementById("registerModalIcon");
    const registerModalOk =
        document.getElementById("registerModalOk");

    let registerModalCallback = null;

    // SHOW MODAL IN FRONT OF THE PAGE
    function showRegisterModal(message, type = "error", callback = null) {
        if (
            !registerMessageModal ||
            !registerModalTitle ||
            !registerModalMessage ||
            !registerModalIcon
        ) {
            console.error("Registration modal elements are missing:", message);
            return;
        }

        registerModalCallback = callback;

        if (type === "success") {
            registerModalTitle.textContent = "Success!";
            registerModalIcon.textContent = "✓";
            registerModalIcon.className =
                "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600";
        } else {
            registerModalTitle.textContent = "Registration Error";
            registerModalIcon.textContent = "!";
            registerModalIcon.className =
                "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600";
        }

        registerModalMessage.textContent = message;

        // Force the modal to overlay the entire page.
        registerMessageModal.classList.remove("hidden");
        registerMessageModal.classList.add("flex");
        registerMessageModal.style.display = "flex";
        registerMessageModal.style.position = "fixed";
        registerMessageModal.style.inset = "0";
        registerMessageModal.style.zIndex = "99999";
        registerMessageModal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

        if (registerModalOk) {
            registerModalOk.focus();
        }
    }

    function showRegisterError(message) {
        showRegisterModal(message, "error");
    }

    function showRegisterSuccess(message, callback = null) {
        showRegisterModal(message, "success", callback);
    }

    function closeRegisterModal() {
        if (!registerMessageModal) return;

        registerMessageModal.classList.add("hidden");
        registerMessageModal.classList.remove("flex");
        registerMessageModal.style.display = "none";

        const callback = registerModalCallback;
        registerModalCallback = null;

        if (callback) callback();
    }

    function clearRegisterMessages() {
        if (registerMessageModal) {
            registerMessageModal.classList.add("hidden");
            registerMessageModal.classList.remove("flex");
            registerMessageModal.style.display = "none";
        }

        registerModalCallback = null;

        if (termsError) {
            termsError.textContent = "";
            termsError.classList.add("hidden");
        }
    }

    if (registerModalOk) {
        registerModalOk.addEventListener("click", closeRegisterModal);
    }

    if (registerMessageModal) {
        registerMessageModal.addEventListener("click", function (event) {
            if (event.target === registerMessageModal) {
                closeRegisterModal();
            }
        });
    }

    // 3. MOBILE MENU
    const menuButton = document.getElementById("registerMenuButton");
    const mobileMenu = document.getElementById("registerMobileMenu");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", function () {
            mobileMenu.classList.toggle("hidden");
        });
    }

    // 4. SHOW / HIDE PASSWORD
    function setupPasswordToggle(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);

        if (!input || !button) return;

        button.addEventListener("click", function (event) {
            event.preventDefault();
            input.type = input.type === "password" ? "text" : "password";

            button.setAttribute(
                "aria-label",
                input.type === "password" ? "Show password" : "Hide password"
            );
        });
    }

    setupPasswordToggle("password", "togglePassword");
    setupPasswordToggle("confirmPassword", "toggleConfirmPassword");

    document.querySelectorAll("[data-toggle-password]").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const input = document.getElementById(
                button.getAttribute("data-toggle-password")
            );

            if (input) {
                input.type = input.type === "password" ? "text" : "password";
            }
        });
    });

    // 5. PET PHOTO PREVIEW
    const choosePhotoButton = document.getElementById("choosePhotoButton");
    const photoFileName = document.getElementById("photoFileName");
    const photoPreview = document.getElementById("photoPreview");
    const photoPreviewContainer =
        document.getElementById("photoPreviewContainer");

    let previewUrl = null;

    if (choosePhotoButton && petPhotoInput) {
        choosePhotoButton.addEventListener("click", function () {
            petPhotoInput.click();
        });
    }

    if (petPhotoInput) {
        petPhotoInput.addEventListener("change", function () {
            const file = petPhotoInput.files[0];

            clearRegisterMessages();

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                previewUrl = null;
            }

            if (!file) {
                if (photoFileName) photoFileName.textContent = "No file chosen";
                if (photoPreviewContainer) {
                    photoPreviewContainer.classList.add("hidden");
                }
                return;
            }

            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

            if (!allowedTypes.includes(file.type)) {
                petPhotoInput.value = "";
                if (photoFileName) photoFileName.textContent = "No file chosen";
                if (photoPreviewContainer) {
                    photoPreviewContainer.classList.add("hidden");
                }

                showRegisterError("Please select a JPG, PNG, or WEBP image.");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                petPhotoInput.value = "";
                if (photoFileName) photoFileName.textContent = "No file chosen";
                if (photoPreviewContainer) {
                    photoPreviewContainer.classList.add("hidden");
                }

                showRegisterError("The pet photo must be 5 MB or smaller.");
                return;
            }

            if (photoFileName) photoFileName.textContent = file.name;

            if (photoPreview) {
                previewUrl = URL.createObjectURL(file);
                photoPreview.src = previewUrl;
                photoPreview.alt = "Preview of your pet photo";
            }

            if (photoPreviewContainer) {
                photoPreviewContainer.classList.remove("hidden");
            }
        });
    }

    // 6. PASSWORD VALIDATION
    function validatePassword() {
        if (!passwordInput) return true;

        if (passwordInput.value.length < 8) {
            passwordInput.setCustomValidity(
                "Password must contain at least 8 characters."
            );
            return false;
        }

        passwordInput.setCustomValidity("");
        return true;
    }

    function validateConfirmPassword() {
        if (!passwordInput || !confirmPasswordInput) return true;

        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("Passwords do not match.");
            return false;
        }

        confirmPasswordInput.setCustomValidity("");
        return true;
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", function () {
            validatePassword();
            validateConfirmPassword();
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener("input", validateConfirmPassword);
    }

    // 7. REGISTER OWNER AND PET
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        clearRegisterMessages();

        // Validate required fields without browser popup messages.
        const requiredFields = registerForm.querySelectorAll(
            "input[required], select[required], textarea[required]"
        );

        for (const field of requiredFields) {
            if (field.type === "checkbox" || field.type === "file") continue;

            if (!field.value.trim()) {
                showRegisterError("Please complete all required fields.");
                field.focus();
                return;
            }

            if (!field.checkValidity()) {
                showRegisterError(
                    field.type === "email"
                        ? "Please enter a valid email address."
                        : "Please check the information you entered."
                );
                field.focus();
                return;
            }
        }

        if (!validatePassword()) {
            showRegisterError("Password must contain at least 8 characters.");
            passwordInput.focus();
            return;
        }

        if (!validateConfirmPassword()) {
            showRegisterError("Your passwords do not match.");
            confirmPasswordInput.focus();
            return;
        }

        if (termsCheckbox && !termsCheckbox.checked) {
            if (termsError) {
                termsError.textContent = "Please accept the terms and conditions.";
                termsError.classList.remove("hidden");
            }

            showRegisterError("Please accept the terms and conditions.");
            return;
        }

        if (typeof supabaseClient === "undefined") {
            showRegisterError(
                "Supabase is not loaded. Please check js/supabase.js."
            );
            return;
        }

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();

        const petName = petNameInput ? petNameInput.value.trim() : "";
        const species = petTypeInput ? petTypeInput.value : "";
        const breed = breedInput ? breedInput.value.trim() : "";
        const gender = genderInput ? genderInput.value : "";
        const dateOfBirth = birthdayInput ? birthdayInput.value : "";
        const photoFile = petPhotoInput ? petPhotoInput.files[0] : null;

        const submitButton = registerForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        const originalButtonText = submitButton
            ? submitButton.tagName === "INPUT"
                ? submitButton.value
                : submitButton.textContent
            : "";

        if (submitButton) {
            submitButton.disabled = true;

            if (submitButton.tagName === "INPUT") {
                submitButton.value = "Creating Account...";
            } else {
                submitButton.textContent = "Creating Account...";
            }
        }

        let uploadedPhotoPath = null;

        try {
            // STEP 1: CREATE OWNER AUTH ACCOUNT
            const { data, error: signupError } =
                await supabaseClient.auth.signUp({
                    email: email,
                    password: passwordInput.value,
                    options: {
                        data: { full_name: fullName }
                    }
                });

            if (signupError) throw signupError;

            if (!data.user) {
                throw new Error("Unable to create the user account.");
            }

            const ownerId = data.user.id;

            // Email confirmation may mean there is no active session.
            if (!data.session) {
                showRegisterSuccess(
                    "Your account was created. Please verify your email. " +
                    "Your pet details have not been saved yet."
                );
                return;
            }

            // STEP 2: SAVE OWNER PROFILE
            const { error: profileError } = await supabaseClient
                .from("profiles")
                .insert({
                    id: ownerId,
                    full_name: fullName,
                    phone_number: phone,
                    address: address,
                    role: "pet_owner"
                });

            if (profileError) throw profileError;

            // STEP 3: UPLOAD OPTIONAL PET PHOTO
            let photoUrl = null;

            if (photoFile) {
                const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

                if (!allowedTypes.includes(photoFile.type)) {
                    throw new Error("Please select a JPG, PNG, or WEBP pet photo.");
                }

                if (photoFile.size > 5 * 1024 * 1024) {
                    throw new Error("The pet photo must be 5 MB or smaller.");
                }

                const extension = photoFile.name.split(".").pop().toLowerCase();

                uploadedPhotoPath =
                    `${ownerId}/${crypto.randomUUID()}.${extension}`;

                const { error: uploadError } = await supabaseClient
                    .storage
                    .from("pets")
                    .upload(uploadedPhotoPath, photoFile);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabaseClient
                    .storage
                    .from("pets")
                    .getPublicUrl(uploadedPhotoPath);

                photoUrl = urlData.publicUrl;
            }

            // STEP 4: SAVE PET
            const { error: petError } = await supabaseClient
                .from("pets")
                .insert({
                    owner_id: ownerId,
                    pet_name: petName,
                    species: species,
                    breed: breed || null,
                    gender: gender || null,
                    date_of_birth: dateOfBirth || null,
                    photo_url: photoUrl
                });

            if (petError) throw petError;

            // STEP 5: SHOW SUCCESS MODAL IN FRONT
            showRegisterSuccess(
                "Account and pet registered successfully!",
                function () {
                    window.location.href = "login.html";
                }
            );

        } catch (error) {
            console.error("Registration error:", error);

            if (uploadedPhotoPath) {
                const { error: cleanupError } = await supabaseClient
                    .storage
                    .from("pets")
                    .remove([uploadedPhotoPath]);

                if (cleanupError) {
                    console.error("Photo cleanup error:", cleanupError);
                }
            }

            showRegisterError(
                "Registration could not be completed: " +
                (error.message || "An unexpected error occurred.")
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;

                if (submitButton.tagName === "INPUT") {
                    submitButton.value = originalButtonText;
                } else {
                    submitButton.textContent = originalButtonText;
                }
            }
        }
    });
});
