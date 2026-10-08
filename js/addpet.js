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

    }

});

customSpecies.addEventListener("blur", function () {

    // If the user didn't type anything
    if (customSpecies.value.trim() === "") {

        customSpecies.value = "";

        customSpecies.classList.add("hidden");
        species.classList.remove("hidden");

        species.value = "";

    }

});
// Date and age Calculation

const dateOfBirth = document.getElementById("dateOfBirth");
const age = document.getElementById("age");

dateOfBirth.addEventListener("change", function () {

    const birthDate = new Date(dateOfBirth.value);
    const today = new Date();

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
// SAVE PET
// ========================================

const savePetButton = document.getElementById("savePetButton");

savePetButton.addEventListener("click", async function () {

    // Get currently logged-in user
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();


    // Check if user is logged in
    if (userError || !user) {

        alert("You must be logged in to add a pet.");
        return;

    }


    // Get form values
    const petName = document.getElementById("petName").value.trim();
    const breed = document.getElementById("breed").value.trim();
    const gender = document.getElementById("gender").value;
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    const weight = document.getElementById("weight").value;
    const coatColor = document.getElementById("coatColor").value.trim();


    // ========================================
    // GET SPECIES
    // ========================================

    const speciesDropdown = document.getElementById("species");
    const customSpecies = document.getElementById("customSpecies");

    let species;

    if (speciesDropdown.value === "Other") {

        species = customSpecies.value.trim();

    } else {

        species = speciesDropdown.value;

    }


    // ========================================
    // BASIC VALIDATION
    // ========================================

    if (!petName) {

        alert("Please enter the pet name.");
        return;

    }

    if (!species) {

        alert("Please select or enter the species.");
        return;

    }


    // ========================================
    // SAVE TO SUPABASE
    // ========================================

    const { data, error } = await supabaseClient
        .from("pets")
        .insert([
            {
                owner_id: user.id,
                pet_name: petName,
                species: species,
                breed: breed || null,
                gender: gender || null,
                date_of_birth: dateOfBirth || null,
                weight: weight ? Number(weight) : null,
                coat_color: coatColor || null
            }
        ])
        .select();


    // ========================================
    // CHECK FOR ERROR
    // ========================================

    if (error) {

        console.log("Error adding pet:", error);

        alert("Failed to add pet.");

        return;

    }


    // ========================================
    // SUCCESS
    // ========================================

    alert("Pet added successfully!");

    window.location.href = "mypets.html";

});