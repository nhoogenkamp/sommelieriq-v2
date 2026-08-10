import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDishes, updateDish } from "../../api/dishApi";
import AdminDishTable from "../../components/admin/AdminDishTable";

function DishUpdate() {
  const { restaurantId } = useParams();

  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetches all dishes for the logged-in restaurant.
  useEffect(() => {
    async function loadDishes() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getDishes();

        setDishes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDishes();
  }, [restaurantId]);

  // Updates one selected dish.
  function updateSelectedDish(updatedDish) {
    const entry = {
      food_id: Number(updatedDish.food_id),
      dish_name: updatedDish.dish_name,
      category: updatedDish.category,
      description: updatedDish.description,
      body_score: Number(updatedDish.body_score),
      tannin_score: Number(updatedDish.tannin_score),
      acidity_score: Number(updatedDish.acidity_score),
      sweetness_score: Number(updatedDish.sweetness_score),
      available: Number(updatedDish.available),
      colour_wine: updatedDish.colour_wine,
      requires_sauce: Number(updatedDish.requires_sauce),
    };

    setMessage("");
    setError("");

    updateDish(entry)
      .then(function (json) {
        // Updates the changed dish in React state.
        const updated = dishes.map((dish) => {
          if (dish.food_id === entry.food_id) {
            return entry;
          }

          return dish;
        });

        setDishes(updated);
        setMessage(json.message);
      })
      .catch(function (error) {
        setError(error.message);
      });
  }

  if (isLoading) {
    return (
      <main>
        <h1>Update Dishes</h1>
        <p>Loading Food Menu...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Update Dishes</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Update Dishes</h1>

      {message && <p>{message}</p>}

      {dishes.length === 0 ? (
        <p>No dishes are currently available.</p>
      ) : (
        <div className="dish-table-container">
          <AdminDishTable
            dishes={dishes}
            updateSelectedDish={updateSelectedDish}
          />
        </div>
      )}
    </main>
  );
}

export default DishUpdate;