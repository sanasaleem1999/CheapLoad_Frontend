import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { REGISTRATION, LOGIN,GET_PROFILE ,VERIFY_OTP, UPDATE_PASSWORD} from '../Constants/URL'
import { getStoredUser } from '../utils/storage'

let initialState = {
    loading: false,
    status: "",
    message: "",
    user: getStoredUser(),
    token: localStorage.getItem('token') || null,
}

export const register_user = createAsyncThunk(
    "register_user",
    async (data, thunkApi) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        const res = await fetch(REGISTRATION, requestOptions)
        const payload = await res.json();

        if (!res.ok) {
            return thunkApi.rejectWithValue(payload);
        }

        return payload;
    }
)
// VERIFY OTP
export const verify_otp = createAsyncThunk(
    "verify_otp",
    async (data, thunkApi) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        const res = await fetch(VERIFY_OTP, requestOptions)
        const payload = await res.json();

        if (!res.ok) {
            return thunkApi.rejectWithValue(payload);
        }

        return payload;
    }
)

export const update_password = createAsyncThunk(
    "update_password",
    async (data, thunkApi) => {
        const state = thunkApi.getState();
        const token = state?.authentication?.token || localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(data)
        };
        const res = await fetch(UPDATE_PASSWORD, requestOptions)
        const payload = await res.json();

        if (!res.ok) {
            return thunkApi.rejectWithValue(payload);
        }

        return payload;
    }
)
// Get My Info 
export const get_mydetails = createAsyncThunk(
    "get_my_info",
    async (params = {}, thunkApi) => {
        try {
             const state = thunkApi.getState();
            const token = state?.authentication?.token || localStorage.getItem('token');
            console.log("Token:", token);
            // Build query string dynamically
            const queryString = new URLSearchParams(
                Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")
            ).toString();

            const url = `${GET_PROFILE}?${queryString}`;
            console.log("Fetching:", url);

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
            return await res.json();
        } catch (error) {
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

// Login User

export const login_user = createAsyncThunk(
    "login_user",
    async (data, thunkApi) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        const res = await fetch(LOGIN, requestOptions)
        return res.json();
    }
)

export const authSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        removeMessage: (state, action) => {
            state.message = ""
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }


    },
    extraReducers: (builder) => {
        builder.addCase(register_user.pending, (state) => {
            state.loading = true;
            state.message = "";
            state.status = "pending";
        });

        builder.addCase(register_user.fulfilled, (state, action) => {
            console.log(action.payload, "Action Payload==FullFilled")
            state.loading = false;

            state.message = action.payload.message || "User created successfully";
            state.status = "fulfilled";

        });

        builder.addCase(register_user.rejected, (state, action) => {
            console.log(action.payload, "Action Payload--Rejected")
            state.loading = false;
            state.message = "Unable to process request, try again later.";
            state.status = "rejected";
        });
        builder.addCase(login_user.pending, (state, action) => {

        })
        builder.addCase(login_user.fulfilled, (state, action) => {
            console.log("Fullfilled", action.payload)
            const payload = action.payload || {};
            // On initial login we expect an OTP step; do not persist token here.
            // Save user info if provided, but keep token null until OTP verification.
            if (!payload && !payload.message) {
                state.message = "Unable To Process Request Atm,Try Again Later";
                state.status = 'rejected';
            } else {
                state.user = payload.user ? { ...payload.user } : state.user;
                if (payload.user) localStorage.setItem('user', JSON.stringify(payload.user));
                state.message = payload.message || "OTP sent for verification";
                state.status = 'fulfilled';
            }

        })
        builder.addCase(login_user.rejected, (state, action) => {
            console.log("Rejected", action.payload)
            if (action.payload == undefined) {
                state.message = "Unable To Process Request Atm,Try Again Later"
                state.status = 'rejected'
            }

        })
        // VERIFY OTP reducers
        builder.addCase(verify_otp.pending, (state) => {
            state.loading = true;
            state.message = "";
            state.status = "pending";
        });

        builder.addCase(verify_otp.fulfilled, (state, action) => {
            state.loading = false;
            const payload = action.payload || {};
            const accessToken = payload.accessToken || payload.token || null;
            if (accessToken) {
                state.token = accessToken;
                if (payload.user) state.user = { ...payload.user };
                try {
                    localStorage.setItem('token', accessToken);
                    if (payload.user) localStorage.setItem('user', JSON.stringify(payload.user));
                } catch (err) {
                    console.log('LocalStorage error:', err);
                }
                state.message = payload.message || 'OTP verified';
                state.status = 'fulfilled';
            } else {
                state.message = payload.message || 'Unable to verify OTP';
                state.status = 'rejected';
            }
        });

        builder.addCase(verify_otp.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload?.message || 'OTP verification failed';
            state.status = 'rejected';
        });

        builder.addCase(update_password.pending, (state) => {
            state.loading = true;
            state.message = "";
            state.status = "pending";
        });

        builder.addCase(update_password.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload?.message || 'Password updated successfully';
            state.status = 'fulfilled';
        });

        builder.addCase(update_password.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload?.message || 'Unable to update password, try again later.';
            state.status = 'rejected';
        });
    }
})

export const { removeMessage, logout } = authSlice.actions