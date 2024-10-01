import type { Transcript as TranscriptType } from "@/types/Transcript"

export default function SentenceWithIPAOnTop(props: {
    subtitle: TranscriptType | Partial<TranscriptType> 
}) {
    const ipaArray = props.subtitle.ipa?.split(" ")
    const textArray = props.subtitle.text?.split(" ")

    const sentenceWithIPAOnTop = ipaArray?.map((ipa, index) => {
        return (
            <div key={crypto.randomUUID()} className="text-center mt-2">
                <p className="text-sm text-neutral-200">{ipa}</p>
                <p className="text-xl">{textArray?.[index]}</p>
            </div>
        )
    })

    return (
        <div key={crypto.randomUUID()}
            className="flex flex-wrap items-start gap-x-4" 
        >
            {sentenceWithIPAOnTop}
        </div>
    )
}