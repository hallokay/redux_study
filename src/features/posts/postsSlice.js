import {
  createSelector,
  createEntityAdapter, //정규화
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

// 정규화
const postsAdapter = createEntityAdapter({
  sertComparer: (a, b) => b.date.localeCompare(a.date),
});
//정규화시 state!
const initialState = postsAdapter.getInitialState();

// index에서 dispatch로 불러와야할 기본
export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      //결과값 정렬방식
      transformResponse: (res) => {
        let min = 1;
        const loadedPosts = res.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min }).toISOString();
          if (!post?.reations)
            post.reations = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        // 기본 값을 loadedPosts로 모두 세팅한다.
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => [
        { type: "Post", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),
    // 유저아이디로 게시물 가져오기(읽기전용이라 query)
    getPostsByUserId: builder.query({
      query: (id) => `/posts/?userId=${id}`,
      //  읽어올 데이터를 어떻게 보여줄지
      transformResponse: (resData) => {
        let min = 1;
        const loadedPosts = resData.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reations)
            post.reations = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => {
        console.log("getPostsByUserId result", result);
        return [...result.ids.map((id) => ({ type: "Post", id }))];
      },
    }),
    //게시물 추가(쓰기전용- mutation)
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reations: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    //업데이트 수정
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
    // 삭제
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
    // 리액션 추가
    addReaction: builder.mutation({
      query: ({postId, reactions}) => ({
        url: `post/${postId}`,
        method: 'PATCH',
        body: {reactions}
      }),
      async onQueryStarted({postId, reactions}, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
            const post = draft.entities[postId]
            if(post) post.reations = reactions
          })
        )

        try {
          await queryFulfilled
        } catch (error) {
          // 에러가 나면 실행하지 않는다.
          patchResult.undo();
        }
      

      }

    })
  }),
});

// postList 페이지에서 사용할 때
export const {
  useGetPostQuery,
  usegetPostsByUserIdQuery,
  useAddNewPostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useAddReactionMutation
} = extendedApiSlice;

//return the query result object
export const selectPostResult = extendedApiSlice.endpoints.getPosts.select();

//Creates memoized select     createSelector(inputFn, outputFn)
const selectPostData = createSelector(
  selectPostResult,
  (postsResult) => postsResult.data //normalized state ob with ids & entities
);

export const {
  // 모든 내용
  selectAll: selectAllPosts,
  // 아이디로 찾기
  selectById: selectPostById,
  // 모든 아이디 선택
  selectIds: selectPostIds,
  //pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors((state) => selectPostData(state) ?? initialState);
