import { marky } from "https://deno.land/x/marky@v1.1.6/mod.ts";
import { render, CSS } from "https://deno.land/x/gfm/mod.ts"
import { GameOfLifeLayout } from "../components/Layout.tsx";
import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import "https://esm.sh/prismjs@1.29.0/components/prism-sql?no-check"

const markdown = await Deno.readTextFile("./resume.md");

export default function Resume(props: PageProps) {
  return (
    <GameOfLifeLayout url={props.url}>
      <Head>
        <style>{CSS.replaceAll("font-family", "noop")}</style>
      </Head>
      <div
        class="prose bg-zinc-800 w-full prose-invert max-w-full py-4 px-6 ring-8 mt-4 ring-zinc-800 font-mono markdown-body pointer-events-auto"
        data-color-mode="dark" data-dark-theme="dark"
        dangerouslySetInnerHTML={{ __html: render(markdown) }}
      ></div>
    </GameOfLifeLayout>
  );
}
