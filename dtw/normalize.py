import numpy as np
from .types import Landmark, TimeSeriesFrame


def center_by_wrist(landmarks: list[Landmark], wrist_index: int = 0) -> list[Landmark]:
    if not landmarks or wrist_index >= len(landmarks):
        return landmarks

    wrist = landmarks[wrist_index]
    return [
        Landmark(
            x=lm.x - wrist.x,
            y=lm.y - wrist.y,
            z=lm.z - wrist.z,
            visibility=lm.visibility,
        )
        for lm in landmarks
    ]


def scale_normalize(landmarks: list[Landmark]) -> list[Landmark]:
    if not landmarks:
        return landmarks

    coords = np.array([[lm.x, lm.y, lm.z] for lm in landmarks])
    max_dist = float(np.max(np.linalg.norm(coords, axis=1)))

    if max_dist == 0:
        return landmarks

    return [
        Landmark(
            x=lm.x / max_dist,
            y=lm.y / max_dist,
            z=lm.z / max_dist,
            visibility=lm.visibility,
        )
        for lm in landmarks
    ]


def normalize_spatial(frames: list[TimeSeriesFrame]) -> list[TimeSeriesFrame]:
    result = []
    for frame in frames:
        centered = center_by_wrist(frame.landmarks)
        scaled = scale_normalize(centered)
        result.append(TimeSeriesFrame(timestamp=frame.timestamp, landmarks=scaled))
    return result
