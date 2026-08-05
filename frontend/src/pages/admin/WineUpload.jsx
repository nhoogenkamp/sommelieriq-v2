import { useState } from "react";
import Papa from "papaparse";
import WineUploadTable from "../../components/admin/WineUploadTable";

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

  // Runs when the selected file changes.
  function handleFileChange(event) {
    setError("");
    setWines([]);

    if (event.target.files.length) {
      const inputFile = event.target.files[0];

      // Gets the file extension from the filename.
      const fileExtension = inputFile.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please select a CSV file.");
        setFile("");
        return;
      }

      setFile(inputFile);
    }
  }

  // Reads and parses the selected CSV file.
  function handleParse() {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = function ({ target }) {
      const csv = Papa.parse(target.result, {
        header: true,
        skipEmptyLines: true,
      });

      // Stores every parsed CSV row in React state.
      setWines(csv.data);
    };

    reader.readAsText(file);
  }

  return (
    <main>
      <h1>Upload Wines</h1>

      <label htmlFor="csvInput">Select CSV File:</label>

      <input
        id="csvInput"
        name="file"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      <button type="button" onClick={handleParse}>
        Preview Wines
      </button>

      {error && <p>{error}</p>}

      {wines.length > 0 && (
        <>
          <h2>Wine Preview</h2>

          <div className="upload-table-container">
            <WineUploadTable wines={wines} />
          </div>

          {/* The backend upload will be connected later. */}
          <button type="button">Accept and Upload</button>
        </>
      )}
    </main>
  );
}

export default WineUpload;
