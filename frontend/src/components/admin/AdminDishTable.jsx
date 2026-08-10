import DeleteDishPopup from "./DeleteDishPopup";

function AdminDishTable({ dishes, deleteSelectedDish }) {
  return (
    <table className="wine-table food-table admin-food-table">
      <thead>
        <tr>
          <th className="food-id">Food ID</th>
          <th className="food-name">Dish Name</th>
          <th className="food-category">Category</th>
          <th className="food-description">Description</th>
          <th className="food-available">Available</th>
          <th className="food-colour-wine">Wine Colour</th>
          <th className="food-requires-sauce">Requires Sauce</th>
          <th className="food-delete">Delete</th>
        </tr>
      </thead>

      <tbody>
        {/* Creates one table row for each dish.
        https://react.dev/learn/rendering-lists */}
        {dishes.map((dish) => (
          <tr key={dish.food_id}>
            <td className="food-id">{dish.food_id}</td>
            <td className="food-name">{dish.dish_name}</td>
            <td className="food-category">{dish.category}</td>
            <td className="food-description">{dish.description}</td>

            <td className="food-available">
              {Number(dish.available) === 1 ? "Yes" : "No"}
            </td>

            <td className="food-colour-wine">
              {dish.colour_wine}
            </td>

            <td className="food-requires-sauce">
              {Number(dish.requires_sauce) === 1 ? "Yes" : "No"}
            </td>

            {deleteSelectedDish && (
              <td className="wine-delete">
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