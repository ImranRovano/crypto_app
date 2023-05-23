export const percentageFormat = (number, decimalPlaces) => {
  return Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: 0,
    signDisplay: "never",
  }).format(number);
};

export const abbreviateDollar = (number, decimalPlaces) => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: 0,
    style: "currency",
    currency: "USD",
  }).format(number);
};

export const longDollarFormat = (number) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};
