import { PGlite, PersistentFileSystem } from 'https://unpkg.com/@electric-sql/pglite@latest/dist/index.js';

let db;
let patientsListDiv; // Declare a variable for the patients list container

async function initializePGlite() {
    try {
        console.log("Initializing PGlite with PersistentFileSystem...");
        const fs = new PersistentFileSystem('patients_db_storage');
        db = new PGlite('patients.db', { fs });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                phone TEXT,
                dateOfBirth TEXT,
                gender TEXT
            )
        `);
        console.log('PGlite database initialized with persistent storage and patients table created (if needed).');
    } catch (error) {
        console.error("Error initializing PGlite:", error);
        alert('Failed to initialize the local database with persistent storage.');
    }
}

async function handleRegistration(event) {
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const dobInput = document.getElementById('dateOfBirth');
    const genderInput = document.getElementById('gender');

    const patientData = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        dateOfBirth: dobInput.value,
        gender: genderInput.value
    };

    console.log("Registration data:", patientData);

    try {
        const result = await db.exec(
            `
            INSERT INTO patients (name, email, phone, dateOfBirth, gender)
            VALUES (?, ?, ?, ?, ?)
            `,
            [patientData.name, patientData.email, patientData.phone, patientData.dateOfBirth, patientData.gender]
        );

        console.log('Patient registered successfully!', result);
        document.getElementById('registration-form').reset();
        loadPatients(); // Reload the patient list

    } catch (error) {
        console.error("Error registering patient:", error);
        alert('Failed to register patient.');
    }
}

async function loadPatients() {
    try {
        const result = await db.query('SELECT * FROM patients');
        const patients = result.rows;
        console.log("Loaded patients:", patients);
        displayPatients(patients);
    } catch (error) {
        console.error("Error loading patients:", error);
        alert('Failed to load patients.');
    }
}

function displayPatients(patients) {
    if (!patientsListDiv) {
        patientsListDiv = document.getElementById('patients-list');
        if (!patientsListDiv) {
            console.error("Error: 'patients-list' div not found in the DOM.");
            return;
        }
    }

    patientsListDiv.innerHTML = '<h2>Registered Patients</h2>';

    if (patients.length === 0) {
        patientsListDiv.innerHTML += '<p>No patients found.</p>';
        return;
    }

    const table = document.createElement('table');
    table.id = 'patients-table';

    const headerRow = table.insertRow();
    const headers = ['Name', 'Email', 'Phone', 'Date of Birth', 'Gender'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    patients.forEach(patient => {
        const row = table.insertRow();
        const nameCell = row.insertCell();
        nameCell.textContent = patient.name;
        const emailCell = row.insertCell();
        emailCell.textContent = patient.email;
        const phoneCell = row.insertCell();
        phoneCell.textContent = patient.phone;
        const dobCell = row.insertCell();
        dobCell.textContent = patient.dateOfBirth;
        const genderCell = row.insertCell();
        genderCell.textContent = patient.gender;
    });

    patientsListDiv.appendChild(table);
}

async function executeSqlQuery() {
    const sqlQuery = document.getElementById('sql-query').value;
    const resultsContainer = document.getElementById('sql-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = 'Executing...';
    }

    console.log("Executing SQL:", sqlQuery);

    try {
        const result = await db.query(sqlQuery);
        console.log("SQL Result:", result);

        if (resultsContainer) {
            if (result && result.rows) {
                if (result.rows.length > 0) {
                    const table = document.createElement('table');
                    const headerRow = table.insertRow();

                    if (result.columns && result.columns.length > 0) {
                        result.columns.forEach(column => {
                            const th = document.createElement('th');
                            th.textContent = column;
                            headerRow.appendChild(th);
                        });
                    } else if (result.rows[0]) {
                        Object.keys(result.rows[0]).forEach(key => {
                            const th = document.createElement('th');
                            th.textContent = key;
                            headerRow.appendChild(th);
                        });
                    }

                    result.rows.forEach(row => {
                        const dataRow = table.insertRow();
                        if (result.columns && result.columns.length > 0) {
                            result.columns.forEach(column => {
                                const cell = dataRow.insertCell();
                                cell.textContent = row[column];
                            });
                        } else {
                            Object.values(row).forEach(value => {
                                const cell = dataRow.insertCell();
                                cell.textContent = value;
                            });
                        }
                    });
                    resultsContainer.innerHTML = '';
                    resultsContainer.appendChild(table);
                } else {
                    resultsContainer.textContent = 'Query executed successfully, no results.';
                }
            } else if (result && result.error) {
                resultsContainer.textContent = `Error: ${result.error}`;
            } else {
                resultsContainer.textContent = 'Query executed.';
            }
        }

    } catch (error) {
        console.error("Error executing SQL:", error);
        if (resultsContainer) {
            resultsContainer.textContent = `Error executing SQL: ${error.message}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    patientsListDiv = document.getElementById('patients-list'); // Get the element when DOM is ready
    if (!patientsListDiv) {
        console.error("Error: 'patients-list' div not found on DOMContentLoaded.");
        return;
    }
    await initializePGlite();
    document.getElementById('registration-form').addEventListener('submit', handleRegistration);
    loadPatients();
});