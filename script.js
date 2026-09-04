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