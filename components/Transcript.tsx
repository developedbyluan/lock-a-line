import React from "react";

export default function Transcript(props: { text: string }) {
    React.useEffect(() => {
        const lines = props.text.split("\n\n")
        console.log(lines)
    }, [props.text])

    const lineElements = props.text.split("\n\n").map((line, index) => {    
        return <div key={index}>{line}</div>
    })
  return <div>{lineElements}</div>;
}