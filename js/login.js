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

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Login using Supabase Auth
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert("Invalid email or password.");
        return;
    }

    // Get the user's role from profiles
    const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

    if (profileError) {
        alert("Could not find your user profile.");
        console.log(profileError);
        return;
    }

    // Redirect based on role
    if (profile.role === "admin") {
        window.location.href = "admin/dashboard.html";
    } 
    else if (profile.role === "veterinarian") {
        window.location.href = "veterinarian/dashboard.html";
    } 
    else if (profile.role === "pet_owner") {
        window.location.href = "dashboard.html";
    }
});