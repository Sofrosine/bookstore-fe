type User = {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id: string;
  name: string;
  email: string;
  password: string;
  role_id: string;
  role: {
    created_at: string;
    updated_at: string;
    id: string;
    name: string;
  };
  status: UserStatus;
};

type UserStatus = "pending" | "verified" | "deleted";
