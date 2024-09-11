import {
  pipeline,
  env,
  RawImage,
  Pipeline,
  type PipelineType,
} from "sillytavern-transformers";
import path from "path";
import fs from "fs";

configureTransformers();

function configureTransformers(): void {
  // Limit the number of threads to 1 to avoid issues on Android
  env.backends.onnx.wasm.numThreads = 1;
  // Use WASM from a local folder to avoid CDN connections
  env.backends.onnx.wasm.wasmPaths =
    path.join(`${process.cwd()}/data`, "dist") + path.sep;
}

interface Task {
  defaultModel: string;
  pipeline: Pipeline | null;
  quantized: boolean;
  currentModel?: string;
}

const tasks: Record<string, Task> = {
  "text-classification": {
    defaultModel: "Cohee/distilbert-base-uncased-go-emotions-onnx",
    pipeline: null,
    quantized: true,
  },
  "image-to-text": {
    defaultModel: "Xenova/vit-gpt2-image-captioning",
    pipeline: null,
    quantized: true,
  },
  "feature-extraction": {
    defaultModel: "Xenova/all-mpnet-base-v2",
    pipeline: null,
    quantized: true,
  },
  "text-generation": {
    defaultModel: "Cohee/fooocus_expansion-onnx",
    pipeline: null,
    quantized: false,
  },
  "automatic-speech-recognition": {
    defaultModel: "Xenova/whisper-small",
    pipeline: null,
    quantized: true,
  },
  "text-to-speech": {
    defaultModel: "Xenova/speecht5_tts",
    pipeline: null,
    quantized: false,
  },
  summarization: {
    defaultModel: "Xenova/long-t5-tglobal-base-16384-book-summary",
    pipeline: null,
    quantized: true,
  },
};

/**
 * Gets a RawImage object from a base64-encoded image.
 * @param {string} image Base64-encoded image
 * @returns {Promise<RawImage | null>} Object representing the image
 */
async function getRawImage(image: string): Promise<RawImage | null> {
  try {
    const buffer = Buffer.from(image, "base64");
    const byteArray = new Uint8Array(buffer);
    const blob = new Blob([byteArray]);

    const rawImage = await RawImage.fromBlob(blob);
    return rawImage;
  } catch {
    return null;
  }
}

/**
 * Gets the model to use for a given transformers.js task.
 * @param {string} task The task to get the model for
 * @returns {string} The model to use for the given task
 */
function getModelForTask(task: string): string {
  const defaultModel = tasks[task].defaultModel;

  try {
    //const model = getConfigValue(tasks[task].configField, null);
    const model = null;
    return model || defaultModel;
  } catch (error) {
    console.warn(
      "Failed to read config.yaml, using default classification model."
    );
    return defaultModel;
  }
}

async function checkCacheDir(): Promise<void> {
  const newCacheDir = path.join(`${process.cwd()}/data`, "_models_cache");

  if (!fs.existsSync(newCacheDir)) {
    fs.mkdirSync(newCacheDir, { recursive: true });
  }
}

/**
 * Gets the transformers.js pipeline for a given task.
 * @param {PipelineType} task The task to get the pipeline for
 * @param {string} [forceModel] The model to use for the pipeline, if any
 * @returns {Promise<Pipeline>} Pipeline for the task
 */
async function getPipeline(
  task: PipelineType,
  forceModel = ""
): Promise<Pipeline | any> {
  await checkCacheDir();

  if (tasks[task].pipeline) {
    if (forceModel === "" || tasks[task].currentModel === forceModel) {
      return tasks[task]?.pipeline;
    }
    console.log(
      "Disposing transformers.js pipeline for task",
      task,
      "with model",
      tasks[task].currentModel
    );
    await tasks[task].pipeline?.dispose();
  }

  const cacheDir = path.join(`${process.cwd()}/data`, "_models_cache");
  const model = forceModel || getModelForTask(task);
  //const localOnly = getConfigValue('extras.disableAutoDownload', false);
  const localOnly = false; //true if we want to disable auto download
  console.log(
    "Initializing transformers.js pipeline for task",
    task,
    "with model",
    model
  );
  const instance = await pipeline(task, model, {
    cache_dir: cacheDir,
    quantized: tasks[task].quantized ?? true,
    local_files_only: localOnly,
  });
  tasks[task].pipeline = instance as Pipeline;
  tasks[task].currentModel = model;
  return instance as Pipeline;
}

export default {
  getPipeline,
  getRawImage,
};
