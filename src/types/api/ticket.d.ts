type Ticket = {
  id: string;
  price: string;
  currency: TicketCurrency;
  type: TicketType;
  duration: TicketDuration;
  category: TicketCategory;
};

type TicketCurrency = "USD" | "IDR";

type TicketType =
  | "domestic"
  | "international"
  | "student-domestic"
  | "student-international";

type TicketDuration = "pre-conference" | "one-day" | "three-days" | "fullday";

type TicketCategory = "early" | "late";
