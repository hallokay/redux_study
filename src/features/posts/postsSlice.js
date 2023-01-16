import { 
    createSlice, 
    createAsyncThunk, 
    createSelector,
    createEntityAdapter //정규화
} from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
// 정규화
const postsAdapter = createEntityAdapter({
    sertComparer: (a, b) => b.date.localeCompare(a.date)
})
//정규화시 state!
const initialState =  postsAdapter.getInitialState({
//     posts: [], 이거는 자동적으로 설정됨
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    count: 0
})

// state! 
// const initialState = {
//     posts: [],
//     status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
//     error: null,
//     count: 0
// }

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

export const updatePost = createAsyncThunk('posts/updatePost', async(initialPost) => {
    const { id } = initialPost;

    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
        return response.data;
    } catch (err) {
        // return err.message;
        return initialPost; // test 할떄만! 
    }
} )

export const deletePost = createAsyncThunk('posts/deletePost', async( initialPost ) => {
    const { id } = initialPost;

    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if(response?.status === 200 ) return initialPost;
      return `${response?.status} : ${response?.statusText}`
       } catch (err) {
      return err.message;
    }
})

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // 게시물 추가
        // postAdded: {
        //     reducer(state, action) {
        //         state.posts.push(action.payload)
        //     },
        //     prepare(title, content, userId) {
        //         return {
        //             payload: {
        //                 id: nanoid(),
        //                 title,
        //                 content,
        //                 date: new Date().toISOString(),
        //                 userId,
        //                 reactions: {
        //                     thumbsUp: 0,
        //                     wow: 0,
        //                     heart: 0,
        //                     rocket: 0,
        //                     coffee: 0
        //                 }
        //             }
        //         }
        //     }
        // },
        reactionAdded(state, action) {
          // console.log('click');
          const { postId, reaction } = action.payload;
          //정규화
          const existingPost = state.entities[postId]

          // const existingPost = state.posts.find(post => post.id === postId)
          if (existingPost) {
            existingPost.reactions[reaction]++;
          }
        },
        increseCount(state, action) {
            state.count = state.count + 1 
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
            // state.posts = state.posts.concat(loadedPosts)
        
            //정규화
            postsAdapter.upsertMany(state, loadedPosts);
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
        //   state.posts.push(action.payload)
         //정규화
         postsAdapter.addOne(state, action.payload)
        })
        .addCase(updatePost.fulfilled, (state, action) => {
            if(!action.payload?.id) {
                return;
            }
            // const { id } = action.payload;
            action.payload.date = new Date().toISOString();
            // const posts = state.posts.filter(post => post.id !== id);
            // state.posts = [...posts, action.payload];
            postsAdapter.upsertOne(state, action.payload);
        })
        .addCase(deletePost.fulfilled, (state, action) => {
            if(!action.payload?.id) {
                return;
            }
            const { id } = action.payload;
            // const posts = state.posts.filter(post => post.id !== id);
            // state.posts = posts;
            postsAdapter.removeOne(state, id)
        })
 
    }
})

export const {
    // 모든 내용
    selectAll: selectAllPosts,
    // 아이디로 찾기
    selectById: selectPostById,
    // 모든 아이디 선택
    selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)
// 처음 모든 포스트를 다 보여주는거 
// export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = state => state.posts.status;
export const getPostsError = state => state.posts.error;
export const getCount = state => state.posts.count;

// 포스트 아이디로 게시물 찾기
// export const selectPostById = (state, postId) => {
//    return state.posts.posts.find((post) => post.id === postId);
// }
// header에서 count를 누를때마다 리렌더되는데 userPage에서 전체 게시물 불러오기가 과부하옴
// 이렇게 따로 불러와주면 헤더가 바뀌어도 과부하 안옴
export const selectPostByUsers = createSelector([selectAllPosts, (state, userId) => userId],
(posts, userId) => posts.filter(post => post.userId === userId))

//이렇게 써도 무방dispatch시에는 dispatch(postsActions.increseCount())
// export postsActions = postSlice.actions

export const { increseCount, reactionAdded } = postSlice.actions;
export default postSlice.reducer;