export type ExperienceType = {
  id?: number | undefined;
  docId?: number | undefined;
  title: string | undefined;
  companyName: string | undefined;
  city: string | undefined;
  state: string | undefined;
  startDate: string | undefined;
  endDate?: string | undefined;
  currentlyWorking: boolean;
  workSummary: string | undefined;
};

export type EducationType = {
  id?: number;
  docId?: number | undefined;
  universityName: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  degree: string | undefined;
  major: string | undefined;
  description: string | undefined;
};

export type SkillType = {
  id?: number;
  docId?: number | undefined;
  name: string | undefined;
  rating?: number;
};

export type PersonalInfoType = {
  id?: number;
  docId?: number | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  jobTitle?: string | undefined;
  address?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
};

export type StatusType = "archived" | "private" | "public" | undefined;

export type ResumeDataType = {
  id?: number;
  documentId?: string;
  title: string;
  status: StatusType;
  thumbnail?: string | undefined;
  personalInfo?: PersonalInfoType | undefined;
  themeColor?: string | undefined;
  currentPosition?: number | undefined;
  summary: string | undefined;
  experiences?: ExperienceType[] | undefined;
  educations?: EducationType[] | undefined;
  skills?: SkillType[] | undefined;
  updatedAt?: string;
};