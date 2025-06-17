// All UI ELEMENTS
const loginBtn = document.getElementById("login");
const invalidPWDToast = document.getElementById("invalid-password-toast");

// Event listeners

// Listen for login
loginBtn.addEventListener("click", () => {
  invalidPWDToast.classList.add("show");
  invalidPWDToast.style.maxWidth = invalidPWDToast.scrollWidth + "px";

  //  Auto-hide after 3 seconds
  setTimeout(() => {
    invalidPWDToast.classList.remove("show");
    //   invalidPWDToast.style.maxWidth = "0px";
  }, 3000);
});
