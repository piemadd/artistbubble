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
    let genresTemp = {};
    artistData.forEach(artist => {
      artist.genres.forEach(genre => {
        genresTemp[genre] = genresTemp[genre] ? genresTemp[genre]: [];
        genresTemp[genre].push(artist.name);
      })
    });

    const sortedGenres = Object.keys(genresTemp).sort((a, b) => {
      if (genresTemp[a].length > genresTemp[b].length) {
        return 1;
      } else if (genresTemp[a].length === genresTemp[b].length) {
        return 0;
      }

      return -1;
    }).reverse();

    setSortedGenres(sortedGenres);


    //note to future self: dont write code at 1am

    let tempArtistGenreMap = {};
    sortedGenres.forEach((genre) => {
      genresTemp[genre].forEach((artist) => {
        if (!tempArtistGenreMap[artist]) {
          tempArtistGenreMap[artist] = genre;
        }
      })
    })
    setGenresMap(tempArtistGenreMap);



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
    setMaxOuter(Object.keys(genresMap).length);
    setMaxInner(Object.keys(sortedFilteredGenres).length);

    console.log('max outer: ' + maxOuter);
    console.log('max inner: ' + maxInner);

  }, [artistData]);
          

  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    //labels: sortedGenres.slice(0, 20),
    labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    datasets: [
      {
        label: 'Artists',
        
        data: Object.keys(genresMap).map((artist) => {
          return 1;
        }),
        
        //data: Object.values(genres),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
      {
        label: 'Genres',
        
        data: Object.keys(sortedFilteredGenres).map((genre) => {
          return sortedFilteredGenres[genre].length;
        }),
        
        //data: Object.values(genres),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }
    ],
  };


  return (
    <main>
      <Pie data={data} options={{
        plugins: {
          legend: {
            labels: {
              generateLabels: function(chart) {
                // Get the default label list
                const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                const labelsOriginal = original.call(this, chart);

                console.log('orig')
                console.log(labelsOriginal)
    
                // Build an array of colors used in the datasets of the chart
                let datasetColors = chart.data.datasets.map(function(e) {
                  return e.backgroundColor;
                });
                datasetColors = datasetColors.flat();
    
                // Modify the color and hide state of each label
                labelsOriginal.forEach(label => {
                  // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
                  label.datasetIndex = (label.index - label.index % 2) / 2;
    
                  // The hidden state must match the dataset's hidden state
                  label.hidden = !chart.isDatasetVisible(label.datasetIndex);
    
                  // Change the color to match the dataset
                  label.fillStyle = datasetColors[label.index];
                });
    
                return labelsOriginal;
              }
            },
            onClick: function(mouseEvent, legendItem, legend) {
              // toggle the visibility of the dataset from what it currently is
              legend.chart.getDatasetMeta(
                legendItem.datasetIndex
              ).hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex);
              legend.chart.update();
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {

                const start = (context.dataset.label == 'Artists') ? 0 : maxOuter;
                return correctLabels[start + context.dataIndex]
              }
            }
          }
        }
      }}/>
    </main>
  )
}