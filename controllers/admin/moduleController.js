const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const db = require("../../db");
const nodemailer = require("nodemailer");

require("dotenv").config();

exports.getmodulelist = (req, res) => {
  db.query("SELECT * FROM module ORDER BY id DESC", async (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database query error",
        error: err,
      });
    }

    res.status(200).json({
      message: "Fetched successfully",
      status: "1",
      results: results, // <-- include the results here
    });
  });
};
exports.savemodule = (req, res) => {
  const name = req.body.name;
  const status = req.body.status;
  const price = req.body.price;
  const description = req.body.description;
  const annual_price = req.body.description;

  // SQL query to insert video and max_limit into videomanagement table
  const query =
    "INSERT INTO module (annual_price,description,price,name, status) VALUES (?, ?,?,?,?)";
  db.query(
    query,
    [annual_price, description, price, name, status],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into database:", err.stack);
        return res
          .status(500)
          .json({ message: "Failed to insert video details into database" });
      }

      // Respond with success if insertion is successful
      res.status(200).json({
        message: "Module saved successfully",
      });
    }
  );
};
exports.moduledelete = (req, res) => {
  const videoId = req.body.id; // ID to be deleted

  if (!videoId) {
    return res.status(400).json({ message: "No video ID provided." });
  }

  // MySQL query to delete the video
  const query = "DELETE FROM module WHERE id = ?";

  db.query(query, [videoId], (error, results) => {
    if (error) {
      console.error("Error deleting video:", error);
      return res.status(500).json({ message: "Error deleting video." });
    }

    if (results.affectedRows > 0) {
      return res.status(200).json({ message: "Video deleted successfully." });
    } else {
      return res.status(404).json({ message: "Video not found." });
    }
  });
};
exports.getmodulerecord = (req, res) => {
  const videoId = req.body.id; // ID to be deleted

  if (!videoId) {
    return res.status(400).json({ message: "No video ID provided." });
  }

  // MySQL query to delete the video
  const query = "SELECT *  FROM module WHERE id = ?";

  db.query(query, [videoId], (error, row) => {
    if (error) {
      console.error("Error deleting video:", error);
      return res.status(500).json({ message: "Error deleting video." });
    }

    return res
      .status(200)
      .json({ message: "Video deleted successfully.", results: row });
  });
};

exports.updatelimit = (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const status = req.body.status;
  const price = req.body.price;
  const description = req.body.description;
  const id = req.body.id;
  const annual_price = req.body.annual_price;

  const query =
    "UPDATE module SET annual_price=?,price=?,description=?, name = ?,status=? WHERE id = ?";

  db.query(
    query,
    [annual_price, price, description, name, status, id],
    (err, result) => {
      if (err) {
        console.error("Error updating data in database:", err.stack);
        return res.status(500).json({
          message: "Failed to update video details in database",
        });
      }

      res.status(200).json({
        message: "Module updated successfully",
        id: id,
      });
    }
  );
};

exports.getallUsersMeetinglist = (req, res) => {
  // MySQL query to delete the video
  var user_id = req.body.user_id;
  const query =
    "SELECT zoommeeting_register.name, zoommeeting_register.email, zoommeeting.*, module.name AS module_name FROM zoommeeting_register LEFT JOIN zoommeeting ON zoommeeting.zoom_register_id = zoommeeting_register.id LEFT JOIN module ON module.id = zoommeeting.module_id WHERE zoom_register_id = ?;";

  db.query(query, [user_id], (error, row) => {
    if (error) {
      console.error("Error deleting video:", error);
      return res.status(500).json({ message: "Error deleting video." });
    }

    return res
      .status(200)
      .json({ message: "Video deleted successfully.", results: row });
  });
};

exports.getallUsersDetaillist = (req, res) => {
  // MySQL query to delete the video
  const query =
    "SELECT * FROM zoommeeting_register z1 WHERE z1.id = ( SELECT MAX(z2.id) FROM zoommeeting_register z2 WHERE z2.email = z1.email ) ORDER BY z1.id DESC;";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error deleting video:", error);
      return res.status(500).json({ message: "Error deleting video." });
    }

    return res
      .status(200)
      .json({ message: "Video deleted successfully.", results: results });
  });
};

exports.mettingDelete = (req, res) => {
  const id = req.body.id; // ID to be deleted

  if (!id) {
    return res.status(400).json({ message: "No video ID provided." });
  }

  // MySQL query to delete the video
  const query = "DELETE FROM zoommeeting WHERE id = ?";

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting video:", error);
      return res.status(500).json({ message: "Error deleting." });
    }

    return res.status(200).json({ message: "Successfully deleted" });
  });
};
exports.getallUserList = (req, res) => {
  const id = req.body.id; // ID to be deleted

  if (!id) {
    return res.status(400).json({ message: "No video ID provided." });
  }

  // MySQL query to delete the video
  const query = "SELECT *  FROM zoommeeting_register WHERE id = ?";

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting video:", error);
      return res.status(500).json({ message: "Error deleting." });
    }

    return res
      .status(200)
      .json({ message: "Successfully deleted", results: results });
  });
};
exports.getallcompnay = (req, res) => {
  // MySQL query to delete the video
  const query = "SELECT *  FROM company order by id desc";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error deleting video:", error);
      return res.status(500).json({ message: "Error deleting." });
    }

    return res
      .status(200)
      .json({ message: "Successfully deleted", results: results });
  });
};
