import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { fetchPosts } from "./features/posts/postsSlice";
import { fetchUsers } from './features/users/usersSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

store.dispatch(fetchPosts());
store.dispatch(fetchUsers());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 리덕스 저장소 */}
    <Provider store={store}>
    {/* 라우터 */}
      <Router>
        <Routes>
          <Route path="/*" element={ <App /> }/>
        </Routes>
      </Router>

    </Provider>
   </React.StrictMode>,
  document.getElementById('root')

);
