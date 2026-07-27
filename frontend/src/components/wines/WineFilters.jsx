function WineFilters({
  selectedColour,
  selectedBottle,
  maxPrice,
  setSelectedColour,
  setSelectedBottle,
  setMaxPrice,
  clearFilters,
}) {
  return (
    <section>
      <h2>Filter Wines</h2>

      <div>
        {/* htmlfor used as for is a keyword already reserved: https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor */}
        <label htmlFor="wineColour">Wine Colour:</label>

        <select
          id="wineColour"
          value={selectedColour}
          // gets the selected value will update on any changes
          // https://react.dev/reference/react-dom/components/select#:~:text=submit%20the%20form.-,Controlling%20a%20select%20box%20with%20a%20state%20variable,-A%20select%20box
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

      <div>
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

      <div>
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
        type="button"
        // runs the clearFilters function from WineList
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </section>
  );
}

export default WineFilters;