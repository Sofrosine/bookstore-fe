interface Abstract {
  created_at: string;
  updated_at: string;
  id: string;
  name: string;
  url: string;
  owner_id: string;
  status: AbstractStatus;
  type: AbstractType;
}

type AbstractStatus = "on_review" | "approved" | "rejected";
type AbstractType = "oral" | "poster";
