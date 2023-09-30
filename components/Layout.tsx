import GameOfLifeCanvas from "../islands/GameOfLifeCanvas.tsx";
import { colours } from "../utils/colors.ts";
import { Header } from "./Header.tsx";
import { ComponentChildren } from "preact";

export function GameOfLifeLayout(props: { children: ComponentChildren; url: URL }) {
  return (
    <>
      <div class="w-screen h-screen fixed top-0 left-0 right-0">
        <GameOfLifeCanvas colors={colours} />
      </div>
      <div class="max-w-4xl min-h-screen mx-auto flex flex-col py-4 relative pointer-events-none">
        <Header />
        <div class="flex-grow flex">{props.children}</div>
      </div>
    </>
  );
}

export function PlainLayout(props: {
  children: ComponentChildren;
  url: URL;
  cookies: Record<string, string>;
}) {
  return (
    <>
      <Header />
      {props.children}
    </>
  );
}
