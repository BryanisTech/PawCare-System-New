
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