/** First thing a keyboard user reaches: jumps past the header and menus (WCAG 2.4.1). Hidden until focused. */
export function SkipLink({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg"
    >
      Bỏ qua tới nội dung
    </a>
  );
}
