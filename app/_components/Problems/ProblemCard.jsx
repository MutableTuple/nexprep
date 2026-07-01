import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ZoomableImage from "./ZoomableImage";
import MarkdownRenderer from "../MarkdownRenderer";
export default function ProblemCard({
  number,
  title,
  meta,
  body,
  images = [],
}) {
  return (
    <Card className="">
      <CardHeader className="border-b px-5 pt-5 pb-5 sm:px-7 sm:pt-6 flex-row items-start gap-4 space-y-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary font-black text-primary-foreground sm:h-11 sm:w-11">
          {number}
        </div>

        <div className="min-w-0">
          <h1 className="text-base font-extrabold leading-snug sm:text-lg">
            {title}
          </h1>

          <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-6 sm:px-7">
        <MarkdownRenderer
          className="
            text-[15px]
            leading-8
            prose-h2:mt-6
            prose-h2:mb-3
            prose-h3:mt-5
            prose-h3:mb-2
            prose-ul:my-3
            prose-ol:my-3
            prose-li:my-1
          "
        >
          {body}
        </MarkdownRenderer>

        {images.length > 0 && (
          <div className="mt-8 space-y-6">
            {images.map((img, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border bg-muted/40 p-5"
              >
                <ZoomableImage
                  src={img.url}
                  alt={img.alt ?? `Diagram ${i + 1}`}
                />

                {img.caption && (
                  <p className="mt-3 text-center text-sm text-muted-foreground">
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
