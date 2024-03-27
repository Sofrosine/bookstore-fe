export const currencyConverter = (amount: number) => {
  const _amount = amount < 0 ? 0 : amount;

  return `${String(_amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};


