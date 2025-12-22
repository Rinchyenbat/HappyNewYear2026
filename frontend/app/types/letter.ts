export interface Letter {
  id: string;
  from: {
    id?: string;
    username: string;
    avatarId?: string;
  } | null;
  to?: {
    id: string;
    username: string;
  };
  title: string | null;
  body: string;
  isAnonymous: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface LettersResponse {
  letters: Letter[];
}

export interface LetterResponse {
  letter: Letter;
}

export interface SendLetterRequest {
  toUsername: string;
  title?: string;
  body: string;
  isAnonymous?: boolean;
}
