import { Link } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux';
// import { increseCount, getCount } from '../features/posts/postsSlice';
const Header = () => {

  return (
    <header>
      <h1 className="Header">Redux</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="post">Post</Link>
          </li>
          <li>
            <Link to="user">Users</Link>
          </li>
        </ul>
        {/* <button
          onClick={() => {
            dispatch(increseCount());
          }}>
          {count}
        </button> */}
      </nav>
    </header>
  );
}

export default Header