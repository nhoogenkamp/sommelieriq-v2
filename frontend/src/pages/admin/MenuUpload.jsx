import { useState, useRef } from "react";
import Papa from "papaparse";
import FoodUploadTable from "../../components/admin/FoodUploadTable";
import { uploadMenu } from "../../api/wineApi";
import CsvFoodTemplateDownload from "../../components/admin/CsvFoodTemplateDownload";

// https://www.geeksforgeeks.org/reactjs/how-to-read-csv-files-in-react-js/
// Allowed file extensions.
const allowedExtensions = ["csv"];

function MenuUpload() {
  // Stores all dishes parsed from the CSV file.
  const [dishes, setDishes] = useState([]);

  // Stores an error if the selected file is incorrect.
  const [error, setError] = useState("");

  // Stores the file selected by the administrator.
  const [file, setFile] = useState("");

  // stores success message that is returned by flask
  const [message, setMessage] = useState("");  

  // Used to reset the selected CSV file. https://www.geeksforgeeks.org/reactjs/how-to-reset-a-file-input-in-react-js/
  const inputFile = useRef(null);

  // Runs when the selected file changes.
  function handleFileChange(event) {
    setError("");
    setMessage("");
    setDishes([]);

    if (event.target.files.length) {
      const selectedFile  = event.target.files[0];

      // Gets the file extension from the filename.
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please select a CSV file.");
        setFile("");
        return;
      }

      setFile(selectedFile);
    }
  }
  // Clears the selected CSV file.
  function resetFileInput() {
    if (inputFile.current) {
      inputFile.current.value = "";
      inputFile.current.type = "text";
      inputFile.current.type = "file";
    }
  }
  // Reads and parses the selected CSV file.
  function handleParse() {
    if (!file) {
      setMessage("");
      setError("Please select a CSV file.");
      return;
    }
    setError("");
    setMessage("");

    const reader = new FileReader();

    reader.onload = function ({ target }) {
      const csv = Papa.parse(target.result, {
        header: true,
        skipEmptyLines: true,
        // Converts CSV numbers from text into JavaScript numbers. https://www.papaparse.com/docs
        dynamicTyping: true,
      });

      // Stores every parsed CSV row in React state.
      setDishes(csv.data);
    };

    reader.readAsText(file);
  }


// Uploads all previewed dishes to the backend.
function uploadDishesFile() {

  // Creates the object that will be sent to the API.
  const entry = {
    dishes: dishes,
  };
  setError("");
  setMessage("");

  uploadMenu(entry)
    .then(function (json) {
      setMessage(json.message);

      setDishes([]);
      setFile("");
      resetFileInput();

    })
    .catch(function (error) {
      setError(error.message);
    });
}  

  return (
    <main>
      <h1>Upload Food Menu</h1>

      <label htmlFor="csvInput">Select CSV File:</label>

      <input
        ref={inputFile}
        id="csvInput"
        name="file"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      <button type="button" className="preview-button" onClick={handleParse}>
        Preview Food
      </button>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <br />
      <br />
      <h3>Download a template below </h3>
      <p> For the best results, it's recommended to download this csv file below and add information on all the fields </p>
      <div className="download-button">
        <CsvFoodTemplateDownload />
      </div>

      <br />
      <br />
      {dishes.length > 0 && (
        <>
          <h2>Food Menu Preview</h2>

          <div className="upload-table-container">
            <FoodUploadTable dishes={dishes} />
          </div>
          
          <button type="button" className="upload-button" onClick={uploadDishesFile} >Accept and Upload</button>
        </>
      )}
    </main>
  );
}

export default MenuUpload;
