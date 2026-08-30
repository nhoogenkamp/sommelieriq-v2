//https://freddydiengott.com/blogs/csv-react

function AICsvTemplateDownload() {

  const fileName = "ai_wine_template.csv";

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
    ],
    [
      "Example Footbolt Shiraz",
      "red",
      "Shiraz",
      "Australia",
      "McLaren Vale",
      2021,
      "Bottle",
      39.95,
      1,
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

export default AICsvTemplateDownload;

