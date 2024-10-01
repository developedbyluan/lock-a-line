import Image from "next/image";
import PlaceHolderImage from "@/public/images/placeholder100x100.svg";

export default function CustomizedImage(props: {
  imgUrl: string | undefined;
  altText: string | undefined;
  imgCredit: string | undefined;
}) {
  return (
    <div>
      <Image
        src={props.imgUrl || PlaceHolderImage}
        alt={props.altText || ""}
        width={300}
        height={0}
        className="w-1/4 h-auto"
      />
      <p className="text-xs text-muted-foreground mt-1">
        <span className="font-bold">Credit: </span> {props.imgCredit || ""}
      </p>
    </div>
  );
}
