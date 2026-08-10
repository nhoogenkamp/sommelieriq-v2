function CsvSauceTemplateDownload() {
  const fileName = "sauce_template.csv";

  const data = [
    [
      "name",
      "body_modifier",
      "tannin_modifier",
      "acidity_modifier",
      "sweetness_modifier",
      "available",
    ],
    [
      "Peppercorn Sauce",
      2,
      1,
      0,
      0,
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
    <a href={url} download={fileName}>
      Download Sauce Template
    </a>
  );
}

export default CsvSauceTemplateDownload;