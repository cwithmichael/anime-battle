export interface Battle {
  itemOneId: string;
  itemTwoId: string;
  selectedId: string;
}

export interface BattleItem {
  itemId: number;
  firstName: string;
  lastName: string;
  origin: string;
  image: string;
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
