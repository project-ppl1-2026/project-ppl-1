/**
 * Exact baseline questionnaire order used by the ONNX model input tensor.
 * The API must preserve this order when building the `[1, 8]` string tensor.
 */
export const BASELINE_QUESTIONS = [
  {
    question:
      "Children are safe among family members such as grandparents, uncles, aunts, cousins",
    options: ["Agree", "Disagree"] as const,
  },
  {
    question: "Children are mainly abused by strangers in our society",
    options: ["Agree", "Disagree"] as const,
  },
  {
    question: "Male children dont need sexual abuse prevention knowledge",
    options: ["Agree", "Disagree"] as const,
  },
  {
    question:
      "Teaching sexual abuse prevention in school is not necessary. It will make children curious about sex",
    options: ["Agree", "Disagree"] as const,
  },
  {
    question: "Do you know what child grooming is?",
    options: ["Yes", "No"] as const,
  },
  {
    question:
      "Do you know what signs to look for to identify if your child has been abused?",
    options: ["Yes", "No"] as const,
  },
  {
    question:
      "Do you think children need post abuse counseling for recovering?",
    options: ["Yes", "No"] as const,
  },
  {
    question:
      "Do you think you should take legal action against the abuser of your child?",
    options: ["Yes", "No"] as const,
  },
] as const;

export const BASELINE_INPUT_NAME = "raw_input";
export const BASELINE_LABEL_MAP = ["Beginner", "Intermediate"] as const;

export type BaselineLevel = (typeof BASELINE_LABEL_MAP)[number];
