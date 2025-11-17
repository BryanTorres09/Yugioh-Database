import express from 'express';
import multer from 'multer';
import pg from 'pg';
import axios from 'axios';
import env from 'dotenv';
import path from 'path';
import cors from 'cors';
import { v2 as cloudinary } from "cloudinary";

const app = express();

// ✅ Correct CORS configuration
app.use(cors({
  origin: "https://yugioh-database-app.onrender.com", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));



const PORT = process.env.PORT || 3000;
// app.use(cors());
env.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Make the uploads folder public
app.use("/cardsimg", express.static(path.join(process.cwd(), "cardsImages")));
//app.use("./cardImages", express.static("cardsImages"));


// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});




//Multer Storage Configuration
// const storage = multer.diskStorage ({
//     destination: (req, file, cb) => cb (null, './cardsImages/'),
//     filename: (req, file, cb) => {
//          const cardName = req.body.CardName?.replace(/\s+/g, "_"); // remove spaces
//          const ext = path.extname(file.originalname); // get file extension (.jpg, .png)
//          const finalName = `${cardName}${ext}`;
//          cb (null, finalName);
//     }
// });

// Multer storage for Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "cards", // optional folder in your Cloudinary
//     format: "png",   // or 'jpg'
//     public_id: (req, file) => req.body.CardName.replace(/\s+/g, "_"),
//   },
// });


const storage = multer.memoryStorage();
const upload = multer({storage});



app.use(express.static('public'));

//PostgreSQL Client Setup
const db = new pg.Pool({
  //   user: process.env.PG_USER,
  //   host: process.env.PG_HOST,
  //   database: process.env.PG_DATABASE,
  //   password: process.env.PG_PASSWORD,
  //   port: process.env.PG_PORT,
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

db.connect()

//Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//Home Page Route
app.get ('/', (req, res) => {
    
})

// Upload Card Route
app.post(
  "/upload",
  cors({
    // add CORS again here just in case
    origin: "https://yugioh-database-app.onrender.com",
    methods: ["POST"],
    credentials: true,
  }),
  upload.single("CardImage"),
  async (req, res) => {
    const { CardName, Quantity, CardType, Attribute, Level } = req.body;

    const cardName = CardName;
    const cardType = CardType?.trim();
    const quantityNum = parseInt(Quantity, 10);
    const levelNum = parseInt(Level, 10);
    const attribute = Attribute?.trim() || "";

    if (!CardName || !req.file) {
      return res
        .status(400)
        .send("Missing required fields: CardName or CardImage");
    }

    // Upload buffer to Cloudinary
    const cloudinaryUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "cards", public_id: CardName.replace(/\s+/g, "_") },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const imageFilename = req.file.filename;
    //const imageUrl = req.file.path; // For Cloudinary, this is the URL

    try {
      const uploadResult = await cloudinaryUpload();
      const imageUrl = uploadResult.secure_url;

      const result = await db.query(
        `INSERT INTO cards (cardname, quantity, cardtype, attribute, level, image_filename,image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *;`,
        [
          cardName,
          quantityNum,
          cardType,
          attribute,
          levelNum,
          imageFilename,
          imageUrl,
        ]
      );
      const savedCard = result.rows[0];
      res.status(200).json("Card uploaded successfully");
    } catch (error) {
      console.error("Error uploading card:", error);
      console.error(
        "Full error:",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      res.status(500).json("Error uploading card");
    }
  }
);

// Get All Cards Route
app.get('/cards', async (req, res) => {

    try {
        const result = await db.query('SELECT * FROM cards;');
        const list = result.rows;
        res.status(200).json(list);
    }

    catch (error) {
        console.error ('Error fetching cards:', error);
        res.status(500).send ('Error fetching cards');
    }
})

