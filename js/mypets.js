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
                    class="w-full mt-5 bg-pink-500 hover:bg-pink-600 text-white py-2.5 rounded-lg">

                    View Profile

                </button>

            </div>
        `;


        petsContainer.appendChild(petCard);

    });

}


// ========================================
// CALCULATE AGE
// ========================================

function calculateAge(dateOfBirth) {

    if (!dateOfBirth) {
        return "Not provided";
    }


    const birthDate = new Date(dateOfBirth);
    const today = new Date();


    let years =
        today.getFullYear() -
        birthDate.getFullYear();


    let months =
        today.getMonth() -
        birthDate.getMonth();


    if (today.getDate() < birthDate.getDate()) {
        months--;
    }


    if (months < 0) {
        years--;
        months += 12;
    }


    // Less than one year old
    if (years === 0) {

        if (months === 1) {
            return "1 month";
        }

        return `${months} months`;
    }


    // Exactly years old
    if (months === 0) {

        if (years === 1) {
            return "1 year";
        }

        return `${years} years`;
    }


    // Years and months
    return `${years} years, ${months} months`;
}


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


// ========================================
// LOAD PETS
// ========================================

loadPets();