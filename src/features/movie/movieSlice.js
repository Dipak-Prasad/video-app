import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recommend: null,
  newRelease: null,
  watchMovies: null,
  watchlist: null,
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setMovies: (state, action) => {
      state.recommend = action.payload.recommend;
      state.newRelease = action.payload.newRelease;
      state.watchMovies = action.payload.watchMovies;
      state.watchlist = action.payload.watchlist;
    },
  },
});

export const { setMovies } = movieSlice.actions;

export const selectRecommend = (state) => state.movie.recommend;
export const selectNewRelease = (state) => state.movie.newRelease;
export const selectWatchMovies = (state) => state.movie.watchMovies;
export const selectWatchlist = (state) => state.movie.watchlist;

export default movieSlice.reducer;