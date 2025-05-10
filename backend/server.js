// const express = require('express');
// const bodyParser = require('body-parser');
// const { PGlite } = require('@electric-sql/pglite');
// const path = require('path');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

// const dbPath = path.join(__dirname, 'patients.db');
// console.log("Server: Database Path:", dbPath);
// const db = new PGlite(dbPath);

// async function initializeDatabase() {
//     try {
//         // Truncate the table before creating it
//         // await db.exec(`
//         //     DROP TABLE IF EXISTS patients;
//         // `);
//         // console.log('Server: Patient table dropped (if it existed).');

//         await db.exec(`
//             CREATE TABLE IF NOT EXISTS patients (
//                 id SERIAL PRIMARY KEY,
//                 name TEXT NOT NULL,
//                 email TEXT NOT NULL UNIQUE,
//                 phone TEXT,
//                 "dateOfBirth" TEXT,
//                 gender TEXT
//             )
//         `);
//         console.log('Server: Patient table created.');
//     } catch (error) {
//         console.error('Server: Error initializing database:', error);
//     }
// }

// initializeDatabase();

// app.post('/api/register', async (req, res) => {
//     const { name, email, phone, dateOfBirth, gender } = req.body;

//     try {
//         const result = await db.query(
//             `
//             INSERT INTO patients (name, email, phone, "dateOfBirth", gender)
//             VALUES ($1, $2, $3, $4, $5)
//             `,
//             [name, email, phone, dateOfBirth, gender]
//         );

//         console.log('Server: Patient registered successfully:', name);
//         res.status(201).json({ message: 'Patient registered successfully!' });

//     } catch (error) {
//         console.error('Server: Error registering patient:', error);
//         res.status(500).json({ error: 'Failed to register patient.' });
//     }
// });

// app.get('/api/patients', async (req, res) => {
//     try {
//         const result = await db.query('SELECT * FROM patients');
//         const patients = result.rows || [];
//         console.log("Server: Patients data:", patients);
//         res.status(200).json(patients);
//     } catch (error) {
//         console.error('Server: Error fetching patients:', error);
//         res.status(500).json({ error: 'Failed to fetch patients.' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
// });

// api/patients.js (This will be your Vercel Function)
const express = require('express');
const cors = require('cors');
const { PGlite } = require('@electric-sql/pglite');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Define the database path within the Vercel function environment
const dbPath = path.join(process.cwd(), 'api', 'patients.db');
console.log("Vercel Function: Database Path:", dbPath);
const db = new PGlite(dbPath);

async function initializeDatabase() {
    try {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS patients (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                phone TEXT,
                "dateOfBirth" TEXT,
                gender TEXT
            )
        `);
        console.log('Vercel Function: Patient table created.');
    } catch (error) {
        console.error('Vercel Function: Error initializing database:', error);
    }
}

// Initialize the database on function execution
(async () => {
    await initializeDatabase();
})();

app.post('/register', async (req, res) => {
    const { name, email, phone, dateOfBirth, gender } = req.body;

    try {
        const result = await db.query(
            `
            INSERT INTO patients (name, email, phone, "dateOfBirth", gender)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [name, email, phone, dateOfBirth, gender]
        );

        console.log('Vercel Function: Patient registered successfully:', name);
        res.status(201).json({ message: 'Patient registered successfully!' });

    } catch (error) {
        console.error('Vercel Function: Error registering patient:', error);
        res.status(500).json({ error: 'Failed to register patient.' });
    }
});

app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM patients');
        const patients = result.rows || [];
        console.log("Vercel Function: Patients data:", patients);
        res.status(200).json(patients);
    } catch (error) {
        console.error('Vercel Function: Error fetching patients:', error);
        res.status(500).json({ error: 'Failed to fetch patients.' });
    }
});

module.exports = async (req, res) => {
    await app(req, res);
};
