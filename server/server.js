// All the required modlues
// Require Express
const express = require("express");
const app = express(); // Create the express app

// Require express-session
const session = require("express-session");

// Require cors to be able to communicate betweeen hosts
const cors = require("cors");

// Require dotenv
const dotenv = require("dotenv");
dotenv.config({ path: ".env" }); // Configure dotenv to get the variables from the .env file

// Import the functions from dbService
const dbService = require("./dbService");

// To make working paths (because + doesn't work properly when using res.sendFile)
const path = require("path");

// Set enviroment
app.set("env", process.env.ENVIROMENT || "development");

// Set the view engine to use ejs and set the folder where me ejs files are located
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "EJS"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "foodPlaces.sid",
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

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
  const placeId = request.body.placeID;

  const db = dbService.getDbServiceInstance();

  const result = db.addNewNfc(name, phoneNumber, nfcId, placeId);

  result
    .then((data) => {
      response.json({ data: data });
    })
    .catch((error) => console.log(error));
});

// Add socials
app.post("/insert-socials", (req, res) => {
  const socials = req.body;

  const db = dbService.getDbServiceInstance();
  const result = db.addSocials(socials.placeId, socials.socials);
});

// Read
app.get("/get", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();
  result.then((data) => {
    if (data instanceof Error) {
      console.log(data);
      response.json({ error: "DBError", errorMessage: data.message });
    } else {
      response.json({ data: data });
    }
  });
  // .catch((error) => {
  //   console.log(error);
  // });
});

// Get Socials
app.post("/get-socials", (req, res) => {
  const placeId = req.body.placeId;

  const db = dbService.getDbServiceInstance();
  const socialsList = db.getSocials(placeId);
  socialsList.then((data) => {
    res.json({ data: data });
  });
});

// Update
app.post("/update", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const updateNfcRes = db.updateNfc(
    request.body.id,
    request.body.resellerName,
    request.body.resellerPhone,
    request.body.nfcTagId,
    request.body.placeId
  );
  updateNfcRes.then((data) => {
    if (data.success) {
      response.json({ success: true });
    } else {
      response.json({ success: false });
    }
  });
});

// Update socials placeid
app.post("/edit-socials", (req, res) => {
  const db = dbService.getDbServiceInstance();

  db.editSocials(req.body).then((data) => {
    console.log(data);
  });
});

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

// Delete Socials
app.post("/delete-socials", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const socialsToDelete = request.body.socials;
  const placeId = request.body.placeId;

  db.deleteSocials(socialsToDelete, placeId).then((data) => {
    return data;
  });
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

// Check Password Query
app.post("/auth/user", (req, res) => {
  const db = dbService.getDbServiceInstance();

  const username = req.body.username;
  const password = req.body.password;

  user = db.authenticateUser(username, password);
  user.then((data) => {
    if (data.length > 0) {
      // If user is successfully authenticated
      req.session.regenerate((err) => {
        if (err) {
          return res
            .status(500)
            .send("Login Successful but something went wrong");
        }

        req.session.isAuthenticated = true;
        req.session.username = req.body.username;
        // After Generating cookie send response
        res.json({ success: true, redirect: "/admin" });
      });
    } else {
      // If something goes wrong
      res.json({ success: false });
    }
  });
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!
// Admin Page
// Only send JS file if authenticated
app.get("/adminDB.js", (req, res) => {
  if (req.session.isAuthenticated) {
    res.sendFile(path.join(__dirname, "../admin-panel/adminDB.js"));
  } else {
    // temorarily allow access to admin page without login
    res.sendFile(path.join(__dirname, "../admin-panel/adminDB.js"));
  }
});

// Redirect to admin DB
app.get("/admin", (req, res, next) => {
  if (req.session.isAuthenticated) {
    res.sendFile(path.join(__dirname, "../admin-panel/adminDB.html"));
    // console.log("redirect to admin");
  } else {
    // Temporarily allow access to admin page without login
    // res.sendFile(path.join(__dirname, "../admin-panel/adminDB.html"));
    next();
  }
});

// Logout method - delete cookie and destroy session
app.use("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("foodPlaces.sid");
  res.redirect("/");
});

// Run the server on given port
app.listen(process.env.PORT, () => {
  console.log(" Server Running");
});

// Make the links work
// Use route parameters to get the id part of the link, then send the id to the dbService and get the PlaceID
app.get("/restaurant/:id/", (req, res, next) => {
  db = dbService.getDbServiceInstance();

  // Get place id by link id
  const getPlaceId = db.getPlaceIdByLinkId(req.params.id);

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

  // Render the EJS page with the placeId and socials
  getPlaceId.then((response) => {
    if (response !== null) {
      let placeId = response;
      socials = db.getSocials(placeId).then((response) => {
        response.forEach((item) => {
          item.icon = iconSelector(item.platform);
        });
        res.render("restaurant", { placeId: placeId, socials: response });
      });
    } else next();
  });
});
