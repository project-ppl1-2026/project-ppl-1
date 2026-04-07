import "server-only";

import {
  BASELINE_INPUT_NAME,
  BASELINE_LABEL_MAP,
  type BaselineLevel,
} from "./questions";
import type { BaselineAnswersTuple } from "./validation";

declare const require: (moduleName: string) => unknown;

const { existsSync } = require("fs") as {
  existsSync: (filePath: string) => boolean;
};
const path = require("path") as {
  join: (...paths: string[]) => string;
};

type OrtTensor = {
  data: ArrayLike<number> | ArrayLike<string> | ArrayLike<bigint>;
  dims: readonly number[];
  type: string;
};

type OrtSession = {
  inputNames: readonly string[];
  outputNames: readonly string[];
  run(feeds: Record<string, unknown>): Promise<Record<string, OrtTensor>>;
};

type OrtModule = {
  InferenceSession: {
    create(modelPath: string): Promise<OrtSession>;
  };
  Tensor: new (
    type: string,
    data: readonly string[],
    dims: readonly number[],
  ) => unknown;
};

const BASELINE_MODEL_FILE = "baseline_model.onnx";
const BASELINE_MODEL_DIRECTORY = "src";
const BASELINE_PROBABILITY_OUTPUT = "probabilities";
const BASELINE_LABEL_OUTPUT = "label";

let onnxRuntimePromise: Promise<OrtModule> | null = null;
let baselineSessionPromise: Promise<OrtSession> | null = null;

function resolveBaselineModelPath() {
  const modelPath = path.join(
    process.cwd(),
    BASELINE_MODEL_DIRECTORY,
    "models",
    BASELINE_MODEL_FILE,
  );

  if (existsSync(modelPath)) {
    return modelPath;
  }

  throw new Error(`Model baseline tidak ditemukan di "${modelPath}".`);
}

async function loadOnnxRuntime() {
  onnxRuntimePromise ??= Promise.resolve().then(() => {
    const loadedModule = require("onnxruntime-node") as {
      default?: OrtModule;
    } & OrtModule;
    return (loadedModule.default ?? loadedModule) as OrtModule;
  });

  return onnxRuntimePromise;
}

async function getBaselineSession() {
  baselineSessionPromise ??= (async () => {
    const ort = await loadOnnxRuntime();
    return ort.InferenceSession.create(resolveBaselineModelPath());
  })();

  return baselineSessionPromise;
}

function extractLabelIndex(labelTensor: OrtTensor) {
  const labelValue = labelTensor.data[0] as string | number | bigint;
  const labelIndex =
    typeof labelValue === "bigint" ? Number(labelValue) : Number(labelValue);

  if (!Number.isInteger(labelIndex) || labelIndex < 0) {
    throw new Error("Output label dari model baseline tidak valid.");
  }

  return labelIndex;
}

function extractConfidenceScore(
  probabilityTensor: OrtTensor,
  labelIndex: number,
) {
  const rawProbabilities = probabilityTensor.data as ArrayLike<number>;
  const probabilities = Array.from(rawProbabilities, (value) => Number(value));

  if (probabilities.length === 0) {
    throw new Error("Output probabilitas dari model baseline kosong.");
  }

  const predictedClassScore = probabilities[labelIndex];
  if (predictedClassScore !== undefined) {
    return predictedClassScore;
  }

  return Math.max(...probabilities);
}

export type BaselineInferenceResult = {
  confidenceScore: number;
  inputName: typeof BASELINE_INPUT_NAME;
  isBeginner: boolean;
  label: BaselineLevel;
  labelIndex: number;
  modelPath: string;
};

/**
 * Runs the ONNX baseline model using the exact 8-answer order expected by the model.
 */
export async function runBaselineInference(
  answers: BaselineAnswersTuple,
): Promise<BaselineInferenceResult> {
  const ort = await loadOnnxRuntime();
  const session = await getBaselineSession();
  const rawInputTensor = new ort.Tensor("string", [...answers], [1, 8]);
  const outputs = await session.run({
    [BASELINE_INPUT_NAME]: rawInputTensor,
  });

  const modelOutputs = new Set(session.outputNames);
  if (
    !modelOutputs.has(BASELINE_LABEL_OUTPUT) ||
    !modelOutputs.has(BASELINE_PROBABILITY_OUTPUT)
  ) {
    throw new Error(
      `Output model baseline tidak cocok. Ditemukan: ${session.outputNames.join(", ")}.`,
    );
  }

  const labelTensor = outputs[BASELINE_LABEL_OUTPUT];
  const probabilityTensor = outputs[BASELINE_PROBABILITY_OUTPUT];

  if (!labelTensor || !probabilityTensor) {
    throw new Error(
      "Output model baseline tidak lengkap. Pastikan output label dan probabilitas tersedia.",
    );
  }

  const labelIndex = extractLabelIndex(labelTensor);
  const label = BASELINE_LABEL_MAP[labelIndex];

  if (!label) {
    throw new Error(`Indeks label baseline ${labelIndex} tidak dikenali.`);
  }

  const confidenceScore = extractConfidenceScore(probabilityTensor, labelIndex);

  return {
    confidenceScore,
    inputName: BASELINE_INPUT_NAME,
    isBeginner: label === "Beginner",
    label,
    labelIndex,
    modelPath: resolveBaselineModelPath(),
  };
}
