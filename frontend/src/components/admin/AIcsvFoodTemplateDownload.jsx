
// Food template same style as Wine
function AIcsvFoodTemplateDownload() {
  const fileName = "AI_food_template.csv";

  const data = [
    [
      "dish_name",
      "category",
      "description",
      "available",
      "requires_sauce",
    ],
    [
      "Grilled Steak",
      "main",
      "Grilled Salmon, served with vegetables",
      1,
      0,
    ],
  ];

  // Wraps strings containing commas in quotes.
  const escapeCommas = (s) =>
    s.includes(",") ? `"${s}"` : s;

  // Separates each value with a comma and each row with a new line.
  const csvData = data
    .map((row) => {
      return row
        .map((value) => {
          return typeof value === "string"
            ? escapeCommas(value)
            : value;
        })
        .join(",");
    })
    .join("\n");

  // Creates the CSV file.
  const blob = new Blob([csvData], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  return (
    <a href={url} download={fileName}>
      Download Food Template
    </a>
  );
}

export default AIcsvFoodTemplateDownload;