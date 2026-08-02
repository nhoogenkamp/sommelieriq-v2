// Displays extra information about one selected wine.
// https://react.dev/learn/passing-props-to-a-component

function WinePopup({ wine, closePopup }) {

  return (
    // Clicking anywhere outside the popup closes it.
    <div
      className="wine-popup-overlay"
      onClick={closePopup}
    >

      {/* This is the popup itself. */}
      <section
        className="wine-popup"

        // Prevents the popup from closing when clicking inside it.
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
        onClick={(event) => event.stopPropagation()}
      >

        <h2>{wine.name}</h2>

        <hr />
        <p>
          <strong>Type:</strong> {wine.wine_type}
        </p>
        <p>
          <strong>Grape:</strong> {wine.grape}
        </p>
        <p>
          <strong>Country:</strong> {wine.country}
        </p>
        <p>
          <strong>Region:</strong> {wine.region}
        </p>
        <p>
          <strong>Year:</strong> {wine.year}
        </p>
        <p>
          <strong>Bottle:</strong> {wine.bottle_type}
        </p>
        <p>
          <strong>Price:</strong>
          {" "}
          €{Number(wine.price).toFixed(2)}
        </p>
        <hr />

        <h3>Description</h3>
        <p>{wine.description}</p>

        <button
          type="button"
          onClick={closePopup}
        >
          Close
        </button>
      </section>
    </div>
  );
}

export default WinePopup;