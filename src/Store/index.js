
import { configureStore } from "@reduxjs/toolkit";
// import { themeSlice } from "./themeReducer";
import { authSlice } from "./authenticationReducer";
import chatReducer from "./chatReducer";
import postsSlice from "./postReducer";
import { userSlice } from "./userReducer";
// import { catSlice } from "./CategoriesReducer";


export const Store=configureStore({   //setup and configure Store
    reducer:{
        // define whatever you want to define here 
        authentication:authSlice.reducer,
        posts: postsSlice,
        chat: chatReducer,
        user:userSlice.reducer
    }
})
