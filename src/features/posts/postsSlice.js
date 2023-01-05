import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
// state!
const initialState = {
    posts: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

// async 로 fetch 하기 
// 아래createAsyncThunk 에서 pending / fulfilled / rejected써줘서 try catch안씀
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {

    const response = await axios.get(POSTS_URL);
    console.log(response);
    return response.data
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async(initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data;
});

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // 게시물 추가
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded(state, action) {
            console.log('click');
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
    // 빌드할때 실행해주는거
    extraReducers(builder) {
        builder
        .addCase(fetchPosts.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
             state.status = 'succeeded'
            //  이거 해줘야 strict 모드로 두번 호출될때 데이터 한번만 생김
             state.posts = []
            //  날짜와 반응(리액션)추가
            let min = 1;
            const loadedPosts = action.payload.map( post => {
                post.date = sub(new Date(), { minutes: min++ }).toISOString()
                post.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                return post;
            
            })
            // 이미 데이터가 있는 것들 불러와서 끼워넣기
            // Add any fetched posts to the array
            state.posts = state.posts.concat(loadedPosts)
        })
        .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message

        })
        .addCase(addNewPost.fulfilled, (state, action) => {
          action.payload.userId = Number(action.payload.userId)
          action.payload.date = new Date().toISOString();
          action.payload.reactions = {
                thumbsUp: 0,
                wow: 0,
                heart: 0,
                rocket: 0,
                coffee: 0
          }
          console.log(action.payload);
          state.posts.push(action.payload)
        })
 
    }
})

// 처음 모든 포스트를 다 보여주는거 
export const allPosts = state => state.posts.posts;
export const getPostsStatus = state => state.posts.status;
export const getPostsError = state => state.posts.error;

// 포스트 아이디로 게시물 찾기
export const selectPostById = (state, postId) => {
    state.posts.posts.find(post => post.id === postId);
}


export const { postAdded, reactionAdded } = postSlice.actions;
export default postSlice.reducer;