import Head from 'next/head'
import Image from 'next/image'

const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev ? 'http://localhost:3000' : 'https://cloud.piemadd.com';

export default function Home() {
  return (
    <>
      <Head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <title>replit</title>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" /> 
      </Head>

      <h1>ArtistBubble</h1>
      <p>View your Bubble Today!</p>
      <a class="button scaleIn" id="loginButton" href={`https://accounts.spotify.com/authorize?client_id=57e3f0d0690c485884d4088dd9fef246&redirect_uri=${baseURL}/callback&scope=playlist-read-collaborative%20user-library-read%20user-top-read&response_type=token&show_dialog=true`}>Login with Spotify</a>
      <br/>
      <p>Made by <a href="https://piemadd.com">Piero</a>. pls hire me lol (dev and comm manager)</p>
    </>
  )
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
    <h1>ArtistBubble</h1>
    <p>View your Bubble Today!</p>
    <a class="button scaleIn" id="loginButton">Login with Spotify</a>
    <br>
    <p>Made by <a href="https://piemadd.com">Piero</a>. pls hire me lol (dev and comm manager)</p>
    
    <script src="scripts/login.js"></script>
  </body>
</html>
*/