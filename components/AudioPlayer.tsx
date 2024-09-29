import React from "react";

function AudioPlayer(props: {
  audioUrl: string | null;
  isAudioPlaying: boolean;
  setIsAudioPlaying: (isAudioPlaying: boolean) => void;
}, ref: React.Ref<HTMLAudioElement>) {

  return (
    <div>
      <audio
        src={props.audioUrl!}
        controls
        ref={ref}
        onPlay={() => props.setIsAudioPlaying(true)}
        onPause={() => props.setIsAudioPlaying(false)}
      />
    </div>
  );
}

export default React.forwardRef(AudioPlayer);