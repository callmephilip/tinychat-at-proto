import { Main as Facets } from "@tinychat/lexicons/types/app/bsky/richtext/facet.ts";
import { segmentRichText } from "tinychat/bsky.ts";
import { toShortUrl } from "tinychat/utils.ts";
import { parse as parseMd } from "marked";

interface RichTextProps {
  text: string;
  facets?: Facets[];
}

export const RichText = ({ text, facets }: RichTextProps) => {
  if (facets === undefined || facets.length === 0) {
    // @ts-ignore yolo
    return <p dangerouslySetInnerHTML={{ __html: parseMd(text) }} />;
  }

  const segments = segmentRichText(text, facets);

  return (
    <p
      dangerouslySetInnerHTML={{
        __html: segments
          .map(({ text, feature }) => {
            if (!feature) {
              // @ts-ignore yolo
              return parseMd(text).replaceAll(/<p>|<\/p>/g, "");
            }

            const makeLink = (href: string, shorten: boolean = false) =>
              `<a target="_blank" class="font-bold underline" href="${href}">${shorten ? toShortUrl(text) : text}</a>`;

            if (feature.$type === "app.bsky.richtext.facet#link") {
              // @ts-ignore yolo
              return makeLink(feature.uri, true);
            } else if (feature.$type === "app.bsky.richtext.facet#mention") {
              return makeLink(`https://bsky.app/profile/${feature.did}`);
            } else if (feature.$type === "app.bsky.richtext.facet#tag") {
              return makeLink(`https://bsky.app/hashtag/${feature.tag}`);
            }
          })
          .join("")
          .replaceAll("><", "> <"),
      }}
    />
  );
};
