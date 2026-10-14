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
        // MESSAGE MODAL
        // ========================================

        const messageModal = document.getElementById("messageModal");
        const messageIcon = document.getElementById("messageIcon");
        const messageTitle = document.getElementById("messageTitle");
        const messageText = document.getElementById("messageText");

        function showMessage(title, message, type = "notice") {
            messageTitle.textContent = title;
            messageText.textContent = message;

            if (type === "success") {
                messageIcon.textContent = "✓";
                messageIcon.className =
                    "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600";
            } else if (type === "error") {
                messageIcon.textContent = "!";
                messageIcon.className =
                    "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600";
            } else {
                messageIcon.textContent = "i";
                messageIcon.className =
                    "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-3xl text-pink-600";
            }

            messageModal.classList.remove("hidden");
            messageModal.classList.add("flex");
        }

        function closeMessage() {
            messageModal.classList.add("hidden");
            messageModal.classList.remove("flex");
        }

        document.getElementById("closeMessageButton")
            .addEventListener("click", closeMessage);

        // ========================================
        // BOOKING MODAL
        // ========================================

        const bookingModal = document.getElementById("bookingModal");
        const bookingForm = document.getElementById("bookingForm");
        const bookingDate = document.getElementById("bookingDate");

        bookingDate.min = localDateString(today);

        function openBookingModal(date = selectedDate) {
            bookingForm.reset();

            bookingDate.min = localDateString(today);
            bookingDate.value =
                date >= localDateString(today)
                    ? date
                    : localDateString(today);

            bookingModal.classList.remove("hidden");
            bookingModal.classList.add("flex");
            document.body.classList.add("overflow-hidden");

            setTimeout(() => {
                document.getElementById("bookingPet").focus();
            }, 50);
        }

        function closeBookingModal() {
            bookingModal.classList.add("hidden");
            bookingModal.classList.remove("flex");
            document.body.classList.remove("overflow-hidden");
        }

        document.getElementById("openBookingButton")
            .addEventListener("click", () => openBookingModal());

        document.getElementById("bookSelectedDate")
            .addEventListener("click", () => openBookingModal(selectedDate));

        document.getElementById("closeBookingButton")
            .addEventListener("click", closeBookingModal);

        document.getElementById("cancelBookingButton")
            .addEventListener("click", closeBookingModal);

        bookingModal.addEventListener("click", event => {
            if (event.target === bookingModal) {
                closeBookingModal();
            }
        });

        // ========================================
        // CREATE APPOINTMENT (FRONT-END DEMO)
        // ========================================

        bookingForm.addEventListener("submit", event => {
            event.preventDefault();

            const pet = document.getElementById("bookingPet").value.trim();
            const service = document.getElementById("bookingService").value;
            const date = bookingDate.value;
            const time = document.getElementById("bookingTime").value;
            const notes = document.getElementById("bookingNotes").value.trim();

            if (!pet || !service || !date || !time) {
                showMessage(
                    "Missing Information",
                    "Please complete all required fields.",
                    "error"
                );
                return;
            }

            if (date < localDateString(today)) {
                showMessage(
                    "Invalid Date",
                    "Please choose today or a future date.",
                    "error"
                );
                return;
            }

            const chosenDateTime = new Date(`${date}T${time}:00`);

            if (chosenDateTime.getTime() <= Date.now()) {
                showMessage(
                    "Invalid Time",
                    "Please choose a future appointment time.",
                    "error"
                );
                return;
            }

            const timeIsTaken = appointments.some(appointment =>
                appointment.date === date &&
                appointment.time === time &&
                ["Pending", "Confirmed"].includes(appointment.status)
            );

            if (timeIsTaken) {
                showMessage(
                    "Time Slot Unavailable",
                    "There is already an active appointment at this time in this demo. Please choose another time.",
                    "error"
                );
                return;
            }

            appointments.push({
                id: nextAppointmentId++,
                pet,
                service,
                date,
                time,
                status: "Pending",
                notes
            });

            selectedDate = date;
            displayedMonth = new Date(
                Number(date.slice(0, 4)),
                Number(date.slice(5, 7)) - 1,
                1
            );

            currentFilter = "All";
            document.getElementById("statusFilter").value = "All";

            closeBookingModal();
            renderEverything();

            showMessage(
                "Request Added!",
                "Your demo appointment request has been added to this page as Pending. This does not send a request to the clinic.",
                "success"
            );
        });

        // ========================================
        // CALENDAR
        // ========================================

        function renderCalendar() {
            const year = displayedMonth.getFullYear();
            const month = displayedMonth.getMonth();

            document.getElementById("currentMonth").textContent =
                displayedMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric"
                });

            document.getElementById("selectedDateLabel").textContent =
                formatDate(selectedDate);

            const calendarDays = document.getElementById("calendarDays");
            calendarDays.innerHTML = "";

            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                const blank = document.createElement("div");
                blank.className = "calendar-day";
                calendarDays.appendChild(blank);
            }

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
                    "calendar-day flex flex-col items-center justify-center gap-1 rounded-xl text-sm font-medium";

                if (dateString === localDateString(today)) {
                    button.classList.add("today");
                }

                if (dateString === selectedDate) {
                    button.classList.add("selected");
                }

                button.setAttribute("aria-label", formatDate(dateString));

                const number = document.createElement("span");
                number.textContent = day;
                button.appendChild(number);

                if (dayAppointments.length > 0) {
                    const dot = document.createElement("span");
                    dot.className = "h-1.5 w-1.5 rounded-full";

                    dot.classList.add(
                        dayAppointments.some(item => item.status === "Confirmed")
                            ? "bg-green-500"
                            : "bg-pink-500"
                    );

                    if (dateString === selectedDate) {
                        dot.classList.remove("bg-green-500", "bg-pink-500");
                        dot.classList.add("bg-white");
                    }

                    button.appendChild(dot);
                }

                button.addEventListener("click", () => {
                    selectedDate = dateString;
                    renderCalendar();
                    renderAppointments();
                });

                calendarDays.appendChild(button);
            }
        }

        document.getElementById("prevMonth").addEventListener("click", () => {
            displayedMonth.setMonth(displayedMonth.getMonth() - 1);
            renderCalendar();
        });

        document.getElementById("nextMonth").addEventListener("click", () => {
            displayedMonth.setMonth(displayedMonth.getMonth() + 1);
            renderCalendar();
        });

        // ========================================
        // APPOINTMENT SUMMARY
        // ========================================

        function renderSummary() {
            document.getElementById("totalCount").textContent =
                appointments.length;

            document.getElementById("upcomingCount").textContent =
                appointments.filter(isUpcoming).length;

            document.getElementById("pendingCount").textContent =
                appointments.filter(item => item.status === "Pending").length;

            document.getElementById("completedCount").textContent =
                appointments.filter(item => item.status === "Completed").length;

            const nextContent =
                document.getElementById("nextAppointmentContent");

            const nextAppointment = appointments
                .filter(isUpcoming)
                .sort((a, b) => dateTimeValue(a) - dateTimeValue(b))[0];

            nextContent.innerHTML = "";

            if (!nextAppointment) {
                const empty = document.createElement("p");
                empty.className = "mt-6 text-sm leading-6 text-pink-50";
                empty.textContent = "No upcoming appointments yet. Book a visit for your pet to get started.";
                nextContent.appendChild(empty);
                return;
            }

            const card = document.createElement("div");
            card.className = "mt-4 rounded-2xl bg-white/15 p-4";

            const petName = document.createElement("p");
            petName.className = "text-lg font-bold";
            petName.textContent = nextAppointment.pet;

            const service = document.createElement("p");
            service.className = "mt-1 text-sm text-pink-50";
            service.textContent = nextAppointment.service;

            const date = document.createElement("p");
            date.className = "mt-4 text-sm font-semibold";
            date.textContent = "▦  " + formatDate(nextAppointment.date);

            const time = document.createElement("p");
            time.className = "mt-2 text-sm";
            time.textContent = "◷  " + formatTime(nextAppointment.time);

            const status = document.createElement("span");
            status.className =
                "mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-pink-700";
            status.textContent = nextAppointment.status;

            card.append(petName, service, date, time, status);
            nextContent.appendChild(card);
        }

        // ========================================
        // APPOINTMENT LIST
        // ========================================

        function createAppointmentCard(appointment) {
            const card = document.createElement("article");
            card.className =
                "rounded-2xl border border-gray-100 p-4 transition hover:border-pink-200 hover:shadow-sm sm:p-5";

            const topRow = document.createElement("div");
            topRow.className =
                "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between";

            const left = document.createElement("div");
            left.className = "flex min-w-0 items-start gap-4";

            const icon = document.createElement("div");
            icon.className =
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-2xl";
            icon.textContent =
                appointment.service.toLowerCase().includes("vaccination")
                    ? "💉"
                    : appointment.service.toLowerCase().includes("grooming")
                    ? "✂️"
                    : "🐾";

            const details = document.createElement("div");
            details.className = "min-w-0 flex-1";

            const petName = document.createElement("h4");
            petName.className = "break-words font-bold text-gray-900";
            petName.textContent = appointment.pet;

            const service = document.createElement("p");
            service.className = "mt-1 text-sm text-gray-500";
            service.textContent = appointment.service;

            const dateTime = document.createElement("p");
            dateTime.className = "mt-2 text-xs leading-5 text-gray-500";
            dateTime.textContent =
                formatDate(appointment.date) + " · " +
                formatTime(appointment.time);

            details.append(petName, service, dateTime);
            left.append(icon, details);

            const status = document.createElement("span");
            status.className = "status-badge status-" + appointment.status;
            status.textContent = appointment.status;

            topRow.append(left, status);
            card.appendChild(topRow);

            if (appointment.notes) {
                const notes = document.createElement("p");
                notes.className =
                    "mt-4 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-500";
                notes.textContent = "Note: " + appointment.notes;
                card.appendChild(notes);
            }

            const actions = document.createElement("div");
            actions.className =
                "mt-4 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4";

            if (["Pending", "Confirmed"].includes(appointment.status) &&
                dateTimeValue(appointment) > Date.now()) {

                const cancelButton = document.createElement("button");
                cancelButton.type = "button";
                cancelButton.className =
                    "rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50";
                cancelButton.textContent = "Cancel Appointment";

                cancelButton.addEventListener("click", () => {
                    showCancelConfirmation(appointment.id);
                });

                actions.appendChild(cancelButton);
            }

            card.appendChild(actions);
            return card;
        }

        function renderAppointments() {
            const list = document.getElementById("appointmentList");
            const empty = document.getElementById("emptyAppointments");

            list.innerHTML = "";

            let filteredAppointments = [...appointments];

            if (currentFilter === "Upcoming") {
                filteredAppointments = filteredAppointments.filter(isUpcoming);
            } else if (currentFilter !== "All") {
                filteredAppointments = filteredAppointments.filter(item =>
                    item.status === currentFilter
                );
            }

            filteredAppointments.sort((a, b) => {
                return dateTimeValue(a) - dateTimeValue(b);
            });

            if (filteredAppointments.length === 0) {
                empty.classList.remove("hidden");
                return;
            }

            empty.classList.add("hidden");

            filteredAppointments.forEach(appointment => {
                list.appendChild(createAppointmentCard(appointment));
            });
        }

        document.getElementById("statusFilter").addEventListener("change", event => {
            currentFilter = event.target.value;
            renderAppointments();
        });

        document.getElementById("viewUpcomingButton").addEventListener("click", () => {
            currentFilter = "Upcoming";
            document.getElementById("statusFilter").value = "Upcoming";
            renderAppointments();

            document.getElementById("appointmentsSection").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });

        // ========================================
        // CANCEL APPOINTMENT CONFIRMATION
        // ========================================

        function showCancelConfirmation(appointmentId) {
            const appointment = appointments.find(item => item.id === appointmentId);

            if (!appointment) return;

            const overlay = document.createElement("div");
            overlay.className =
                "modal-backdrop fixed inset-0 z-[55] flex items-center justify-center bg-gray-900/40 p-4";

            const panel = document.createElement("div");
            panel.className =
                "w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl";

            const icon = document.createElement("div");
            icon.className =
                "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600";
            icon.textContent = "!";

            const title = document.createElement("h2");
            title.className = "text-xl font-bold text-gray-900";
            title.textContent = "Cancel Appointment?";

            const message = document.createElement("p");
            message.className = "mt-3 text-sm leading-6 text-gray-500";
            message.textContent =
                `Are you sure you want to cancel ${appointment.pet}'s ${appointment.service} appointment?`;

            const buttons = document.createElement("div");
            buttons.className = "mt-6 flex gap-3";

            const keepButton = document.createElement("button");
            keepButton.type = "button";
            keepButton.className =
                "flex-1 rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50";
            keepButton.textContent = "Keep It";

            const confirmButton = document.createElement("button");
            confirmButton.type = "button";
            confirmButton.className =
                "flex-1 rounded-xl bg-red-600 px-3 py-3 text-sm font-semibold text-white hover:bg-red-700";
            confirmButton.textContent = "Yes, Cancel";

            function close() {
                overlay.remove();
            }

            keepButton.addEventListener("click", close);

            confirmButton.addEventListener("click", () => {
                appointment.status = "Cancelled";
                close();
                renderEverything();

                showMessage(
                    "Appointment Cancelled",
                    "The appointment was marked as cancelled in this demo page.",
                    "success"
                );
            });

            overlay.addEventListener("click", event => {
                if (event.target === overlay) close();
            });

            buttons.append(keepButton, confirmButton);
            panel.append(icon, title, message, buttons);
            overlay.appendChild(panel);
            document.body.appendChild(overlay);
        }

        // ========================================
        // RENDER EVERYTHING
        // ========================================

        function renderEverything() {
            renderCalendar();
            renderSummary();
            renderAppointments();
        }

        renderEverything();