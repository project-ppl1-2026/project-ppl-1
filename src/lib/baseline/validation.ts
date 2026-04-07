import { z } from "zod";

export const baselineAnswersSchema = z.object({
  answers: z.tuple([
    z.enum(["Agree", "Disagree"], {
      error: "Jawaban pertanyaan 1 harus Agree atau Disagree.",
    }),
    z.enum(["Agree", "Disagree"], {
      error: "Jawaban pertanyaan 2 harus Agree atau Disagree.",
    }),
    z.enum(["Agree", "Disagree"], {
      error: "Jawaban pertanyaan 3 harus Agree atau Disagree.",
    }),
    z.enum(["Agree", "Disagree"], {
      error: "Jawaban pertanyaan 4 harus Agree atau Disagree.",
    }),
    z.enum(["Yes", "No"], {
      error: "Jawaban pertanyaan 5 harus Yes atau No.",
    }),
    z.enum(["Yes", "No"], {
      error: "Jawaban pertanyaan 6 harus Yes atau No.",
    }),
    z.enum(["Yes", "No"], {
      error: "Jawaban pertanyaan 7 harus Yes atau No.",
    }),
    z.enum(["Yes", "No"], {
      error: "Jawaban pertanyaan 8 harus Yes atau No.",
    }),
  ]),
});

export type BaselineAnswersInput = z.infer<typeof baselineAnswersSchema>;
export type BaselineAnswersTuple = BaselineAnswersInput["answers"];
