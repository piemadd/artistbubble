import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart } from 'chart.js';
import { Pie } from 'react-chartjs-2';

export default function Callback() {

  const [artistData, setArtistData] = useState([]);
  const [songData, setSongData] = useState([])
  const [userData, setUserData] = useState({});

  const [genres, setGenres] = useState([]);
  const [sortedGenres, setSortedGenres] = useState([]);
  const [sortedFilteredGenres, setSortedFilteredGenres] = useState({});
  const [genresMap, setGenresMap]  = useState({});
  const [correctLabels, setCorrectLabels] = useState([]);
  const [maxInner, setMaxInner] = useState(0);
  const [maxOuter, setMaxOuter] = useState(0);

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
      fetch('https://api.spotify.com/v1/me/top/artists?limit=20', {
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

  useEffect(() => {
    //key is genre, value is list of artists
    let genresTemp = {};
    artistData.forEach(artist => {
      artist.genres.forEach(genre => {
        genresTemp[genre] = genresTemp[genre] ? genresTemp[genre]: [];
        genresTemp[genre].push(artist.name);
      })
    });

    // list of genres by popularity in list
    const sortedGenres = Object.keys(genresTemp).sort((a, b) => {
      if (genresTemp[a].length > genresTemp[b].length) {
        return 1;
      } else if (genresTemp[a].length === genresTemp[b].length) {
        return 0;
      }

      return -1;
    }).reverse();

    setSortedGenres(sortedGenres);

    // map of artist name to most popular genre
    let tempArtistGenreMap = {};
    sortedGenres.forEach((genre) => {
      genresTemp[genre].forEach((artist) => {
        if (!tempArtistGenreMap[artist]) {
          tempArtistGenreMap[artist] = genre;
        }
      })
    })
    setGenresMap(tempArtistGenreMap);

    // same as genresTemp but with only the top 20 genres
    let sortedFilteredGenres = {};
    Object.keys(tempArtistGenreMap).forEach((artist) => {
      sortedFilteredGenres[tempArtistGenreMap[artist]] = sortedFilteredGenres[tempArtistGenreMap[artist]] ? sortedFilteredGenres[tempArtistGenreMap[artist]] : [];
      sortedFilteredGenres[tempArtistGenreMap[artist]].push(artist);
    });

    console.log(sortedFilteredGenres)
    setSortedFilteredGenres(sortedFilteredGenres)
    setGenres(genresTemp);

    setCorrectLabels(Object.keys(genresMap));

    Object.keys(sortedFilteredGenres).forEach((genre) => {
      setCorrectLabels(correctLabels => [...correctLabels, genre]);
    })

    // originally was for pie chart stuff, might not be needed anymore
    setMaxOuter(Object.keys(genresMap).length);
    setMaxInner(Object.keys(sortedFilteredGenres).length);

    console.log('max outer: ' + maxOuter);
    console.log('max inner: ' + maxInner);

  }, [artistData]);
          
  return (
    <main>
      test
    </main>
  )
}