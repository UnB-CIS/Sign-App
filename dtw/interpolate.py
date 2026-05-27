import math
from .types import Landmark, TimeSeriesFrame


def interpolate_to_length(
    frames: list[TimeSeriesFrame], target_length: int
) -> list[TimeSeriesFrame]:
    if not frames or target_length <= 0:
        return []
    if len(frames) == target_length:
        return frames

    result: list[TimeSeriesFrame] = []
    ratio = (len(frames) - 1) / (target_length - 1)

    for i in range(target_length):
        pos = i * ratio
        low = math.floor(pos)
        high = min(math.ceil(pos), len(frames) - 1)
        t = pos - low

        if low == high:
            result.append(frames[low])
            continue

        interpolated = [
            Landmark(
                x=a.x + t * (b.x - a.x),
                y=a.y + t * (b.y - a.y),
                z=a.z + t * (b.z - a.z),
                visibility=a.visibility,
            )
            for a, b in zip(frames[low].landmarks, frames[high].landmarks)
        ]

        timestamp = frames[low].timestamp + t * (
            frames[high].timestamp - frames[low].timestamp
        )
        result.append(TimeSeriesFrame(timestamp=timestamp, landmarks=interpolated))

    return result
