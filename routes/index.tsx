import { AboutSean } from "../components/AboutSean.tsx";
import { GameOfLifeLayout } from "../components/Layout.tsx";
import { githubUrl, linkedinUrl } from "../utils/socialUrls.ts";
import { type PageProps } from "$fresh/server.ts";

const avatarImg = "/avatar.jpg";
const emoji = `🇨🇦`;
const description = `Hi! My name is Sean Aye, I'm a ${emoji} software engineer working on the future of document drafting and reviewing. In my free time I enjoy taking photos, making music, and travelling.`;

export default function Home(props: PageProps) {
  return (
    <GameOfLifeLayout url={props.url}>
      <div class="justify-self-center flex justify-center items-center pointer-events-none">
        <AboutSean
          class="pointer-events-auto"
          {...{ avatarImg, githubUrl, linkedinUrl, description }}
        />
      </div>
    </GameOfLifeLayout>
  );
}
