import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_CARRIER, POSTS, ALL_POSTS, ASSIGN_DISPATCH } from '../Constants/URL'

const normalizePostsPayload = (payload) => {
    if (!payload) {
        return { rows: [], total: 0, page: 1, pageSize: 20 };
    }
    if (Array.isArray(payload)) {
        return { rows: payload, total: payload.length, page: 1, pageSize: 20 };
    }
    if (payload.rows) {
        return {
            rows: payload.rows || [],
            total: payload.total ?? payload.count ?? payload.rows.length,
            page: payload.page ?? payload.currentPage ?? 1,
            pageSize: payload.pageSize ?? payload.limit ?? 20,
            ...payload,
        };
    }
    return { rows: [payload], total: 1, page: 1, pageSize: 20 };
};

let initialState = {
    posts: { rows: [], total: 0, page: 1, pageSize: 20 },
    currentPost: {
        "trailerType": "",
        "pickupDate": "",
        "deliveryDate": "",
        "price": 0,
        "notes": "",
        "pickupLocation": {

        },
        "deliveryLocation": {

        },
        "vehicles": [

        ],
    },    // single post (for view/edit)
    loading: false,
    message: "",
    status: "",
    error: null,
    pageSize: 20,
    count: 0,
}
export const add_post = createAsyncThunk(
    "add_post",
    async (data, thunkApi) => {
        try {
            // attempt to read token from redux state, fallback to localStorage
            const state = thunkApi.getState();
            const token = state?.authentication?.token || localStorage.getItem('token');

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(data),
            };
            console.log(data, "data in add post thunk");
            const res = await fetch(POSTS, requestOptions);
            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: res.statusText }));
                return thunkApi.rejectWithValue(err.message || `Failed to create post: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            return thunkApi.rejectWithValue(error.message || 'Network error');
        }
    }
)
export const get_posts = createAsyncThunk(
    "posts/get_posts",
    async (params = {}, thunkApi) => {
        try {
            console.log(params, "params in get posts thunk");
            // attempt to read token from redux state, fallback to localStorage
            const state = thunkApi.getState();
            console.log("state in user", state)
            const token = state?.authentication?.token || localStorage.getItem('token');
            const createdbyme = state?.authentication?.user?.role === 'Shipper' ? true : false;
            const assignToMe = state?.authentication?.user?.role === 'Carrier' ? true : false;

            // Prepare request body. All filters are optional.
            const requestBody = {
                ...(params.page !== undefined && { page: params.page }),
                ...(params.pageSize !== 5 && { pageSize: params.pageSize }),
                ...({ createdByMe: createdbyme }),
                ...(params.trailerType !== undefined && { trailerType: params.trailerType }),
                ...(params.status !== undefined && { status: params.status }),
                ...({ assignToMe: assignToMe }),
                ...(params.from !== undefined && { from: params.from }),
                ...(params.to !== undefined && { to: params.to }),
                ...(params.make !== undefined && { make: params.make }),
                ...(params.model !== undefined && { model: params.model }),
                ...(params.state !== undefined && { state: params.state }),
                ...(params.year !== undefined && { year: params.year }),
            };

            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(requestBody),
            };
           console.log(requestBody, "request body in get posts thunk");
            const res = await fetch(ALL_POSTS, requestOptions);

            if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
            return await res.json();
        } catch (error) {
            return thunkApi.rejectWithValue(error.message);
        }
    }
);



export const get_post_by_id = createAsyncThunk(
    "posts/get_post_by_id",
    async (id, thunkApi) => {
        try {
            const state = thunkApi.getState();
            const token = state?.authentication?.token || localStorage.getItem('token');
            const res = await fetch(`${POSTS}/${id}`, {
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

export const update_post = createAsyncThunk(
    "posts/update_post",
    async ({ id, data }, thunkApi) => {
        try {
            const state = thunkApi.getState();
            const token = state?.authentication?.token || localStorage.getItem('token');
            console.log({ id, data, token }, "update_post payload and token");

            const body = JSON.stringify(data);
            console.log({ id, body }, "update_post request body");
            const res = await fetch(`${POSTS}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body,
            });

            if (!res.ok) {
                const rawError = await res.text().catch(() => null);
                console.error("update_post response text:", rawError);
                let err = res.statusText;
                if (rawError) {
                    try {
                        const parsed = JSON.parse(rawError);
                        err = parsed?.message?.toString() || rawError;
                    } catch (parseError) {
                        err = rawError;
                    }
                }
                return thunkApi.rejectWithValue(err || `Failed to update post: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            return thunkApi.rejectWithValue(error.message);
        }
    }
);
export const delete_post = createAsyncThunk(
    "posts/delete_post",
    async (id, thunkApi) => {
        try {
            const state = thunkApi.getState();
            const token = state?.authentication?.token || localStorage.getItem('token');
            const res = await fetch(`${POSTS}/${id}`, {
                method: "DELETE",
                
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            console.log({ id }, "delete_post request");

            if (!res.ok) throw new Error(`Failed to delete post: ${res.status}`);
            return { id }; // return deleted ID to remove it from state
        } catch (error) {
            return thunkApi.rejectWithValue(error.message);
        }
    }
);


// Assign & Carriers
export const get_carriers = createAsyncThunk(
    "get_carriers",
    async (data, thunkApi) => {
        try {
            // attempt to read token from redux state, fallback to localStorage
            const state = thunkApi.getState();
            const token = state?.authentication?.token || localStorage.getItem('token');
            console.log(data, "data in get carriers thunk");
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(data),
            };

            const res = await fetch(GET_CARRIER, requestOptions);
            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: res.statusText }));
                return thunkApi.rejectWithValue(err.message || `Failed to get carriers: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            return thunkApi.rejectWithValue(error.message || 'Network error');
        }
    }
)
export const assign_dispatch = createAsyncThunk(
    "assign_dispatch",
    async (data, thunkApi) => {
        try {
            const state = thunkApi.getState();
            const token = state?.authentication?.token || localStorage.getItem('token');
            console.log(data, "data in get carriers thunk");
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(data),
            };

            const res = await fetch(ASSIGN_DISPATCH, requestOptions);
            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: res.statusText }));
                return thunkApi.rejectWithValue(err.message || `Failed to assign dispatch: ${res.status}`);
            }

        } catch (error) {
            return thunkApi.rejectWithValue(error.message || 'Network error');
        }
    }
)

export const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        removeMessage: (state) => {
            state.message = "";
            state.status = "";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // 🟢 Add Post
        builder
            .addCase(add_post.pending, (state) => {
                state.loading = true;
                state.status = "pending";
                state.message = "";
            })
            .addCase(add_post.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "fulfilled";
                state.message = action.payload?.message || "Post created successfully";
                const newPost = action.payload?.data || action.payload;
                if (newPost) {
                    if (Array.isArray(state.posts)) {
                        state.posts.push(newPost);
                    } else if (state.posts && typeof state.posts === 'object') {
                        const rows = Array.isArray(state.posts.rows) ? state.posts.rows : [];
                        state.posts.rows = [...rows, newPost];
                        state.posts.total = (state.posts.total ?? rows.length) + 1;
                    } else {
                        state.posts = { rows: [newPost], total: 1, page: 1, pageSize: state.pageSize };
                    }
                }
            })
            .addCase(add_post.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.message = action.payload || "Failed to create post";
            });

        // 🟢 Get All Posts
        builder
            .addCase(get_posts.pending, (state) => {
                state.loading = true;
                state.status = "pending";
                console.log(state.posts, "posts in slice pending");

            })
            .addCase(get_posts.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "fulfilled";
                state.posts = normalizePostsPayload(action.payload?.data || action.payload);
                state.message = "Posts fetched successfully";
                console.log(state.posts, "posts in slice fullfillled");
            })
            .addCase(get_posts.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.message = action.payload || "Failed to fetch posts";
                console.log(state.posts, "posts in slice rejected");

            });

        // 🟢 Get Post by ID
        builder
            .addCase(get_post_by_id.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(get_post_by_id.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "fulfilled";
                state.currentPost = action.payload?.data || action.payload;
                state.message = "Post fetched successfully";
            })
            .addCase(get_post_by_id.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.message = action.payload || "Failed to fetch post details";
            });

        // 🟢 Update Post
        builder
            .addCase(update_post.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(update_post.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "fulfilled";
                const updatedPost = action.payload?.data || action.payload;
                if (state.posts && Array.isArray(state.posts)) {
                    state.posts = state.posts.map((p) =>
                        p.id === updatedPost.id ? updatedPost : p
                    );
                } else if (state.posts && typeof state.posts === 'object') {
                    const rows = Array.isArray(state.posts.rows) ? state.posts.rows : [];
                    state.posts.rows = rows.map((p) =>
                        p.id === updatedPost.id ? updatedPost : p
                    );
                }
                if (state.currentPost?.id === updatedPost.id) {
                    state.currentPost = updatedPost;
                }
                state.message = "Post updated successfully";
                console.log(action.payload, "update post fulfilled in slice");
            })
            .addCase(update_post.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.message = action.payload || "Failed to update post";
                console.log(action.payload, "update post rejected in slice");
            });

        // 🟢 Delete Post
        builder
            .addCase(delete_post.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(delete_post.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "fulfilled";
                if (state.posts && Array.isArray(state.posts)) {
                    state.posts = state.posts.filter((p) => p.id !== action.payload.id);
                } else if (state.posts && typeof state.posts === 'object') {
                    const rows = Array.isArray(state.posts.rows) ? state.posts.rows : [];
                    state.posts.rows = rows.filter((p) => p.id !== action.payload.id);
                    state.posts.total = Math.max(0, (state.posts.total ?? rows.length) - 1);
                }
                state.message = "Post deleted successfully";
            })
            .addCase(delete_post.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.message = action.payload || "Failed to delete post";
            });
        builder
            .addCase(get_carriers.pending, (state) => {
                state.loading = true;
                state.status = "pending";
                state.message = "";
            })
            .addCase(get_carriers.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "fulfilled";
                state.message = action.payload?.message || "Carriers fetched successfully";
                if (action.payload?.data) {
                    state.carriers = action.payload.data;
                }
            })
            .addCase(get_carriers.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.message = action.payload || "Failed to get carriers";
            });
        builder
            .addCase(assign_dispatch.pending, (state) => {
                state.loading = true;
                state.status = "pending";
                state.message = "";
            })
            .addCase(assign_dispatch.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "fulfilled";
                state.message = action.payload?.message || "Dispatcher assigned successfully";
                console.log(action.payload,"assign dispatch suxess")
                // Optionally update the currentPost if needed
                if (state.currentPost) {
                    // Assuming the API returns updated post data or we can set status
                    // state.currentPost.status = 'assigned'; // Uncomment if needed
                }
            })
            .addCase(assign_dispatch.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                console.log(action.payload,"assign dispatch rejected")

                state.message = action.payload || "Failed to assign dispatcher";
            });
    },
});

export const { removeMessage } = postsSlice.actions;
export default postsSlice.reducer;