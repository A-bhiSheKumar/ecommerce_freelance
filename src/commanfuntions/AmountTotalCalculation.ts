export const AmountCalculation = (amounts: number[]) => {
  const amount = amounts.map((amount) => {
    return +amount;
  });
  return amount;
};
