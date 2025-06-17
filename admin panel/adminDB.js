// UI Elements
const addBtn = document.getElementById("add-NFC");
const formCard = document.getElementById("add-NFC-div");
const cancelBtn = document.getElementById("cancel-add");

// Make the form area show when the plus button is clicked
addBtn.addEventListener("click", () => {
  // Hide the plus button
  addBtn.style.display = "none";

  //   Show the form area
  formCard.classList.add("show");
  formCard.style.maxHeight = formCard.scrollHeight + "px";
});

// Hide the from area when the cancel button is clicked
cancelBtn.addEventListener("click", () => {
  // Hide the from area
  formCard.classList.remove("show");
  formCard.style.maxHeight = "0px";
  // Show the plus button
  addBtn.style.display = "block";
});
