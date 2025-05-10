# Patient Registration App Documentation

This documentation details the features and functionality of the Patient Registration App, explaining each component and its role.
A simple web application for registering and displaying patient information.

## Git Commit History

**1️⃣ Initial Project Setup**

## How to Run the Project

1.  **Clone the repository:**
    ```bash
    git clone [[https://github.com/robinrauthan/patient-registration-app](https://github.com/robinrauthan/patient-registration-app.git)]
    cd patient-registration-app
    ```
2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the backend server:**
    ```bash
    node server.js
    ```
5.  **Open the frontend:** Open the `index.html` file in your web browser.


**2️⃣ Set Up a Basic Web Page with Registration Form (index.html)**

📌 **Inferred Commit Message:** `Initial HTML structure with patient registration form`

The `index.html` file sets up the basic structure of the web page. It includes:

* A `div` with the class `container` to center and manage the main content.
* A `div` with the class `form-container` to hold the patient registration form.
* An `image-heading` section with a logo (`image.png`) and the heading "Patient Registration".
* A `<form>` with the ID `registration-form` containing input fields for:
    * Name (`name`) - Text input, required.
    * Email (`email`) - Email input, required.
    * Phone (`phone`) - Telephone input, required.
    * Date of Birth (`dateOfBirth`) - Date input, required.
    * Gender (`gender`) - Select dropdown with options "Male", "Female", and "Other".
* A `div` with the class `form-actions` containing:
    * A submit button (`<input type="submit" value="Register">`) to submit the registration form.
    * A button (`<button type="button" onclick="loadPatients()">Show Patients</button>`) to trigger the loading of registered patients.

💡 **Example:** This is like setting up a digital form where patients can enter their personal information when they visit a clinic for the first time.

**3️⃣ Styling the App (style.css)**

📌 **Inferred Commit Message:** `Basic CSS styling for layout and appearance`

The `style.css` file (though not provided, it's linked in the `<head>`) is responsible for the visual presentation of the web page. It likely includes styles for:

* The overall `body` to set the font, margins, and basic layout (centering content).
* The `container` to control the width and maximum width of the main content area.
* The `form-container` to style the registration form's appearance (padding, border, etc.).
* The `image-heading` to arrange the logo and heading.
* The input fields (`<input>` and `<select>`) to define their size and appearance.
* The buttons (`<input type="submit">` and `<button>`) for consistent styling.
* The patient list area (`patients-list` and potentially the table within it) for layout and readability.

💡 **Example:** This is like choosing the colors, fonts, and arrangement of elements on a physical form to make it easy to read and fill out.

**4️⃣ Handling Patient Registration (index.html & JavaScript)**

📌 **Inferred Commit Message:** `Implemented frontend registration submission`

The JavaScript code within the `<script>` tags in `index.html` handles the submission of the registration form:

* An event listener is attached to the `registration-form` to call the `handleRegistration` function when the form is submitted.
* The `handleRegistration` function prevents the default form submission behavior.
* It gathers the values from all the input fields in the form.
* It creates a `patientData` object containing the collected information.
* It uses the `fetch` API to send a `POST` request to the `/api/register` endpoint on `http://localhost:3000`, sending the `patientData` as JSON in the request body.
* It processes the response from the server:
    * If the response is successful (`response.ok`), it displays a success message, resets the form, and calls `loadPatients()` to update the displayed patient list.
    * If there's an error, it displays an error message from the server.
* It includes error handling for network issues during the `fetch` request.

💡 **Example:** This is like clicking the "Submit" button on a digital form, which then sends your information to the clinic's computer system.

**5️⃣ Saving Patient Data in the Database (server.js)**

📌 **Inferred Commit Message:** `Added backend logic to register patients and store in PGlite`

The `server.js` file sets up a backend server using Express.js and the `@electric-sql/pglite` library to manage patient data:

* It imports necessary modules: `express`, `body-parser`, `@electric-sql/pglite`, `path`, and `cors`.
* It creates an Express application (`app`) and defines the port (`3000`).
* It uses `body-parser` middleware to parse incoming JSON and URL-encoded request bodies.
* It uses `cors` middleware to enable Cross-Origin Resource Sharing, allowing the frontend (running in a browser) to make requests to the backend server.
* It defines the path to a local SQLite database file (`patients.db`) using `path.join(__dirname, 'patients.db')`.
* It initializes a `PGlite` database instance (`db`).
* The `initializeDatabase` function is called to create the `patients` table if it doesn't exist. The table has columns for `id` (primary key, auto-incrementing), `name` (text, not null), `email` (text, not null, unique), `phone` (text), `dateOfBirth` (text), and `gender` (text).
* The `/api/register` POST endpoint handles patient registration:
    * It extracts the patient data from the request body.
    * It uses `db.query` to insert a new record into the `patients` table with the provided data.
    * If the insertion is successful, it sends a 201 status code with a success message.
    * If there's an error during insertion (e.g., duplicate email), it sends a 500 status code with an error message.

💡 **Example:** This is like the clinic's computer system receiving the information you submitted on the form and storing it securely in its database.

**6️⃣ Fetching Registered Patients (server.js & JavaScript)**

📌 **Inferred Commit Message:** `Implemented backend patient retrieval and frontend display`

* **Backend (`server.js`):**
    * The `/api/patients` GET endpoint handles fetching all registered patients:
        * It uses `db.query('SELECT * FROM patients')` to retrieve all records from the `patients` table.
        * It extracts the rows from the result (`result.rows || []`).
        * It sends a 200 status code with the array of patient data as JSON.
        * It includes error handling in case there's an issue fetching data from the database.
* **Frontend (`index.html` JavaScript):**
    * The `loadPatients` function uses the `fetch` API to send a `GET` request to the `/api/patients` endpoint.
    * It parses the JSON response from the server, which contains an array of patient objects.
    * It calls the `displayPatients` function to render this data on the web page.
    * It includes error handling for network issues during the `fetch` request.
    * The `displayPatients` function takes the array of patient data and dynamically creates an HTML `<table>` to display the information in a structured format. It iterates through the patients and creates table rows and cells for each patient's details. If there are no patients, it displays a "No patients found." message.

💡 **Example:** This is like the clinic staff being able to pull up a list of all registered patients in their system to view their basic information.

## How to Run the Project

1.  **Save the files:** Ensure you have saved the provided `index.html` and `server.js` files in appropriate directories (e.g., `index.html` in the root and `server.js` in a `backend` folder).
2.  **Navigate to the backend directory:** Open your terminal or command prompt and navigate to the directory containing `server.js` (e.g., `cd backend`).
3.  **Install dependencies:** Run the command `npm install` to install the necessary Node.js packages (`express`, `body-parser`, `@electric-sql/pglite`, `cors`). **Note:** Make sure you have Node.js and npm installed on your system.
4.  **Start the server:** Run the command `node server.js` to start the backend server. You should see a message in the console indicating that the server is listening on `http://localhost:3000`.
5.  **Open the frontend:** Open the `index.html` file in your web browser.

Now you should be able to:

* Fill out the registration form and click "Register". This will send the data to the backend server, which will store it in the local `patients.db` database.
<<<<<<< HEAD
* Click the "Show Patients" button. This will fetch the registered patient data from the backend server and display it in a table on the page.
=======
* Click the "Show Patients" button. This will fetch the registered patient data from the backend server and display it in a table on the page.
>>>>>>> efc25fe (Add entire patient registration app project)
