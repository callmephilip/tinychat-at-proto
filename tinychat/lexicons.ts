import { lexicons } from "tinychat/api/lexicons.ts";
import { LexUserType, lexUserType } from "@atproto/lexicon";
import { z } from "zod";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: lexicons.ipynb

// get lexicon for tincychat
export const getLocalLexicon = (): ([string, LexUserType])[] => {
  return lexicons.defs
    .entries()
    .toArray()
    .filter(([name]) =>
      name.startsWith("lex:chat.tinychat") && !name.endsWith("#main")
    ).map((
      [name, def],
    ) => [name.replace("lex:", ""), def]);
};

// import { merman } from "tinychat/tools/merman.ts";

type LexiconObjectType = Extract<
  z.infer<typeof lexUserType>,
  { type: "object" }
>;

const getLexiconDefByName = (
  name: string,
): { name: string; def: LexUserType } | undefined => {
  const r = lexicons.defs.entries().toArray().find((e) => e[0] === name);
  return r && { name: r[0], def: r[1] };
};

// generate random alpha string
const genAlias = (length: number = 10) => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const diagram = (name: string, def: LexUserType): string | undefined => {
  const renderedEntities: string[] = [];

  const _diagram = (
    name: string,
    def: LexUserType,
    defAliases: Record<string, string> = {},
  ): string | undefined => {
    defAliases[name] = genAlias();
    const links: string[][] = [];
    const linkedEntities: string[] = [];

    const entity = (name: string, props: string[]) => {
      const n = defAliases[name] ? `${defAliases[name]}["${name}"]` : name;
      return [`${n.replace("lex:", "")} {`, props.join("\n"), "}"].join("\n");
    };

    const mapRef = (
      name: string,
      ref: string,
      refObj: LexUserType | undefined = undefined,
    ) => {
      // most of the time ref points to an existing type
      // but sometimes we need a synthetic type that does not really exist by itself (e.g. query returns an object)
      // this is what refObj is for

      // if there is existing ref, skip
      if (links.find(([, l]) => l === ref)) {
        return;
      }

      links.push([name, ref]);

      if (!refObj && renderedEntities.includes(ref)) {
        return;
      }

      linkedEntities.push(
        _diagram(ref, refObj || getLexiconDefByName(ref)!.def, defAliases)!,
      );

      if (!refObj) {
        renderedEntities.push(ref);
      }
    };

    const renderRefs = () => {
      return (
        links
          .map(([n, l]) => [
            n,
            Object.entries(defAliases).find(([k]) => k === l)![1],
          ])
          .map(([n, l]) => `${defAliases[name]} ||--o| ${l} : ${n}`)
          .join("\n\n") +
        "\n\n" +
        linkedEntities.join("\n\n")
      );
    };

    const processObject = (o: LexiconObjectType): string[] => {
      return Object.entries(o.properties).map((prop) => {
        const [name, d] = prop;

        const propEntry = ({
          name,
          type,
          description,
          format,
        }: {
          name: string;
          type: string;
          description?: string | undefined;
          format?: string | undefined;
        }) => {
          let t = type;
          if (format) {
            t = `${t}(${format})`;
          }
          return `${name} ${t} ${description ? `"${description}"` : ""}`;
        };

        if (d.type === "ref") {
          mapRef(name, d.ref);
        } else if (d.type === "array") {
          if (d.items.type === "ref") {
            mapRef(name, d.items.ref);
          } else if (d.items.type === "union") {
            d.items.refs.forEach((r) => mapRef(name, r));
          }
        } else if (d.type === "union") {
          d.refs.forEach((r) => mapRef(name, r));
        }

        return propEntry({
          name,
          type: d.type,
          description: d.description,
          // @ts-ignore yolo, i got it babe
          format: d.format!,
        });
      });
    };

    if (def.type === "object") {
      const props = processObject(def);

      return [
        renderRefs(),
        entity(name, props),
      ].join("\n");
    } else if (def.type === "record") {
      return _diagram(name, def.record, defAliases);
    } else if (def.type === "query" || def.type === "procedure") {
      if (def.output?.schema?.type === "ref") {
        mapRef("returns", def.output.schema.ref);
      } else if (
        def.output?.schema?.type === "object" &&
        Object.keys(def.output.schema.properties).length !== 0
      ) {
        mapRef("returns", "returns", def.output.schema);
      }

      let input;

      if (def.type === "query") {
        input = def.parameters;
      } else {
        input = def.input?.schema;
      }

      // @ts-ignore yolo
      const props = input ? processObject(input) : [];

      return [
        renderRefs(),
        // procedure body
        entity(name, props),
      ].join("\n");
    }
    return "";
  };

  return _diagram(name, def, {});
};

export const getDiagram = (name: string) => {
  const item = getLexiconDefByName(
    name.startsWith("lex:") ? name : `lex:${name}`,
  );
  const dc = diagram(item!.name, item!.def);
  return `---
config:
fontSize: 18
theme: neutral
layout: elk
elk:
    mergeEdges: true
    nodePlacementStrategy: NETWORK_SIMPLEX
---
erDiagram
    ${dc}`;
};

// merman(
//   [
//     // "lex:chat.tinychat.actor.getProfile",
//     // "lex:chat.tinychat.server.getServers",
//     // "lex:chat.tinychat.server.createServer",
//     // "chat.tinychat.core.message",
//     // "chat.tinychat.core.defs#messageView",
//     "chat.tinychat.server.toggleReaction",
//   ].map(getDiagram),
//   `<strong>Legend:</strong>hello<hr/>`
// );
