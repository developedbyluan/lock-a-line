export default function AudioPlayer(props: {
  audioUrl: string;
}) {
  return <div>
    <audio src={props.audioUrl} controls />
  </div>
}