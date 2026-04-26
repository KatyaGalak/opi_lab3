import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchPoints, PointRow, clearPointsApi } from "./ResultTableAPI";
import { RootState } from "../../app/store";

interface ResultTableState {
  points: PointRow[];
  loading: boolean;
  error: string | null;
}

const initialState: ResultTableState = {
  points: [],
  loading: false,
  error: null,
};

export const loadPoints = createAsyncThunk(
  "resultTable/loadPoints",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    console.log('[loadPoints] Token:', token);
    if (!token) {
      return rejectWithValue("Не авторизован");
    }

    const response = await fetchPoints(token);
    if (response.error) {
      return rejectWithValue(response.error);
    }
    return response.points;
  }
);

export const clearPointsAsync = createAsyncThunk(
  "resultTable/clearPointsAsync",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (!token) return rejectWithValue("Не авторизован");

    const result = await clearPointsApi(token);
    if (result.success) {
      dispatch(clearPoints()); 
      return true;
    } else {
      return rejectWithValue(result.error);
    }
  }
);

const resultTableSlice = createSlice({
  name: "resultTable",
  initialState,
  reducers: {

    addPoint: (state, action: PayloadAction<PointRow>) => {
      state.points.unshift(action.payload);
    },

    clearPoints: (state) => {
      state.points = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPoints.fulfilled, (state, action: PayloadAction<PointRow[]>) => {
        state.loading = false;
        state.points = action.payload;
      })
      .addCase(loadPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addPoint, clearPoints } = resultTableSlice.actions;

export const selectResultTable = (state: RootState) => state.resultTable;

export default resultTableSlice.reducer;