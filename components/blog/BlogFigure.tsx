import Image from "next/image";

type BlogFigureProps = {
  src: string;
  alt: string;
  caption: string;
};

export function BlogFigure({ src, alt, caption }: BlogFigureProps) {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[16/10] w-full bg-slate-50">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 672px"
        />
      </div>
      <figcaption className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600">
        {caption}
      </figcaption>
    </figure>
  );
}
