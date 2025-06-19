// UI Elements
const addBtn = document.getElementById("add-NFC");
const formCard = document.getElementById("add-NFC-div");
const cancelBtn = document.getElementById("cancel-add");
const submitBtn = document.getElementById("submit-add");
const table = document.getElementById("nfc-table");
const confirmDeleteToast = document.getElementById("confirm-delete-toast");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");
// List of deleteRowBtns
let deleteRowBtns;

// Inputs
const reseller = document.getElementById("input-name");
const resellerPhone = document.getElementById("phone-number");
const NFCTagId = document.getElementById("nfc-tag-id");

// Booleans
let allowAdd = false;
let deleteConfirmed = false;

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
  // Clear the values from the form area
  reseller.value = "";
  resellerPhone.value = "";
  NFCTagId.value = "";
  // Hide the from area
  formCard.classList.remove("show");
  formCard.style.maxHeight = "0px";
  // Show the plus button
  addBtn.style.display = "block";
});

// The actual stuff
// !!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!

// Load everything when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  fetch("/get")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      loadData(data["data"]);
    });
});

// All the side functions
// Load all data
function loadData(data) {
  data.forEach((row) => {
    loadRow(row);
  });
}

// loads Row
function loadRow(row) {
  const tableRow = document.createElement("tr");

  // The Inner HTML inside the table row
  tableRow.innerHTML = `
  <th class="p-2">${row.ID}</th>
  <td class="p-2">${row.Reseller}</td>
  <td class="p-2">${row.Reseller_Phone}</td>
  <td class="p-2">${row.Link}</td>
  <td class="p-2">Tag ID: ${row.NFC_tag_id}</td>
  <td>
  <a  delete_id="${row.ID}" class="text-danger pointer delete-row">
  <i class="fa-solid fa-circle-xmark"></i>
  </a>
  </td>
  `;

  table.appendChild(tableRow);
}

// Add New row to UI after adding to DB
function addNewRow(data) {
  console.log(data);
}

// Submit
submitBtn.addEventListener("click", () => {
  if (
    reseller.value &&
    resellerPhone.value &&
    Number.isInteger(parseInt(NFCTagId.value, 10))
  ) {
    allowAdd = true;
  }
  if (allowAdd) {
    info = {
      reseller: reseller.value,
      phone: resellerPhone.value,
      NfcId: NFCTagId.value,
    };
    addNewNFCTag(info);

    // Clear the values from the form area
    reseller.value = "";
    resellerPhone.value = "";
    NFCTagId.value = "";
    // Hide the from area
    formCard.classList.remove("show");
    formCard.style.maxHeight = "0px";
    // Show the plus button
    addBtn.style.display = "block";
  }
});

// Add a new nfc tag to the database
function addNewNFCTag(info) {
  fetch("http://localhost:5000/insert", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(info),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      loadRow(data["data"]);
    });
}

// Delete NFC tag from database
// Variable for the selected item to be deleted
let tryDeleteRow;

// put event listener on table and listen for a click. Then use delegation to delete the proper item.
table.addEventListener("click", (e) => {
  confirmDeleteRow(e);
});

// Event listeners for the confirm delete and cancel delete buttons
confirmDeleteBtn.addEventListener("click", () => {
  // allow the deletetion to happen
  deleteConfirmed = true;
  deleteRow();

  // Hide the delete toast
  confirmDeleteToast.classList.remove("show");
});
cancelDeleteBtn.addEventListener("click", () => {
  // Dont allow the delete
  deleteConfirmed = false;

  // Hide the delete toast
  confirmDeleteToast.classList.remove("show");

  tryDeleteRow = "";
});

function confirmDeleteRow(e) {
  if (e.target && e.target.parentElement.classList.contains("delete-row")) {
    // Show the delete conformation section
    confirmDeleteToast.classList.add("show");
    tryDeleteRow = e.target.parentElement;
  }
}

// Actually delete the row
function deleteRow() {
  if (deleteConfirmed) {
    delete_info = { delete_id: tryDeleteRow.getAttribute("delete_id") };

    fetch("http://localhost:5000/delete", {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(delete_info),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.successfully_deleted) {
          table
            .querySelector(`[delete_id="${delete_info.delete_id}"]`)
            .parentElement.parentElement.remove();
        }
      });
  }
}
