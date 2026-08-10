import { TimeSeriesFrame, DTWResult, DTWConfig } from './types';
import { euclideanDistance, manhattanDistance, weightedDistance } from './distance';

export function computeDTW(
  series1: TimeSeriesFrame[],
  series2: TimeSeriesFrame[],
  config: DTWConfig = {},
): DTWResult {
  const n = series1.length;
  const m = series2.length;

  if (n === 0 || m === 0) {
    return { distance: Infinity, normalizedDistance: Infinity, path: [], similarity: 0 };
  }

  const { windowSize, distanceMetric = 'euclidean', weights } = config;

  const getDistance = (a: TimeSeriesFrame, b: TimeSeriesFrame): number => {
    switch (distanceMetric) {
      case 'manhattan':
        return manhattanDistance(a.landmarks, b.landmarks);
      case 'weighted':
        return weightedDistance(a.landmarks, b.landmarks, weights ?? []);
      default:
        return euclideanDistance(a.landmarks, b.landmarks);
    }
  };

  const matrix: number[][] = Array.from({ length: n }, () => Array(m).fill(Infinity));
  matrix[0][0] = getDistance(series1[0], series2[0]);

  for (let i = 1; i < n; i++) {
    matrix[i][0] = matrix[i - 1][0] + getDistance(series1[i], series2[0]);
  }
  for (let j = 1; j < m; j++) {
    matrix[0][j] = matrix[0][j - 1] + getDistance(series1[0], series2[j]);
  }

  for (let i = 1; i < n; i++) {
    const jStart = windowSize ? Math.max(1, i - windowSize) : 1;
    const jEnd = windowSize ? Math.min(m - 1, i + windowSize) : m - 1;

    for (let j = jStart; j <= jEnd; j++) {
      const cost = getDistance(series1[i], series2[j]);
      matrix[i][j] = cost + Math.min(
        matrix[i - 1][j],
        matrix[i][j - 1],
        matrix[i - 1][j - 1],
      );
    }
  }

  const path: [number, number][] = [];
  let i = n - 1;
  let j = m - 1;
  path.push([i, j]);

  while (i > 0 || j > 0) {
    if (i === 0) {
      j--;
    } else if (j === 0) {
      i--;
    } else {
      const candidates = [matrix[i - 1][j - 1], matrix[i - 1][j], matrix[i][j - 1]];
      const minIndex = candidates.indexOf(Math.min(...candidates));
      if (minIndex === 0) { i--; j--; }
      else if (minIndex === 1) { i--; }
      else { j--; }
    }
    path.push([i, j]);
  }

  path.reverse();

  const distance = matrix[n - 1][m - 1];
  const normalizedDistance = distance / path.length;
  const similarity = 1 / (1 + normalizedDistance);

  return { distance, normalizedDistance, path, similarity };
}
