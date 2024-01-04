const express = require("express");
const app = express();
const cors = require("cors");
const port = 8000;
const mysql = require("mysql2/promise");

app.use(express.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "admin",
  database: "signupdata",
};

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hello from server");
});

app.post("/sign-up", async (req, res) => {
  try {
    const formData = req.body;

    const sign_up_for_emails = formData.emailnotification === "on" ? 1 : 0;

    const connection = await mysql.createConnection(dbConfig);

    const [results, fields] = await connection.query(
      `INSERT INTO user_data (email, password, first_name, last_name, date_of_birth, country, gender, sign_up_for_emails) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        formData.email,
        formData.password,
        formData.firstname,
        formData.lastname,
        formData.dob,
        formData.contry,
        formData.gender,
        sign_up_for_emails,
      ]
    );
 
    connection.end();

    res.json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`server is runnig on ${port}`);
});
