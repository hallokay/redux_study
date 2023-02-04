import { useSelector } from "react-redux";
import { selectPostIds, useGetPostQuery } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";


const PostsList = () => {
    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostQuery();
    const orderedPostIds = useSelector(selectPostIds);

    let content;
    if (postStatus === 'loading') {
        content = <p>"Loading..."</p>;
    } else if (postStatus === 'succeeded') {
        content = orderedPostIds.map( postId => <PostsExcerpt key={postId} postId={postId} />)
    } else if (postStatus === 'failed') {
        content = <p>{error}</p>;
    }

    return (
        <section>
            {content}
        </section>
    )
}
export default PostsList