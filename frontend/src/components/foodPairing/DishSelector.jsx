function DishSelector({
  dishNumber,
  foods,
  selectedDish,
  setSelectedDish,
}) {
  return (
    <div className="dish-selector">
      {/* Same style as WineFilters.jsx*/}
      <label htmlFor={`dish_${dishNumber}`}> Dish {dishNumber}</label>

      <select
        id={`dish_${dishNumber}`}
        value={selectedDish}
        onChange={(event) =>
          setSelectedDish(event.target.value)
        }
      >
        <option value=""> Select Dish</option>

        {foods.map((food) => (
          <option key={food.food_id} value={food.food_id}>
            {food.dish_name}
          </option>
        ))}
      </select>

    </div>
  );
}

export default DishSelector;