export type JobItem = {
  id: number;
  badgeLetters: string;
  title: string;
  company: string;
  daysAgo: number;
  date: string;
  relevanceScore: number;
};

export type TJobItemContent = JobItem & {
  description: string;
  jobType: string;
  salary: string;
  location: string;
  requirements: string;
  applyLink: string;
  duration: string;
  qualifications: string[];
  reviews: string[];
  companyURL: string;
  coverImgURL: string;
};

export type PageDirection = "next" | "previous";

export type SortBy = "relevant" | "recent";
