import { getDiagram } from "tinychat/lexicons.ts";

export const LexiconDefinition = ({ name }: { name: string }) => {
  return (
    <>
      <h1 class="text-lg">{name}</h1>
      <pre class="mermaid">{getDiagram(name)}</pre>
    </>
  );
};
