// import { useDispatch } from "react-redux"
// import { reactionAdded } from "./postsSlice"
import { useAddReactionMutation } from "./postsSlice"
const reactionEmoji = {
    thumbsUp: '👍',
    wow: '😮',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕'
}

const ReactionButtons = ({post}) => {
  const [addReaction] = useAddReactionMutation();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
        <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() =>{
            const newVal = post.reactions[name] + 1;
            reactionAdded({ postId: post.id, reactions: {...post.reactions, [name]: newVal}})
        }}
    >
        {emoji} {post.reactions[name]}
    </button>
    )
  })
  
 
   return <div>{reactionButtons}</div>
}

export default ReactionButtons