// Using the same style as wineApi.js

const API_URL = import.meta.env.VITE_FLASK_API;

// Gets the available food items for one restaurant.
export async function getRestaurantFood(restaurantId) {
  const response = await fetch(`${API_URL}/getFood`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      restaurant_id: Number(restaurantId),
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to load the food menu.");
  }

  return response.json();
}

// Gets the available sauces for one restaurant.
export async function getRestaurantSauces(restaurantId) {
  const response = await fetch(`${API_URL}/getSauces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      restaurant_id: Number(restaurantId),
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to load the sauces.");
  }

  return response.json();
}