// import Counter from './features/counter/Counter';
import PostList from './features/posts/PostList';
import AddPostForm from './features/posts/AddPostForm';
import SinglePostPage from './features/posts/SinglePostPage';
import Layout from './components/Layout';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/' element={ <Layout/> } >
        {/* 레이아웃안에 들어갈 하위페이지중 기본 */}
        <Route index element={ <PostList /> }/>

        <Route path='post'>
          <Route index element={<AddPostForm/>}/>
          <Route path=":postId" element={<SinglePostPage/>} />
        </Route>
      </Route>


    </Routes>
  );
}

export default App;
