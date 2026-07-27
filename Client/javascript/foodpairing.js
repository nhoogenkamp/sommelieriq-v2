// Filtering wines
function filterWines(wines) {
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

// select fields to create number of fields https://stackoverflow.com/questions/73554956/how-to-display-fields-according-to-selected-input-using-plain-javascript

function genFields() {

    document.getElementById("dishMessage").innerHTML = "";

    document.getElementById("fields").innerHTML = "";

    let numFields = document.getElementById("dishCount").value;
    //assigning numbers to a dish chosen https://www.freecodecamp.org/news/what-does-the-dollar-sign-mean-in-javascript/#:~:text=The%20dollar%20sign%20followed%20by,m%20%24%7Bage%7D%20years%20old.
    for (let i = 1; i <= numFields; i++) {

        document.getElementById("fields").innerHTML += `

            <div>

                <label for="dish_${i}">Dish ${i}</label>

                <select id="dish_${i}" onchange="checkSauce(${i})">

                    <option value="">Select Dish</option>

                    <option value="Achill Island Oysters">
                        Achill Island Oysters
                    </option>

                    <option value="Pan Seared Scallops">
                        Pan Seared Scallops
                    </option>

                    <option value="Beetroot Carpaccio">
                        Beetroot Carpaccio
                    </option>

                    <option value="Short Rib Nugget">
                        Short Rib Nugget
                    </option>

                    <option value="Caesar Salad">Caesar Salad</option>

                    <option value="Chicken Liver & Foie Gras Parfait">
                        Chicken Liver & Foie Gras Parfait
                    </option>

                    <option value="Devilled Kidneys">Devilled Kidneys</option>

                    <option value="Dry Aged Beef Tartare">
                        Dry Aged Beef Tartare
                    </option>

                    <option value="F.X. Buckley Black Pudding Scotch Egg">
                        F.X. Buckley Black Pudding Scotch Egg
                    </option>

                    <option value="6oz Beef Fillet Medallions">
                        6oz Beef Fillet Medallions
                    </option>
                    
                    <option value="Fillet Steak">
                        Fillet Steak
                    </option>
                    
                    <option value="Rib Eye Steak">
                        Rib Eye Steak
                    </option>

                    <option value="Striploin Steak">
                        Striploin Steak
                    </option>

                    <option value="T-Bone Steak">
                        T-Bone Steak
                    </option>

                    <option value="Striploin on the Bone">
                        Striploin on the Bone
                    </option>

                    <option value="Ridgeway Wagyu Bone In Striploin">
                        Ridgeway Wagyu Bone In Striploin
                    </option>

                    <option value="Chateaubriand">
                        Chateaubriand
                    </option>

                    <option value="Irish Ex Dairy Cow Côte de Boeuf">
                        Irish Ex Dairy Cow Côte de Boeuf
                    </option>

                    <option value="Porterhouse Steak">
                        Porterhouse Steak
                    </option>

                    <option value="Braised Beef Cheek">
                        Braised Beef Cheek
                    </option>
                   
                    <option value="Free Range Chicken Roulade">
                        Free Range Chicken Roulade
                    </option>

                    <option value="Cornish Sole Meuniére">
                        Cornish Sole Meuniére
                    </option>


                </select>

                <div id="sauce_${i}"></div>

                <br><br>

            </div>

        `;
    }
}

function checkSauce(i) {

    let dish = document.getElementById(`dish_${i}`).value;

    if (
        dish == "Fillet Steak" ||
        dish == "Rib Eye Steak" ||
        dish == "Striploin Steak" ||
        dish == "Striploin on the Bone" ||
        dish == "Ridgeway Wagyu Bone In Striploin" ||
        dish == "T-Bone Steak"
    ) {

        document.getElementById(`sauce_${i}`).innerHTML = `
            
            <label>Sauce</label>

             <!-- sauce id so JavaScript can read selected sauce -->
            <select id="sauce_select_${i}">
            
                <option value="">Select Sauce</option>
                <option value="Pepper Sauce">Pepper Sauce</option>
                <option value="Bearnaise">Bearnaise</option>
                <option value="Garlic Butter">Garlic Butter</option>
                <option value="Bone Marrow Jus">Bone Marrow Jus</option>
                <option value="No Sauce">No Sauce</option>
            </select>

        `;

    } else {

        document.getElementById(`sauce_${i}`).innerHTML = "";

    }
}


// https://www.youtube.com/watch?v=QKcVjdLEX_s
// Sending multiple dishes js to py when button clicked

function submit_dish() {
    var dishCount = document.getElementById("dishCount").value;
    var dishes = [];

    if (!validatedishes(dishCount)) {
        return;
    }  

    for (let i = 1; i <= dishCount; i++){
        // Get the dropdown element with id
        var dish = document.getElementById(`dish_${i}`);
        // same for sauce but changed to sauce_select to get correct value each time
        var sauce = document.getElementById(`sauce_select_${i}`);

        var sauce_value = "";

        if (sauce){
            sauce_value = sauce.value
        }        
        // Only add dish if user selected something
        // .push to combine dish and sauce for each dish: https://www.w3schools.com/jsref/jsref_push.asp
        if (dish.value !== "") {

            dishes.push({
                dish: dish.value,
                sauce: sauce_value
            });

        }
    }

    // Create JavaScript object to send to Flask
    var entry = {
        restaurant_id: Number(document.getElementById("restaurant_id").value),
        dishes: dishes
    };


    // Send POST request to Flask backend with method, body preventing browser from caching and telling flask its JSON data
    fetch(`http://localhost:8080/senddish`, {
        method: "POST",
        body: JSON.stringify(entry),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
    
    // Check response from Flask
    .then(function(response) {
        if (response.status !==200) {
            console.log(`response status was not 200: ${response.status}`);
            return;
        }
        console.log("dish sent successfully")
        // had to return in order to use the next .then function
        return response.json()
    })

    // .then which I will have to change later to asynch or await: https://www.w3schools.com/js/js_async_await.asp
    .then(function(json) {

    const combined_recommendations = json.combined_recommendations;
    const filteredWines = filterWines(combined_recommendations);
    let combinedOut = "";

    // only show combined recommendations if they exist
    if (combined_recommendations.length > 1) {

        document.getElementById("combined_section").style.display = "block";
        filteredWines.slice(0,25).forEach(element => {

            combinedOut += `
                <tr>
                    <td>${element.year}</td>
                    <td>${element.bottle_type}</td>
                    <td>${element.name}</td>
                    <td>${element.wine_type}</td>
                    <td>${element.grape}</td>
                    <td>${element.country}</td>
                    <td>${element.region}</td>
                    <td>${element.match_percentage} %</td>
                    <td>€ ${element.price}</td>
                </tr>
            `;

        });

        document.getElementById("combined_recommendations").innerHTML = combinedOut;
    }else {
        // don't show table combined_recommendations
        document.getElementById("combined_section").style.display = "none";
}    
    
    const recommendationGroups = json.recommendations;
     
    let out = "";

recommendationGroups.forEach(group => {
   // headers for each of the dish recommendation https://www.geeksforgeeks.org/html/html-colspan-attribute/
    out += `
        <tr>
            <td colspan="9">
                <h1>${group.dish}</h1><h2>${group.sauce}</h2>
            </td>  
        </tr>
    `;
    const filteredWines = filterWines(group.recommendations);
    // too many results use slice method: https://www.w3schools.com/Jsref/jsref_slice_array.asp
    filteredWines.slice(0,15).forEach(wine => {

        out += `
            <tr>
                <td>${wine.year}</td>
                <td>${wine.bottle_type}</td>
                <td>${wine.name}</td>
                <td>${wine.wine_type}</td>
                <td>${wine.grape}</td>
                <td>${wine.country}</td>
                <td>${wine.region}</td>
                <td>${wine.match_percentage} %</td>
                <td>€ ${wine.price}</td>
            </tr>
        `;

    });

});

    document.getElementById("recommendations").innerHTML = out;
});
}