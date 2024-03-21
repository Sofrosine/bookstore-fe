type Registration = {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id: string;
  registration_number: string;
  ticket_id: string;
  ticket: Ticket;
  user_id: string;
  user: User;
  status: RegistrationStatus;
};

type RegistrationStatus = "unregistered" | "on-progress" | "success";
