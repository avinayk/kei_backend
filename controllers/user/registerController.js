const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const moment = require("moment-timezone");
const db = require("../../db");
const nodemailer = require("nodemailer");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { format } = require("date-fns");
const fs = require("fs");
const path = require("path");

const pdfParse = require("pdf-parse");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your .env file
});
// const response = await openai.chat.completions.create({
//   model: "gpt-4", // or "gpt-3.5-turbo"
//   messages: [
//     { role: "system", content: "You are a helpful assistant." },
//     { role: "user", content: "Summarize this document." },
//   ],
// });

require("dotenv").config();

exports.getallcountry = (req, res) => {
  db.query("SELECT * FROM country", async (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database query error", error: err });
    }

    res.status(200).json({
      message: "",
      results: results,
    });
  });
};
function generateStrongPassword(length = 12) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const allChars = uppercase + lowercase + numbers + special;

  const passwordArray = [
    uppercase[
      Math.floor((crypto.randomBytes(1).readUInt8() / 256) * uppercase.length)
    ],
    lowercase[
      Math.floor((crypto.randomBytes(1).readUInt8() / 256) * lowercase.length)
    ],
    numbers[
      Math.floor((crypto.randomBytes(1).readUInt8() / 256) * numbers.length)
    ],
    special[
      Math.floor((crypto.randomBytes(1).readUInt8() / 256) * special.length)
    ],
  ];

  for (let i = passwordArray.length; i < length; i++) {
    const randomByte = crypto.randomBytes(1).readUInt8();
    passwordArray.push(
      allChars[Math.floor((randomByte / 256) * allChars.length)]
    );
  }

  for (let i = passwordArray.length - 1; i > 0; i--) {
    const randomByte = crypto.randomBytes(1).readUInt8();
    const j = Math.floor((randomByte / 256) * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join("");
}
function generateAccessToken() {
  return crypto.randomBytes(32).toString("hex"); // 32 bytes = 64 hex characters
}
exports.userRegister = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    role,
    linked_in,
    maimai,
    wechat,
    boss_zhipin,
    phone,
    area,
    city_step2,
    country,
    company_name,
    year_registration,
    company_website,
    employee_number,
    company_linkedin,
    company_maimai,
    company_wechat,
    company_zhipin,
    company_mail_address,
    company_state,
    company_city,
    company_postal_code,
    company_country,
    stage_step3,
    gross_revenue,
    headline,
    descriptionBrief,
    descriptionProblem,
    descriptionSolution,
    headlineStep4,
    descriptionStep4,
    problemStep4,
    solutionStep4,
  } = req.body;

  try {
    // Hash the password
    //var password = generateStrongPassword(8);
    var password = "12345";
    const hashedPassword = await bcrypt.hash(password, 12);
    const accessToken = generateAccessToken();
    // Check if user already exists
    db.query(
      "SELECT * FROM company WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database query error", error: err });
        }

        if (results.length > 0) {
          return res.status(200).json({
            message: "Email is already exists",
            status: "2",
          });
        } else {
          // Insert new user (adjust query based on your database schema)
          var date = new Date();
          const query = `
          INSERT INTO company (
            first_name, last_name, email, password, role,
            linked_in, maimai, wechat, boss_zhipin, phone,
            area, city_step2, country, company_name, year_registration,
            company_website, employee_number, company_linkedin,
            company_maimai, company_wechat, company_zhipin,
            company_mail_address, company_state, company_city,
            company_postal_code, company_country, stage_step3,
            gross_revenue, headline, descriptionBrief,
            descriptionProblem, descriptionSolution, headlineStep4,
            descriptionStep4, problemStep4, solutionStep4,created_at,access_token,view_password
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

          // Array of values for the query
          const values = [
            first_name,
            last_name,
            email,
            hashedPassword, // NULL if password not provided
            role || "user", // Default to 'user'
            linked_in || null,
            maimai || null,
            wechat || null,
            boss_zhipin || null,
            phone || null,
            area || null,
            city_step2 || null,
            country || null,
            company_name || null,
            year_registration || null,
            company_website || null,
            employee_number || null,
            company_linkedin || null,
            company_maimai || null,
            company_wechat || null,
            company_zhipin || null,
            company_mail_address || null,
            company_state || null,
            company_city || null,
            company_postal_code || null,
            company_country || null,
            stage_step3 || null,
            gross_revenue || null,
            headline || null,
            descriptionBrief || null,
            descriptionProblem || null,
            descriptionSolution || null,
            headlineStep4 || null,
            descriptionStep4 || null,
            problemStep4 || null,
            solutionStep4 || null,
            date,
            accessToken,
            password,
          ];

          // Execute the INSERT query
          db.query(query, values, (err, results) => {
            if (err) {
              console.error("Database insert error:", err);
              return res.status(500).json({
                message: "Database insert error",
                status: "0",
                error: err.message,
              });
            }

            res.status(200).json({
              message: "Account successfully created",
              status: "1",
              id: results.insertId,
              email: email,
              first_name: first_name,
              last_name: last_name,
              access_token: accessToken,
            });
          });
        }
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    db.query(
      "SELECT * FROM company WHERE email = ?",
      [email],
      async (err, rows) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database query error", error: err });
        }

        if (rows.length > 0) {
          const user = rows[0];

          // Check if password matches
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res
              .status(200)
              .json({ status: "2", message: "Invalid email or password" });
          } else {
            res.status(200).json({
              message: "Login successfully",
              status: "1",
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              access_token: user.access_token,
            });
          }
        } else {
          res
            .status(200)
            .json({ status: "2", message: "Invalid email or password" });
        }
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

exports.getModules = (req, res) => {
  db.query(
    "SELECT * FROM module where status =? order by id desc",
    ["Active"],
    async (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Database query error", error: err });
      }

      res.status(200).json({
        message: "",
        results: results,
      });
    }
  );
};
const generateUniqueCode = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000); // Add randomness

  // Generate a random 3-letter string
  const randomLetters = Math.random()
    .toString(36)
    .substring(2, 5)
    .toUpperCase();

  return `${randomLetters}${timestamp}${randomNum}`;
};
exports.registerforZoom = async (req, res) => {
  const data = req.body;
  const meetingRecords = [];
  let selectedSlots = [];

  if (typeof data.selectedSlots === "string") {
    try {
      selectedSlots = JSON.parse(data.selectedSlots);
    } catch (err) {
      return res.status(200).json({
        message: "Invalid selectedSlots format",
        status: "2",
      });
    }
  } else if (Array.isArray(data.selectedSlots)) {
    selectedSlots = data.selectedSlots;
  } else {
    return res.status(200).json({
      message: "selectedSlots is missing or invalid",
      status: "2",
    });
  }

  // Convert slot start times into formatted datetime strings
  const formattedSlots = selectedSlots.map((slot) =>
    format(new Date(slot.start), "yyyy-MM-dd HH:mm:ss")
  );

  // ❌ Check for conflicting slots (exact time match)
  const conflictQuery = `
    SELECT zm.meeting_date 
    FROM zoommeeting_register zr 
    JOIN zoommeeting zm ON zm.zoom_register_id = zr.id 
    WHERE zr.email = ? AND zr.module_id = ? 
      AND zm.meeting_date IN (${formattedSlots.map(() => "?").join(",")})
  `;

  const conflictParams = [data.email, data.module_id, ...formattedSlots];

  db.query(conflictQuery, conflictParams, async (err, conflictResults) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database query error", error: err });
    }

    if (conflictResults.length > 0) {
      const conflictingTimes = conflictResults.map((row) =>
        format(new Date(row.meeting_date), "yyyy-MM-dd hh:mm a")
      );
      const conflictingTimess = conflictResults.map((row) =>
        format(new Date(row.meeting_date), "yyyy-MM-dd")
      );

      return res.status(200).json({
        message: `Already registered for the following date(${conflictingTimess}):`,
        status: "2",
        conflicts: conflictingTimes,
      });
    }

    // ✅ No conflicts, proceed with insert
    const insertRegisterQuery = `
      INSERT INTO zoommeeting_register (module_id, name, email, description, date)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertRegisterQuery,
      [data.module_id, data.name, data.email, data.description, new Date()],
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Error inserting into zoommeeting_register",
            error: err,
          });
        }

        const registerId = result.insertId;

        for (const slot of selectedSlots) {
          try {
            const zoomMeeting = await createZoomMeeting(
              slot,
              data.selectedZone,
              data.module_id
            );

            const meetingDateTime = format(
              new Date(slot.start),
              "yyyy-MM-dd HH:mm:ss"
            );

            const token = jwt.sign(
              {
                email: data.email,
                ip: data.ip_address,
                meetingId: zoomMeeting.id,
              },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );

            const uniqueCode = generateUniqueCode();
            const tokenExpiry = format(
              new Date(slot.start),
              "yyyy-MM-dd 23:00:00"
            );

            const insertMeetingQuery = `
              INSERT INTO zoommeeting 
              (zoom_meeting_id, module_id, unique_code, zoom_register_id, time, ip_address, meeting_date, timezone, date, zoom_link, access_token, token_expiry)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
              zoomMeeting.id,
              data.module_id,
              uniqueCode,
              registerId,
              data.timeset,
              data.ip_address,
              meetingDateTime,
              data.selectedZone,
              new Date(),
              zoomMeeting.join_url,
              token,
              tokenExpiry,
            ];

            await new Promise((resolve, reject) => {
              db.query(insertMeetingQuery, values, (err, res) => {
                if (err) reject(err);
                else resolve(res);
              });
            });

            meetingRecords.push({
              join_url: zoomMeeting.join_url,
              slot: format(new Date(slot.start), "yyyy-MM-dd hh:mm a"),
            });
          } catch (zoomErr) {
            return res.status(500).json({
              message: "Zoom meeting creation failed",
              error: zoomErr.message,
            });
          }
        }

        return res.status(200).json({
          message: `Successfully registered for ${meetingRecords.length} meeting(s)`,
          status: "1",
          meetings: meetingRecords,
        });
      }
    );
  });
};

const CLIENT_ID = "AC7sqzKtRlq_Cqh8W5Hxg";
const CLIENT_SECRET = "DsRMvo4EoYxUrhXuxKxr317OQYZPbY3L";
const ACCOUNT_ID = "dLzomxwNRdaSvLyNiUzOsQ";

// Step 1: Get OAuth Access Token
async function getZoomAccessToken() {
  const token = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  try {
    const response = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ACCOUNT_ID}`,
      {},
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    return response.data.access_token;
  } catch (err) {
    console.error(
      "Error fetching Zoom access token:",
      err.response?.data || err.message
    );
    throw err;
  }
}
let meetingsDatabase = {};

// Step 2: Create Zoom Meeting
async function createZoomMeeting(slot, timezone, moduleid) {
  const accessToken = await getZoomAccessToken();

  // Query to fetch module name
  let moduleName = "Entrepreneur Session"; // Default topic if query fails
  try {
    const query = "SELECT name FROM module WHERE id = $1"; // Use parameterized query for security
    const result = await pool.query(query, [moduleid]);

    if (result.rows.length > 0) {
      moduleName = result.rows[0].name; // Set module name from query result
    } else {
      console.warn(`No module found with id ${moduleid}`);
    }
  } catch (error) {
    console.error("❌ Error fetching module name:", error.message);
    // Proceed with default topic if query fails
  }

  const meetingData = {
    topic: `Entrepreneur Session: ${moduleName}`, // Use module name in topic
    type: 2, // Scheduled meeting
    start_time: slot.start,
    duration: 30,
    timezone: timezone,
    agenda: "Zoom Meeting for Entrepreneurs",
    settings: {
      host_video: true,
      participant_video: true,
      waiting_room: true,
      require_password: true,
      approval_type: 2,
    },
  };

  try {
    const response = await axios.post(
      `https://api.zoom.us/v2/users/me/meetings`,
      meetingData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Optional: Store meeting info in in-memory DB
    meetingsDatabase[response.data.id] = {
      join_url: response.data.join_url,
      created_at: new Date(),
      id: response.data.id,
    };

    // console.log('✅ Zoom Meeting Created', meetingsDatabase);
    // console.log('Join URL:', response.data.join_url);

    return response.data; // Return the meeting data
  } catch (error) {
    console.error(
      "❌ Error creating Zoom meeting:",
      error.response?.data || error.message
    );
    throw error;
  }
}

exports.selectModule = (req, res) => {
  db.query(
    "SELECT * FROM module where id =?",
    [req.body.id],
    async (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Database query error", error: err });
      }

      res.status(200).json({
        message: "",
        results: results,
      });
    }
  );
};

exports.joinZoomMeeting = (req, res) => {
  const token = req.body.token;
  const clientIp = req.body.ip;

  // Verify JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid token", error: err.message });
    }

    const { email, ip, meetingId } = decoded;

    // Check token and IP in database
    db.query(
      "SELECT zm.ip_address, zm.zoom_link, zm.zoom_meeting_id, zm.token_expiry, zmr.email FROM zoommeeting AS zm JOIN zoommeeting_register AS zmr ON zmr.id = zm.zoom_register_id WHERE zm.access_token = ? AND zmr.email = ?;",
      [token, email],
      (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return res
            .status(500)
            .json({ message: "Database query error", error: err });
        }
        console.log(results);
        if (results.length === 0) {
          return res.status(200).json({
            message: "Invalid or expired token",
            error: "No matching record found",
          });
        }

        const { ip_address, zoom_link, zoom_meeting_id, token_expiry } =
          results[0];

        // Check token expiry
        if (new Date() > new Date(token_expiry)) {
          return res.status(200).json({
            message: "Token has expired",
            error: "Token validity period exceeded",
          });
        }

        // Check IP match
        if (ip_address !== clientIp || ip !== clientIp) {
          return res.status(200).json({
            message: "Access denied: IP address does not match",
            error: "IP mismatch",
          });
        }

        // Check meeting ID
        if (Number(zoom_meeting_id) !== Number(meetingId)) {
          return res.status(200).json({
            message: "Invalid meeting ID",
            error: "Meeting ID mismatch",
          });
        }
        res.status(200).send(`
             
                <iframe src="${zoom_link}" allow="camera; microphone; fullscreen" sandbox="allow-same-origin allow-scripts allow-popups" onload="window.parent.postMessage('zoom-loaded', '*')"></iframe>
             
            `);
        // Invalidate token
        // db.query(
        //   "UPDATE zoommeeting SET access_token = NULL, token_expiry = NULL WHERE access_token = ?",
        //   [token],
        //   (err) => {
        //     if (err) {
        //       console.error("Error invalidating token:", err);
        //       return res
        //         .status(500)
        //         .json({ message: "Error invalidating token", error: err });
        //     }

        //     // Serve Zoom meeting in an iframe
        //     res.status(200).send(`

        //         <iframe src="${zoom_link}" allow="camera; microphone; fullscreen" sandbox="allow-same-origin allow-scripts allow-popups"></iframe>

        //     `);
        //   }
        // );
      }
    );
  });
};

exports.videolimitsave = (req, res) => {
  const { user_id, video_id, limit } = req.body;
  db.query(
    "SELECT * FROM uservideolimit where user_id =? And video_id = ?",
    [user_id, video_id],
    async (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Database query error", error: err });
      }
      if (results.length >= limit) {
        res.status(200).json({
          message: `You have reached the maximum views ${limit} for this video.`,
          status: "2",
        });
      } else {
        const userInsertQuery = `
            INSERT INTO uservideolimit 
            (user_id, video_id, date)
            VALUES (?, ?, ?)
          `;

        const date = new Date();
        db.query(
          userInsertQuery,
          [user_id, video_id, date],
          async (err, result) => {}
        );
        res.status(200).json({
          message: "",
          status: 1,
        });
      }
    }
  );
};

exports.getcategories = (req, res) => {
  const query = `
    SELECT
      dc.id AS category_id,
      dc.name AS category_name,
      dsc.id AS subcategory_id,
      dsc.name AS subcategory_name
    FROM dataroomcategories dc
    LEFT JOIN dataroomsub_categories dsc
      ON dc.id = dsc.dataroom_id
  `;

  db.query(query, async (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database query error",
        error: err,
      });
    }

    // Group categories and their subcategories
    const grouped = {};
    results.forEach((row) => {
      if (!grouped[row.category_id]) {
        grouped[row.category_id] = {
          id: row.category_id,
          name: row.category_name,
          subcategories: [],
        };
      }

      if (row.subcategory_id) {
        grouped[row.category_id].subcategories.push({
          id: row.subcategory_id,
          name: row.subcategory_name,
        });
      }
    });

    const finalResults = Object.values(grouped);

    res.status(200).json({
      message: "",
      results: finalResults,
    });
  });
};

exports.uploadDocuments = async (req, res) => {
  try {
    const files = req.files;
    console.log(files);
    if (!files || files.length === 0)
      return res.status(400).json({ error: "No files uploaded" });

    let combinedText = "";

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      let extractedText = "";

      if (ext === ".pdf") {
        const buffer = fs.readFileSync(file.path);
        const data = await pdfParse(buffer);
        extractedText = data.text;
      } else if (ext === ".docx") {
        const result = await mammoth.extractRawText({ path: file.path });
        extractedText = result.value;
      } else {
        extractedText = await new Promise((resolve, reject) => {
          textract.fromFileWithPath(file.path, (err, text) => {
            if (err) reject(err);
            else resolve(text);
          });
        });
      }

      if (extractedText) {
        combinedText += `\n\n--- Extracted from: ${file.originalname} ---\n\n${extractedText}`;
      }
    }

    if (!combinedText.trim()) {
      return res.status(400).json({ error: "No readable content found" });
    }

    const englishPrompt = `Summarize the following documents into a due diligence report (1000 characters max per section):\n\n${combinedText}`;
    const localPrompt = `Translate and summarize this due diligence content into the local language (max 1000 characters per section):\n\n${combinedText}`;

    const [englishCompletion, localCompletion] = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a due diligence assistant." },
          { role: "user", content: englishPrompt },
        ],
      }),
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a local language due diligence assistant.",
          },
          { role: "user", content: localPrompt },
        ],
      }),
    ]);

    const englishSummary = englishCompletion.choices[0].message.content;
    const localSummary = localCompletion.choices[0].message.content;

    // Optionally: Use a template and email/send/download logic here

    res.json({
      englishSummary,
      localSummary,
      message: "Due diligence summaries generated successfully",
    });
  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ error: "Failed to process documents" });
  }
};

exports.checkCompanyEmail = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const query = "SELECT * FROM company WHERE email = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database query error",
        error: err,
      });
    }

    if (results.length > 0) {
      res.status(200).json({
        message: "",
        status: "2",
      });
    } else {
      res.status(200).json({
        message: "",
        status: "1",
      });
    }
  });
};
exports.getallSubscriptionPlan = (req, res) => {
  const query = "SELECT * FROM subscription_plans";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database query error",
        error: err,
      });
    }

    res.status(200).json({
      results: results,
    });
  });
};
exports.usersubscription = (req, res) => {
  const data = req.body;
  const date = new Date();

  const getPlanQuery = "SELECT period FROM subscription_plans WHERE id = ?";
  db.query(getPlanQuery, [data.plan_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({
        message: "Plan not found or DB error",
        status: "0",
        error: err ? err.message : "Plan not found",
      });
    }

    const period = results[0].period;
    console.log(period);
    const startDate = new Date();
    let endDate;

    if (period === "yearly") {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      // default to monthly
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    }
    console.log(endDate, startDate);
    const insertQuery = `
      INSERT INTO users_subscription (
        company_id, module_id, name, email, cardnumber,
        expiry, cvv, start_date, end_date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.user_id,
      data.plan_id,
      data.name,
      data.email,
      data.cardnumber,
      data.expiry,
      data.cvv,
      startDate,
      endDate,
      date,
    ];

    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error("Database insert error:", err);
        return res.status(500).json({
          message: "Database insert error",
          status: "0",
          error: err.message,
        });
      }

      res.status(200).json({
        message: "Subscription saved successfully",
        status: "1",
      });
    });
  });
};

exports.checkmodulesubscription = (req, res) => {
  var id = req.body.id;
  console.log(id);
  const query = "SELECT * FROM  users_subscription where id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database query error",
        error: err,
      });
    }

    res.status(200).json({
      results: results,
    });
  });
};
