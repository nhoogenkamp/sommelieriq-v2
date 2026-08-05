// storing link in .env https://vite.dev/guide/env-and-mode
const API_URL = import.meta.env.VITE_FLASK_API;

export async function getRestaurantWines(restaurantId) {
  const response = await fetch(`${API_URL}/getWines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      restaurant_id: Number(restaurantId),
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to load the wine list.");
  }

  return response.json();
}



// Get all wines for admin purposes
export function getAllWines() {
  return fetch(`${API_URL}/getallWines`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json().then(function (json) {
        if (!response.ok) {
          throw new Error(json.error);
        }

        return json;
      });
    });
}


// Updates the availability of one wine.
export function availableWine(entry) {
  return fetch(`${API_URL}/availableWine`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(entry),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json().then(function (json) {
        if (!response.ok) {
          throw new Error(json.error);
        }

        return json;
      });
    });
}


// Updates the price of one wine.
export function updateWine(entry) {
  return fetch(`${API_URL}/updateWine`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(entry),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json().then(function (json) {
        if (!response.ok) {
          throw new Error(json.error);
        }

        return json;
      });
    });
}


// Delete a wine
export function deleteWine(entry) {
  return fetch(`${API_URL}/deleteWine`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(entry),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json().then(function (json) {
        if (!response.ok) {
          throw new Error(json.error);
        }

        return json;
      });
    });
}