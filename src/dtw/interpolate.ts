import { TimeSeriesFrame, Landmark } from './types';

/**
 * TODO: Interpolação temporal para uniformizar a quantidade de frames.
 * - Reamostragem para N frames
 * - Interpolação linear entre frames
 */
export function interpolateToLength(frames: TimeSeriesFrame[], targetLength: number): TimeSeriesFrame[] {
  if (frames.length === 0 || targetLength <= 0) return [];
  if (frames.length === targetLength) return frames;

  const result: TimeSeriesFrame[] = [];
  const ratio = (frames.length - 1) / (targetLength - 1);

  for (let i = 0; i < targetLength; i++) {
    const pos = i * ratio;
    const low = Math.floor(pos);
    const high = Math.min(Math.ceil(pos), frames.length - 1);
    const t = pos - low;

    if (low === high) {
      result.push(frames[low]);
      continue;
    }

    const interpolated: Landmark[] = frames[low].landmarks.map((lm, idx) => {
      const other = frames[high].landmarks[idx];
      return {
        x: lm.x + t * (other.x - lm.x),
        y: lm.y + t * (other.y - lm.y),
        z: lm.z + t * (other.z - lm.z),
        visibility: lm.visibility,
      };
    });

    result.push({
      timestamp: frames[low].timestamp + t * (frames[high].timestamp - frames[low].timestamp),
      landmarks: interpolated,
    });
  }

  return result;
}
