import DeleteDishPopup from "./DeleteDishPopup";

function AdminDishTable({ dishes, updateSelectedDish, deleteSelectedDish, }) {
  return (
    <table className="wine-table admin-dish-table">
      <thead>
        <tr>
          <th className="food-id">Food ID</th>
          <th className="food-name">Dish Name</th>
          <th className="food-category">Category</th>
          <th className="food-description">Description</th>
          <th className="food-body-score">Body</th>
          <th className="food-tannin-score">Tannin</th>
          <th className="food-acidity-score">Acidity</th>
          <th className="food-sweetness-score">Sweetness</th>
          <th className="food-available">Available</th>
          <th className="food-colour-wine">Wine Colour</th>
          <th className="food-requires-sauce">Requires Sauce</th>

          {/* Only show this column when updateSelectedDish is on the page https://react.dev/learn/conditional-rendering */}
          {updateSelectedDish && (
            <>
              <th className="food-update">Update</th>
            </>
          )}

          {/* Only show this column when deletion is on the page https://react.dev/learn/conditional-rendering */}
          {deleteSelectedDish && (
            <>
              <th className="food-delete">Delete Dish</th>
            </>
          )}
        </tr>
      </thead>

      <tbody>
        {/* Mapping each dish object to a table row.
        https://react.dev/learn/rendering-lists
        for dropdown changes: https://react.dev/reference/react-dom/components/select and https://www.w3schools.com/react/react_forms_select.asp */}
        {dishes.map((dish) => (
          <tr key={dish.food_id}>
            <td className="food-id">{dish.food_id}</td>

            <td className="food-name">
              {updateSelectedDish ? (
                <input
                  type="text"
                  id={`dish-name-${dish.food_id}`}
                  defaultValue={dish.dish_name}
                />
              ) : (
                dish.dish_name
              )}
            </td>

            <td className="food-category">
              {updateSelectedDish ? (
                <select
                  id={`dish-category-${dish.food_id}`}
                  defaultValue={dish.category}
                >
                  <option>starter</option>
                  <option>main</option>
                  <option>dessert</option>
                </select>
              ) : (
                dish.category
              )}
            </td>

            <td className="food-description">
              {updateSelectedDish ? (
                <textarea
                  id={`dish-description-${dish.food_id}`}
                  defaultValue={dish.description}
                />
              ) : (
                dish.description
              )}
            </td>

            <td className="food-body-score">
              {updateSelectedDish ? (
                <input
                  type="number"
                  min="0"
                  max="20"
                  id={`dish-body-${dish.food_id}`}
                  defaultValue={dish.body_score}
                />
              ) : (
                dish.body_score
              )}
            </td>

            <td className="food-tannin-score">
              {updateSelectedDish ? (
                <input
                  type="number"
                  min="0"
                  max="20"
                  id={`dish-tannin-${dish.food_id}`}
                  defaultValue={dish.tannin_score}
                />
              ) : (
                dish.tannin_score
              )}
            </td>

            <td className="food-acidity-score">
              {updateSelectedDish ? (
                <input
                  type="number"
                  min="0"
                  max="20"
                  id={`dish-acidity-${dish.food_id}`}
                  defaultValue={dish.acidity_score}
                />
              ) : (
                dish.acidity_score
              )}
            </td>

            <td className="food-sweetness-score">
              {updateSelectedDish ? (
                <input
                  type="number"
                  min="0"
                  max="20"
                  id={`dish-sweetness-${dish.food_id}`}
                  defaultValue={dish.sweetness_score}
                />
              ) : (
                dish.sweetness_score
              )}
            </td>

            <td className="food-available">
              {updateSelectedDish ? (
                <select
                  id={`dish-available-${dish.food_id}`}
                  defaultValue={dish.available}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              ) : (
                Number(dish.available) === 1 ? "Yes" : "No"
              )}
            </td>

            <td className="food-colour-wine">
              {updateSelectedDish ? (
                <select
                  id={`dish-colour-${dish.food_id}`}
                  defaultValue={dish.colour_wine}
                >
                  <option value="red">Red</option>
                  <option value="white">White</option>
                  <option value="rose">Rosé</option>
                  <option value="non_alcoholic">Non-Alcoholic</option>
                  <option value="sherry">Sherry</option>
                  <option value="sparkling">Sparkling</option>
                  <option value="champagne">Champagne</option>
                  <option value="dessert">Dessert</option>
                  <option value="port">Port</option>
                </select>
              ) : (
                dish.colour_wine
              )}
            </td>

            <td className="food-requires-sauce">
              {updateSelectedDish ? (
                <select
                  id={`dish-sauce-${dish.food_id}`}
                  defaultValue={dish.requires_sauce}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              ) : (
                Number(dish.requires_sauce) === 1 ? "Yes" : "No"
              )}
            </td>

            {updateSelectedDish && (
              <>
                <td>
                  <button
                    className="food-update-button"
                    type="button"
                    onClick={() =>
                      updateSelectedDish({
                        food_id: dish.food_id,
                        dish_name: document.getElementById(`dish-name-${dish.food_id}`).value,
                        category: document.getElementById(`dish-category-${dish.food_id}`).value,
                        description: document.getElementById(`dish-description-${dish.food_id}`).value,
                        body_score: document.getElementById(`dish-body-${dish.food_id}`).value,
                        tannin_score: document.getElementById(`dish-tannin-${dish.food_id}`).value,
                        acidity_score: document.getElementById(`dish-acidity-${dish.food_id}`).value,
                        sweetness_score: document.getElementById(`dish-sweetness-${dish.food_id}`).value,
                        available: document.getElementById(`dish-available-${dish.food_id}`).value,
                        colour_wine: document.getElementById(`dish-colour-${dish.food_id}`).value,
                        requires_sauce: document.getElementById(`dish-sauce-${dish.food_id}`).value,
                      })
                    }
                  >
                    Update
                  </button>
                </td>
              </>
            )}

            {deleteSelectedDish && (
              <td className="food-delete">
                <DeleteDishPopup
                  dish={dish}
                  deleteSelectedDish={deleteSelectedDish}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AdminDishTable;