// ========================================
// PETS ELEMENTS
// ========================================

const addPetButton = document.getElementById("addPetButton");
const petsContainer = document.getElementById("petsContainer");



// ========================================
// DISPLAY PETS
// ========================================

function displayPets(pets) {

    // Clear existing cards
    petsContainer.innerHTML = "";

    // If there are no pets
    if (pets.length === 0) {

        petsContainer.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center text-center min-h-[500px]">

                <p class="text-xl font-medium text-gray-600">
                    No pets registered yet.
                </p>

                <p class="text-lg text-gray-400 mt-2">
                    Click "Add Pet" to register your first pet.
                </p>

            </div>
        `;

        return;
    }


    // ========================================
    // DISPLAY PET CARDS
    // ========================================

    pets.forEach(pet => {

        const petCard = document.createElement("div");

        petCard.className =
            "bg-white rounded-2xl shadow-md overflow-hidden";


        // Calculate age
        const age = calculateAge(pet.date_of_birth);


        petCard.innerHTML = `
            <div class="bg-pink-100 h-48 flex items-center justify-center">

                <img
                    src="${pet.photo_url || './images/default-pet.png'}"
                    alt="${pet.pet_name}"
                    class="w-32 h-32 object-cover rounded-full">

            </div>


            <div class="p-5">

                <h2 class="text-xl font-bold text-gray-800">
                    ${pet.pet_name}
                </h2>

                <p class="text-gray-500 mb-4">
                    ${pet.breed || "Breed not provided"}
                </p>


                <div class="space-y-2 text-sm">

                    <div class="flex justify-between">
                        <span class="text-gray-500">
                            Species
                        </span>

                        <span class="font-medium">
                            ${pet.species}
                        </span>
                    </div>


                    <div class="flex justify-between">
                        <span class="text-gray-500">
                            Gender
                        </span>

                        <span class="font-medium">
                            ${pet.gender || "Not provided"}
                        </span>
                    </div>


                    <div class="flex justify-between">
                        <span class="text-gray-500">
                            Age
                        </span>

                        <span class="font-medium">
                            ${age}
                        </span>
                    </div>

                </div>


                
                <button
                    type="button"
                    data-pet-id="${pet.id}"
                    class="view-medical-records-button w-full mt-5 border border-black bg-white hover:bg-pink-500 text-black py-2.5 rounded-lg">
                    View Medical Records
                </button>


                
                <button
                    type="button"
                    data-edit-pet-id="${pet.id}"
                    class="edit-pet-button w-full mt-5 border border-black bg-white hover:bg-pink-500 text-black py-2.5 rounded-lg">

                    Edit Pets

                </button>


                <button
                    type="button"
                    data-delete-pet-id="${pet.id}"
                    class="delete-pet-button w-full mt-5 border border-black bg-white hover:bg-red-700 hover:text-white text-black py-2.5 rounded-lg">

                    Delete Pets

                </button>

            </div>
        `;


        petsContainer.appendChild(petCard);

    });

}


/* ========================================
   SAVE EDIT PET MODAL
======================================== */

const saveEditPetModal = document.getElementById("saveEditPetModal");
const saveEditPetName = document.getElementById("saveEditPetName");
const okaySaveEditPet = document.getElementById("okaySaveEditPet");
const cancelSaveEditPet = document.getElementById("cancelSaveEditPet");

let pendingSaveEdit = null;

function openSaveEditPetModal(petName, saveCallback) {
    saveEditPetName.textContent = petName || "this pet";
    pendingSaveEdit = saveCallback;

    saveEditPetModal.classList.remove("hidden");
    saveEditPetModal.classList.add("flex");
}

function closeSaveEditPetModal() {
    saveEditPetModal.classList.add("hidden");
    saveEditPetModal.classList.remove("flex");
    pendingSaveEdit = null;
}

cancelSaveEditPet.addEventListener("click", closeSaveEditPetModal);

okaySaveEditPet.addEventListener("click", async function () {
    if (!pendingSaveEdit) return;

    const saveCallback = pendingSaveEdit;

    okaySaveEditPet.disabled = true;
    okaySaveEditPet.textContent = "Saving...";

    try {
        await saveCallback();
    } finally {
        okaySaveEditPet.disabled = false;
        okaySaveEditPet.textContent = "Okay";
    }
});



// ========================================
// DELETE PET MODAL
// ========================================

const deletePetModal = document.getElementById("deletePetModal");
const deletePetName = document.getElementById("deletePetName");
const cancelDeletePet = document.getElementById("cancelDeletePet");
const confirmDeletePet = document.getElementById("confirmDeletePet");

let petToDelete = null;

// Open confirmation modal
petsContainer.addEventListener("click", function (event) {
    const button = event.target.closest(".delete-pet-button");

    if (!button) return;

    const petCard = button.closest(".bg-white");
    const nameElement = petCard?.querySelector("h2");

    petToDelete = button.dataset.deletePetId;
    deletePetName.textContent = nameElement?.textContent || "this pet";

    deletePetModal.classList.remove("hidden");
    deletePetModal.classList.add("flex");
});

// Close modal
function closeDeletePetModal() {
    deletePetModal.classList.add("hidden");
    deletePetModal.classList.remove("flex");
    petToDelete = null;
}

cancelDeletePet.addEventListener("click", closeDeletePetModal);

// Confirm deletion
confirmDeletePet.addEventListener("click", async function () {
    if (!petToDelete) return;

    const petId = petToDelete;

    confirmDeletePet.disabled = true;
    confirmDeletePet.textContent = "Deleting...";

    try {
        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();

        if (userError || !user) {
            throw new Error("Please log in again.");
        }

        const { data, error } = await supabaseClient
            .from("pets")
            .delete()
            .eq("id", petId)
            .eq("owner_id", user.id)
            .select("id");

        if (error) throw error;

        if (!data || data.length === 0) {
            throw new Error(
                "Pet was not deleted. Please check your permissions."
            );
        }

        closeDeletePetModal();
        await loadPets();

    } catch (error) {
        console.error("Delete pet error:", error);
        alert("Unable to delete pet. Please try again.");

    } finally {
        confirmDeletePet.disabled = false;
        confirmDeletePet.textContent = "Delete Pet";
    }
});


// ========================================
// GET PETS FROM SUPABASE
// ========================================

async function loadPets() {

    // Get logged-in user
    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();


    if (userError || !user) {

        console.log("User error:", userError);

        return;
    }


    // Get only this owner's pets
    const {
        data: pets,
        error
    } = await supabaseClient
        .from("pets")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });


    if (error) {

        console.log("Error loading pets:", error);

        return;
    }


    // Display the pets
    displayPets(pets);

}


// ========================================
// ADD PET BUTTON
// ========================================

addPetButton.addEventListener("click", function () {

    window.location.href = "addpet.html";

});

//Medical Records Button
petsContainer.addEventListener("click", function (event) {
    const button = event.target.closest(".view-medical-records-button");

    if (!button) return;

    const petId = button.dataset.petId;

    window.location.href =
        `medical-records.html?id=${encodeURIComponent(petId)}`;
});



// ========================================
// LOAD PETS
// ========================================

loadPets();


/* ========================================
   EDIT PET MODAL
======================================== */

const editPetModal = document.getElementById("editPetModal");
const editPetForm = document.getElementById("editPetForm");
const closeEditModal = document.getElementById("closeEditModal");
const cancelEditModal = document.getElementById("cancelEditModal");

const editPetName = document.getElementById("editPetName");
const editSpecies = document.getElementById("editSpecies");
const editBreed = document.getElementById("editBreed");
const editGender = document.getElementById("editGender");
const editDateOfBirth = document.getElementById("editDateOfBirth");
const editWeight = document.getElementById("editWeight");
const editCoatColor = document.getElementById("editCoatColor");
const editPetPhoto = document.getElementById("editPetPhoto");
const editPetPhotoPreview = document.getElementById("editPetPhotoPreview");
const savePetChanges = document.getElementById("savePetChanges");

let selectedPet = null;


/* Open modal and fill in current pet information */
petsContainer.addEventListener("click", async function (event) {

    const editButton = event.target.closest(".edit-pet-button");

    if (!editButton) {
        return;
    }

    const petId = editButton.dataset.editPetId;

    const { data: { user }, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !user) {
        alert("Please log in again.");
        return;
    }

    const { data: pet, error } = await supabaseClient
        .from("pets")
        .select("*")
        .eq("id", petId)
        .eq("owner_id", user.id)
        .single();

    if (error || !pet) {
        console.error("Error loading pet:", error);
        alert("Could not load this pet's information.");
        return;
    }

    selectedPet = pet;

    editPetName.value = pet.pet_name || "";
    editSpecies.value = pet.species || "";
    editBreed.value = pet.breed || "";
    editGender.value = pet.gender || "";
    editDateOfBirth.value = pet.date_of_birth || "";
    editWeight.value = pet.weight ?? "";
    editCoatColor.value = pet.coat_color || "";

    editPetPhoto.value = "";
    editPetPhotoPreview.src =
        pet.photo_url || "./images/default-pet.png";

    editPetModal.classList.remove("hidden");
    editPetModal.classList.add("flex");
});


/* Preview a replacement photo */
editPetPhoto.addEventListener("change", function () {

    const file = editPetPhoto.files[0];

    if (!file) {
        editPetPhotoPreview.src =
            selectedPet?.photo_url || "./images/default-pet.png";
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        editPetPhoto.value = "";
        return;
    }

    editPetPhotoPreview.src = URL.createObjectURL(file);
});


/* Close modal */
function closePetEditor() {
    editPetModal.classList.add("hidden");
    editPetModal.classList.remove("flex");
    editPetForm.reset();
    editPetPhotoPreview.src = "./images/default-pet.png";
    selectedPet = null;
}

closeEditModal.addEventListener("click", closePetEditor);
cancelEditModal.addEventListener("click", closePetEditor);


/* Save changes to Supabase after confirmation */
editPetForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!selectedPet) {
        alert("Please select a pet to edit.");
        return;
    }

    const petName = editPetName.value.trim();
    const species = editSpecies.value.trim();

    if (!petName || !species) {
        alert("Pet name and species are required.");
        return;
    }

    const weightValue = editWeight.value.trim();

    if (
        weightValue !== "" &&
        (!Number.isFinite(Number(weightValue)) ||
            Number(weightValue) < 0)
    ) {
        alert("Please enter a valid weight.");
        return;
    }

    // Show confirmation before saving.
    openSaveEditPetModal(petName, async function () {
        savePetChanges.disabled = true;
        savePetChanges.textContent = "Saving...";

        try {
            const {
                data: { user },
                error: userError
            } = await supabaseClient.auth.getUser();

            if (userError || !user) {
                throw new Error("Please log in again.");
            }

            // Keep the existing photo unless a new one is selected.
            let photoUrl = selectedPet.photo_url || null;
            const photoFile = editPetPhoto.files[0];

            // Upload a replacement photo if selected.
            if (photoFile) {
                const extension = photoFile.name.split(".").pop();
                const fileName =
                    `${user.id}/${crypto.randomUUID()}.${extension}`;

                const { error: uploadError } = await supabaseClient
                    .storage
                    .from("pets")
                    .upload(fileName, photoFile);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: publicUrlData } = supabaseClient
                    .storage
                    .from("pets")
                    .getPublicUrl(fileName);

                photoUrl = publicUrlData.publicUrl;
            }

            // Update the selected pet belonging to this owner.
            const { error: updateError } = await supabaseClient
                .from("pets")
                .update({
                    pet_name: petName,
                    species: species,
                    breed: editBreed.value.trim() || null,
                    gender: editGender.value || null,
                    date_of_birth: editDateOfBirth.value || null,
                    weight: weightValue === ""
                        ? null
                        : Number(weightValue),
                    coat_color: editCoatColor.value.trim() || null,
                    photo_url: photoUrl
                })
                .eq("id", selectedPet.id)
                .eq("owner_id", user.id);

            if (updateError) {
                throw updateError;
            }

            // Close both modals after a successful update.
            closeSaveEditPetModal();
            closePetEditor();
            await loadPets();

        } catch (error) {
            console.error("Error updating pet:", error);
            alert("Could not update pet: " + error.message);

        } finally {
            savePetChanges.disabled = false;
            savePetChanges.textContent = "Save Changes";
        }
    });
});


