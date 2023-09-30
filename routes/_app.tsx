import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>seanaye-site</title>
      </head>
      <body class="relative">
        <Component />
      </body>
    </html>
  );
}
