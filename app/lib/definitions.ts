import { z } from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export type User = {
  id: string;
  name: string;
  username: string;
  password: string;
};

export interface Battle {
  itemOneId: string;
  itemTwoId: string;
  selectedId: string;
}

export interface BattleItem {
  itemId: number;
  firstName?: string;
  lastName?: string;
  origin?: string;
  image?: string;
}

export interface Media {
  title: {
    english: string;
  };
}
export interface AnimeItem {
  Character: {
    id: number;
    name: {
      first: string;
      last: string;
    };
    image: {
      medium: string;
    };
    media: {
      nodes: Media[];
    };
  };
}

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
