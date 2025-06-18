const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./server/.env" });

const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create
app.post("/insert", (request, response) => {
  const name = request.body.reseller;
  const phoneNumber = request.body.phone;
  const nfcId = request.body.NfcId;

  const db = dbService.getDbServiceInstance();

  const result = db.addNewNfc(name, phoneNumber, nfcId);

  result
    .then((data) => {
      response.json({ data: data });
    })
    .catch((error) => console.log(error));
});

// Read
app.get("/get", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();
  result
    .then((data) => {
      response.json({ data: data });
    })
    .catch((error) => {
      console.log(error);
    });
});

// Update

// Delete
app.post("/delete", (request, response) => {
  const db = dbService.getDbServiceInstance();
  deleteConfirmation = db.deleteNfc(request.body.delete_id);
  deleteConfirmation.then((confirmed) => {
    if (confirmed.success) {
      response.json({ successfully_deleted: true });
    }
  });
});

// Run the server locally
app.listen(process.env.PORT, () => {
  console.log(" Server Running");
});
