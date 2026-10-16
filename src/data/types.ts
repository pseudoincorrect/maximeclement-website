export interface Picture { path: string; alt: string }
export interface Project {
  title: string;
  mainPictures: Picture[];
  shortSummary: string;
  summary: string;
  details: string;
  tags: string[];
  location: string;
  date: string;
}
export interface PathItem {
  isSchool: boolean;
  title: string;
  location: string;
  dateRange: string;
  picturePath: string;
  colorBg: string;
  colorFg: string;
  keyPoints: string[];
}
