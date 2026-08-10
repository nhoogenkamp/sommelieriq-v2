function AdminSauceTable({ sauces, updateSelectedSauce, }) {
  return (
    <table className="wine-table sauce-table">
      <thead>
        <tr>
          {/* Only show Sauce ID when updateSelectedSauce is on the page https://react.dev/learn/conditional-rendering */}
          {updateSelectedSauce && (
            <th className="sauce-id">Sauce ID</th>
          )}

          <th className="sauce-name">Name</th>
          <th className="sauce-body">Body Modifier</th>
          <th className="sauce-tannin">Tannin Modifier</th>
          <th className="sauce-acidity">Acidity Modifier</th>
          <th className="sauce-sweetness">Sweetness Modifier</th>
          <th className="sauce-available">Available</th>

          {/* Only show this column when updateSelectedSauce is on the page https://react.dev/learn/conditional-rendering */}
          {updateSelectedSauce && (
            <>
              <th className="sauce-update">Update</th>
            </>
          )}
        </tr>
      </thead>

      <tbody>
        {/* Mapping each sauce object to a table row.
        https://react.dev/learn/rendering-lists */}
        {sauces.map((sauce, index) => (
          <tr key={sauce.sauce_id || index}>

            {/* Only show Sauce ID when updateSelectedSauce is on the page */}
            {updateSelectedSauce && (
              <td className="sauce-id">{sauce.sauce_id}</td>
            )}

            <td className="sauce-name">
              {updateSelectedSauce ? (
                <input
                  type="text"
                  id={`sauce-name-${sauce.sauce_id}`}
                  defaultValue={sauce.name}
                />
              ) : (
                sauce.name
              )}
            </td>

            <td className="sauce-body">
              {updateSelectedSauce ? (
                <input
                  type="number"
                  min="-3"
                  max="3"
                  id={`sauce-body-${sauce.sauce_id}`}
                  defaultValue={sauce.body_modifier}
                />
              ) : (
                sauce.body_modifier
              )}
            </td>

            <td className="sauce-tannin">
              {updateSelectedSauce ? (
                <input
                  type="number"
                  min="-3"
                  max="3"
                  id={`sauce-tannin-${sauce.sauce_id}`}
                  defaultValue={sauce.tannin_modifier}
                />
              ) : (
                sauce.tannin_modifier
              )}
            </td>

            <td className="sauce-acidity">
              {updateSelectedSauce ? (
                <input
                  type="number"
                  min="-3"
                  max="3"
                  id={`sauce-acidity-${sauce.sauce_id}`}
                  defaultValue={sauce.acidity_modifier}
                />
              ) : (
                sauce.acidity_modifier
              )}
            </td>

            <td className="sauce-sweetness">
              {updateSelectedSauce ? (
                <input
                  type="number"
                  min="-3"
                  max="3"
                  id={`sauce-sweetness-${sauce.sauce_id}`}
                  defaultValue={sauce.sweetness_modifier}
                />
              ) : (
                sauce.sweetness_modifier
              )}
            </td>

            <td className="sauce-available">
              {updateSelectedSauce ? (
                <select
                  id={`sauce-available-${sauce.sauce_id}`}
                  defaultValue={sauce.available}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              ) : (
                Number(sauce.available) === 1 ? "Yes" : "No"
              )}
            </td>

            {updateSelectedSauce && (
              <>
                <td>
                  <button
                    className="sauce-update-button"
                    type="button"
                    onClick={() =>
                      updateSelectedSauce({
                        sauce_id: sauce.sauce_id,
                        name: document.getElementById(`sauce-name-${sauce.sauce_id}`).value,
                        body_modifier: document.getElementById(`sauce-body-${sauce.sauce_id}`).value,
                        tannin_modifier: document.getElementById(`sauce-tannin-${sauce.sauce_id}`).value,
                        acidity_modifier: document.getElementById(`sauce-acidity-${sauce.sauce_id}`).value,
                        sweetness_modifier: document.getElementById(`sauce-sweetness-${sauce.sauce_id}`).value,
                        available: document.getElementById(`sauce-available-${sauce.sauce_id}`).value,
                      })
                    }
                  >
                    Update
                  </button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AdminSauceTable;