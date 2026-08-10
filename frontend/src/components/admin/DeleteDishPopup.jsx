import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function DeleteDishPopup({ dish, deleteSelectedDish }) {
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

          <h2>Delete Dish</h2>

          <p>
            Are you sure you want to permanently delete this Dish?
          </p>

          <hr />

          <p>
            <strong>Dish ID:</strong> {dish.food_id}
          </p>

          <p>
            <strong>Name:</strong> {dish.dish_name}
          </p>

          <p>
            <strong>Category:</strong> {dish.category}
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
              deleteSelectedDish(dish.food_id);
              close();
            }}
          >
            Delete Dish
          </button>

        </div>
      )}
    </Popup>
  );
}

export default DeleteDishPopup;