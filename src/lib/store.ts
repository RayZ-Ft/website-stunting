import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux"
import tensorStateReducer from "./features/tensor-state/tensor-state"


export const store = () => {
    return configureStore({
        reducer: {
            tensorStateReducer
        }
    })
}

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector