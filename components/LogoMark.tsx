import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

export function LogoMark({
  className = "h-9 w-9",
  iconClassName = "",
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <Image
      src="/superinterns-icon.png"
      alt={SITE_NAME}
      width={128}
      height={128}
      className={`shrink-0 object-contain ${className} ${iconClassName}`.trim()}
      priority
    />
  );
}
