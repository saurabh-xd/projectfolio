export type Project = {
  _id: string;
  name: string;
  description: string;
  image?: string;
  repoLink?: string;
  liveLink?: string;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  userId: string;
};