import { useState, useEffect, useRef } from "react";
import React from "react";
import domtoimage from "@intactile/dom-to-image-next";
import { saveAs } from "file-saver";
//import { Treemap, Tooltip } from "recharts";
import { Treemap } from "react-vis";

const exportToPng = (dom) => {
  domtoimage
    .toPng(dom)
    .then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      document.body.appendChild(img);
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
    });
};

export default function Callback() {
  const container = useRef(null);
  const [artistData, setArtistData] = useState([]);
  const [artistLink, setArtistLink] = useState({});
  const [songData, setSongData] = useState([]);
  const [userData, setUserData] = useState({});

  const [genresMap, setGenresMap] = useState({});
  const [maxInner, setMaxInner] = useState(0);
  const [maxOuter, setMaxOuter] = useState(0);

  const [isLoading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  const [finalChartData, setFinalChartData] = useState({});

  useEffect(() => {
    //yes, this is a hack, but it works
    setAccessToken(
      window.location.href.split("#access_token=")[1].split("&")[0]
    );
    console.log("access token!");
  });

  useEffect(() => {
    if (accessToken != "") {
      console.log("fetching user");
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          window.userData = data;
        })
        .catch((err) => console.log(err));
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken != "") {
      console.log("fetching artists");
      fetch("https://api.spotify.com/v1/me/top/artists", {
        //?limit=20&time_range=short_term', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setArtistData(data.items);
          console.log(data.items);
          window.artistData = data.items;

          data.items.forEach((artist) => {
            setArtistLink((prev) => ({
              ...prev,
              [artist.name]: artist.external_urls.spotify,
            }));
          });
        })
        .catch((err) => console.log(err));
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken != "") {
      console.log("fetching tracks");
      fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data.items);
          setSongData(data.items);
          window.songData = data.items;
        })
        .catch((err) => console.log(err));
    }
  }, [accessToken]);

  useEffect(() => {
    //key is genre, value is list of artists
    let genresTemp = {};
    artistData.forEach((artist) => {
      if (artist.genres.length == 0) {
        artist.genres = ["none?"];
      }

      artist.genres.forEach((genre) => {
        genresTemp[genre] = genresTemp[genre] ? genresTemp[genre] : [];
        genresTemp[genre].push(artist.name);
      });
    });
    console.log("genresTemp", genresTemp);

    // list of genres by popularity in list
    const sortedGenres = Object.keys(genresTemp)
      .sort((a, b) => {
        if (genresTemp[a].length > genresTemp[b].length) {
          return 1;
        } else if (genresTemp[a].length === genresTemp[b].length) {
          return 0;
        }

        return -1;
      })
      .reverse();

    // map of artist name to most popular genre
    let tempArtistGenreMap = {};
    sortedGenres.forEach((genre) => {
      genresTemp[genre].forEach((artist) => {
        if (!tempArtistGenreMap[artist]) {
          tempArtistGenreMap[artist] = genre;
        }
      });
    });
    console.log("tempArtistGenreMap:", tempArtistGenreMap);
    setGenresMap(tempArtistGenreMap);

    // same as genresTemp but with only the top 20 genres
    let sortedFilteredGenres = {};
    Object.keys(tempArtistGenreMap).forEach((artist) => {
      sortedFilteredGenres[tempArtistGenreMap[artist]] = sortedFilteredGenres[
        tempArtistGenreMap[artist]
      ]
        ? sortedFilteredGenres[tempArtistGenreMap[artist]]
        : [];
      sortedFilteredGenres[tempArtistGenreMap[artist]].push(artist);
    });

    console.log(sortedFilteredGenres);

    // originally was for pie chart stuff, might not be needed anymore
    setMaxOuter(Object.keys(genresMap).length);
    setMaxInner(Object.keys(sortedFilteredGenres).length);

    console.log("max outer: " + maxOuter);
    console.log("max inner: " + maxInner);

    let finalData = {
      children: [],
    };
    Object.keys(sortedFilteredGenres).forEach((genre, i, arr) => {
      let tempGroup = {
        title: genre,
        color: hslToHex(i * (360 / arr.length), 56, 70),
        opacity: 1,
        children: [],
        style: {
          textAlign: "left",
        },
      };

      sortedFilteredGenres[genre].forEach((artist) => {
        tempGroup.children.push({
          title: <a href={artistLink[artist]}>{artist}</a>,
          color: `hsl(${i * (360 / arr.length)}, 50, 60, 1)`,
          size: 100,
          opacity: 1,
          children: [],
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: "1px",
            borderStyle: "solid",
          },
        });

        /*
      sortedFilteredGenres[genre].forEach((artist) => {
        tempGroup.children.push({
          title: artist,
          color: `hsl(${i * (360 / arr.length)}, 50, 60, 1)`,
          size: 100,
          opacity: 1,
          children: [],
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: "1px",
            borderStyle: "solid",
          },
        });
        */

        //revisit at a later date?
        /*
        songData.forEach((song) => {
          song.artists.forEach((songArtist) => {
            if (songArtist.name == artist) {
              tempGroup.children[tempGroup.children.length - 1].children.push({
                'title': song.name,
                'opacity': 0.5
              })
            }
          })
        })
        */
      });

      finalData.children.push(tempGroup);
    });

    console.log(finalData);
    setFinalChartData(finalData);

    console.log("final chart data: " + finalData.children.length);

    console.log(`number of artists fetched: ${artistData.length}`);
  }, [artistData, songData]);

  return (
    <>

      <main
        style={{
          width: "80vw",
          height: "80vw",
          maxWidth: "750px",
          maxHeight: "750px",
        }}
      >
        <center>
        <section
          style={{
            display: "flex",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <a href={"/"} className={"button scaleIn"}>
            Disconnect Account
          </a>
          <a
            className={"button scaleIn"}
            onClick={() => {
              domtoimage
                .toBlob(document.querySelector(".treemap"), { height: 750, width: 750 })
                .then((blob) => saveAs(blob, "artistgrid.piemadd.com.png"));
            }}
          >
            Save Image
          </a>
        </section>
        </center>
        
        <Treemap
          ref={container}
          data={finalChartData}
          width={800}
          height={800}
          renderMode={"DOM"}
          colorType={"literal"}
          colorRange={["#222"]}
          mode={"binary"}
          className={"treemap"}
        ></Treemap>
      </main>
    </>
  );
}
//debug stuff
/*
<p>{`number of artists fetched: ${artistData.length}`}</p>
      <textarea
        value={JSON.stringify(artistData, null, 2)}
        rows={"10"}
        cols={"100"}
      ></textarea>
*/

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
