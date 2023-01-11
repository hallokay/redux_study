// import Counter from './features/counter/Counter';
import PostList from './features/posts/PostList';
import AddPostForm from './features/posts/AddPostForm';
import SinglePostPage from './features/posts/SinglePostPage';
import EditPostForm from './features/posts/EditPostForm';
import Layout from './components/Layout';
import UsersList from './features/users/UsersList';
import UserPage from './features/users/userPage';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>
        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>

        {/* 에러일때 기본 페이지로 보내줌 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
