import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { submitPoint, PointSubmitData, PointSubmitResponse } from "./PointFormAPI";
// import { PointRow } from "../resultTable/ResultTableAPI";
import { RootState } from "../../app/store";
import { addPoint } from "../resultTable/ResultTableSlice";

interface PointFormState {
  x: number | null;
  y: number | null;
  r: number | null;

  xError: string;
  yError: string;
  rError: string;
  formError: string;

  xTouched: boolean;
  yTouched: boolean;
  rTouched: boolean;

  loading: boolean;
}

const initialState: PointFormState = {
  x: null,
  y: null,
  r: null,
  xError: "",
  yError: "",
  rError: "",
  formError: "",
  xTouched: false,
  yTouched: false,
  rTouched: false,
  loading: false,
};

const validateX = (x: number | null): string => {
  if (x === null) 
    return "Выберите значение X";
  if (x < -3 || x > 5) 
    return "X должен быть в диапазоне [-3, 5]";
  return "";
};

const validateY = (y: number | null): string => {
  if (y === null) 
    return "Введите значение Y";
  if (y < -5 || y > 3) 
    return "Y должен быть в диапазоне (-5, 3)";
  return "";
};

const validateR = (r: number | null): string => {
  if (r === null) return "Выберите значение R";
  if (r < 1 || r > 5) return "R должен быть в диапазоне (1, 5)";
  return "";
};

export const sendPoint = createAsyncThunk(
  "pointForm/sendPoint",
  async (data: PointSubmitData, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (!token) {
      return rejectWithValue("Не авторизован");
    }

    const response = await submitPoint(data, token);
    if (response.error) {
      return rejectWithValue(response.error);
    }

    if (response.newPoint) {
      dispatch(addPoint(response.newPoint)); 
    }

    return response.newPoint;
  }
);

export const sendPointFromGraph = createAsyncThunk(
  "pointForm/sendPointFromGraph",
  async (data: PointSubmitData, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (!token) {
      return rejectWithValue("Не авторизован");
    }

    const response = await submitPoint({ ...data, fromGraph: true }, token!);
    if (response.error) {
      return rejectWithValue(response.error);
    }

    if (response.newPoint) {
      dispatch(addPoint(response.newPoint)); 
    }
    return response.newPoint;
  }
);

const pointFormSlice = createSlice({
  name: "pointForm",
  initialState,
  reducers: {
    setX: (state, action: PayloadAction<number>) => {
      state.xTouched = true;
      state.x = action.payload;
      state.xError = validateX(action.payload);
      state.formError = "";
    },
    setY: (state, action: PayloadAction<number | null>) => {
      state.yTouched = true;
      state.y = action.payload;
      state.yError = state.yTouched ? validateY(action.payload) : "";
      state.formError = "";
    },
    setR: (state, action: PayloadAction<number>) => {
      state.r = action.payload;
      state.rTouched = true;
      state.rError = state.rTouched ? validateR(action.payload) : "";
      state.formError = "";
    },
    validateAll(state) {
      state.xTouched = true;
      state.yTouched = true;
      state.rTouched = true;
      state.xError = validateX(state.x);
      state.yError = validateY(state.y);
      state.rError = validateR(state.r);
    },
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendPoint.pending, (state) => {
        state.loading = true;
        state.formError = "";
      })
      .addCase(sendPoint.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendPoint.rejected, (state, action) => {
        state.loading = false;
        state.formError = action.payload as string;
      })
      .addCase(sendPointFromGraph.rejected, (state, action) => {
        state.formError = action.payload as string;
      })
      .addCase(sendPointFromGraph.fulfilled, (state) => {
        state.formError = "";
      });
  },
});

export const { setX, setY, setR, validateAll, resetForm } = pointFormSlice.actions;

export const selectPointForm = (state: RootState) => state.pointForm;

export default pointFormSlice.reducer;