import { useState, useRef } from "react";
import Papa from "papaparse";
import WineUploadTable from "../../components/admin/WineUploadTable";
import { uploadWines } from "../../api/wineApi";
import CsvTemplateDownload from "../../components/admin/CsvTemplateDownload";
import AICsvTemplateDownload from "../../components/admin/AIcsvTemplateDownload";


// https://www.geeksforgeeks.org/reactjs/how-to-read-csv-files-in-react-js/
// Allowed file extensions.
const allowedExtensions = ["csv"];

function WineUpload() {
  // Stores all wines parsed from the CSV file.
  const [wines, setWines] = useState([]);

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
    setWines([]);

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
      setWines(csv.data);
    };

    reader.readAsText(file);
  }


// Uploads all previewed wines to the backend.
function uploadWineFile() {

  // Creates the object that will be sent to the API.
  const entry = {
    wines: wines,
  };
  setError("");
  setMessage("");

  uploadWines(entry)
    .then(function (json) {
      setMessage(json.message);

      setWines([]);
      setFile("");
      resetFileInput();

    })
    .catch(function (error) {
      setError(error.message);
    });
}  

// Uploads all previewed wines to the backend for ai generation
function uploadWinesAIFile() {
  // Creates the object that will be sent to the API 
  const entry = {
    wines: wines,
  };
  setError("");
  setMessage("");

  uploadWinesAI(entry)
    .then(function (json) {
      setWines(json.wines);
      setMessage(json.message);
    })
    .catch(function (error) {
      setError(error.message);
    });
}  

  return (
    <main>
      <h1>Upload Wines</h1>

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
        Preview Wines
      </button>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <br />
      <br />
      <h3>Download a template below </h3>
      <p> For the best results, it's recommended to download this csv file below and add information on all the fields </p>
      <div className="download-button">
        <CsvTemplateDownload />
      </div>

      <br />
      <br />
      {wines.length > 0 && (
        <>
          <h2>Wine Preview</h2>

          <div className="upload-table-container">
            <WineUploadTable wines={wines} />
          </div>

          {/* The backend upload will be connected later. */}
          
          <button type="button" className="upload-button" onClick={uploadWineFile} >Accept and Upload</button>
        </>
      )}


      <h1>Upload Wines with the help of AI</h1>

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
        Preview Wines
      </button>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <br />
      <br />
      <h3>Download a template below </h3>
      <p> For the best results, it's recommended to download this csv file below and add information on all the fields </p>
      <div className="download-button">
        <CsvTemplateDownload />
      </div>

      <br />
      <br />
      {wines.length > 0 && (
        <>
          <h2>Wine Preview</h2>

          <div className="upload-table-container">
            <WineUploadTable wines={wines} />
          </div>

          {/* The backend upload will be connected later. */}
          <button type="button"className="upload-button" onClick={uploadWinesAIFile}> Generate AI Profiles</button>

          <button type="button" className="upload-button" onClick={uploadWineFile} >Accept and Upload</button>
        </>
      )}      
    </main>
  );
}

export default WineUpload;
