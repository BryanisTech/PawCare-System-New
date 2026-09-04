 const passwordInput = document.getElementById('password');
        const toggleButton = document.getElementById('togglePassword');
        const eyeOpen = document.getElementById('eyeOpen');
        const eyeClosed = document.getElementById('eyeClosed');

        toggleButton.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            
            // Switch 
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            
            // Toggle 
            eyeOpen.classList.toggle('hidden');
            eyeClosed.classList.toggle('hidden');
        });


   
    // --- 1. KUNIN ANG MGA ELEMENTS ---
    const registerForm = document.getElementById('registerForm');
    const mainPassword = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const errorMessage = document.getElementById('passwordError');

    // --- 2. FUNCTION PARA I-CHECK KUNG MATCH ---
    function checkPasswords() {
        // Kung walang laman yung confirm password, itago lang muna yung error
        if (confirmPassword.value === '') {
            errorMessage.classList.add('hidden');
            confirmPassword.classList.remove('border-red-400');
            return;
        }

        // I-check kung magkaparehas
        if (mainPassword.value !== confirmPassword.value) {
            // KAPAG HINDI MATCH: Ipakita ang error text at gawing red ang border
            errorMessage.classList.remove('hidden');
            confirmPassword.classList.add('border-red-400', 'ring-red-400/30');
            confirmPassword.classList.remove('border-green-400', 'ring-green-400/30');
        } else {
            // KAPAG MATCH: Itago ang error at gawing green ang border
            errorMessage.classList.add('hidden');
            confirmPassword.classList.remove('border-red-400', 'ring-red-400/30');
            confirmPassword.classList.add('border-green-400', 'ring-green-400/30');
        }
    }

    // --- 3. REAL-TIME CHECKING HABANG NAGTA-TYPE ---
    mainPassword.addEventListener('input', checkPasswords);
    confirmPassword.addEventListener('input', checkPasswords);

    // --- 4. ON-SUBMIT CHECKING (Para di maka-register pag mali) ---
    registerForm.addEventListener('submit', function(event) {
        if (mainPassword.value !== confirmPassword.value) {
            // Pipigilan nito yung form na mag-submit at mag-load sa next page
            event.preventDefault(); 
            
            alert("Please make sure your passwords match!");
            confirmPassword.focus(); // I-fofocus yung cursor sa confirm password
        }
    });

    // (Pwedeng isunod dito sa baba yung script mo para sa Eye Open/Closed)
