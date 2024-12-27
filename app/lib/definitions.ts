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
