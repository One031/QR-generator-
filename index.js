import qr from "qr-image";
import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';


const app = express();
const port = 3000;
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req,res) => {
  var value = req.body.url;
  var qr_svg = qr.image(value, { type: 'png' });
  const qr_img_path = path.join(__dirname, 'public/image', 'Qr_img.png');
  qr_svg.pipe(fs.createWriteStream(qr_img_path));
  qr_svg.on('end', () => {
    res.render("index.ejs", {qrPng: 'image/Qr_img.png'} );
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
