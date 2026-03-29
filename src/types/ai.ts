import type { GempaData } from "./bmkg";

export interface UserProfile {
  location: string;
  house_type: string;
  has_elderly: boolean;
  has_infant: boolean;
}

export interface AIRequestBody {
  gempa: GempaData;
  profile: UserProfile;
}

export interface AIResponse {
  instructions: string[];
  error?: string;
  details?: string;
}
