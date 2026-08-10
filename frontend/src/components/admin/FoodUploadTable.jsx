function FoodUploadTable({ dishes }) {
  return (
    <table className="food-table upload-food-table">
      <thead>
        <tr>
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
        </tr>
      </thead>

      <tbody>
        {/* Creates one preview row for every dish in the CSV, same as WineUploadTable.jsx
        https://react.dev/learn/rendering-lists */}
        {dishes.map((dish, index) => (
          <tr key={index}>
            <td className="food-name">{dish.dish_name}</td>
            <td className="food-category">{dish.category}</td>
            <td className="food-description">{dish.description}</td>
            <td className="food-body-score">{dish.body_score}</td>
            <td className="food-tannin-score">{dish.tannin_score}</td>
            <td className="food-acidity-score">{dish.acidity_score}</td>
            <td className="food-sweetness-score">{dish.sweetness_score}</td>
            <td className="food-available">{Number(dish.available) === 1 ? "Yes" : "No"}</td>
            <td className="food-colour-wine">{dish.colour_wine}</td>
            <td className="food-requires-sauce">{Number(dish.requires_sauce) === 1 ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FoodUploadTable;