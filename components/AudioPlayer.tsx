export default function AudioPlayer(props: {
  audioUrl: string | null;
}) {
  return <div>
    <audio src={props.audioUrl!} controls />
  </div>
}