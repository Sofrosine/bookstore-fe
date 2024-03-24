type User = {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id: string;
  name: string;
  email: string;
  password: string;
  registration: Registration;
  status: UserStatus;
  title: UserTitle;
  food_preference: UserFoodPreference;
  country: string;
  city: string;
  province: string;
  phone_number: string;
  address: string;
  image_url: string;
};

type UserStatus = "pending" | "verified" | "deleted";
type UserTitle = "mr" | "mrs" | "ms" | "professor" | "dr";
type UserFoodPreference = "vegetarian" | "non_vegetarian";
