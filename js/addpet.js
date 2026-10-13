// other species input field toggle when "Other" is selected from the dropdown it becames a text input 
// field and the dropdown is hidden, and when the user clicks outside of the input field it becomes a 
// dropdown again if the user didn't type anything in the input field.
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
// this one calculates the date of birth and age of the pet and displays it in
//  the age input field when the user selects a date from the date picker.


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

// this one gets the pet photo from the petPhoto input field and saves it to the supabase storage when the user clicks the save button.
const petPhoto = document.getElementById("petPhoto").files[0];
const savePetButton = document.getElementById("savePetButton");

savePetButton.addEventListener("click", async function () {

    // Get logged-in user
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {

        alert("You must be logged in to add a pet.");
        return;

    }


    // this one is in the registerPet function and it gets the values from the input fields and saves them to variables.


    const petName =
        document.getElementById("petName").value.trim();

    const breed =
        document.getElementById("breed").value.trim();

    const gender =
        document.getElementById("gender").value;

    const dateOfBirth =
        document.getElementById("dateOfBirth").value;

    const weight =
        document.getElementById("weight").value;

    const coatColor =
        document.getElementById("coatColor").value.trim();


    // this one gets the species from the species dropdown or the custom species input field 
    // depending on which one is visible. If the user selects "Other" from the dropdown, the custom 
    // species input field is shown and the value from that field is used. If the user selects a 
    // species from the dropdown, that value is used. If neither field has a value, an alert 
    // is shown and the function returns early.

    const speciesDropdown =
        document.getElementById("species");

    const customSpecies =
        document.getElementById("customSpecies");

    let species;

    if (speciesDropdown.value === "Other") {

        species = customSpecies.value.trim();

    } else {

        species = speciesDropdown.value;

    }


    // GET PET PHOTO


    const petPhoto =
        document.getElementById("petPhoto").files[0];


    // BASIC VALIDATION

    if (!petName) {

        alert("Please enter the pet name.");
        return;

    }

    if (!species) {

        alert("Please select or enter the species.");
        return;

    }


    // this one uploads the pet photo to the supabase storage and gets the public 
    // URL of the uploaded photo. If the user didn't select a photo, the photoUrl
    //  variable is set to null. If the user selected a photo, the file extension 
    // is extracted from the file name and a new file name is generated using the 
    // user's ID and a random UUID. The photo is then uploaded to the "pets" bucket
    //  in supabase storage. If there is an error during upload, an alert is shown 
    // and the function returns early. If the upload is successful, the public URL 
    // of the uploaded photo is retrieved and saved to the photoUrl variable.

    let photoUrl = null;

    if (petPhoto) {

        const fileExtension =
            petPhoto.name.split(".").pop();

        const fileName =
            `${user.id}/${crypto.randomUUID()}.${fileExtension}`;


        const {
            error: uploadError
        } = await supabaseClient
            .storage
            .from("pets")
            .upload(fileName, petPhoto);


        if (uploadError) {

            console.log("Photo upload error:", uploadError);

            alert("Failed to upload pet photo.");

            return;

        }


        // this one gets the public URL of the uploaded pet photo from the supabase storage and saves it to the photoUrl variable.
        const {
            data: publicUrlData
        } = supabaseClient
            .storage
            .from("pets")
            .getPublicUrl(fileName);


        photoUrl =
            publicUrlData.publicUrl;

    }


    // ========================================
    // SAVE PET INFORMATION
    // ========================================

    const {
        data,
        error
    } = await supabaseClient
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
                coat_color: coatColor || null,
                photo_url: photoUrl
            }
        ])
        .select();


    // ========================================
    // CHECK ERROR
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

    window.location.href = "pets.html";

});