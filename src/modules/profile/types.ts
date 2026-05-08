export interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  mobile?: string | null;
  imageUrl?: string | null;
  bio?: string | null;
  designation?: string | null;
  github?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  portfolio?: string | null;
  createdAt: string;
}

export interface ProfileUpdateInput {
  name?: string;
  email?: string;
  mobile?: string;
  imageUrl?: string;
  bio?: string;
  designation?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  portfolio?: string;
}
