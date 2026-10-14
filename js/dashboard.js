        // ========================================
        // DATE HELPERS
        // ========================================

        function localDateString(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }

        function addDays(numberOfDays) {
            const date = new Date();
            date.setHours(12, 0, 0, 0);
            date.setDate(date.getDate() + numberOfDays);
            return date;
        }

        function formatDate(dateString) {
            const [year, month, day] = dateString.split("-").map(Number);
            const date = new Date(year, month - 1, day, 12);

            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });
        }

        function formatTime(timeString) {
            const [hours, minutes] = timeString.split(":").map(Number);
            const date = new Date();
            date.setHours(hours, minutes, 0, 0);

            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit"
            });
        }

        function dateTimeValue(appointment) {
            return new Date(
                `${appointment.date}T${appointment.time}:00`
            ).getTime();
        }

        function isUpcoming(appointment) {
            return (
                ["Pending", "Confirmed"].includes(appointment.status) &&
                dateTimeValue(appointment) >= Date.now()
            );
        }

        // ========================================
        // SAMPLE APPOINTMENTS
        // Replace these with Supabase data later.
        // ========================================

      

        const appointments = [];

        let nextAppointmentId = 1;


        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let displayedMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        let selectedDate = localDateString(today);
        let currentFilter = "All";

 // ========================================
 // CALENDAR
 // ========================================

function renderCalendar() {
    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();

    const currentMonth = document.getElementById("currentMonth");
    const calendarDays = document.getElementById("calendarDays");

    if (!currentMonth || !calendarDays) {
        console.error("Calendar HTML elements were not found.");
        return;
    }

    currentMonth.textContent = displayedMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });

    calendarDays.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty spaces before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement("div");
        blank.className = "min-h-10";
        calendarDays.appendChild(blank);
    }

    // Generate the date numbers
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day, 12);
        const dateString = localDateString(date);

        const dayAppointments = appointments.filter(appointment =>
            appointment.date === dateString &&
            appointment.status !== "Cancelled"
        );

        const button = document.createElement("button");
        button.type = "button";

        button.className =
            "flex min-h-10 flex-col items-center justify-center gap-1 rounded-xl text-sm font-medium text-gray-800 hover:bg-pink-100";

        // Highlight today
        if (dateString === localDateString(new Date())) {
            button.classList.add("border", "border-pink-500");
        }

        button.setAttribute("aria-label", formatDate(dateString));

        // Date number
        const number = document.createElement("span");
        number.textContent = String(day);
        button.appendChild(number);

        // Appointment indicator
        if (dayAppointments.length > 0) {
            const dot = document.createElement("span");

            dot.className = "h-1.5 w-1.5 rounded-full";

            dot.classList.add(
                dayAppointments.some(item => item.status === "Confirmed")
                    ? "bg-green-500"
                    : "bg-pink-500"
            );

            button.appendChild(dot);
        }

        // View information only; no booking action
        button.addEventListener("click", () => {
            selectedDate = dateString;
            renderAppointments();
        });

        calendarDays.appendChild(button);
    }
}

// Previous month
document.getElementById("prevMonth").addEventListener("click", () => {
    displayedMonth = new Date(
        displayedMonth.getFullYear(),
        displayedMonth.getMonth() - 1,
        1
    );

    renderCalendar();
});

// Next month
document.getElementById("nextMonth").addEventListener("click", () => {
    displayedMonth = new Date(
        displayedMonth.getFullYear(),
        displayedMonth.getMonth() + 1,
        1
    );

    renderCalendar();
});

// Initial calendar display
renderCalendar();


function renderAppointments() {
    const appointmentResult =
        document.getElementById("appointmentResult");

    const vaccinationResult =
        document.getElementById("vaccinationResult");

    if (!appointmentResult || !vaccinationResult) return;

    const dayAppointments = appointments.filter(appointment =>
        appointment.date === selectedDate &&
        appointment.status !== "Cancelled"
    );

    if (dayAppointments.length === 0) {
        appointmentResult.textContent =
            "No appointments on " + formatDate(selectedDate);
    } else {
        appointmentResult.textContent = dayAppointments
            .map(appointment =>
                `${appointment.petName || "Pet"} · ` +
                `${appointment.service || "Appointment"} · ` +
                `${formatTime(appointment.time)} · ` +
                `${appointment.status}`
            )
            .join(" | ");
    }

    // Vaccination reminders will be connected to your
    // vaccination records in Supabase later.
    vaccinationResult.textContent =
        "No vaccination reminders for this date.";
}

async function loadTotalPets() {
    const totalPetsElement = document.getElementById("totalPets");

    if (!totalPetsElement) return;

    // Get the currently logged-in user
    const { data: { user }, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !user) {
        totalPetsElement.textContent = "0";
        return;
    }

    // Count only pets belonging to this user
    const { count, error } = await supabaseClient
        .from("pets")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", user.id);

    if (error) {
        console.error("Error counting pets:", error);
        totalPetsElement.textContent = "—";
        return;
    }

    // Display the total
    totalPetsElement.textContent = count;
}

loadTotalPets();
