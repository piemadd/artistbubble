import { useState, useEffect } from 'react';
import React from "react";
//import { Treemap, Tooltip } from "recharts";
import {Treemap} from 'react-vis';

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

  const [finalChartData, setFinalChartData] = useState([]);
  const [colors, setColors] = useState([]);
  const [windowWidth, setWindowWidth] = useState(0);

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

    setWindowWidth(window.innerWidth);
  }, [accessToken]);

  useEffect(() => {
    if (accessToken != '') {
      console.log('fetching artists')
      fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=short_term', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setArtistData(data.items);
          console.log(data.items)
          window.artistData = data.items;
        })
        .catch(err => console.log(err));
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken != '') {
      console.log('fetching tracks')
      fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term', {
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

    let finalData = [];
    Object.keys(sortedFilteredGenres).forEach((genre, i, arr) => {
      let tempGroup = {
        'title': genre,
        'opacity': 1,
        'children': [],
        'style': {
          'textAlign': 'left',
          'backgroundColor': 'hsl(0, 0, 0, 0)',
        }
      };

      sortedFilteredGenres[genre].forEach((artist) => {
        tempGroup.children.push({
          'title': artist,
          'color': `hsl(${i * (360 / arr.length)}, 50, 60, 1)`,
          'size': 100,
          'opacity': 1,
          'style': {
            'display': 'flex',
            'justifyContent': 'center',
            'alignItems': 'center',
            'borderWidth': '1px',
            'borderStyle': 'solid',
          }
        })
      });

      finalData.push(tempGroup);
    });

    let finalDataUber = {
      'children': finalData
    }

    finalData.forEach((genre, i) => {
      genre.color = COLORS[i];
    })

    console.log(finalDataUber)
    setFinalChartData(finalDataUber);

    console.log('final chart data: ' + finalData.length);

    console.log(`number of artists fetched: ${artistData.length}`);

  }, [artistData]);
          
  return (
    <main style={{justifyContent: 'center', alignItems: 'center'}}>
      <center>

      
      <Treemap 
        data={finalChartData}
        width={800}
        height={800}
        renderMode={'DOM'}
        colorType={'literal'}
        colorRange={['#222']}
        mode={'binary'}
      >

      </Treemap>
      </center>
      <p>{`number of artists fetched: ${artistData.length}`}</p>
      <textarea value={JSON.stringify(artistData, null, 2)} rows={"10"} cols={"100"}></textarea>
    </main>
  )
}

/*
<Tooltip />
      content={<CustomizedContent colors={colors} />}
*/

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}