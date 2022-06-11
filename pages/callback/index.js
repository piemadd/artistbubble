import { useState, useEffect } from 'react';
import React            from 'react';
import BubbleChart from '@weknow/react-bubble-chart-d3';

export default function Callback() {

  const [artistData, setArtistData] = useState([]);
  const [songData, setSongData] = useState([])
  const [userData, setUserData] = useState({});

  const [genres, setGenres] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    //yes, this is a hack, but it works
    setAccessToken(window.location.href.split('#access_token=')[1].split('&')[0]);
    console.log('access token!')
  });

  useEffect(() => {
    if (accessToken != '') {
      console.log('fetching user')
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setUserData(data);
          window.userData = data;
        })
        .catch(err => console.log(err));
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken != '') {
      console.log('fetching artists')
      fetch('https://api.spotify.com/v1/me/top/artists?limit=50', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setArtistData(data.items);
          window.artistData = data.items;
        })
        .catch(err => console.log(err));
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken != '') {
      console.log('fetching tracks')
      fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setSongData(data.items);
          window.songData = data.items;
        })
        .catch(err => console.log(err));
    }
  }, [accessToken]);

  return (
    <>
      test
    </>
  )
}