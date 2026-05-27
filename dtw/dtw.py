import numpy as np
from .types import TimeSeriesFrame, DTWResult, DTWConfig
from .distance import euclidean_distance, manhattan_distance, weighted_distance


def compute_dtw(
    series1: list[TimeSeriesFrame],
    series2: list[TimeSeriesFrame],
    config: DTWConfig | None = None,
) -> DTWResult:
    if config is None:
        config = DTWConfig()

    n = len(series1)
    m = len(series2)

    if n == 0 or m == 0:
        return DTWResult(
            distance=float("inf"),
            normalized_distance=float("inf"),
            path=[],
            similarity=0.0,
        )

    def get_distance(a: TimeSeriesFrame, b: TimeSeriesFrame) -> float:
        ma = a.to_matrix()
        mb = b.to_matrix()
        if config.distance_metric == "manhattan":
            return manhattan_distance(ma, mb)
        elif config.distance_metric == "weighted" and config.weights is not None:
            return weighted_distance(ma, mb, config.weights)
        return euclidean_distance(ma, mb)

    matrix = np.full((n, m), float("inf"))
    matrix[0, 0] = get_distance(series1[0], series2[0])

    for i in range(1, n):
        matrix[i, 0] = matrix[i - 1, 0] + get_distance(series1[i], series2[0])
    for j in range(1, m):
        matrix[0, j] = matrix[0, j - 1] + get_distance(series1[0], series2[j])

    for i in range(1, n):
        j_start = max(1, i - config.window_size) if config.window_size else 1
        j_end = min(m - 1, i + config.window_size) if config.window_size else m - 1

        for j in range(j_start, j_end + 1):
            cost = get_distance(series1[i], series2[j])
            matrix[i, j] = cost + min(
                matrix[i - 1, j],
                matrix[i, j - 1],
                matrix[i - 1, j - 1],
            )

    path: list[tuple[int, int]] = []
    i, j = n - 1, m - 1
    path.append((i, j))

    while i > 0 or j > 0:
        if i == 0:
            j -= 1
        elif j == 0:
            i -= 1
        else:
            candidates = [matrix[i - 1, j - 1], matrix[i - 1, j], matrix[i, j - 1]]
            min_idx = int(np.argmin(candidates))
            if min_idx == 0:
                i -= 1
                j -= 1
            elif min_idx == 1:
                i -= 1
            else:
                j -= 1
        path.append((i, j))

    path.reverse()

    distance = float(matrix[n - 1, m - 1])
    normalized_distance = distance / len(path)
    similarity = 1.0 / (1.0 + normalized_distance)

    return DTWResult(
        distance=distance,
        normalized_distance=normalized_distance,
        path=path,
        similarity=similarity,
    )
