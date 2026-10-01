const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();

const PORT = 6001;

// MongoDB connection
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);


// Middleware to read form data
app.use(express.urlencoded({ extended: true }));


// ------------------------------------
// 1. DISPLAY REGISTRATION FORM
// ------------------------------------
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "home.html"));

});


// ------------------------------------
// 2. START SERVER AND CONNECT MONGODB
// ------------------------------------
async function startServer() {

    try {

        // Connect to MongoDB
        await client.connect();

        console.log("Connected to MongoDB");


        // Create / use database
        const db = client.db("registrationDB");


        // Create / use collection
        const collection = db.collection("users");


        // ------------------------------------
        // 3. RECEIVE FORM DATA
        // ------------------------------------
        app.post("/server", async (req, res) => {

            // Get data from the form
            const data = {

                name: req.body.name,

                password: req.body.password,

                age: req.body.age,

                mobile: req.body.mobile,

                email: req.body.email,

                gender: req.body.gender,

                state: req.body.state,

                // Handle one or multiple skills
                skills: req.body.skills
                    ? (Array.isArray(req.body.skills)
                        ? req.body.skills
                        : [req.body.skills])
                    : []

            };


            // ------------------------------------
            // 4. STORE DATA IN MONGODB
            // ------------------------------------
            await collection.insertOne(data);


            // ------------------------------------
            // 5. DISPLAY SUBMITTED DETAILS
            // ------------------------------------
            res.send(`

                <!DOCTYPE html>

                <html>

                <head>

                    <title>User Submitted Details</title>

                </head>


                <body>

                    <h1>User Submitted Details</h1>


                    <table border="1" cellpadding="10">

                        <tr>
                            <th>Name</th>
                            <td>${data.name}</td>
                        </tr>


                        <tr>
                            <th>Password</th>
                            <td>${data.password}</td>
                        </tr>


                        <tr>
                            <th>Age</th>
                            <td>${data.age}</td>
                        </tr>


                        <tr>
                            <th>Mobile Number</th>
                            <td>${data.mobile}</td>
                        </tr>


                        <tr>
                            <th>Email</th>
                            <td>${data.email}</td>
                        </tr>


                        <tr>
                            <th>Gender</th>
                            <td>${data.gender}</td>
                        </tr>


                        <tr>
                            <th>State</th>
                            <td>${data.state}</td>
                        </tr>


                        <tr>
                            <th>Skills</th>
                            <td>${Array.isArray(data.skills) ? data.skills.join(", ") : data.skills}</td>
                        </tr>

                    </table>

                </body>

                </html>

            `);

        });


        // ------------------------------------
        // 6. START NODE.JS SERVER
        // ------------------------------------
        app.listen(PORT, () => {

            console.log(
                `Server running at http://localhost:${PORT}`
            );

        });

    }


    catch (error) {

        console.log("Error:", error);

    }

}


// Run the server
startServer();