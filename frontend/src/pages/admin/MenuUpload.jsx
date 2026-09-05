import { useState, useRef } from "react";
import Papa from "papaparse";
import FoodUploadTable from "../../components/admin/FoodUploadTable";
import SauceUploadTable from "../../components/admin/SauceUploadTable";
import { uploadMenu } from "../../api/wineApi";
import { uploadSauces, uploadDishesAI } from "../../api/dishApi";
import CsvFoodTemplateDownload from "../../components/admin/CsvFoodTemplateDownload";
import CsvSauceTemplateDownload from "../../components/admin/CsvSauceTemplateDownload";
import AILoadingPopup from "../../components/admin/AILoadingPopup";

const allowedExtensions = ["csv"];


function MenuUpload() {
  const [dishes, setDishes] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [message, setMessage] = useState("");

  // Stores which upload option has been selected.
  const [uploadMode, setUploadMode] = useState("");

  // Stores whether AI dish profiles are currently being generated.
  const [aiLoading, setAiLoading] = useState(false);

  // Stores whether the current dishes have already been processed by AI.
  const [aiGenerated, setAiGenerated] = useState(false);

  const inputFile = useRef(null);

  function handleFileChange(event) {
    setError("");
    setMessage("");
    setDishes([]);
    setSauces([]);
    setAiGenerated(false);

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

    function handleParseSauce() {
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
        setAiGenerated(false);
        resetFileInput();
      })
      .catch(function (error) {
        setError(error.message);
      });
  }
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

  // Uploads all previewed dishes to the backend for AI generation.
  function uploadDishesAIFile() {
    // Creates the object that will be sent to the API 
    const entry = {
      dishes: dishes,
    };
    setError("");
    setMessage("");
    setAiLoading(true);

    uploadDishesAI(entry)
      .then(function (json) {
        setDishes(json.dishes);
        setMessage(json.message);
        setAiGenerated(true);
      })
      .catch(function (error) {
        setError(error.message);
        setAiGenerated(false);
      })
      .finally(function () {
        setAiLoading(false);
      });
  }


  // Cancels the current upload and clears the preview.
  function cancelUpload() {
    setDishes([]);
    setSauces([]);
    setFile("");
    setError("");
    setMessage("");
    setAiGenerated(false);
    resetFileInput();
  }

  return (
    <section>

      <AILoadingPopup open={aiLoading} />

      <h1>Upload Food Menu</h1>

      <div className="dashboard-grid">

        <article
          className="dashboard-card"
          onClick={() => {
            setUploadMode("regular");
            setDishes([]);
            setFile("");
            setError("");
            setMessage("");
            setAiGenerated(false);
            resetFileInput();
          }}
        >
          <h2>Upload Food Menu</h2>

          <p>
            Upload food dishes using a completed CSV file.
          </p>
        </article>


        <article
          className="dashboard-card"
          onClick={() => {
            setUploadMode("ai");
            setDishes([]);
            setFile("");
            setError("");
            setMessage("");
            setAiGenerated(false);
            resetFileInput();
          }}
        >
          <h2>Upload Food Menu with the help of AI</h2>

          <p>
            Upload dish information and use AI to generate the recommended
            wine characteristics and wine category.
          </p>
        </article>

        <article
          className="dashboard-card"
          onClick={() => {
            setUploadMode("sauces");
            setDishes([]);
            setFile("");
            setError("");
            setMessage("");
            setAiGenerated(false);
            resetFileInput();
          }}
        >
          <h2>Upload Sauces.</h2>

          <p>
            Upload sauces and their wine pairing modifiers using a completed CSV file.
          </p>
        </article>
      </div>


      <br />
      <br />


      {/* Regular food CSV upload */}
      {uploadMode === "regular" && (
        <section className="upload-section">

          <h1>Upload Food Menu</h1>
          <div className="upload-controls">
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
          </div>
          <br />
          <br />

          <h3>Download a template below</h3>

          <p>
            For the best results, it's recommended to download this CSV file
            and add information in all fields.
          </p>

          <div className="download-button">
            <CsvFoodTemplateDownload />
          </div>

        </section>
      )}


      {/* AI food CSV upload */}
      {uploadMode === "ai" && (
        <section className="upload-section">

          <h1>Upload Food Menu with the help of AI</h1>
          <div className="upload-controls">
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
          </div>
          <br />
          <br />

          <h3>Download a template below</h3>

          <p>
            The AI upload only requires the dish name, category and description.
            AI will generate the wine characteristic scores and recommended wine category.
          </p>

          <div className="download-button">
            <CsvFoodTemplateDownload />
          </div>

        </section>
      )}

      {/* Regular Sauces CSV upload */}
      {uploadMode === "sauces" && (
        <section className="upload-section">
          <h1>Upload Sauces</h1>
          <div className="upload-controls">
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
              onClick={handleParseSauce}
            >
              Preview Sauces
            </button>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
          </div>
          <br />
          <br />

          <h3>Download a template below</h3>

          <p>
            For the best results, it's recommended to download this CSV file
            and add information in all fields.
          </p>

          <div className="download-button">
            <CsvSauceTemplateDownload />
          </div>

        </section>
      )}


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
          <button
              type="button"
              className="upload-button"
              onClick={cancelUpload}
            >
              Cancel
          </button>

        </>
      )}

      {dishes.length > 0 && (
        <>

          <h2>Food Menu Preview</h2>

          <div className="upload-table-container">
            <FoodUploadTable dishes={dishes} />
          </div>


          {/* Regular CSV upload */}
          {uploadMode === "regular" && (
            <>

              <button
                type="button"
                className="upload-button"
                onClick={uploadDishesFile}
              >
                Accept and Upload
              </button>

              <button
                type="button"
                className="upload-button"
                onClick={cancelUpload}
              >
                Cancel
              </button>

            </>
          )}


          {/* AI CSV upload */}
          {uploadMode === "ai" && (
            <>

              {/* This button appears before the AI profiles have been generated. */}
              {!aiGenerated && (
                <button
                  type="button"
                  className="upload-button"
                  onClick={uploadDishesAIFile}
                  disabled={aiLoading}
                >
                  Generate AI Profiles
                </button>
              )}


              {/* This button appears after the AI profiles have been generated. */}
              {aiGenerated && (
                <button
                  type="button"
                  className="upload-button"
                  onClick={uploadDishesFile}
                >
                  Accept and Upload
                </button>
              )}


              <button
                type="button"
                className="upload-button"
                onClick={cancelUpload}
                disabled={aiLoading}
              >
                Cancel
              </button>

            </>
          )}

        </>
      )}

    </section>
  );
}
export default MenuUpload;
