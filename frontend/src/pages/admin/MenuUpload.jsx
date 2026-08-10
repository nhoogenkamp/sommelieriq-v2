import { useState, useRef } from "react";
import Papa from "papaparse";
import FoodUploadTable from "../../components/admin/FoodUploadTable";
import SauceUploadTable from "../../components/admin/SauceUploadTable";
import { uploadMenu } from "../../api/wineApi";
import { uploadSauces } from "../../api/dishApi";
import CsvFoodTemplateDownload from "../../components/admin/CsvFoodTemplateDownload";
import CsvSauceTemplateDownload from "../../components/admin/CsvSauceTemplateDownload";

const allowedExtensions = ["csv"];


function FoodUpload() {
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [message, setMessage] = useState("");

  const inputFile = useRef(null);

  function handleFileChange(event) {
    setError("");
    setMessage("");
    setDishes([]);

    if (event.target.files.length) {
      const selectedFile = event.target.files[0];

      const fileExtension = selectedFile.name
        .split(".")
        .pop()
        .toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please select a CSV file.");
        setFile("");
        return;
      }

      setFile(selectedFile);
    }
  }

  function resetFileInput() {
    if (inputFile.current) {
      inputFile.current.value = "";
      inputFile.current.type = "text";
      inputFile.current.type = "file";
    }
  }

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
        dynamicTyping: true,
      });

      setDishes(csv.data);
    };

    reader.readAsText(file);
  }

  // Uploads all previewed dishes to the backend.
  function uploadDishesFile() {
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
    <section>
      <h1>Upload Food Menu</h1>

      <label htmlFor="foodCsvInput">Select CSV File:</label>

      <input
        ref={inputFile}
        id="foodCsvInput"
        name="file"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      <button
        type="button"
        className="preview-button"
        onClick={handleParse}
      >
        Preview Food
      </button>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <h3>Download a template below</h3>

      <p>
        For the best results, it's recommended to download this CSV file
        and add information in all fields.
      </p>

      <div className="download-button">
        <CsvFoodTemplateDownload />
      </div>

      {dishes.length > 0 && (
        <>
          <h2>Food Menu Preview</h2>

          <div className="upload-table-container">
            <FoodUploadTable dishes={dishes} />
          </div>

          <button
            type="button"
            className="upload-button"
            onClick={uploadDishesFile}
          >
            Accept and Upload
          </button>
        </>
      )}
    </section>
  );
}


function SauceUpload() {
  const [sauces, setSauces] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [message, setMessage] = useState("");

  const inputFile = useRef(null);

  function handleFileChange(event) {
    setError("");
    setMessage("");
    setSauces([]);

    if (event.target.files.length) {
      const selectedFile = event.target.files[0];

      const fileExtension = selectedFile.name
        .split(".")
        .pop()
        .toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please select a CSV file.");
        setFile("");
        return;
      }

      setFile(selectedFile);
    }
  }

  function resetFileInput() {
    if (inputFile.current) {
      inputFile.current.value = "";
      inputFile.current.type = "text";
      inputFile.current.type = "file";
    }
  }

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
        dynamicTyping: true,
      });

      setSauces(csv.data);
    };

    reader.readAsText(file);
  }

  // Uploads all previewed sauces to the backend.
  function uploadSaucesFile() {
    const entry = {
      sauces: sauces,
    };

    setError("");
    setMessage("");

    uploadSauces(entry)
      .then(function (json) {
        setMessage(json.message);

        setSauces([]);
        setFile("");
        resetFileInput();
      })
      .catch(function (error) {
        setError(error.message);
      });
  }

  return (
    <section>
      <h1>Upload Sauces</h1>

      <label htmlFor="sauceCsvInput">Select CSV File:</label>

      <input
        ref={inputFile}
        id="sauceCsvInput"
        name="file"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      <button
        type="button"
        className="preview-button"
        onClick={handleParse}
      >
        Preview Sauces
      </button>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <h3>Download a template below</h3>

      <p>
        For the best results, it's recommended to download this CSV file
        and add information in all fields.
      </p>

      <div className="download-button">
        <CsvSauceTemplateDownload />
      </div>

      {sauces.length > 0 && (
        <>
          <h2>Sauce Preview</h2>

          <div className="upload-table-container">
            <SauceUploadTable sauces={sauces} />
          </div>

          <button
            type="button"
            className="upload-button"
            onClick={uploadSaucesFile}
          >
            Accept and Upload
          </button>
        </>
      )}
    </section>
  );
}


function MenuUpload() {
  return (
    <main>
      <FoodUpload />

      <br />
      <hr />
      <br />

      <SauceUpload />
    </main>
  );
}

export default MenuUpload;