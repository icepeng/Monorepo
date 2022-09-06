export type FieldTemplateId =
  | "email"
  | "text"
  | "longtext"
  | "help"
  | "others"
  | "others_textarea"
  | "happiness"
  | "single"
  | "multiple"
  | "opinion"
  | "proficiency"
  | "country"
  | "bracket"
  | "feature"
  | "pattern"
  | "tool"
  /** An autocomplete for the Project collection */
  | "project"
  /** An autocomplete for the People collection */
  | "people"
  | "email2"
  | "receive_notifications"
  | "race_ethnicity";

// TODO: what is a section template? The default for all questions?
export type SectionTemplateId = FieldTemplateId | string;
export interface Field {
  id: string;
  fieldName?: string;
  matchTags?: Array<string>;
  template?: FieldTemplateId;
}

/**
 * Generated by parsing the question template
 */
export interface ParsedQuestion extends Pick<Field, "template"> {
  // those are inherited from Vulcan schemas
  // we may want to differentiate the QuestionTemplate from the parsed question generated
  // by "getQuestionObject" in the future
  /** Simple Schema type: String | Number etc. */
  type?: any;
  optional?: any;
  arrayItem?: ParsedQuestion;
  id?: string;
  title?: string;
  allowmultiple?: boolean;
  allowother?: boolean;
  alias?: string;
  year?: any;
  autocompleteQuery?: () => any;
  dynamicQuery?: () => any;
  /**
   * Inherited from Vulcan
   * autocomplete  | multiautocomplete | React component
   */
  input?: any;
  intlId?: string;
  options?:
    | ((
        props: any
      ) => Array<{ value?: string | number; intlId?: string; label?: string }>)
    | Array<{ value?: string | number; intlId?: string; label?: string }>;
  query?: () => any;
  queryWaitsForValue?: boolean;
  sectionSlug?: string;
  showOther?: boolean;
  slug?: string;
  suffix?: string;
}

// A question can nest fields
export type SurveyQuestion = Field | Array<Field>;
export interface SurveySection {
  intlId?: string;
  id?: string;
  slug?: string | "features";
  questions: Array<SurveyQuestion>;
  template?: SectionTemplateId;
}

export interface EOConfig {
  listId: string;
}

export interface SurveyType {
  createdAt?: Date;
  updatedAt?: Date;
  /**
   * MUST NOT INCLUDE "-" use underscore instead "_"
   * Because dashes are not allowed as i18n token
   */
  slug?: string;
  /**
   * Slug with "dashes", used as the survey relative URL
   */
  prettySlug?: string;
  name?: string;
  year?: number;
  status?: SurveyStatus;
  outline: Array<SurveySection>;
  context?: any;
  imageUrl?: string;
  credits?: any;
  domain?: string;
  tags?: string[];
  emailOctopus: EOConfig;
  // style
  bgColor: string;
  textColor: string;
  linkColor: string;
  hoverColor: string;
  //
  shareUrl: string;
  hashtag: string;
  resultsUrl: string;
}

/**
 * Needed when getting a survey from SSR
 */
export type SerializedSurveyDocument = Omit<
  SurveyType,
  "createdAt" | "updatedAt"
> & {
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Survey as stored in the database
 */
export interface SurveyDocument extends SurveyType {
  createdAt?: any;
  updatedAt?: any;
}

export type SurveyStatus = 1 | 2 | 3 | 4;
export type SurveyStatusLabel = "preview" | "open" | "closed" | "hidden";
