import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

/** SuperInterns mark — matches `public/icon.png` and `app/icon.png`. */
export function LogoMark({
  className = "h-9 w-9",
}: {
  className?: string;
  /** @deprecated Icon sizing is controlled by `className` on the image. */
  iconClassName?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt={SITE_NAME}
      width={512}
      height={512}
      className={`shrink-0 rounded-xl object-cover ${className}`}
      priority
    />
  );
}
