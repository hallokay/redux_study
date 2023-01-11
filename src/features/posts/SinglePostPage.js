import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactButtons from './ReactionButtons';

import { useParams, Link } from "react-router-dom";

const SinglePostPage = () => {

    const { postId } = useParams();
    const post = useSelector((state) => selectPostById(state, Number(postId)));

    // 게시물이 없는 상황
    if(!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }
    return (
        <article>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p className="postCredit">
                <Link to={`/post/edit/${post.id}`}>Edit</Link> 
                <PostAuthor userId={post.userId}/> 
                <TimeAgo timestamp={post.date}/>
            </p>
            <ReactButtons post={post}/>
        </article>
    )
    }
 


export default SinglePostPage