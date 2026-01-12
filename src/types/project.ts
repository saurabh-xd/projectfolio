export type Project = {
  _id: string;
  name: string;
  tags: string[];
  description: string;
  image?: string;
  repoLink?: string;
  liveLink?: string;
  isLiked: boolean;
  isBookmarked: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;

   userId?: {
    username?: string;
    userimage?: string;
    _id?: string;
  };
};