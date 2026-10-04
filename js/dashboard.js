// ========================================
// LOAD USER PROFILE
// ========================================

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

        // Show name in profile button
        document.getElementById("fullName").textContent = profile.full_name;

        document.getElementById("welcomeName").textContent = profile.full_name;

        // Show name in dropdown
        document.getElementById("dropdownUsername").textContent = profile.full_name;

        // Show email in dropdown
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

// ========================================
// CALENDAR
// ========================================

const calendarDays = document.getElementById("calendarDays");
const currentMonth = document.getElementById("currentMonth");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const todayButton = document.getElementById("todayButton");


// Current calendar date
let calendarDate = new Date();


// ========================================
// DISPLAY CALENDAR
// ========================================

function renderCalendar() {

    calendarDays.innerHTML = "";

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();


    // First day of the month
    const firstDay =
        new Date(year, month, 1).getDay();


    // Number of days in the month
    const daysInMonth =
        new Date(year, month + 1, 0).getDate();


    // Display month and year
    currentMonth.textContent =
        new Date(year, month).toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    // ========================================
    // EMPTY SPACES BEFORE FIRST DAY
    // ========================================

    for (let i = 0; i < firstDay; i++) {

        const emptyDay =
            document.createElement("div");

        emptyDay.className =
            "min-h-[75px] bg-white";

        calendarDays.appendChild(emptyDay);

    }


    // ========================================
    // CREATE CALENDAR DATES
    // ========================================

    for (let day = 1; day <= daysInMonth; day++) {

        const dayButton =
            document.createElement("button");

        dayButton.type = "button";

        dayButton.className =
            "flex min-h-[75px] w-full items-start " +
            "justify-center bg-white p-3 " +
            "text-sm text-gray-700 " +
            "hover:bg-pink-50 transition";


        // Date number
        const dateNumber =
            document.createElement("span");

        dateNumber.textContent = day;

        dateNumber.className =
            "flex h-8 w-8 items-center justify-center " +
            "rounded-full font-medium";


        // ========================================
        // CHECK IF TODAY
        // ========================================

        const today = new Date();

        const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();


        if (isToday) {

            dateNumber.classList.add(
                "border-2",
                "border-pink-500",
                "text-pink-600"
            );

        }


        dayButton.appendChild(dateNumber);


        // ========================================
        // CLICK DATE
        // ========================================

        dayButton.addEventListener(
            "click",
            function () {

                // Remove previous selected date
                document
                    .querySelectorAll(".calendar-selected")
                    .forEach(function (button) {

                        button.classList.remove(
                            "calendar-selected",
                            "bg-pink-100",
                            "text-black"
                        );

                    });


                // Add selected style
                dayButton.classList.add(
                    "calendar-selected",
                    "bg-pink-100",
                    "text-black"
                );

            }
        );


        calendarDays.appendChild(dayButton);

    }

}


// ========================================
// PREVIOUS MONTH
// ========================================

prevMonth.addEventListener(
    "click",
    function () {

        calendarDate.setMonth(
            calendarDate.getMonth() - 1
        );

        renderCalendar();

    }
);


// ========================================
// NEXT MONTH
// ========================================

nextMonth.addEventListener(
    "click",
    function () {

        calendarDate.setMonth(
            calendarDate.getMonth() + 1
        );

        renderCalendar();

    }
);


// ========================================
// TODAY BUTTON
// ========================================

todayButton.addEventListener(
    "click",
    function () {

        calendarDate = new Date();

        renderCalendar();

    }
);


// ========================================
// INITIALIZE CALENDAR
// ========================================

renderCalendar();