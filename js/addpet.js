
// ========================================
// OTHER SPECIES INPUT TOGGLE
// ========================================

const species = document.getElementById("species");
const customSpecies = document.getElementById("customSpecies");

species.addEventListener("change", function () {
    if (species.value === "Other") {
        species.classList.add("hidden");
        customSpecies.classList.remove("hidden");
        customSpecies.focus();
    } else {
        species.classList.remove("hidden");
        customSpecies.classList.add("hidden");
        customSpecies.value = "";
    }
});

customSpecies.addEventListener("blur", function () {
    if (customSpecies.value.trim() === "") {
        customSpecies.value = "";
        customSpecies.classList.add("hidden");
        species.classList.remove("hidden");
        species.value = "";
    }
});


// ========================================
// SAVE PET CONFIRMATION MODAL
// ========================================

const savePetModal = document.getElementById("savePetModal");
const savePetName = document.getElementById("savePetName");
const cancelSavePet = document.getElementById("cancelSavePet");
const okaySavePet = document.getElementById("okaySavePet");
const savePetButton = document.getElementById("savePetButton");

function openSavePetModal(petName) {
    savePetName.textContent = petName || "this pet";
    savePetModal.classList.remove("hidden");
    savePetModal.classList.add("flex");
}

function closeSavePetModal() {
    savePetModal.classList.add("hidden");
    savePetModal.classList.remove("flex");
}

cancelSavePet.addEventListener("click", function () {
    closeSavePetModal();
});


// ========================================
// CALCULATE PET AGE
// ========================================

const dateOfBirth = document.getElementById("dateOfBirth");
const age = document.getElementById("age");

dateOfBirth.addEventListener("change", function () {
    if (!dateOfBirth.value) {
        age.value = "";
        return;
    }

    const birthDate = new Date(dateOfBirth.value + "T00:00:00");
    const today = new Date();

    if (birthDate > today) {
        age.value = "";
        alert("Date of birth cannot be in the future.");
        dateOfBirth.value = "";
        return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (today.getDate() < birthDate.getDate()) {
        months--;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    age.value = years + " years and " + months + " months";
});


// ========================================
// SAVE PET BUTTON
// Open confirmation modal first
// ========================================

savePetButton.addEventListener("click", function (event) {
    event.preventDefault();

    const petName = document.getElementById("petName").value.trim();
    const speciesValue = species.value === "Other"
        ? customSpecies.value.trim()
        : species.value;

    if (!petName) {
        alert("Please enter the pet name.");
        return;
    }

    if (!speciesValue) {
        alert("Please select or enter the species.");
        return;
    }

    const weight = document.getElementById("weight").value.trim();

    if (
        weight !== "" &&
        (!Number.isFinite(Number(weight)) || Number(weight) < 0)
    ) {
        alert("Please enter a valid weight.");
        return;
    }

    openSavePetModal(petName);
});


// ========================================
// CONFIRM AND REGISTER PET
// ========================================

okaySavePet.addEventListener("click", async function () {
    okaySavePet.disabled = true;
    okaySavePet.textContent = "Saving...";

    try {
        // Get logged-in user
        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();

        if (userError || !user) {
            throw new Error("You must be logged in to add a pet.");
        }

        // Get pet information
        const petName =
            document.getElementById("petName").value.trim();

        const breed =
            document.getElementById("breed").value.trim();

        const gender =
            document.getElementById("gender").value;

        const birthDate =
            document.getElementById("dateOfBirth").value;

        const weight =
            document.getElementById("weight").value.trim();

        const coatColor =
            document.getElementById("coatColor").value.trim();

        const speciesValue = species.value === "Other"
            ? customSpecies.value.trim()
            : species.value;

        // Get pet photo
        const petPhoto =
            document.getElementById("petPhoto").files[0];

        if (!petName || !speciesValue) {
            throw new Error("Pet name and species are required.");
        }

        let photoUrl = null;

        // Upload pet photo if selected
        if (petPhoto) {
            if (!petPhoto.type.startsWith("image/")) {
                throw new Error("Please select a valid image file.");
            }

            const fileExtension = petPhoto.name.split(".").pop();

            const fileName =
                `${user.id}/${crypto.randomUUID()}.${fileExtension}`;

            const { error: uploadError } = await supabaseClient
                .storage
                .from("pets")
                .upload(fileName, petPhoto);

            if (uploadError) {
                throw new Error("Failed to upload pet photo: " + uploadError.message);
            }

            const { data: publicUrlData } = supabaseClient
                .storage
                .from("pets")
                .getPublicUrl(fileName);

            photoUrl = publicUrlData.publicUrl;
        }

        // Save pet information to Supabase
        const { error } = await supabaseClient
            .from("pets")
            .insert([
                {
                    owner_id: user.id,
                    pet_name: petName,
                    species: speciesValue,
                    breed: breed || null,
                    gender: gender || null,
                    date_of_birth: birthDate || null,
                    weight: weight ? Number(weight) : null,
                    coat_color: coatColor || null,
                    photo_url: photoUrl
                }
            ]);

        if (error) {
            throw new Error("Failed to add pet: " + error.message);
        }

        // Success
        closeSavePetModal();
        
        window.location.href = "mypets.html";

    } catch (error) {
        console.error("Error adding pet:", error);
        alert(error.message || "Failed to add pet.");

    }
});
