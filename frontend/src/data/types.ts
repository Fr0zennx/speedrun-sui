export interface TechnicalSkill {
  label: string;
  description: string;
}

export interface ChapterButtons {
  next?: string;
  prev?: string;
  check?: string;
  showAnswer?: string;
}

export interface ChapterData {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  expectedCode: string;
  validate: (code: string) => { 
    isValid: boolean; 
    errors: Array<{ line: number, message: string }> 
  };
  technicalSkills?: TechnicalSkill[];
  buttons?: ChapterButtons;
}
