import { Landmark, TimeSeriesFrame } from './types';

/**
 * TODO: Normalização espacial dos landmarks.
 * - Centralização pelo pulso/centro da mão
 * - Normalização por escala
 * - Coordenadas relativas
 */
export function normalizeSpatial(frames: TimeSeriesFrame[]): TimeSeriesFrame[] {
  return frames;
}

export function centerByWrist(landmarks: Landmark[], wristIndex: number = 0): Landmark[] {
  const wrist = landmarks[wristIndex];
  if (!wrist) return landmarks;

  return landmarks.map((lm) => ({
    x: lm.x - wrist.x,
    y: lm.y - wrist.y,
    z: lm.z - wrist.z,
    visibility: lm.visibility,
  }));
}

export function scaleNormalize(landmarks: Landmark[]): Landmark[] {
  let maxDist = 0;
  for (const lm of landmarks) {
    const dist = Math.sqrt(lm.x * lm.x + lm.y * lm.y + lm.z * lm.z);
    if (dist > maxDist) maxDist = dist;
  }

  if (maxDist === 0) return landmarks;

  return landmarks.map((lm) => ({
    x: lm.x / maxDist,
    y: lm.y / maxDist,
    z: lm.z / maxDist,
    visibility: lm.visibility,
  }));
}
