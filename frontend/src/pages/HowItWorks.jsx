import { Link } from "react-router-dom";
import images from "../assets/images/images.js";

function HowItWorks() {

  return (
    <main className="how-it-works-page">


      {/* HERO */}
      <section className="how-hero">

        <div className="how-hero-text">

          <p className="how-eyebrow">
            HOW IT WORKS
          </p>

          <h1>
            From your dish
            <br />
            to the right wine.
          </h1>

          <p className="how-description">
            SommelierIQ connects a restaurant's food menu and wine
            collection to help diners discover wines that complement
            what they are eating.
          </p>

          <Link
            to="/restaurants"
            className="how-primary-button"
          >
            Find Your Restaurant
          </Link>

        </div>


        <div className="how-hero-visual">

          <img
            src={images.howPairing}
            alt="Wine being served alongside food in a restaurant"
          />

        </div>

      </section>



      {/* INTRODUCTION */}
      <section className="how-introduction">

        <p className="how-eyebrow">
          DESIGNED FOR THE TABLE
        </p>

        <h2>
          Wine pairing without needing
          <br />
          to know everything about wine.
        </h2>

        <p>
          Restaurant wine lists can contain unfamiliar grapes,
          regions and producers. SommelierIQ helps make that choice
          easier by starting with something you already know:
          what you are eating.
        </p>

      </section>



      {/* STEP 1 */}
      <section className="how-step-section">

        <div className="how-step-visual">

          <img
            src={images.howRestaurant}
            alt="Customers dining in a contemporary restaurant"
          />

        </div>


        <div className="how-step-content">

          <span className="how-step-number">
            01
          </span>

          <p className="how-eyebrow">
            CHOOSE
          </p>

          <h2>
            Start with your restaurant.
          </h2>

          <p>
            Select the restaurant where you are dining. Each restaurant
            has its own food menu and wine collection within SommelierIQ,
            so the wines you explore are relevant to that restaurant.
          </p>

          <Link
            to="/restaurants"
            className="how-text-link"
          >
            Explore Restaurants →
          </Link>

        </div>

      </section>



      {/* STEP 2 */}
      <section className="how-step-section how-step-reverse">

        <div className="how-step-content">

          <span className="how-step-number">
            02
          </span>

          <p className="how-eyebrow">
            SELECT
          </p>

          <h2>
            Tell us what's on the table.
          </h2>

          <p>
            Choose a dish from the restaurant's menu or select several
            dishes when sharing a meal. SommelierIQ uses the food
            characteristics associated with those dishes when looking
            for suitable wines.
          </p>

          <p>
            This means the recommendation can consider the meal as a
            whole rather than requiring everyone at the table to make
            an independent wine choice.
          </p>

        </div>


        <div className="how-step-visual">

          <img
            src={images.howTable}
            alt="Several dishes arranged on a contemporary restaurant table"
          />

        </div>

      </section>



      {/* STEP 3 */}
      <section className="how-step-section">

        <div className="how-step-visual">

          <img
            src={images.howWine}
            alt="Red wine being poured beside a restaurant dish"
          />

        </div>


        <div className="how-step-content">

          <span className="how-step-number">
            03
          </span>

          <p className="how-eyebrow">
            DISCOVER
          </p>

          <h2>
            Discover your pairing.
          </h2>

          <p>
            SommelierIQ compares characteristics such as body,
            tannin, acidity and sweetness to identify wines that
            complement the selected food.
          </p>

          <p>
            Recommendations come from the restaurant's own wine
            collection, helping diners discover a bottle that is
            relevant to where they are actually dining.
          </p>

          <Link
            to="/restaurants"
            className="how-text-link"
          >
            Find Your Pairing →
          </Link>

        </div>

      </section>



      {/* RESTAURANT SECTION */}
      <section className="how-restaurant-section">

        <div className="how-restaurant-heading">

          <p className="how-eyebrow">
            BEHIND THE PAIRING
          </p>

          <h2>
            Built for
            <br />
            restaurants too.
          </h2>

        </div>


        <div className="how-restaurant-content">

          <p className="how-restaurant-intro">
            The customer experience is supported by a restaurant
            management platform that keeps wine and menu information
            organised in one place.
          </p>


          <div className="how-restaurant-feature">

            <span>01</span>

            <div>
              <h3>Manage the wine collection</h3>

              <p>
                Restaurant teams can add wines, update pricing and
                control availability as their wine collection changes.
              </p>
            </div>

          </div>


          <div className="how-restaurant-feature">

            <span>02</span>

            <div>
              <h3>Manage the food menu</h3>

              <p>
                Food items can be maintained alongside the wine
                collection so pairing information reflects the
                restaurant's own menu.
              </p>
            </div>

          </div>


          <div className="how-restaurant-feature">

            <span>03</span>

            <div>
              <h3>AI-assisted profiling</h3>

              <p>
                AI assistance can generate wine characteristics and
                descriptions to reduce manual data entry. Restaurant
                administrators can review the generated information
                before it is saved.
              </p>
            </div>

          </div>


          <div className="how-restaurant-feature">

            <span>04</span>

            <div>
              <h3>Connect diners through QR access</h3>

              <p>
                Restaurants can provide customers with direct access
                to their SommelierIQ experience, making the pairing
                platform available while dining.
              </p>
            </div>

          </div>


          <div className="how-restaurant-buttons">

            <Link
              to="/pricing"
              className="how-primary-button"
              onClick={() => window.scrollTo(0, 0)}
            >
              View Pricing
            </Link>

            <Link
              to="/login"
              className="how-outline-button"
            >
              Restaurant Login
            </Link>

          </div>

        </div>

      </section>
    </main>
  );
}

export default HowItWorks;