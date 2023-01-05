import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    count: 0
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: state => {
            state.count += 1;
        },
        decrement: state => {
            state.count -= 1;
        },
        reset: state => {
            state.count = 0;
        },
        // payload가 있는 값을 받아오는 함수
        incrementByAmount: (state, action) => {
            state.count += action.payload;
        },


    }
})

export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;


