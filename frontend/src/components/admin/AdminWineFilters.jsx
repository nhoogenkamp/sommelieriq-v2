function AdminWineFilters({
  wines,
  wineId,
  selectedColour,
  selectedBottle,
  maxPrice,
  selectedGrape,
  selectedCountry,
  selectedRegion,
  selectedAvailability,
  setSelectedAvailability,
  setWineId,
  setSelectedColour,
  setSelectedBottle,
  setMaxPrice,
  setSelectedGrape,
  setSelectedCountry,
  setSelectedRegion,
  clearFilters,
}) {

  const grapes = Array.from(
  new Set(wines.map((wine) => wine.grape))
);

const countries = Array.from(
  new Set(wines.map((wine) => wine.country))
);

const regions = Array.from(
  new Set(wines.map((wine) => wine.region))
);
  return (
    <section className="wine-filters">
      <h2>Filter Wines</h2>

      <div className="wine-filter-controls">
        <div className="wine-filter-group">

          <label htmlFor="wineId">Wine ID:</label>
          <input
            id="wineId"
            type="number"
            min="1"
            value={wineId}
            onChange={(event) => setWineId(event.target.value)}
          />
        </div>  

        <div className="wine-filter-group">
          <label htmlFor="wineAvailability">Availability:</label>

          <select
            id="wineAvailability"
            value={selectedAvailability}
            onChange={(event) => setSelectedAvailability(event.target.value)}
          >
            <option value="">All</option>
            <option value="1">Available</option>
            <option value="0">Unavailable</option>
          </select>
        </div>

          {/* htmlFor is used because for is already a reserved keyword.
              https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor */}
        <div className="wine-filter-group">
          <label htmlFor="wineColour">Wine Colour:</label>

          <select
            id="wineColour"
            value={selectedColour}
            // gets the selected value and updates it when changed
            // https://react.dev/reference/react-dom/components/select
            onChange={(event) =>
              setSelectedColour(event.target.value)
            }
          >
            <option value="">All</option>
            <option value="red">Red</option>
            <option value="white">White</option>
            <option value="rose">Rosé</option>
            <option value="non_alcoholic">Non-Alcoholic</option>
            <option value="sherry">Sherry</option>
            <option value="sparkling">Sparkling</option>
            <option value="champagne">Champagne</option>
            <option value="dessert">Dessert</option>
            <option value="port">Port</option>
          </select>
        </div>

        <div className="wine-filter-group">
          <label htmlFor="bottleType">Bottle Type:</label>

          <select
            id="bottleType"
            value={selectedBottle}
            onChange={(event) =>
              setSelectedBottle(event.target.value)
            }
          >
            <option value="">All</option>
            <option value="Glass">Glass</option>
            <option value="Half Bottle">Half Bottle</option>
            <option value="Bottle">Bottle</option>
            <option value="Magnum">Magnum</option>
            <option value="Jeroboam">Jeroboam</option>
            <option value="Melchior">Melchior</option>
            <option value="Salmanazar">Salmanazar</option>
            <option value="Double Magnum">Double Magnum</option>
            <option value="Imperial">Imperial</option>
          </select>
        </div>

        <div className="wine-filter-group">
          <label htmlFor="grape">Grape:</label>

          <select
            id="grape"
            value={selectedGrape}
            onChange={(event) =>
              setSelectedGrape(event.target.value)
            }
          >
            <option value="">All</option>

            {/* Creates an option for each available grape.
                https://react.dev/learn/rendering-lists */}
            {grapes.map((grape) => (
              <option key={grape} value={grape}>
                {grape}
              </option>
            ))}
          </select>
        </div>

        {/* Creates an option for each available country. */}
        <div className="wine-filter-group">
          <label htmlFor="country">Country:</label>

          <select
            id="country"
            value={selectedCountry}
            onChange={(event) =>
              setSelectedCountry(event.target.value)
            }
          >
            <option value="">All</option>

            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Creates an option for each available region. */}
        <div className="wine-filter-group">
          <label htmlFor="region">Region:</label>

          <select
            id="region"
            value={selectedRegion}
            onChange={(event) =>
              setSelectedRegion(event.target.value)
            }
          >
            <option value="">All</option>

            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="wine-filter-group">
          <label htmlFor="maxPrice">Max Price:</label>

          <select
            id="maxPrice"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(event.target.value)
            }
          >
            <option value="">No Limit</option>
            <option value="25">€25</option>
            <option value="50">€50</option>
            <option value="75">€75</option>
            <option value="100">€100</option>
            <option value="150">€150</option>
            <option value="200">€200</option>
            <option value="250">€250</option>
            <option value="300">€300</option>
            <option value="400">€400</option>
            <option value="500">€500</option>
            <option value="750">€750</option>
            <option value="1000">€1,000</option>
          </select>
        </div>

        <button
          className="clear-filters-button"
          type="button"
          // runs the clearFilters function from WineList
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
    </section>
  );
}

export default AdminWineFilters;