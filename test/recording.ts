import {
  setupRecording,
  SetupRecordingInput,
  mutations
} from '@jupiterone/integration-sdk-testing';

export { Recording } from '@jupiterone/integration-sdk-testing';

export async function withRecording(
  recordingName: string,
  directoryName: string,
  cb: () => Promise<void>,
  options?: SetupRecordingInput['options'],
) {
  const recording = setupRecording({
    directory: directoryName,
    name: recordingName,
    redactedRequestHeaders: ['x-api-key'],
    mutateEntry(entry) {
      mutations.unzipGzippedRecordingEntry(entry)
    },
    options: {
      recordFailedRequests: false,
      ...(options || {}),
    },
  });

  try {
    await cb();
  } finally {
    await recording.stop();
  }
}
