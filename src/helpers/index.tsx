export const currencyConverter = (amount: number) => {
  const _amount = amount < 0 ? 0 : amount;

  return `${String(_amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};


export const getTicketDurationLabel = (item: TicketDuration) => {
  switch (item) {
    case "pre-conference":
      return "Pre-conference";
    case "one-day":
      return "One day conference";
    case "three-days":
      return "3 days conference";
    default:
      return "4 full days events";
  }
};
