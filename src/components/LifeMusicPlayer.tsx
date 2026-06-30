import { BackgroundMusic } from "./BackgroundMusic";
import { useLife } from "./LifeContext";
import { getLifeMusicPlaylist, selectLifeMusicId } from "../data/life/music";

export function LifeMusicPlayer() {
  const { state } = useLife();
  const trackId = selectLifeMusicId(state);

  return (
    <BackgroundMusic
      songs={getLifeMusicPlaylist()}
      currentTrackId={trackId}
      disableScrollAutoplay
      hideSkipControls
      lockTrackSelection
      enableInteractionAutoplay
      titleDisplayMs={2000}
      fadeOutMs={900}
      fadeInMs={1200}
    />
  );
}
