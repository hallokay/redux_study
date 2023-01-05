import { useSelector } from "react-redux";
import { selectAllusers } from "../users/usersSlice";


const PostAuthor = ({userId}) => {
    const users = useSelector(selectAllusers);
    const author = users.find(user => user.id === userId);
  return (
    <span> By {author ? author.name : 'Unknown Author'}</span>
  )
}

export default PostAuthor