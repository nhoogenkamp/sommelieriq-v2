import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

// Popup component using the reactjs-popup library.
// https://www.geeksforgeeks.org/reactjs/how-to-create-popup-box-in-reactjs/

function WinePopup({ wine }) {
  return (
    <Popup
      trigger={
        <button
          className="wine-view-button"
          type="button"
        >
          View
        </button>
      }

      modal
      nested
    >
      {(close) => (
        <div className="wine-popup">

          <h2>{wine.name}</h2>
          <h3>Description</h3>

          <p>{wine.description}</p>

          <hr />

          <p>
            <strong>Type:</strong> {wine.wine_type}
          </p>

          <p>
            <strong>Grape:</strong> {wine.grape}
          </p>

          <p>
            <strong>Country:</strong> {wine.country}
          </p>

          <p>
            <strong>Region:</strong> {wine.region}
          </p>

          <p>
            <strong>Year:</strong> {wine.year}
          </p>

          <p>
            <strong>Bottle:</strong> {wine.bottle_type}
          </p>

          <p>
            <strong>Price:</strong>
            {" "}
            €{Number(wine.price).toFixed(2)}
          </p>

          <hr />

          <button
            className="wine-popup-close"
            type="button"
            onClick={() => close()}
          >
            Close
          </button>

        </div>
      )}
    </Popup>
  );
}

export default WinePopup;