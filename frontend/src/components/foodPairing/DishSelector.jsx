function DishSelector({
  dishNumber,
  foods,
  sauces,
  selectedDish,
  selectedSauce,
  setSelectedDish,
  setSelectedSauce,
}) {
  // Finds the selected food item so its information can be used.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  const selectedFood = foods.find(
    (food) => Number(food.food_id) === Number(selectedDish)
  );

  // Updates the selected dish.
  function changeDish(event) {
    setSelectedDish(event.target.value);

    // Clears the sauce if the dish changes.
    setSelectedSauce("");
  }
  return (
    <div className="dish-selector">
      <div className="dish-filter-group">
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

      {/* Shows the sauce dropdown only for dishes that require a sauce. */}
        {selectedFood?.requires_sauce === 1 && (
          <>
            <label htmlFor={`sauce_${dishNumber}`}> Sauce</label>

            <select
              id={`sauce_${dishNumber}`}
              value={selectedSauce}
              onChange={(event) =>
                setSelectedSauce(event.target.value)
              }
            >
              <option value="">No Sauce</option>

              {/* Creates one option for each available sauce.
              https://react.dev/learn/rendering-lists */}
              {sauces.map((sauce) => (
                <option
                  key={sauce.sauce_id}
                  value={sauce.sauce_id}
                >
                  {sauce.name}
                </option>
              ))}

            </select>
          </>
        )}
      </div>
    </div>
  );
}

export default DishSelector;