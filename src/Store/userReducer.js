import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_USER } from '../Constants/URL'

let initialState = {
    loading: false,
    status: "",
    message: "",
    userInfo: null,
}

export const get_user_info = createAsyncThunk(
    "get_user_info",
    async (id, thunkApi) => {
        try {
            const state = thunkApi.getState();
            const token = state?.authentication?.token || localStorage.getItem('token');
            const res = await fetch(`${GET_USER}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
            return await res.json();
        } catch (error) {
            return thunkApi.rejectWithValue(error.message);
        }
    }
);
// UPDATE API
export const update_user = createAsyncThunk(
    "update_user",
    async (data, thunkApi) => {
        try {
            const state = thunkApi.getState();
            const token = state?.authentication?.token || localStorage.getItem('token');
            const res = await fetch(`${GET_USER}/${data.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    
                },
                body: JSON.stringify(data), // Example update data
            });

            if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
            return await res.json();
        } catch (error) {
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState,
    extraReducers: (builder) => {
        // 🟢 Add Post
        builder
            .addCase(get_user_info.pending, (state) => {
                state.loading = true;
                state.status = "pending";
                state.message = "";
            })
            .addCase(get_user_info.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "fulfilled";
                state.message = action.payload?.message || "User info fetched successfully";
                if (action.payload?.data) {
                    state.userInfo = action.payload.data;
                }
                console.log(action.payload, "User Info Payload success");
            })
            .addCase(get_user_info.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.message = action.payload || "Failed to fetch user info";
                console.log(action.payload, "User Info Payload rejected");

            });
              builder
            .addCase(update_user.pending, (state) => {
                state.loading = true;
                state.status = "pending";
                state.message = "";
            })
            .addCase(update_user.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "fulfilled";
                state.message = action.payload?.message || "User info updated successfully";
                if (action.payload?.data) {
                    state.userInfo = action.payload.data;
                }
                console.log(action.payload, "User Info Payload success");
            })
            .addCase(update_user.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.message = action.payload || "Failed to update user info";
                console.log(action.payload, "User Info Payload rejected");

            });
    },
});

// export const { removeMessage } = userSlice.actions;
export default userSlice.reducer;  