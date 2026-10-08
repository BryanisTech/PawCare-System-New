async function loadUserProfile() {

    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error) {
        console.log("User error:", error);
        return;
    }

    if (user) {

        // Get profile information from Supabase
        const { data: profile, error: profileError } = await supabaseClient
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

        if (profileError) {
            console.log("Profile error:", profileError);
            return;
        }

        document.getElementById("fullName").textContent = profile.full_name;

        const welcomeName = document.getElementById("welcomeName");

        if (welcomeName) {
            welcomeName.textContent = profile.full_name;
        }

        document.getElementById("dropdownUsername").textContent = profile.full_name;

        document.getElementById("userEmail").textContent = user.email;
            }
}


// ========================================
// PROFILE DROPDOWN
// ========================================

const profileButton = document.getElementById("profileButton");
const profileDropdown = document.getElementById("profileDropdown");
const profileArrow = document.getElementById("profileArrow");

profileButton.addEventListener("click", function () {

    profileDropdown.classList.toggle("hidden");

    profileArrow.classList.toggle("rotate-180");

});


// ========================================
// RUN PROFILE
// ========================================

loadUserProfile();