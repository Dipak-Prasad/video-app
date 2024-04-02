import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice';
import movieReducer from "../features/movie/movieSlice";

// Including reducers in the STORE
export default configureStore({
    reducer: {
        user: userReducer,
        movie: movieReducer
    }
});