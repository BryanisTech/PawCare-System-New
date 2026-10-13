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