import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import * as tfjs from "@tensorflow/tfjs"
import { TrainTestTensor } from "@/lib/models/TrainTestTensor";

const initialState: {
    value: TrainTestTensor;
} = {
    value: {
        testTensor: {
            x: tfjs.tensor([]),
            y: tfjs.tensor([])
        },
        trainTensor: {
            x: tfjs.tensor([]),
            y: tfjs.tensor([])
        }
    }
};

export const tensorState = createSlice({
    name: "tensor-state",
    initialState,
    reducers: {
        convertToTensor: (state, action: PayloadAction<TrainTestTensor>) => {
            return {
                value: {
                    testTensor: {
                        x: action.payload.testTensor.x,
                        y: action.payload.testTensor.y
                    },
                    trainTensor: {
                        x: action.payload.trainTensor.x,
                        y: action.payload.trainTensor.y
                    }
                }
            }
        }
    }
})

export const { convertToTensor } = tensorState.actions;
export default tensorState.reducer;