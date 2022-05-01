export enum Pronoun {
  i = "I",
  you = "you",
  we = "we",
  they = "they",
  he = "he",
  she = "she",
  it = "it",
}
export enum Tense {
  presentSimple = "present simple",
  presetContinuous = "present continuous",
  futureSimple = "future simple",
  pastSimple = "past simple",
}
export enum Sign {
  positive = "positive",
  negative = "negative",
  question = "question",
}

export enum Verb {
  work = "work",
  study = "study",
  go = "go",
}

export interface TaskI {
  tense: Tense;
  pronoun: Pronoun;
  sign: Sign;
  verb: Verb;
  toString(): string;
}

export interface TaskBuilderSettings {
  usedVerbs: Verb[];
}

export interface TaskBuilderI {
  createRandomTask(settings: TaskBuilderSettings): TaskI;
}

export interface LanguageI {
  getSolution(task: TaskI): string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export const languages = ["system", "russian", "english"] as const;
export type Language = typeof languages[number];
export type Settings = {
  taskLanguage: Language;
  solutionLanguage: Language;
  usedVerbs: Verb[];
};

export enum CurrentStep {
  task = "task",
  solution = "solution",
}
