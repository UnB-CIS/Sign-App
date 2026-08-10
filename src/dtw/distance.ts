import { Landmark } from './types';

export function euclideanDistance(a: Landmark[], b: Landmark[]): number {
  const len = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < len; i++) {
    const dx = a[i].x - b[i].x;
    const dy = a[i].y - b[i].y;
    const dz = a[i].z - b[i].z;
    sum += dx * dx + dy * dy + dz * dz;
  }
  return Math.sqrt(sum);
}

export function manhattanDistance(a: Landmark[], b: Landmark[]): number {
  const len = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += Math.abs(a[i].x - b[i].x);
    sum += Math.abs(a[i].y - b[i].y);
    sum += Math.abs(a[i].z - b[i].z);
  }
  return sum;
}

export function weightedDistance(a: Landmark[], b: Landmark[], weights: number[]): number {
  const len = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < len; i++) {
    const w = weights[i] ?? 1;
    const dx = a[i].x - b[i].x;
    const dy = a[i].y - b[i].y;
    const dz = a[i].z - b[i].z;
    sum += w * (dx * dx + dy * dy + dz * dz);
  }
  return Math.sqrt(sum);
}
