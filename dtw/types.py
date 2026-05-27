from dataclasses import dataclass, field
from typing import Optional
import numpy as np


@dataclass
class Landmark:
    x: float
    y: float
    z: float
    visibility: Optional[float] = None

    def to_array(self) -> np.ndarray:
        return np.array([self.x, self.y, self.z])


@dataclass
class TimeSeriesFrame:
    timestamp: float
    landmarks: list[Landmark]

    def to_matrix(self) -> np.ndarray:
        return np.array([[lm.x, lm.y, lm.z] for lm in self.landmarks])


@dataclass
class DTWResult:
    distance: float
    normalized_distance: float
    path: list[tuple[int, int]]
    similarity: float


@dataclass
class DTWConfig:
    window_size: Optional[int] = None
    distance_metric: str = "euclidean"
    weights: Optional[np.ndarray] = None
    threshold: Optional[float] = None
