//https://stackoverflow.com/questions/57891275/simple-fetch-get-request-in-javascript-to-a-flask-server 

// display in table :https://www.youtube.com/watch?v=eS-FVnhjvEQ

function filterWines(wines) {
    const restaurant_id = Number(document.getElementById("restaurant_id").value);
    const selectedColour = document.getElementById("wineColour").value;
    const selectedBottle = document.getElementById("bottleType").value;
    const maxPrice = document.getElementById("maxPrice").value;

    return wines.filter(wine => {

        return (
            (selectedColour === "" || wine.wine_type === selectedColour) &&
            (selectedBottle === "" || wine.bottle_type === selectedBottle) &&
            (maxPrice === "" || Number(wine.price) <= Number(maxPrice))
        );

    });
}

function getWines() {
    var restaurant_id = Number(document.getElementById("restaurant_id").value);

    var entry = {
        restaurant_id: restaurant_id
    };

    fetch(`http://localhost:8080/getWines`, {
        method: "POST",
        body: JSON.stringify(entry),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
    .then(response => response.json())  
    .then(json => {

    const filteredWines = filterWines(json);

    let out = "";

    filteredWines.forEach(element => {
        out += `
            <tr>
                <td>${element.year}</td>
                <td>${element.bottle_type}</td>
                <td>${element.name}</td>
                <td>${element.wine_type}</td>
                <td>${element.grape}</td>
                <td>${element.country}</td>
                <td>${element.region}</td>
                <td>${element.price}</td>
            </tr>
        `;
    });

    document.getElementById("wines").innerHTML = out;
});
}