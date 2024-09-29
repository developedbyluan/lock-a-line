export default function AudioPlayer(props: {
  audioUrl: string | null;
  isAudioPlaying: boolean;
  setIsAudioPlaying: (isAudioPlaying: boolean) => void;
}) {
  return (
    <div>
      <audio
        src={props.audioUrl!}
        controls
        onPlay={() => props.setIsAudioPlaying(true)}
        onPause={() => props.setIsAudioPlaying(false)}
      />
    </div>
  );
}