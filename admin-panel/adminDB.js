// UI Elements
const addBtn = document.getElementById("add-NFC");
const formCard = document.getElementById("add-NFC-div");
const cancelBtn = document.getElementById("cancel-add");
const submitBtn = document.getElementById("submit-add");

const table = document.getElementById("nfc-table");
const tableBody = document.getElementById("table-body");

const confirmDeleteToast = document.getElementById("confirm-delete-toast");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");

// Inputs
const reseller = document.getElementById("input-name");
const resellerPhone = document.getElementById("phone-number");
const NFCTagId = document.getElementById("nfc-tag-id");
const placeID = document.getElementById("placeID");

const facebookInput = document.getElementById("facebook");
const instagramInput = document.getElementById("instagram");
const youtubeInput = document.getElementById("youtube");
const tiktokInput = document.getElementById("tiktok");

// Socials Elements
const addSocialBtn = document.getElementById("add-social");
const removeSocialBtn = document.getElementById("remove-social");
const socialsDiv = document.getElementById("extra-socials");

// Edit Panel Elements
const editPanelBg = document.getElementById("edit-panel-background");
const editPanel = document.getElementById("edit-panel");
const editPanelCancelBtn = document.getElementById("edit-panel-cancel");
const editPanelConfirmBtn = document.getElementById("edit-panel-confirm");
const editPanelSocialsSection = document.getElementById(
  "edit-panel-socials-section"
);
let editPanelSocialsToDelete = [];
let editPanelSocialsOrignalInfo = [];
let editPanelSocialsToEdit = [];
let editPanelSocialsToAdd = 0;

// Booleans
let allowAdd = false;
let deleteConfirmed = false;

// Generic Functions
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Make the form area show when the plus button is clicked
addBtn.addEventListener("click", () => {
  // Hide the plus button
  addBtn.style.display = "none";

  //   Show the form area
  formCard.classList.add("show");
});

// Hide the from area when the cancel button is clicked
cancelBtn.addEventListener("click", () => {
  // Clear the values from the form area
  reseller.value = "";
  resellerPhone.value = "";
  NFCTagId.value = "";
  // Hide the from area
  formCard.classList.remove("show");
  // Show the plus button
  addBtn.style.display = "block";

  // Clear the inputs of the socials
  facebookInput.value = "";
  instagramInput.value = "";
  youtubeInput.value = "";
  tiktokInput.value = "";

  // Clear all the extra socials
  socialsDiv.innerHTML = "";
  removeSocialBtn.style.display = "none";
  extraSocials = 0;
});

// Create a global variable to store the orignal info of the row to be edited
let rowsBeingEditedInfo = [];

// Change the row to editable fields when the edit button is clicked
function editRow(e) {
  const rowToEdit = e.target.parentElement.parentElement.parentElement;
  const id = rowToEdit.querySelector("th:nth-child(1)").innerText;
  const resellerName = rowToEdit.querySelector("td:nth-child(2)").innerText;
  const resellerPhone = rowToEdit.querySelector("td:nth-child(3)").innerText;
  let nfcTagId = rowToEdit.querySelector("td:nth-child(5)").innerText;
  nfcTagId = nfcTagId.replace("Tag ID: ", ""); // Remove "Tag ID: " from the string
  const placeId = rowToEdit.querySelector("td:nth-child(6)").innerText;

  // Store the original row info in a global variable
  rowsBeingEditedInfo.push({
    id: id,
    resellerName: resellerName,
    resellerPhone: resellerPhone,
    nfcTagId: nfcTagId,
    placeId: placeId,
  });
  // Change the inner HTML of the row to editable fields
  rowToEdit.innerHTML = `
            <th>${id}</th>
            <td><input id="edit-input-name" type="text" class="form-control" value="${resellerName}"/></td>
            <td><input id="edit-input-phone" type="text" class="form-control" value="${resellerPhone}"/></td>
            <td>https://foodapp.com/restaraunt/1</td>
            <td><input id="edit-input-nfc-id" type="text" class="form-control" value="${nfcTagId}"/></td>
            <td><input id="edit-input-place-id" type="text" class="form-control" value="${placeId}"/></td>
            <td >
              <a cancel_edit_id ="${e.target.parentElement.getAttribute(
                "edit_id"
              )}" class="text-danger pointer cancel-edit p-0"><i class="hover fa-solid fa-xmark"></i></a>
              <a edit_id="${e.target.parentElement.getAttribute(
                "edit_id"
              )}" class="text-primary pointer confirm-edit ms-2 p-0"><i class="hover fa-solid fa-check"></i></a>
            </td>
  `;
}

// Cancel the edit and rever the row back to normal.
function cancelEdit(e) {
  let orignalRowInfo = {};
  // Revert the row back to normal
  const selectedRowId = e.target.parentElement.getAttribute("cancel_edit_id");
  // Find the original row info using the selectedRowId
  rowsBeingEditedInfo.forEach((row, i) => {
    if (row.id == selectedRowId) {
      orignalRowInfo = row;
      rowsBeingEditedInfo.splice(i, 1); // Remove the row from the array
    }
  });
  const rowToRevert = e.target.parentElement.parentElement.parentElement;
  rowToRevert.innerHTML = `
            <th class="p-2">${orignalRowInfo.id}</th>
            <td class="p-2">${orignalRowInfo.resellerName}</td>
            <td class="p-2">${orignalRowInfo.resellerPhone}</td>
            <td class="p-2">https://foodapp.com/restaraunt/${orignalRowInfo.id}</td>
            <td class="p-2">Tag ID: ${orignalRowInfo.nfcTagId}</td>
            <td class="p-2"> ${orignalRowInfo.placeId}</td>
            <td>
          <a info_id="${orignalRowInfo.id}" class="text-primary pointer info-row p-0">
          <i class="fa-solid fa-circle-info"></i></a>
              <a edit_id="${orignalRowInfo.id}" class="text-third pointer edit-row hover p-0"
                ><i class="hover fa-solid fa-pen-to-square"></i
              ></a>
              <a delete_id="${orignalRowInfo.id}" class="text-danger pointer delete-row hover p-0"
                ><i class="hover fa-solid fa-circle-xmark"></i
              ></a>
            </td>
  `;
}

// Socials UI Stuff

// Adding Extra/Custom socials
let extraSocials = 0;

// Event listener for add social button
addSocialBtn.addEventListener("click", () => {
  if (extraSocials == 0) {
    removeSocialBtn.style.display = "inline-block";
  }
  extraSocials += 1;

  const newSocialForm = document.createElement("div");
  newSocialForm.classList.add("mt-3", "custom-social", "col-12", "col-lg-3");
  newSocialForm.innerHTML = `
                <div class="form-floating">
                <input
                  id="extra-social-${extraSocials}-name"
                  type="text"
                  class="form-control"
                  id="platform"
                  placeholder="Platform Name"
                />
                <label for="extra-social-${extraSocials}-name">Platform Name</label>
              </div>
              <div class="form-floating">
                <input id="extra-social-${extraSocials}-link" type="text" class="form-control" placeholder=" " />
                <label for="extra-social-${extraSocials}-link" class="form-label social-label">Link</label>
              </div>
  `;

  socialsDiv.appendChild(newSocialForm);
});

// Remove the last social form
removeSocialBtn.addEventListener("click", () => {
  let lastSocial = document.getElementById(`extra-social-${extraSocials}-name`)
    .parentElement.parentElement;

  lastSocial.remove();

  extraSocials -= 1;

  // If there are no extra socials then hide the remove button
  if (extraSocials == 0) {
    removeSocialBtn.style.display = "none";
  }
});

// Edit Panel Stuff

// Bring up the edit panel when the edit button is clicked
function showEditPanel(e) {
  editPanelOrignalInfo = {};
  // Show the edit panel
  editPanelBg.style = "opacity:1; z-index: 10;";
  editPanel.classList.add("show");

  // Get the orignal info of the row

  const row = e.target.parentElement.parentElement.parentElement;
  editPanelOrignalInfo = {
    id: row.querySelector("th:nth-child(1)").innerText,
    resellerName: row.querySelector("td:nth-child(2)").innerText,
    resellerPhone: row.querySelector("td:nth-child(3)").innerText,
    link: row.querySelector("td:nth-child(4)").innerText,
    nfcTagId: row
      .querySelector("td:nth-child(5)")
      .innerText.replace("Tag ID: ", ""),
    placeId: row.querySelector("td:nth-child(6)").innerText,
  };

  // Fill in the edit panel with the orignal info
  document.getElementById("edit-panel-id").querySelector("input").value =
    editPanelOrignalInfo.id;
  document.getElementById("edit-panel-name").querySelector("input").value =
    editPanelOrignalInfo.resellerName;
  document.getElementById("edit-panel-phone").querySelector("input").value =
    editPanelOrignalInfo.resellerPhone;
  document.getElementById("edit-panel-link").querySelector("input").value =
    editPanelOrignalInfo.link;
  document.getElementById("edit-panel-placeId").querySelector("input").value =
    editPanelOrignalInfo.placeId;
  document.getElementById("edit-panel-tagId").querySelector("input").value =
    editPanelOrignalInfo.nfcTagId;

  // Get the socials links from the databse and display them
  editPanelShowSocials(editPanelOrignalInfo.placeId);
}

// Event listener for the edit panel cancel button
editPanelCancelBtn.addEventListener("click", () => {
  // Clear all the input's values in the edit panel
  const editPanelInputs = Array.from(
    document.getElementById("edit-panel-inputs").children
  );

  // Loop through all the input's and clear their values
  editPanelInputs.forEach((input) => {
    input.querySelector("input").value = "";
  });

  // Hide the edit panel
  editPanelBg.style = "opacity:0; z-index: -10;";
  editPanel.classList.remove("show");

  // Clear the socials section
  editPanelSocialsSection.innerHTML = "";

  // Reset the variables
  editPanelSocialsToDelete = [];
  editPanelSocialsToEdit = [];
  editPanelSocialsToAdd = 0;
});

// Event listener for the edit panel confirm button
editPanelConfirmBtn.addEventListener("click", (e) => {
  const editPanelInputs = e.target.parentElement.parentElement.parentElement
    .querySelector(".card-body")
    .querySelector("#edit-panel-inputs");

  // Get the new inputs values
  const editId = editPanelInputs.children[0].querySelector("input").value;
  const resellerName = editPanelInputs.children[1].querySelector("input").value;
  const resellerPhone =
    editPanelInputs.children[2].querySelector("input").value;
  let nfcTagId = editPanelInputs.children[4].querySelector("input").value;
  nfcTagId = nfcTagId.replace("Tag ID: ", ""); // Remove "Tag ID: " from the string
  const placeId = editPanelInputs.children[5].querySelector("input").value;

  // Create an object with the new values
  const editedRowInfo = {
    id: editId,
    resellerName: resellerName,
    resellerPhone: resellerPhone,
    nfcTagId: nfcTagId,
    placeId: placeId,
  };

  if (
    editedRowInfo.resellerName !== editPanelOrignalInfo.resellerName ||
    editedRowInfo.resellerPhone !== editPanelOrignalInfo.resellerPhone ||
    editedRowInfo.nfcTagId !== editPanelOrignalInfo.nfcTagId ||
    editedRowInfo.placeId !== editPanelOrignalInfo.placeId
  ) {
    // Send the edited row info to the server
    fetch("/update", {
      headers: { "Content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(editedRowInfo),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success) {
        }
      });

    // If placeId was changed then also update the placeId in the socials table
    // if (editedRowInfo.placeId !== editPanelOrignalInfo.placeId) {
    //   placeIDs = {
    //     oldPlaceId: editPanelOrignalInfo.placeId,
    //     newPlaceId: editedRowInfo.placeId,
    //   };
    //   fetch("/update-socials-placeid", {
    //     headers: { "Content-Type": "application/json" },
    //     method: "POST",
    //     body: JSON.stringify(placeIDs),
    //   });
    // }
  }

  // Update the row in the table with the new values
  const rowToUpdate = table.querySelector(`[info_id="${editedRowInfo.id}"]`)
    .parentElement.parentElement;
  rowToUpdate.innerHTML = `
            <th class="p-2">${editedRowInfo.id}</th>
            <td class="p-2">${editedRowInfo.resellerName}</td>
            <td class="p-2">${editedRowInfo.resellerPhone}</td>
            <td class="p-2">https://foodapp.com/restaraunt/${editedRowInfo.id}</td>
            <td class="p-2">Tag ID: ${editedRowInfo.nfcTagId}</td>
            <td class="p-2"> ${editedRowInfo.placeId}</td>
            <td>
            <a info_id="${editedRowInfo.id}" class="text-primary pointer info-row p-0">
            <i class="fa-solid fa-circle-info"></i></a>
              <a edit_id="${editedRowInfo.id}" class="text-third pointer edit-row hover p-0"
                ><i class="hover fa-solid fa-pen-to-square"></i
              ></a>
              <a delete_id="${editedRowInfo.id}" class="text-danger pointer delete-row hover p-0"
                ><i class="hover fa-solid fa-circle-xmark"></i
              ></a>
            </td>
  `;

  // Socials Updates
  // Delete the socials from the database if there are any to delete
  if (editPanelSocialsToDelete.length > 0) {
    // Delete the socials from the database
    fetch("/delete-socials", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        socials: editPanelSocialsToDelete,
        placeId: editedRowInfo.placeId,
      }),
    });
  }

  // Edit the socials in the database if there are any to edit/update
  let editPanelConfirmedSocialDivs = Array.from(
    document.getElementById("edit-panel-socials-section").children
  );
  let editPanelConfirmedSocialValues = [];

  editPanelConfirmedSocialDivs.forEach((social) => {
    // Exclude newly added socials and the plus social button
    if (!social.classList.contains("edit-panel-custom-social") && !social.id) {
      link = social.querySelector(".form-control").value;
      platform = social.querySelector(".form-label").innerText.trim();
      editPanelConfirmedSocialValues.push({ [platform]: link });
    }
  });

  const changes = editPanelConfirmedSocialValues.filter((newSocial) => {
    // New Values
    const [platform, link] = Object.entries(newSocial)[0];

    // Check if they are duplicate, and only return if its not true
    return !editPanelSocialsOrignalInfo.some((originalSocial) => {
      // New Values
      const [origPlatform, origLink] = Object.entries(originalSocial)[0];
      return origPlatform === platform && origLink === link;
    });
  });

  if (changes.length > 0) {
    console.log("There are changes to be made");
    fetch("/edit-socials", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        placeId: editedRowInfo.placeId,
        changes: changes,
      }),
    });
  }

  // Check to see if any socials were added
  if (editPanelSocialsToAdd > 0) {
    let addedSocials = [];
    let addedSocialsData = [];

    // To check if a its a duplicate addition
    let platforms = [];
    let orignalPlatforms = [];

    // Get the platform and links of all the new added socials
    const editPanelAllSocials = Array.from(editPanelSocialsSection.children);
    editPanelAllSocials.forEach((social) => {
      if (social.classList.contains("edit-panel-custom-social")) {
        addedSocials.push(social);
      } else if (social.classList.contains("edit-panel-social")) {
        const platform = social.querySelector("input").id;
        orignalPlatforms.push(platform);
      }
    });
    // Loop through the added socials and get its data
    addedSocials.forEach((social, i) => {
      let platform = social
        .querySelector(`#extra-social-${i + 1}-name`)
        .value.toLowerCase();
      let link = social
        .querySelector(`#extra-social-${i + 1}-link`)
        .value.toLowerCase();

      addedSocialsData.push({ platform: platform, link: link });
      platforms.push(platform);
    });

    // Get rid of platfroms which are already there
    platforms = platforms.filter((social) => {
      return !orignalPlatforms.includes(social);
    });

    // Only keep the added socials which are in platform array
    addedSocialsData = addedSocialsData.filter((social) => {
      return platforms.includes(social.platform);
    });

    // Clear all empty socials
    addedSocialsData = addedSocialsData.filter((social) => {
      return social.platform && social.link;
    });

    socials = {};

    addedSocialsData.forEach((social) => {
      socials[social.platform] = social.link;
    });

    let socialsRequest = { placeId: editedRowInfo.placeId, socials: socials };

    fetch("/insert-socials", {
      headers: { "Content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(socialsRequest),
    });
  }

  // Clear all the input's values in the edit panel
  const panelInputs = Array.from(
    document.getElementById("edit-panel-inputs").children
  );

  // Loop through all the input's and clear their values
  panelInputs.forEach((input) => {
    input.querySelector("input").value = "";
  });

  // Hide the edit panel
  editPanelBg.style = "opacity:0; z-index: -10;";
  editPanel.classList.remove("show");

  // Clear Socials
  editPanelSocialsSection.innerHTML = "";

  // Reset the variables
  editPanelSocialsToDelete = [];
  editPanelSocialsToEdit = [];
  editPanelSocialsToAdd = 0;
});

// Event Listener for deleting social
editPanelSocialsSection.addEventListener("click", (e) => {
  let platformToDelete;
  // If button (or icon inside the button) is pressed
  if (
    e.target.classList.contains("edit-panel-delete-social") ||
    e.target.classList.contains("edit-panel-delete-social-button")
  ) {
    if (e.target.getAttribute("platform")) {
      platformToDelete = e.target.getAttribute("platform");
    } else {
      platformToDelete = e.target.parentElement.getAttribute("platform");
    }
    editPanelSocialsToDelete.push(platformToDelete);

    // Delete the social from the UI
    e.target.closest(".edit-panel-social").remove();
  } else if (
    e.target.classList.contains("edit-panel-add-social") ||
    e.target.classList.contains("edit-panel-add-social-button")
  ) {
    editPanelAddSocial();
  }
});
// NON UI STUFF
// !!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!

// Load everything when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  fetch("/get")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data["error"] === "DBError") {
        tableBody.innerHTML = "<h1>Database Error...</h1>";
      } else if (data["data"].length == 0) {
        tableBody.innerHTML = "<h1>No Data</h1>";
      } else {
        loadData(data["data"]);
      }
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
  if (tableBody.innerHTML == "<h1>No Data</h1>") {
    tableBody.innerHTML = "";
  }
  const tableRow = document.createElement("tr");

  // The Inner HTML inside the table row
  tableRow.innerHTML = `
  <th class="p-2">${row.ID}</th>
  <td class="p-2">${row.Reseller}</td>
  <td class="p-2">${row.Reseller_Phone}</td>
  <td class="p-2">${row.Link}</td>
  <td class="p-2">Tag ID: ${row.NFC_tag_id}</td>
  <td class="p-2">${row.Place_ID}</td>
  <td>
    <a info_id="${row.ID}" class="text-primary pointer info-row p-0">
    <i class="fa-solid fa-circle-info"></i></a>
    <a edit_id="${row.ID}" class="text-third pointer edit-row p-0"><i class="hover fa-solid fa-pen-to-square"></i></a>
    <a delete_id="${row.ID}" class="text-danger pointer delete-row p-0"><i class="hover fa-solid fa-circle-xmark"></i></a>
  </td>
  `;

  table.appendChild(tableRow);
}

// Submit
submitBtn.addEventListener("click", () => {
  if (
    reseller.value &&
    resellerPhone.value &&
    Number.isInteger(parseInt(NFCTagId.value, 10)) &&
    resellerPhone.value.length < 21 &&
    placeID.value != ""
  ) {
    allowAdd = true;
  }
  // If all the values are valid then add the new nfc tag to the database
  if (allowAdd) {
    info = {
      reseller: reseller.value,
      phone: resellerPhone.value,
      NfcId: NFCTagId.value,
      placeID: placeID.value,
    };
    addNewNFCTag(info);

    // Create a socials object to store all the socials
    let socialsRequest = {};
    let socials = {
      facebook: facebookInput.value,
      instagram: instagramInput.value,
      youtube: youtubeInput.value,
      tiktok: tiktokInput.value,
    };

    // Clear the empty values from the socials object
    for (let key in socials) {
      if (!socials[key]) {
        delete socials[key];
      }
    }

    // Loop through all the extra socials and add them to the socials object
    if (extraSocials > 0) {
      for (let i = 1; i <= extraSocials; i++) {
        const extraSocialName = document.getElementById(
          `extra-social-${i}-name`
        );
        const extraSocialLink = document.getElementById(
          `extra-social-${i}-link`
        );
        // Only add the social if both the name and link are provided
        if (extraSocialName.value && extraSocialLink.value) {
          socials[extraSocialName.value] = extraSocialLink.value;
        }
      }
    }

    // Add the socials to the database
    // Assign placeId to the socials object
    socialsRequest.placeId = placeID.value;
    socialsRequest.socials = socials;

    // Check To see if the the place id already has a social. To prevent duplicate platforms for each place id
    fetch("/get-socials", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ placeId: socialsRequest.placeId }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.data.length > 0) {
          // If socialsRequest socials platform and link is the same, then no need to add it again to the database, so delete it
          data.data.forEach((item) => {
            if (socialsRequest.socials[item.platform] === item.Link) {
              delete socialsRequest.socials[item.platform];
            }

            // If the link of a platfrom already there is changed, then change the platforms link in the database aswell
          });
        }
      });

    // If the length of the socials object is more than 1 then there are socials to add
    if (Object.keys(socials).length > 1) {
      fetch("/insert-socials", {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(socialsRequest),
      });
    }

    // Clear the values from the form area    console.log("Clear Inputs");
    reseller.value = "";
    resellerPhone.value = "";
    NFCTagId.value = "";
    placeID.value = "";

    // Clear the inputs of the socials
    facebookInput.value = "";
    instagramInput.value = "";
    youtubeInput.value = "";
    tiktokInput.value = "";

    // Hide the from area
    formCard.classList.remove("show");
    // Show the plus button
    addBtn.style.display = "block";
  }
});

// Add a new nfc tag to the database
function addNewNFCTag(info) {
  fetch("/insert", {
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
  // Delete the row if the delete button is clicked
  if (e.target && e.target.parentElement.classList.contains("delete-row")) {
    confirmDeleteRow(e);
  }
  // If the button pressed is the edit button then turn the row into an editable row
  else if (e.target && e.target.parentElement.classList.contains("edit-row")) {
    editRow(e);
  }
  // If the button pressed is the cancel edit button then revert the row back to normal
  else if (e.target.parentElement.classList.contains("cancel-edit")) {
    cancelEdit(e);
  }

  // If the button pressed is the confirm edit button then save the changes
  else if (e.target.parentElement.classList.contains("confirm-edit")) {
    editConfirmed(e);
  }
  // If the button pressed is the info button then show the info panel
  else if (e.target.parentElement.classList.contains("info-row")) {
    showEditPanel(e);
  }
});

function confirmDeleteRow(e) {
  // Show the delete conformation section
  confirmDeleteToast.classList.add("show");
  tryDeleteRow = e.target.parentElement;
}

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

// Actually delete the row
function deleteRow() {
  if (deleteConfirmed) {
    delete_info = { delete_id: tryDeleteRow.getAttribute("delete_id") };

    fetch("delete", {
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

// Edit the row once the confirm edit button is clicked
function editConfirmed(e) {
  // Get the values from the input fields
  const rowToEdit = e.target.parentElement.parentElement.parentElement;
  const editId = e.target.parentElement.getAttribute("edit_id");
  const resellerName = rowToEdit
    .querySelector("td:nth-child(2)")
    .querySelector("input").value;
  const resellerPhone = rowToEdit
    .querySelector("td:nth-child(3)")
    .querySelector("input").value;
  let nfcTagId = rowToEdit
    .querySelector("td:nth-child(5)")
    .querySelector("input").value;
  nfcTagId = nfcTagId.replace("Tag ID: ", ""); // Remove "Tag ID: " from the string
  const placeId = rowToEdit
    .querySelector("td:nth-child(6)")
    .querySelector("input").value;

  // Create an object with the new values
  const editedRowInfo = {
    id: editId,
    resellerName: resellerName,
    resellerPhone: resellerPhone,
    nfcTagId: nfcTagId,
    placeId: placeId,
  };

  rowsBeingEditedInfo.forEach((row, i) => {
    if (row.id == editId) {
      orignalRowInfo = row;
      rowsBeingEditedInfo.splice(i, 1); // Remove the row from the array
    }
  });

  // Check to see if any changes were made
  if (
    editedRowInfo.resellerName !== orignalRowInfo.resellerName ||
    editedRowInfo.resellerPhone !== orignalRowInfo.resellerPhone ||
    editedRowInfo.nfcTagId !== orignalRowInfo.nfcTagId ||
    editedRowInfo.placeId !== orignalRowInfo.placeId
  ) {
    // Send the edited row info to the server
    fetch("/update", {
      headers: { "Content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(editedRowInfo),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          console.log("success");
          // Update the row with the edited values
          rowToEdit.innerHTML = `
            <th class="p-2">${editedRowInfo.id}</th>
            <td class="p-2">${editedRowInfo.resellerName}</td>
            <td class="p-2">${editedRowInfo.resellerPhone}</td>
            <td class="p-2">https://foodapp.com/restaraunt/${editedRowInfo.id}</td>
            <td class="p-2">Tag ID: ${editedRowInfo.nfcTagId}</td>
            <td class="p-2"> ${editedRowInfo.placeId}</td>
            <td>
            <a info_id="${editedRowInfo.id}" class="text-primary pointer info-row p-0">
            <i class="fa-solid fa-circle-info"></i></a>
              <a edit_id="${editedRowInfo.id}" class="text-primary pointer edit-row hover p-0"
                ><i class="hover fa-solid fa-pen-to-square"></i
              ></a>
              <a delete_id="${editedRowInfo.id}" class="text-danger pointer delete-row hover p-0"
                ><i class="hover fa-solid fa-circle-xmark"></i
              ></a>
            </td>
  `;
        }
      });
  } else {
    // If no changes were made then revert the row back to normal
    rowToEdit.innerHTML = `
            <th class="p-2">${orignalRowInfo.id}</th>
            <td class="p-2">${orignalRowInfo.resellerName}</td>
            <td class="p-2">${orignalRowInfo.resellerPhone}</td>
            <td class="p-2">https://foodapp.com/restaraunt/${orignalRowInfo.id}</td>
            <td class="p-2">Tag ID: ${orignalRowInfo.nfcTagId}</td>
            <td class="p-2"> ${orignalRowInfo.placeId}</td>
            <td>
            <a info_id="${orignalRowInfo.id}" class="text-primary pointer info-row p-0">
            <i class="fa-solid fa-circle-info"></i></a>
              <a edit_id="${orignalRowInfo.id}" class="text-third pointer edit-row hover p-0"
                ><i class="hover fa-solid fa-pen-to-square"></i
              ></a>
              <a delete_id="${orignalRowInfo.id}" class="text-danger pointer delete-row hover p-0"
                ><i class="hover fa-solid fa-circle-xmark"></i
              ></a>
            </td>
  `;
  }
}

// Show the socials in the edit panel
function editPanelShowSocials(placeID) {
  fetch("/get-socials", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ placeId: placeID }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.data.length > 0) {
        data.data.forEach((social) => {
          const socialDiv = document.createElement("div");
          socialDiv.classList.add("mt-3", "edit-panel-social");
          socialDiv.innerHTML = `
          <div class="form-floating">
                  <input
                    id="${social.platform}"
                    type="text"
                    class="form-control"
                    placeholder=" "
                    value="${social.Link}"
                  />
                  <label for="${
                    social.platform
                  }" class="form-label social-label"
                    ><i class="${iconSelector(social.platform)}"></i>
                    ${capitalize(social.platform)}
                  </label>
                  <button platform="${
                    social.platform
                  }" class="btn btn-danger btn-xsm edit-panel-delete-social-button">
                    <i class="fa-solid fa-minus edit-panel-delete-social"></i>
                  </button>
                </div>`;

          editPanelSocialsSection.appendChild(socialDiv);
        });

        // Add the Plus social button in the end
        const plusSocialButton = document.createElement("div");
        plusSocialButton.classList.add("mt-3");
        plusSocialButton.id = "edit-panel-button-container";

        plusSocialButton.innerHTML = `<div id="edit-panel-add-button-container">
                  <button platform="" class="btn btn-success btn-xsm edit-panel-add-social-button">
                    <i class="fa-solid fa-plus edit-panel-add-social"></i>
                  </button>
                </div>`;
        editPanelSocialsSection.appendChild(plusSocialButton);
      } else {
        editPanelSocialsSection.innerHTML = `
              <div id="edit-panel-add-social-button-div" class="mt-3">
                <div id="edit-panel-add-button-container">
                  <button platform="" class="btn btn-success btn-xsm edit-panel-add-social-button">
                    <i class="fa-solid fa-plus edit-panel-add-social"></i>
                  </button>
                </div>
              </div>`;
      }

      // Get all the orignal info of the socials
      socialsArr = Array.from(editPanelSocialsSection.children);

      if (socialsArr.length > 1) {
        socialsArr.forEach((social) => {
          if (!social.id) {
            link = social.querySelector(".form-control").value;
            platform = social.querySelector(".form-label").innerText.trim();
            editPanelSocialsOrignalInfo.push({ [platform]: link });
          }
        });
      }
    });
}

function iconSelector(platform) {
  const icons = {
    facebook: "fa-brands fa-square-facebook",
    instagram: "fa-brands fa-square-instagram",
    youtube: "fa-brands fa-youtube",
    tiktok: "fa-brands fa-tiktok",
    twitter: "fa-brands fa-square-x-twitter", // X (Twitter)
    x: "fa-brands fa-square-x-twitter",
    linkedin: "fa-brands fa-linkedin",
    snapchat: "fa-brands fa-square-snapchat",
    pinterest: "fa-brands fa-square-pinterest",
    github: "fa-brands fa-square-github",
    reddit: "fa-brands fa-reddit",
    discord: "fa-brands fa-discord",
    whatsapp: "fa-brands fa-square-whatsapp",
    telegram: "fa-brands fa-telegram",
    snap: "fa-brands fa-square-snapchat",
  };

  return icons[platform.toLowerCase()];
}

function editPanelAddSocial() {
  editPanelSocialsToAdd += 1;

  const newSocialForm = document.createElement("div");
  newSocialForm.classList.add(
    "mt-3",
    "edit-panel-social",
    "edit-panel-custom-social"
  );
  newSocialForm.innerHTML = `
                <div class="form-floating">
                <input
                  id="extra-social-${editPanelSocialsToAdd}-name"
                  type="text"
                  class="form-control"
                  id="platform"
                  placeholder="Platform Name"
                />
                <label for="extra-social-${editPanelSocialsToAdd}-name">Platform Name</label>
              </div>
              <div class="form-floating">
                <input id="extra-social-${editPanelSocialsToAdd}-link" type="text" class="form-control" placeholder=" " />
                <label for="extra-social-${editPanelSocialsToAdd}-link" class="form-label social-label">Link</label>
              </div>
  `;

  editPanelSocialsSection.insertBefore(
    newSocialForm,
    editPanelSocialsSection.lastElementChild
  );
}

// // Logout Once DOM closes
// window.addEventListener("beforeunload", () => {
//   fetch("/logout");
// });
