export interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl?: string | null;
  bio?: string | null;
  github?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  portfolio?: string | null;
  createdAt: string;
}

export interface ProfileUpdateInput {
  name?: string;
  imageUrl?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}
