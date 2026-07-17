import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import clsx from "clsx";

import "katex/dist/katex.min.css";

export default function MarkdownRenderer({
  children,
  className,
  inline = false,
}) {
  return (
    <div
      className={clsx(
        "markdown-body",
        "prose prose-neutral dark:prose-invert",
        "max-w-none",

        // headings
        "prose-headings:font-bold",
        "prose-headings:tracking-tight",
        "prose-h1:text-3xl",
        "prose-h2:text-2xl",
        "prose-h3:text-xl",
        "prose-h4:text-lg",

        // spacing
        "prose-p:leading-8",
        "prose-p:my-4",
        "prose-li:leading-8",
        "prose-li:my-1",

        // lists
        "prose-ul:my-4",
        "prose-ol:my-4",

        // hr
        "prose-hr:my-8",

        // links
        "prose-a:text-primary",
        "prose-a:no-underline",
        "hover:prose-a:underline",

        // strong
        "prose-strong:text-foreground",

        // images
        "prose-img:rounded-xl",
        "prose-img:border",

        // blockquotes
        "prose-blockquote:border-l-4",
        "prose-blockquote:border-primary",
        "prose-blockquote:bg-muted/40",
        "prose-blockquote:px-5",
        "prose-blockquote:py-2",
        "prose-blockquote:rounded-r-xl",
        "prose-blockquote:font-normal",

        // inline code
        "prose-code:bg-muted",
        "prose-code:px-1.5",
        "prose-code:py-0.5",
        "prose-code:rounded-md",
        "prose-code:before:content-none",
        "prose-code:after:content-none",

        // code blocks
        "prose-pre:bg-muted",
        "prose-pre:border",
        "prose-pre:rounded-xl",

        // tables
        "prose-table:w-full",
        "prose-table:border-collapse",
        "prose-th:border",
        "prose-td:border",

        // inline mode — collapse block spacing for compact contexts (e.g. answer options)
        inline && "prose-p:inline prose-p:my-0 prose-p:leading-normal",

        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={inline ? { p: "span" } : undefined}
      >
        {children ?? ""}
      </ReactMarkdown>
    </div>
  );
}
