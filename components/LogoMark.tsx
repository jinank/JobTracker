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
    <div className={`relative shrink-0 overflow-hidden ${className}`} role="img" aria-label={SITE_NAME}>
      <Image
        src="/superinterns-logo.png"
        alt={SITE_NAME}
        fill
        sizes="64px"
        className={`object-cover object-left ${iconClassName}`}
        priority
      />
    </div>
  );
}
