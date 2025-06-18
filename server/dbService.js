const mysql = require("mysql");
const dotenv = require("dotenv");
const { response } = require("express");
let serviceInstance = null;
dotenv.config({ path: "./server/.env" });

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DBUSERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  //   console.log("db " + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    if (serviceInstance) {
      return serviceInstance;
    } else {
      return new DbService();
    }
  }

  //   Get all Rows
  async getAllData() {
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
      console.log(error);
    }
  }

  //   Add new row
  async addNewNfc(reseller, phone, nfcId) {
    try {
      const addRequest = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO nfc_tag_links (Reseller, Reseller_Phone,NFC_tag_id) VALUES(?,?,?);";
        connection.query(query, [reseller, phone, nfcId], (err, result) => {
          if (err) {
            return reject(reject(new Error(err.message)));
          }

          resolve(result);
        });
      });

      //   Using the Row's id, Update the empty link section of the row, with a new unique link

      const linkId = addRequest.insertId;

      //   New Unique Link
      const link = `https://foodapp.com/restaurant/${linkId}`;

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
      };
    } catch (error) {
      console.log(error);
    }
  }

  //   Delete Row
  async deleteNfc(id) {
    try {
      const deleteAttempt = await new Promise((resolve, reject) => {
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
}

module.exports = DbService;
