// All UI ELEMENTS
const loginBtn = document.getElementById("login");
const invalidPWDToast = document.getElementById("invalid-password-toast");
const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");

// Event listeners

// Listen for login
loginBtn.addEventListener("click", () => {
  requestBody = {
    username: usernameField.value,
    password: passwordField.value,
  };

  fetch("/auth/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        window.location.href = data.redirect;
        console.log("Login Success");
      } else {
        wrongCreds();
      }
    });
});

// Function if credenntials are wrong
function wrongCreds() {
  invalidPWDToast.classList.add("show");
  //  Auto-hide after 3 seconds
  setTimeout(() => {
    invalidPWDToast.classList.remove("show");
  }, 3000);
}
