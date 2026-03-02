import numpy as np


def euclidean_distance(a: np.ndarray, b: np.ndarray) -> float:
    diff = a - b
    return float(np.sqrt(np.sum(diff ** 2)))


def manhattan_distance(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.sum(np.abs(a - b)))


def weighted_distance(a: np.ndarray, b: np.ndarray, weights: np.ndarray) -> float:
    diff = a - b
    weighted = weights[:, np.newaxis] * (diff ** 2)
    return float(np.sqrt(np.sum(weighted)))
