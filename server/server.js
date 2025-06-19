const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./server/.env" });

const dbService = require("./dbService");

// To make working paths (because + doesn't work properly when using res.sendFile)
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Show the public files
app.use(express.static(path.join(__dirname, "../public")));

// !!!!!!!!!!!!!!!!!
// To use google apis
// Geocode api
app.post("/api/geocode", async (req, res) => {
  const address = req.body.address;
  // console.log(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_API_KEY}`;

  try {
    const geoRes = await fetch(url);
    const geoData = await geoRes.json();
    return res.json(geoData);
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});

// Seearch Nearby api
app.post("/api/search-nearby", async (req, res) => {
  try {
    const placesResponse = await fetch(
      `https://places.googleapis.com/v1/places:searchNearby`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask": req.headers["x-goog-fieldmask"],
        },
        body: JSON.stringify(req.body),
      }
    );
    const placesData = await placesResponse.json();
    return res.json(placesData);
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});
// END OF GOOGLE API USE
// !!!!!!!!!!!!!!
// !!!!!!!!!!!!!!

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

// !!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!
// Login page

// Serve the public files in folder /public so that login page can access the css files
app.use("/public", express.static(path.join(__dirname, "../public")));

// Allow express to send all files from login folder as requested by browser
app.use(express.static(path.join(__dirname, "../dashboard-login")));

// Login page code
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../dashboard-login/login.html"));
});
