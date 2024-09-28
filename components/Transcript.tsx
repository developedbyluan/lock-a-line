import React from "react";

export default function Transcript(props: { text: string }) {
  function arrayToObjectsArray(array: string[]) {
    const lineObjectsArray = array.map((line) => {
      const parts = line.split("---");

      if (parts.length !== 5) {
        const [text] = parts;
        return { text };
      }

      const [text, ipa, translation, imgUrlandAlt, type] = parts;
      const [imgUrl, alt] = imgUrlandAlt.split("|");
      return {
        text,
        ipa,
        translation,
        imgUrl,
        alt,
        type,
      };
    });

    return lineObjectsArray;
  }

  const lineElements = arrayToObjectsArray(props.text.split("\n\n")).map(
    (line, index) => {
      return <div key={index}>{line.text}</div>;
    }
  );
  return <div>{lineElements}</div>;
}
