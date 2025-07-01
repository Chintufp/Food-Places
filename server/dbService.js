const mysql = require("mysql2");
const dotenv = require("dotenv");
let serviceInstance = null;
dotenv.config({ path: "./server/.env" });

// Create a pool of connections (5 connections)

const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DBUSERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});
// // Log the connectionos
// console.log("All:", connection._allConnections.length);
// console.log("Free:", connection._freeConnections.length);
// console.log("Waiting:", connection._connectionQueue.length);

class DbService {
  static getDbServiceInstance() {
    if (serviceInstance) {
      return serviceInstance;
    } else {
      return new DbService();
    }
  }

  // !!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!
  // Admin Page Queries!

  //   Get all Rows
  async getAllData() {
    // console.log("GET NFC");
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM nfc_tag_links;";

        connection.query(query, (err, results) => {
          if (err) {
            return reject(new Error(err.message));
          }

          resolve(results);
        });
      });
      //   console.log(response);
      return response;
    } catch (error) {
      return error;
    }
  }

  //   Add new row
  async addNewNfc(reseller, phone, nfcId, placeId) {
    try {
      const addRequest = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO nfc_tag_links (Reseller, Reseller_Phone,NFC_tag_id, Place_ID) VALUES(?,?,?,?);";
        connection.query(
          query,
          [reseller, phone, nfcId, placeId],
          (err, result) => {
            if (err) {
              return reject(new Error(err.message));
            }

            resolve(result);
          }
        );
      });

      //   Using the Row's id, Update the empty link section of the row, with a new unique link

      const linkId = addRequest.insertId;

      //   New Unique Link
      const link = `${process.env.URL}/restaraunt/${linkId}`;

      await new Promise((resolve, reject) => {
        const updateAddRequestQuery =
          "UPDATE nfc_tag_links SET Link = ? WHERE ID = ?";
        connection.query(
          updateAddRequestQuery,
          [link, linkId],
          (err, result) => {
            if (err) {
              return reject(err.message);
            }
            resolve(result);
          }
        );
      });

      return {
        ID: addRequest.insertId,
        Reseller: reseller,
        Reseller_Phone: phone,
        NFC_tag_id: nfcId,
        Link: link,
        Place_ID: placeId,
      };
    } catch (error) {
      console.log(error);
    }
  }

  //  Update Row
  async updateNfc(id, reseller, phone, nfcId, placeId) {
    try {
      const updateRequest = await new Promise((resolve, reject) => {
        const query =
          "UPDATE nfc_tag_links SET Reseller = ?, Reseller_Phone = ?, NFC_tag_id = ?, Place_ID = ? WHERE ID = ?";
        connection.query(
          query,
          [reseller, phone, nfcId, placeId, id],
          (err, result) => {
            if (err) {
              return reject(err.message);
            }
            resolve(result);
          }
        );
      });

      console.log(updateRequest);
      return { success: true, id, reseller, phone, nfcId, placeId };
    } catch (error) {
      console.log(error);
    }
  }

  //   Delete Row
  async deleteNfc(id) {
    try {
      await new Promise((resolve, reject) => {
        const query = "DELETE FROM nfc_tag_links WHERE ID = ?";

        //   send query to database
        connection.query(query, [Number(id)], (err, result) => {
          if (err) {
            return reject(new Error(err.message));
          }
          resolve(result);
        });
      });

      return { success: true };
    } catch (error) {
      console.log(error);
    }
  }

  // !!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!
  // Login Page Queries!
  async authenticateUser(username, password) {
    try {
      const user = new Promise((resolve, reject) => {
        const query =
          "SELECT * FROM `users` WHERE Username = ? AND Password = ?;";

        connection.query(query, [username, password], (err, response) => {
          if (err) {
            return reject(err);
          }
          resolve(response);
        });
      });

      return user;
    } catch (error) {
      console.log(error.message);
    }
  }

  // !!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!
  // Review Page Queries!
  async getPlaceIdByLinkId(linkId) {
    try {
      const placeId = await new Promise((resolve, reject) => {
        // Query to the databse to get the plave Id where nfc id matches
        const query = "SELECT Place_ID FROM nfc_tag_links WHERE ID = ?;";
        connection.query(query, [linkId], (err, response) => {
          if (err) {
            return reject(new Error(err.message));
          }

          // If the response is not empty and place Id is not blank then resolve with the place ID

          if (response.length > 0) {
            if (response[0].Place_ID != "") {
              resolve(response[0].Place_ID);
            } else {
              resolve(undefined);
            }
          } else {
            resolve(null);
          }
        });
      });

      return placeId;
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = DbService;
