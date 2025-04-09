import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./../pages/HomeTemplates/HomePage/slice"
import listUserReducer from "../pages/AdminTemplates/UserPage/slice"
import authReducer from "./../pages/AdminTemplates/AuthPage/slice"
import courseForAdminReducer from './../pages/AdminTemplates/CoursePage/slice'
import registerCourseReducer from './../pages/AdminTemplates/Register/slice'
const store = configureStore({
    reducer: {
        courseReducer,
        authReducer,
        listUserReducer,
        courseForAdminReducer,
        registerCourseReducer,
    },
    devTools: true,
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store;