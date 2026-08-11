import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDishes, updateDish, getAllSauces, updateSauce,} from "../../api/dishApi";
import AdminDishTable from "../../components/admin/AdminDishTable";
import AdminSauceTable from "../../components/admin/SauceUploadTable";

function DishUpdate() {
  const { restaurantId } = useParams();

  // Stores all dishes and sauces returned from the backend.
  const [dishes, setDishes] = useState([]);
  const [sauces, setSauces] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sauceError, setSauceError] = useState("");
  const [sauceMessage, setSauceMessage] = useState("");

  // Fetches all dishes and sauces for the logged-in restaurant.
  // https://react.dev/learn/synchronizing-with-effects
  useEffect(() => {
    async function loadFoodMenu() {
      try {
        setIsLoading(true);
        setError("");

        const dishData = await getDishes();
        const sauceData = await getAllSauces();

        setDishes(dishData);
        setSauces(sauceData);

      } catch (error) {
        setError(error.message);

      } finally {
        setIsLoading(false);
      }
    }

    loadFoodMenu();
  }, [restaurantId]);


  // Updates one selected dish.
  function updateSelectedDish(updatedDish) {

    // Creates the object that will be sent to the API.
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


  // Updates one selected sauce.
  function updateSelectedSauce(updatedSauce) {

    // Creates the object that will be sent to the API.
    const entry = {
      sauce_id: Number(updatedSauce.sauce_id),
      name: updatedSauce.name,
      body_modifier: Number(updatedSauce.body_modifier),
      tannin_modifier: Number(updatedSauce.tannin_modifier),
      acidity_modifier: Number(updatedSauce.acidity_modifier),
      sweetness_modifier: Number(updatedSauce.sweetness_modifier),
      available: Number(updatedSauce.available),
    };

    setSauceError("");
    setSauceMessage("");

    updateSauce(entry)
      .then(function (json) {

        // Updates the changed sauce in React state.
        const updated = sauces.map((sauce) => {
          if (sauce.sauce_id === entry.sauce_id) {
            return entry;
          }

          return sauce;
        });

        setSauces(updated);
        setSauceMessage(json.message);
      })
      .catch(function (error) {
        setSauceError(error.message);
      });
  }


  if (isLoading) {
    return (
      <main>
        <h1>Update Food Menu</h1>
        <p>Loading Food Menu...</p>
      </main>
    );
  }


  return (
    <main>
      <h1>Update Food Menu</h1>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <h2>Update Dishes</h2>

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

      <br />
      <br />

      <h2>Update Sauces</h2>

      {sauceError && <p>{sauceError}</p>}
      {sauceMessage && <p>{sauceMessage}</p>}
      
      {sauces.length === 0 ? (
        <p>No sauces are currently available.</p>
      ) : (
        <div className="sauce-table-container">
          <AdminSauceTable
            sauces={sauces}
            updateSelectedSauce={updateSelectedSauce}
          />
        </div>
      )}
    </main>
  );
}

export default DishUpdate;