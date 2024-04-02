import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    name: "",
    email: "",
    photo: ""
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // SIGN IN - User creds are stored
        setUserLoginDetails: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.photo = action.payload.photo;
        },

        // SIGN OUT - User creds are removed
        setSignOutState: state => {
            state.id = null;
            state.name = null;
            state.email = null;
            state.photo = null;
        }
    }
});

export const { setUserLoginDetails, setSignOutState } = userSlice.actions;

export const selectUID = state => state.user.id;
export const selectUserName = state => state.user.name;
export const selectUserEmail = state => state.user.email;
export const selectUserPhoto = state => state.user.photo;

export default userSlice.reducer;