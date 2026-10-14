"use client";

import type { ReactNode } from "react";
import { bcv_parser } from "bible-passage-reference-parser/esm/bcv_parser.js";
import * as lang from "bible-passage-reference-parser/esm/lang/en.js";

const parser = new bcv_parser(lang);
parser.set_options({
  case_sensitive: "books",
  sequence_combination_strategy: "separate",
});

export function BibleReferenceText({ text }: Readonly<{ text: string }>) {
  const matches = parser.parse(text).osis_and_indices();
  if (matches.length === 0) return text;

  const segments: ReactNode[] = [];
  let position = 0;

  for (const { indices } of matches) {
    const [start, end] = indices;
    const reference = text.slice(start, end);

    if (start < position || !parser.parse(reference).osis()) continue;

    segments.push(
      text.slice(position, start),
      <a
        key={`${start}-${end}`}
        href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-amber-800 underline decoration-amber-300 underline-offset-4 hover:decoration-amber-700"
      >
        {reference}
      </a>,
    );
    position = end;
  }

  segments[segments.length] = text.slice(position);
  return segments;
}
