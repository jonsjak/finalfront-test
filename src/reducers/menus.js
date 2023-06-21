/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

const menus = createSlice({
  name: 'menus',
  initialState: {
    filter: false,
    personal: false,
    login: false,
    register: false,
    about: false,
    isMapClickable: false,
    movieCardHidden: false,
    headerMenuShowing: true,
  },
  reducers: {
    // Not used
    toggleFilter: (store, action) => {
      store.filter = action.payload;
    },
    // Not used
    togglePersonalPage: (store, action) => {
      store.personal = action.payload;
      },
    toggleLoginPage: (store, action) => {
      store.login = action.payload;
    },
    toggleRegisterPage: (store, action) => {
      store.register = action.payload;
    },
    toggleAboutPage: (store, action) => {
      store.about = action.payload;
    },
    toggleMapClicker: (store, action) => {
      store.isMapClickable = action.payload;
    },
    toggleMoviePopup: (store, action) => {
      store.movieCardHidden = action.payload;
    },
    toggleHeaderMenu: (store, action) => {
      store.headerMenuShowing = action.payload;
    },
    }
  }
);

export default menus;