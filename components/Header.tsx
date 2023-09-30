import { type JSX } from "preact/jsx-runtime";
import { emailUrl, githubUrl, linkedinUrl } from "../utils/socialUrls.ts";
import { GithubIcon } from "./GithubIcon.tsx";
import { LinkedinIcon } from "./LinkedinIcon.tsx";
import { EmailIcon } from "./EmailIcon.tsx";

const iconStyle =
  "text-gray-700 hover:text-blue-500 transition-all duration-300 w-6 h-6";

export function Header() {
  return (
    <div class="flex">
      <div class="flex flex-row flex-shrink bg-gray-200 shadow-lg shadow-gray-900 rounded-lg gap-4 px-4 py-2 pointer-events-auto">
        <a href={githubUrl} target="_blank">
          <GithubIcon class={iconStyle} />
        </a>
        <a href={linkedinUrl} target="_blank">
          <LinkedinIcon class={iconStyle} />
        </a>
        <a href={emailUrl} target="_blank">
          <EmailIcon class={iconStyle} />
        </a>
      </div>
    </div>
  );
}
