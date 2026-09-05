import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {

  const [flippedCard, setFlippedCard] = useState(null);

  const pairings = [
    {
      dish: "Grilled Salmon",
      description: "Fresh, delicate and lightly rich.",
      wine: "Pouilly-Fuissé Cuvée Vieilles Vignes Domaine Simonin",
      wineDescription: "Rich Burgundy Chardonnay with ripe orchard fruit, hazelnut and mineral notes, balanced freshness and creamy texture."
    },
    {
      dish: "Fillet Steak",
      description: "Lean, gently savoury, and incredibly tender.",
      wine: "Vosne-Romanée Les Chalandins J. Cacheux",
      wineDescription: "Silky Vosne-Romanée with red cherry, spice and floral notes, refined tannins and elegant persistence"
    },
    {
      dish: "Chocolate Dessert",
      description: "Sweet, rich and intense.",
      wine: "Château d’Yquem Sauternes",
      wineDescription: "Rare mature Sauternes with caramel, dried apricot and spice complexity, profound sweetness and exceptional lingering finish."
    }
  ];


  function flipCard(index) {

    if (flippedCard === index) {
      setFlippedCard(null);
    } else {
      setFlippedCard(index);
    }

  }


  return (
    <main className="home-page">

      {/* HERO */}
      <section className="home-hero">

        <div className="home-hero-text">

          <p className="home-eyebrow">
            SOMMELIERIQ
          </p>

          <h1>
            The right wine.
            <br />
            For every dish.
          </h1>

          <p className="home-description">
            Discover wines from your restaurant's own collection,
            intelligently matched to the food on your table.
          </p>

          <div className="home-hero-buttons">

            <Link
              to="/restaurants"
              className="home-primary-button"
            >
              Find Your Pairing
            </Link>

            <Link
              to="/login"
              className="home-outline-button"
            >
              Restaurant Login
            </Link>

          </div>

        </div>


        <div className="home-hero-visual">

          <div className="home-wine-glass">
            🍷
          </div>

          <div className="home-food-plate">
            🍽️
          </div>

        </div>

      </section>



      {/* INTRODUCTION */}
      <section className="home-introduction">

        <p className="home-eyebrow">
          PAIRING, SIMPLIFIED
        </p>

        <h2>
          From the restaurant's cellar
          <br />
          to the perfect bottle on your table.
        </h2>

        <p>
          SommelierIQ compares the characteristics of your selected
          dishes with wines available in the restaurant, helping you
          discover a bottle that complements your meal.
        </p>

      </section>



      {/* CUSTOMER STEPS */}
      <section className="home-steps">

        <article className="home-step">

          <span>01</span>

          <h2>Choose</h2>

          <h3>Your Restaurant</h3>

          <p>
            Select where you are dining and explore the restaurant's
            wine collection and food menu.
          </p>

        </article>


        <article className="home-step">

          <span>02</span>

          <h2>Pair</h2>

          <h3>Your Dishes</h3>

          <p>
            Choose one or several dishes from the menu to represent
            what is being served at your table.
          </p>

        </article>


        <article className="home-step">

          <span>03</span>

          <h2>Discover</h2>

          <h3>Your Wine</h3>

          <p>
            SommelierIQ compares the food and wine characteristics
            and recommends suitable wines available in the restaurant.
          </p>

        </article>

      </section>



      {/* PAIRING FLIP CARDS */}
      <section className="home-pairing-demo">

        <p className="home-eyebrow">
          FROM DISH TO BOTTLE
        </p>

        <h2>
          See the pairing in action.
        </h2>

        <p className="home-section-description">
          Select a dish to reveal a wine that complements it.
        </p>


        <div className="home-flip-grid">

          {pairings.map((pairing, index) => (

            <div
              key={index}
              className={`home-flip-card ${
                flippedCard === index ? "flipped" : ""
              }`}
              onClick={() => flipCard(index)}
            >

              <div className="home-flip-card-inner">


                {/* FRONT */}
                <div className="home-flip-card-front">

                  <div className="home-dish-icon">
                    🍽️
                  </div>

                  <p className="home-card-label">
                    YOUR DISH
                  </p>

                  <h3>
                    {pairing.dish}
                  </h3>

                  <p>
                    {pairing.description}
                  </p>

                  <span className="home-card-action">
                    Discover the pairing →
                  </span>

                </div>


                {/* BACK */}
                <div className="home-flip-card-back">

                  <div className="home-wine-icon">
                    🍷
                  </div>

                  <p className="home-card-label">
                    YOUR PAIRING
                  </p>

                  <h3>
                    {pairing.wine}
                  </h3>

                  <p>
                    {pairing.wineDescription}
                  </p>

                  <span className="home-card-action">
                    ← View dish
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>



      {/* FOOD SECTION */}
      <section className="home-split-section">

        <div className="home-split-visual">

          <div className="home-large-icon">
            🍽️
          </div>

        </div>


        <div className="home-split-content">

          <p className="home-eyebrow">
            BUILT AROUND YOUR MEAL
          </p>

          <h2>
            One dish or the entire table.
          </h2>

          <p>
            Select multiple dishes and SommelierIQ considers their
            characteristics together when finding wines suitable
            for your meal.
          </p>

          <Link
            to="/restaurants"
            className="home-text-link"
          >
            Explore Restaurants →
          </Link>

        </div>

      </section>



      {/* WINE SECTION */}
      <section className="home-split-section home-split-reverse">

        <div className="home-split-content">

          <p className="home-eyebrow">
            FROM THE CELLAR
          </p>

          <h2>
            Recommendations you can actually order.
          </h2>

          <p>
            Recommendations come from the restaurant's own wine
            collection, so customers can discover wines that are
            actually available where they are dining.
          </p>

          <Link
            to="/restaurants"
            className="home-text-link"
          >
            Browse Restaurants →
          </Link>

        </div>


        <div className="home-split-visual">

          <div className="home-large-icon">
            🍷
          </div>

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="home-cta">

        <p className="home-eyebrow">
          FIND YOUR PAIRING
        </p>

        <h2>
          What's on the menu?
        </h2>

        <p>
          Your next bottle starts with your dish.
        </p>

        <Link
          to="/restaurants"
          className="home-secondary-button"
        >
          Choose a Restaurant
        </Link>

      </section>
      {/* OWNER SECTION */}
      <section className="home-owner-section">

        <div className="home-owner-heading">

          <p className="home-eyebrow">
            FOR RESTAURANTS
          </p>

          <h2>
            Your wine list.
            <br />
            Smarter.
          </h2>

        </div>


        <div className="home-owner-content">

          <p>
            SommelierIQ gives restaurant teams a central place to
            manage wines, menu items, pricing and availability while
            providing customers with an interactive wine experience.
          </p>


          <div className="home-owner-features">

            <div>
              <strong>01</strong>
              <span>Manage wine collections</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Manage food menus</span>
            </div>

            <div>
              <strong>03</strong>
              <span>AI-assisted wine profiling</span>
            </div>

            <div>
              <strong>04</strong>
              <span>Customer food pairing</span>
            </div>

          </div>


          <Link
            to="/login"
            className="home-primary-button"
          >
            Restaurant Login
          </Link>

        </div>

      </section>




    </main>
  );
}

export default Home;