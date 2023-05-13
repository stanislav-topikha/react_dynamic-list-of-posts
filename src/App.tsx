import React, { useEffect, useState } from 'react';
import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import classNames from 'classnames';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { client } from './utils/fetchClient';
import { User } from './types/User';
import { Post } from './types/Post';
import { Comment, CommentData } from './types/Comment';

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [userPosts, setUserPosts] = useState<Post[]>();
  const [selectedPost, setSelectedPost] = useState<Post>();
  const [selectedPostComments, setSelectedPostComments] = useState<Comment[]>();
  const [error, setError] = useState<string>();

  const setLoadingCursor = () => {
    document.body.style.cursor = 'wait';
  };

  const setDefaultCursor = () => {
    document.body.style.cursor = 'default';
  };

  const showError = (e: unknown) => {
    const tmpError = e instanceof Error
      ? e.message
      : 'Something went wrong!';

    setError(tmpError);
    setTimeout(() => setError(undefined), 2000);
  };

  const getUsers = async () => {
    setLoadingCursor();

    try {
      const tmpUsers = await client.get<User[]>('/users');

      setUsers(tmpUsers);
    } catch (e) {
      showError(e);
    }

    setDefaultCursor();
  };

  const getPosts = async (userId: number) => {
    setLoadingCursor();

    try {
      const tmpPosts = await client.get<Post[]>(`/posts?userId=${userId}`);

      setUserPosts(tmpPosts);
    } catch (e) {
      showError(e);
    }

    setDefaultCursor();
  };

  const getPostComments = async (postId: number) => {
    setLoadingCursor();

    try {
      const tmpComments = await client.get<Comment[]>(`/comments?postId=${postId}`);

      setSelectedPostComments(tmpComments);
    } catch (e) {
      showError(e);
    }

    setDefaultCursor();
  };

  const deleteComment = async (commentId: number) => {
    setLoadingCursor();

    if (!selectedPost) {
      return;
    }

    try {
      await client.delete(`/comments/${commentId}`);
      await getPostComments(selectedPost.id);
    } catch (e) {
      showError(e);
    }

    setDefaultCursor();
  };

  const addComment = async (data: CommentData) => {
    setLoadingCursor();

    if (!selectedPost) {
      return;
    }

    try {
      await client.post('/comments', {
        postId: selectedPost.id,
        ...data,
      });

      await getPostComments(selectedPost.id);
    } catch (e) {
      showError(e);
    }

    setDefaultCursor();
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    setUserPosts(undefined);
    setSelectedPost(undefined);

    if (!selectedUser) {
      return;
    }

    getPosts(selectedUser.id);
  }, [selectedUser]);

  useEffect(() => {
    setSelectedPostComments(undefined);

    if (!selectedPost) {
      return;
    }

    getPostComments(selectedPost.id);
  }, [selectedPost]);

  return (
    <main className="section">
      <div className="container">
        {error && (
          <div
            className="notification is-danger"
            data-cy="PostsLoadingError"
          >
            {error}
          </div>
        )}

        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                {users && (
                  <UserSelector
                    users={users}
                    selectedUser={selectedUser}
                    onUserSelect={(user) => setSelectedUser(user)}
                  />
                )}
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">
                    No user selected
                  </p>
                )}

                {userPosts && userPosts.length > 0 && (
                  <PostsList
                    posts={userPosts}
                    selectedPost={selectedPost}
                    onPostSelect={setSelectedPost}
                  />
                )}

                {userPosts && !userPosts.length && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedPost && (
            <div
              data-cy="Sidebar"
              className={classNames(
                'tile',
                'is-parent',
                'is-8-desktop',
                'Sidebar',
                'Sidebar--open',
              )}
            >
              <div className="tile is-child box is-success ">
                <PostDetails
                  post={selectedPost}
                  postComments={selectedPostComments}
                  onCommentDelete={deleteComment}
                  onCommentAdd={addComment}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
};
