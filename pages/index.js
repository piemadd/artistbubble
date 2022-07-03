import Head from "next/head";
import Image from "next/image";

const isDev = process.env.NODE_ENV === "development";
const baseURL = isDev
  ? "http://192.168.4.21:3000"
  : "https://artistgrid.vercel.app";

export default function Home() {
  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />

        <title>Artist Grid</title>
        <meta
          name="description"
          content="grid grid grid grid
grid grid grid grid
grid grid grid grid
grid grid grid grid
grid grid grid grid
grid grid grid grid"
        />

        <meta property="og:url" content="https://artistgrid.piemadd.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Artist Grid" />
        <meta
          property="og:description"
          content="grid grid grid grid
grid grid grid grid
grid grid grid grid
grid grid grid grid
grid grid grid grid
grid grid grid grid"
        />
        <meta property="og:image" content="artistgrid.piemadd.com.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="artistgrid.piemadd.com" />
        <meta
          property="twitter:url"
          content="https://artistgrid.piemadd.com/"
        />
        <meta name="twitter:title" content="Artist Grid" />
        <meta
          name="twitter:description"
          content="grid grid grid grid
grid grid grid grid
grid grid grid grid
grid grid grid grid
grid grid grid grid
grid grid grid grid"
        />
        <meta name="twitter:image" content="artistgrid.piemadd.com.png" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <h1>Grid</h1>
      <p>Check out your grid for this month: </p>
      <a
        className={"button scaleIn"}
        id="loginButton"
        href={`https://accounts.spotify.com/authorize?client_id=57e3f0d0690c485884d4088dd9fef246&redirect_uri=${baseURL}/callback&scope=user-top-read&response_type=token&show_dialog=true`}
      >
        Login with Spotify
      </a>
      <br />
      <p>
        Made by <a href="https://piemadd.com">Piero</a>. pls hire me lol (dev
        and comm manager)
      </p>
    </>
  );
}

/*
<!DOCTYPE html lang="en">
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>replit</title>
    <link href="style.css" rel="stylesheet" type="text/css" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet"> 
    
  </head>

  <body>
    <h1>artistgrid</h1>
    <p>View your Bubble Today!</p>
    <a class="button scaleIn" id="loginButton">Login with Spotify</a>
    <br>
    <p>Made by <a href="https://piemadd.com">Piero</a>. pls hire me lol (dev and comm manager)</p>
    
    <script src="scripts/login.js"></script>
  </body>
</html>
*/
