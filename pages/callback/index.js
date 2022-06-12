import { useState, useEffect } from 'react';
import React from "react";
import { Treemap, Tooltip } from "recharts";

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
      fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=short_term', {
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
    Object.keys(sortedFilteredGenres).forEach((genre) => {
      let tempGroup = {
        'name': genre,
        'children': []
      };

      sortedFilteredGenres[genre].forEach((artist) => {
        tempGroup.children.push({
          'name': artist,
          'size': 100
        })
      });

      finalData.push(tempGroup);
    });

    console.log(finalData)
    setFinalChartData(finalData);

    console.log('final chart data: ' + finalData.length);
    let COLORS = [];
    for (let i = 0; i <= finalData.length; i++) {
      COLORS.push(hslToHex(i * (360 / finalData.length), 56, 70));
    };
    setColors(COLORS);

  }, [artistData]);
          
  return (
    <main style={{justifyContent: 'center', alignItems: 'center'}}>
      <center>

      
      <Treemap
        width={800}
        height={800}
        data={finalChartData}
        dataKey="size"
        stroke="#fff"
        fill="#8884d8"
        content={<CustomizedContent colors={colors} />}
      >
        <Tooltip />
      </Treemap>
      </center>
    </main>
  )
}

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

const CustomizedContent = (props) => {
  const { root, depth, x, y, width, height, index, colors, name, value } = props;
  //console.log(props);

  let nameArray = [name];

  let colorIndex = index;

  if (depth == 2) {
    colorIndex = root.index;
  }

  if (props.name == 'gaming edm') {
    console.log(props)
  }

  if (depth == 1 && props.children.length == 1 && width < 150) {
    nameArray = name.split(' ');
    console.log(props)
  }


  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill:
            depth < 2 && root.children
              ? colors[colorIndex]
              : "none",
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10)
        }}
      />
      {depth === 1 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={width < 120 ? 16 : 32}>
          {name}
        </text>
      ) : null}
      {(depth === 2 && root.children.length == 1 || (root.width < root.height && root.children.length === 2))? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 30}
          textAnchor="middle"
          fill="#fff"
          fontSize={16}
        >
          {name}
        </text>
      ) : null}
      {(depth === 2 && root.children.length > 1 && !(root.width < root.height && root.children.length === 2))? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={16}
        >
          {name}
        </text>
      ) : null}
      {depth === 1 ? (
        <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fillOpacity={0.9}>
          {index + 1}
        </text>
      ) : null}
    </g>
  );
};