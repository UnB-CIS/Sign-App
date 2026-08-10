export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface TimeSeriesFrame {
  timestamp: number;
  landmarks: Landmark[];
}

export interface DTWResult {
  distance: number;
  normalizedDistance: number;
  path: [number, number][];
  similarity: number;
}

export interface DTWConfig {
  windowSize?: number;
  distanceMetric?: 'euclidean' | 'manhattan' | 'weighted';
  weights?: number[];
  threshold?: number;
}
