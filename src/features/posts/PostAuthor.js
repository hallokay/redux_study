import { useSelector } from "react-redux";
import { selectAllusers } from "../users/usersSlice";
import { Link } from "react-router-dom";

const PostAuthor = ({userId}) => {
    const users = useSelector(selectAllusers);
    const author = users.find(user => user.id === userId);
  return (
    <span> By {author 
      ? <Link to={`/user/${userId}`}>{author.name}</Link>
      : 'Unknown Author'}</span>
  )
}

export default PostAuthor