import { marky } from "https://deno.land/x/marky@v1.1.6/mod.ts";
import { render, CSS } from "https://deno.land/x/gfm/mod.ts"
import { GameOfLifeLayout } from "../components/Layout.tsx";
import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { instantiate, parse } from "../lib/parser.generated.js"


// import "https://esm.sh/prismjs@1.29.0/components/prism-sql?no-check"

const markdown = await Deno.readTextFile("./resume.md");
await instantiate();
const html = parse(markdown)

export default function Resume(props: PageProps) {
  return (
    <GameOfLifeLayout url={props.url}>
      <div
        class="prose bg-zinc-800 w-full prose-invert max-w-full py-4 px-6 ring-8 mt-4 ring-zinc-700 font-mono pointer-events-auto shadow-lg prose-code:bg-zinc-700 prose-code:p-1"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </GameOfLifeLayout>
  );
}
