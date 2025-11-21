export interface UserData {
  id: number;
  user_id: number;
  platform: string;
  name: string;
  phone: string | null;
  age: number | null;
  citizenship_id: number | null;
  onboarding: boolean;
  city_id: number | null;
  is_admin: boolean;
}
