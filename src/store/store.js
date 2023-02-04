import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import  counterReducer  from "../features/counter/counterSlice";
import usersReducer from '../features/users/usersSlice'
import { apiSlice } from "../features/api/apiSlice";
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});