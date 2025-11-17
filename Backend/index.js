import express from 'express';
import multer from 'multer';
import pg from 'pg';
import axios from 'axios';
import env from 'dotenv';
import path from 'path';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
env.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Make the uploads folder public
app.use("/cardsimg", express.static(path.join(process.cwd(), "cardsimages")));
//app.use("./cardImages", express.static("cardsImages"));

//Multer Storage Configuration
const storage = multer.diskStorage ({
    destination: (req, file, cb) => cb (null, './cardsImages/'),
    filename: (req, file, cb) => {
         const cardName = req.body.CardName?.replace(/\s+/g, "_"); // remove spaces
         const ext = path.extname(file.originalname); // get file extension (.jpg, .png)
         const finalName = `${cardName}${ext}`;
         cb (null, finalName);
    }
});


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
app.post('/upload', upload.single('CardImage'), async (req, res) => {
    const 
    { CardName, Quantity, CardType, Attribute, Level,} = req.body;

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
    const imageFilename = req.file.filename;

try {
    const result = await db.query(
      `INSERT INTO cards (cardname, quantity, cardtype, attribute, level, image_filename)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *;`,
      [cardName, quantityNum, cardType, attribute, levelNum, imageFilename]
    );
    const savedCard = result.rows[0];
    res.status(200).json('Card uploaded successfully');
} catch (error) {
    console.error('Error uploading card:', error);
    res.status(500).json('Error uploading card');   
}

});

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

