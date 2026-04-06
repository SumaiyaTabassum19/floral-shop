document.getElementById("signupForm").addEventListener("submit", function(event){
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password.length < 6) {
        alert("Password must be at least 6 characters long!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    alert("Sign Up Successful! 🌸");
    document.getElementById("signupForm").reset();
});
