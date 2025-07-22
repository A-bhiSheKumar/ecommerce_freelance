export const numberToWords = (amount: number): string => {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const scales = ["", "Thousand", "Lakh", "Crore"];

  const getBelowThousand = (n: number) => {
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    const tens = Math.floor(remainder / 10);
    const ones = remainder % 10;
    let words = "";
    if (hundreds) words += a[hundreds] + " Hundred ";
    if (remainder > 0) {
      words += tens >= 2 ? b[tens] + " " + a[ones] : a[remainder];
    }
    return words.trim();
  };

  const convertIntegerPart = (num: number) => {
    if (num === 0) return "Zero";
    let words = "";
    let scaleIndex = 0;

    while (num > 0) {
      const remainder = num % 1000;
      if (remainder > 0) {
        words =
          getBelowThousand(remainder) +
          (scales[scaleIndex] ? " " + scales[scaleIndex] + " " : " ") +
          words;
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }
    return words.trim();
  };

  const [integerPart, decimalPart] = amount.toFixed(2).split("."); // Split into rupees and paise
  const rupees = convertIntegerPart(parseInt(integerPart));
  const paise = convertIntegerPart(parseInt(decimalPart));

  if (parseInt(decimalPart) === 0) {
    return `${rupees} Rupees Only`;
  }

  return `${rupees} Rupees and ${paise} Paise Only`;
};
