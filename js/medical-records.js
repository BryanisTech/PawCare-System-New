
    const medicalTabs = document.querySelectorAll(".medical-tab");
    const medicalContents = document.querySelectorAll(".medical-content");

    function showMedicalTab(tabId) {
        medicalContents.forEach(section => {
            section.classList.toggle("hidden", section.id !== tabId);
        });

        medicalTabs.forEach(tab => {
            const active = tab.dataset.tab === tabId;

            tab.classList.toggle("bg-pink-500", active);
            tab.classList.toggle("text-white", active);
            tab.classList.toggle("font-semibold", active);

            tab.classList.toggle("text-gray-600", !active);
            tab.classList.toggle("font-medium", !active);
        });
    }

    medicalTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            showMedicalTab(tab.dataset.tab);
        });
    });

    showMedicalTab("consultations");

    
async function loadMedicalPetPhoto() {
    const params = new URLSearchParams(window.location.search);
    const petId = params.get("id");

    const photo = document.getElementById("medicalPetPhoto");

    if (!petId) {
        console.error("No pet ID found in the URL.");
        return;
    }

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        console.error("Could not get logged-in user:", userError);
        return;
    }

    const { data: pet, error } = await supabaseClient
        .from("pets")
        .select("pet_name, photo_url")
        .eq("id", petId)
        .eq("owner_id", user.id)
        .single();

    if (error || !pet) {
        console.error("Could not load pet:", error);
        return;
    }

    photo.src = pet.photo_url || "./images/default-pet.png";
    photo.alt = pet.pet_name || "Pet photo";
}


loadMedicalPetPhoto();

async function loadPetInformation() {
    const params = new URLSearchParams(window.location.search);
    const petId = params.get("id");

    if (!petId) {
        document.getElementById("medicalPetName").textContent =
            "No pet selected";
        return;
    }

    const { data: { user }, error: authError } =
        await supabaseClient.auth.getUser();

    if (authError || !user) {
        document.getElementById("medicalPetName").textContent =
            "Please log in first";
        return;
    }

    const { data: pet, error } = await supabaseClient
        .from("pets")
        .select("pet_name, species, breed, gender, date_of_birth, weight, photo_url")
        .eq("id", petId)
        .eq("owner_id", user.id)
        .single();

    if (error || !pet) {
        console.error("Error loading pet:", error);
        document.getElementById("medicalPetName").textContent =
            "Pet information not found";
        return;
    }

    document.getElementById("medicalPetName").textContent =
        pet.pet_name || "Not provided";

    document.getElementById("medicalPetSpecies").textContent =
        pet.species || "Not provided";

    document.getElementById("medicalPetBreed").textContent =
        pet.breed || "Not provided";

    document.getElementById("medicalPetGender").textContent =
        pet.gender || "Not provided";

  document.getElementById("medicalPetAge").textContent =
    calculateAge(pet.date_of_birth);

    document.getElementById("medicalPetWeight").textContent =
        pet.weight != null ? `${pet.weight} kg` : "Not provided";

    const photo = document.getElementById("medicalPetPhoto");

    photo.onerror = function () {
        this.onerror = null;
        this.src = "./images/default-pet.png";
    };

    photo.src = pet.photo_url || "./images/default-pet.png";
}

loadPetInformation();

async function loadMedicalOwnerName() {
    const ownerNameElement = document.getElementById("medicalOwnerName");

    try {
        // Get the currently logged-in user
        const {
            data: { user },
            error: authError
        } = await supabaseClient.auth.getUser();

        if (authError || !user) {
            ownerNameElement.textContent = "Not logged in";
            return;
        }

        // Get the user's name from the profiles table
        const { data: profile, error } = await supabaseClient
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

        if (error) {
            throw error;
        }

        ownerNameElement.textContent = profile.full_name || "Name unavailable";

    } catch (error) {
        console.error("Error loading owner name:", error);
        ownerNameElement.textContent = "Name unavailable";
    }
}

loadMedicalOwnerName();


