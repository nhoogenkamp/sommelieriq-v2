import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

// Same style as admin wine popup

function DeleteWinePopup({ wine, deleteSelectedWine }) {
  return (
    <Popup
      trigger={
        <button
          className="wine-delete-button"
          type="button"
        >
          Delete
        </button>
      }
      modal nested
    >
      {(close) => (
        <div className="wine-popup">

          <h2>Delete Wine</h2>

          <p>
            Are you sure you want to permanently delete this wine?
          </p>

          <hr />

          <p>
            <strong>Wine ID:</strong> {wine.wine_id}
          </p>

          <p>
            <strong>Name:</strong> {wine.name}
          </p>

          <p>
            <strong>Type:</strong> {wine.wine_type}
          </p>

          <p>
            <strong>Price:</strong> €{Number(wine.price).toFixed(2)}
          </p>

          <hr />

          <button
            className="wine-popup-close"
            type="button"
            onClick={() => close()}
          >
            Cancel
          </button>

          <button
            className="wine-delete-button"
            type="button"
            onClick={() => {
              deleteSelectedWine(wine.wine_id);
              close();
            }}
          >
            Delete Wine
          </button>

        </div>
      )}
    </Popup>
  );
}

export default DeleteWinePopup;