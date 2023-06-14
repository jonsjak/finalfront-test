/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Box, Card, IconButton, List, ListItem, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import location, { fetchPrivateMovies } from 'reducers/location';

export const AddMovie = ({ onNewMovieAdded }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [userInput, setUserInput] = useState(false);
  const [movieTitle, setMovieTitle] = useState('');
  const [movieLocation, setMovieLocation] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [movieStill, setMovieStill] = useState('');
  const [locationImage, setLocationImage] = useState('');
  const dispatch = useDispatch();
  const map = useMap();
  const accessToken = useSelector((store) => store.user.accessToken);
  const mapClickable = useSelector((store) => store.menus.isMapClickable);
  
  // Add marker if isMapClickable
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (mapClickable)
      {setMarkerPosition([lat, lng])};
    }
  });
  // 
  useEffect(() => {
    if (markerPosition) {
      console.log(markerPosition);
      map.flyTo(markerPosition, 6)
    }
  }, [markerPosition, map]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue) {
        fetch(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=${searchValue}`)
          .then((response) => response.json())
          .then((json) => {
            setSearchResults(json.Search)
          });
      } else {
        setSearchResults([]); // visa lista
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const addMovieOnClick = (Title) => {
    if (Title) {
      fetch(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&t=${Title}`)
        .then((response) => response.json())
        .then((data) => {
          setSelectedMovie(data) // returns one object - what do to with it?
          setUserInput(true)
          setMovieTitle(Title)
          console.log('title', Title)
          setSearchResults([])
        });
    } else {
      console.log('Movie not found')
    }
  }

  const onSubmitMovie = async () => {
    const inputData = {
      title: movieTitle,
      location: movieLocation,
      scene_description: sceneDescription,
      movie_location_still: movieStill,
      location_image: locationImage,
      coordinates: markerPosition ? markerPosition : null,
      LikedBy: []
    };
    console.log('coordinates', markerPosition)
    console.log('marker', markerPosition)
    const newMovieToPost = { ...selectedMovie, ...inputData };

      console.log('newMovie', newMovieToPost)

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify(newMovieToPost)
      };
      try {
        const response = await fetch(`${process.env.REACT_APP_MOVIE_URL}`, options)
        const data = await response.json();
        
        if (data.success) {
          dispatch(location.actions.addMovie(data.response))
          dispatch(location.actions.updateMovieCoordinates(data.response._id, markerPosition));
          dispatch(fetchPrivateMovies(accessToken))
          setSearchValue('');
          setMarkerPosition(null)
        } else {
          console.log('data didnt fetch')
        }
      } catch (error) {
        console.log("Error:", error);
    }
    setUserInput(false)
    setSearchResults([])
    onNewMovieAdded();
  }

  const handleMovieSearch = (event) => {
    setSearchValue(event.target.value);
  };

  return markerPosition && (
    <Marker position={markerPosition}>
      <Popup style={{ margin: '0px', width: '300px' }}>
        <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
          {userInput ? null : (
              <>
                <h2>Want to add a location?</h2>
                <TextField
                  id="standard-search"
                  label="Search movie on OMDB"
                  type="search"
                  variant="standard"
                  value={(searchValue)}
                  onChange={handleMovieSearch} />
              </>
            )}
          {searchResults.length > 0 && (
            <List>
              {searchResults.slice(0, 5).map((result) => (
                <button
                  type="button"
                  onClick={() => addMovieOnClick(result.Title)}
                  key={result.imdbID}>
                  {result.Title}
                </button>
              ))}
            </List>
          )}
          {userInput && (
            <form>
              <h2>{selectedMovie.Title}</h2>
              <input type="text" value={movieLocation} onChange={(e) => setMovieLocation(e.target.value)} name="location" placeholder="Location" required />
              <input type="text" value={sceneDescription} onChange={(e) => setSceneDescription(e.target.value)} name="scene_description" placeholder="Scene Description" />
              <input type="text" value={movieStill} onChange={(e) => setMovieStill(e.target.value)} name="movie_location_still" placeholder="Movie Location Still" />
              <input type="text" value={locationImage} onChange={(e) => setLocationImage(e.target.value)} name="location-image" placeholder="Location image" />
              <button type="button" onClick={onSubmitMovie}>Post movie</button>
            </form>)}
        </Box>
      </Popup>
    </Marker>
  );
};