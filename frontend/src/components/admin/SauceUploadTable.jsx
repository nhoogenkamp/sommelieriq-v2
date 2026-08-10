function SauceUploadTable({ sauces }) {
  return (
    <table className="sauce-table upload-sauce-table">
      <thead>
        <tr>
          <th className="sauce-name">Name</th>
          <th className="sauce-body">Body Modifier</th>
          <th className="sauce-tannin">Tannin Modifier</th>
          <th className="sauce-acidity">Acidity Modifier</th>
          <th className="sauce-sweetness">Sweetness Modifier</th>
          <th className="sauce-available">Available</th>
        </tr>
      </thead>

      <tbody>
        {/* Creates one preview row for every sauce in the CSV.
        https://react.dev/learn/rendering-lists */}
        {sauces.map((sauce, index) => (
          <tr key={index}>
            <td className="sauce-name">{sauce.name}</td>
            <td className="sauce-body">{sauce.body_modifier}</td>
            <td className="sauce-tannin">{sauce.tannin_modifier}</td>
            <td className="sauce-acidity">{sauce.acidity_modifier}</td>
            <td className="sauce-sweetness">{sauce.sweetness_modifier}</td>
            <td className="sauce-available">{Number(sauce.available) === 1 ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SauceUploadTable;