import { Link } from "react-router-dom";
import images from "../assets/images/images.js";

function Pricing() {

  const plans = [
    {
      name: "Essential",
      price: "€14.99",
      period: "/ month",
      description:
        "For smaller restaurants looking to offer a smarter wine experience.",
      features: [
        "Initial wine list uploaded by us",
        "Wine collection management",
        "Food menu management",
        "Customer wine pairing",
        "Wine availability updates",
        "Restaurant QR access"
      ]
    },
    {
      name: "Professional",
      price: "€29",
      period: "/ month",
      description:
        "For restaurants that want more automation and easier wine-list management.",
      featured: true,
      features: [
        "Everything in Essential",
        "AI-assisted wine profiling",
        "AI-assisted dish profiling",
        "CSV wine uploads",
        "CSV food uploads",
        "Role-based staff access"
      ]
    },
    {
      name: "Multi-Location",
      price: "Custom",
      period: "",
      description:
        "For restaurant groups managing several locations, teams and wine collections.",
      features: [
        "Everything in Professional",
        "Multiple restaurant locations",
        "Centralised owner access",
        "Separate restaurant collections",
        "Multi-location user management",
        "Custom onboarding support"
      ]
    }
  ];


  return (
    <main className="pricing-page">


      {/* HERO */}
      <section className="pricing-hero">

        <div className="pricing-hero-text">

          <p className="pricing-eyebrow">
            PRICING
          </p>

          <h1>
            Built for restaurants
            <br />
            that care about wine.
          </h1>

          <p className="pricing-description">
            Give your team a simpler way to manage wine and menu
            information while helping customers discover wines
            suited to what they are eating.
          </p>

          <Link
            to="/login"
            className="pricing-primary-button"
          >
            Restaurant Login
          </Link>

        </div>


        <div className="pricing-hero-visual">

          <img
            src={images.pricingHero}
            alt="Restaurant wine service in a contemporary dining room"
          />

        </div>

      </section>



      {/* INTRO */}
      <section className="pricing-introduction">

        <p className="pricing-eyebrow">
          SIMPLE RESTAURANT PRICING
        </p>

        <h2>
          Choose the level that fits
          <br />
          your restaurant.
        </h2>

        <p>
          SommelierIQ combines restaurant wine management with a
          customer-facing pairing experience. Plans can scale from
          a single venue to restaurant groups with multiple locations.
        </p>

      </section>



      {/* PRICING PLANS */}
      <section className="pricing-plans-section">

        <div className="pricing-plans-grid">

          {plans.map((plan, index) => (

            <article
              key={index}
              className={`pricing-plan ${
                plan.featured ? "pricing-plan-featured" : ""
              }`}
            >

              {plan.featured && (

                <p className="pricing-plan-badge">
                  MOST POPULAR
                </p>

              )}

              <p className="pricing-plan-name">
                {plan.name}
              </p>

              <div className="pricing-plan-price">

                <span className="pricing-price">
                  {plan.price}
                </span>

                <span className="pricing-period">
                  {plan.period}
                </span>

              </div>

              <p className="pricing-plan-description">
                {plan.description}
              </p>


              <div className="pricing-plan-features">

                {plan.features.map((feature, featureIndex) => (

                  <div
                    key={featureIndex}
                    className="pricing-plan-feature"
                  >

                    <span className="pricing-feature-mark">
                      —
                    </span>

                    <p>
                      {feature}
                    </p>

                  </div>

                ))}

              </div>


              <Link
                to={
                  plan.name === "Multi-Location"
                    ? "/contact"
                    : `/signup?plan=${plan.name.toLowerCase()}`
                }
                className={
                  plan.featured
                    ? "pricing-primary-button"
                    : "pricing-outline-button"
                }
              >
                {plan.name === "Multi-Location"
                  ? "Contact Us"
                  : "Get Started"}
              </Link>

            </article>

          ))}

        </div>

      </section>



      {/* INCLUDED SECTION */}
      <section className="pricing-included-section">

        <div className="pricing-included-visual">

          <img
            src={images.pricingManagement}
            alt="Restaurant professional reviewing wine information"
          />

        </div>


        <div className="pricing-included-content">

          <p className="pricing-eyebrow">
            MORE THAN A WINE LIST
          </p>

          <h2>
            One platform for your
            wine and menu information.
          </h2>

          <p>
            SommelierIQ gives restaurant teams a central place to
            maintain wines, food items, pricing and availability.
          </p>

          <p>
            That same information powers the customer pairing
            experience, helping restaurants keep both management
            and discovery connected.
          </p>

          <Link
            to="/how-it-works"
            className="pricing-text-link"
          >
            See How It Works →
          </Link>

        </div>

      </section>



      {/* FEATURE OVERVIEW */}
      <section className="pricing-features-section">

        <div className="pricing-features-heading">

          <p className="pricing-eyebrow">
            INCLUDED WITH SOMMELIERIQ
          </p>

          <h2>
            Everything needed to
            keep the experience connected.
          </h2>

        </div>


        <div className="pricing-feature-list">

          <div className="pricing-feature-row">

            <span>01</span>

            <div>
              <h3>Wine collection management</h3>

              <p>
                Add wines, maintain availability, update pricing
                and keep restaurant collections organised.
              </p>
            </div>

          </div>


          <div className="pricing-feature-row">

            <span>02</span>

            <div>
              <h3>Food menu management</h3>

              <p>
                Manage dishes alongside the wine collection so
                pairing recommendations remain relevant.
              </p>
            </div>

          </div>


          <div className="pricing-feature-row">

            <span>03</span>

            <div>
              <h3>AI-assisted data entry</h3>

              <p>
                Reduce repetitive administration by generating
                wine and dish characteristics for review.
              </p>
            </div>

          </div>


          <div className="pricing-feature-row">

            <span>04</span>

            <div>
              <h3>Customer pairing experience</h3>

              <p>
                Let diners select dishes and discover suitable wines
                from the restaurant's own collection.
              </p>
            </div>

          </div>


          <div className="pricing-feature-row">

            <span>05</span>

            <div>
              <h3>Role-based access</h3>

              <p>
                Give owners, managers, sommeliers and staff access
                appropriate to their responsibilities.
              </p>
            </div>

          </div>


          <div className="pricing-feature-row">

            <span>06</span>

            <div>
              <h3>Restaurant QR access</h3>

              <p>
                Connect diners directly to the restaurant's
                SommelierIQ experience while they are at the table.
              </p>
            </div>

          </div>

        </div>

      </section>



      {/* FINAL CTA */}
      <section className="pricing-cta">

        <p className="pricing-eyebrow">
          FOR RESTAURANTS
        </p>

        <h2>
          Make your wine list
          <br />
          easier to discover.
        </h2>

        <p>
          Bring wine management and customer pairing together
          in one restaurant platform.
        </p>

        <div className="pricing-cta-buttons">

          <Link
            to="/login"
            className="pricing-secondary-button"
          >
            Restaurant Login
          </Link>

          <Link
            to="/how-it-works"
            className="pricing-secondary-outline-button"
          >
            How It Works
          </Link>

        </div>

      </section>


    </main>
  );
}

export default Pricing;