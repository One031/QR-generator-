// Import necessary modules
import qr from "qr-image";                    // Module to generate QR codes
import fs from "fs";                          // File system module to handle file operations
import express from "express";                // Express framework for building web applications
import bodyParser from "body-parser";         // Middleware to parse incoming request bodies
import path from "path";                      // Module to handle and transform file paths
import { fileURLToPath } from 'url';          // Utility to convert file URLs to path strings

// Initialize the Express application
const app = express();

// Define the port the server will listen on
const port = 3000;

// Middleware to serve static files from the 'public' directory
app.use(express.static("public"));

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Resolve the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to EJS for rendering dynamic HTML pages
app.set("view engine", "ejs");

/**
 * Route: GET '/'
 * Description: Renders the main page where users can input a URL to generate its QR code.
 */
app.get("/", (req, res) => {
  res.render("index.ejs"); // Render 'index.ejs' without any additional data
});

/**
 * Route: POST '/submit'
 * Description: Handles form submissions to generate a QR code for the provided URL.
 */
app.post("/submit", (req, res) => {
  // Extract the 'url' value submitted from the form
  const value = req.body.url;

  // Generate a QR code in PNG format for the provided URL
  const qr_svg = qr.image(value, { type: 'png' });

  // Define the path where the QR code image will be saved
  const qr_img_path = path.join(__dirname, 'public/image', 'Qr_img.png');

  // Pipe the generated QR code data to a writable stream to save the image
  qr_svg.pipe(fs.createWriteStream(qr_img_path));

  /**
   * Event Listener: 'end'
   * Description: Once the QR code image has been fully written to the file system,
   *              render the 'index.ejs' template and pass the path of the QR image.
   */
  qr_svg.on('end', () => {
    res.render("index.ejs", { qrPng: 'image/Qr_img.png' }); // Pass the QR image path to the template
  });

  /**
   * Event Listener: 'error'
   * Description: Handles any errors that occur during the QR code generation or file writing process.
   */
  qr_svg.on('error', (err) => {
    console.error("Error generating QR code:", err); // Log the error for debugging
    res.status(500).send("An error occurred while generating the QR code."); // Send a 500 Internal Server Error response
  });
});

/**
 * Start the Express server
 * Description: The server listens on the specified port and logs a message to the console once it's running.
 */
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
