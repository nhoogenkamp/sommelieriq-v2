//https://freddydiengott.com/blogs/csv-react

function CsvTemplateDownload() {

  const fileName = "wine_template.csv";

  const data = [
    [
      "name",
      "wine_type",
      "grape",
      "country",
      "region",
      "year",
      "bottle_type",
      "price",
      "available",
      "description",
      "body_score",
      "tannin_score",
      "acidity_score",
      "sweetness_score",
    ],
    [
      "Example Merlot",
      "red",
      "Merlot",
      "France",
      "Bordeaux",
      2022,
      "Bottle",
      39.95,
      1,
      "Rich, smooth red wine",
      15,
      14,
      10,
      3,
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
    <a
      href={url}
      download={fileName}
    >
      Download Template
    </a>
  );
}

export default CsvTemplateDownload;