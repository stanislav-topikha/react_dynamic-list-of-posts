import React, { useState } from 'react';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { Comment, CommentData } from '../types/Comment';

interface Props {
  post: Post
  postComments: Comment[] | undefined
  onCommentDelete: (id: number) => void
  onCommentAdd: (comment: CommentData) => void
}

export const PostDetails: React.FC<Props> = ({
  post,
  postComments,
  onCommentDelete,
  onCommentAdd,
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">
            {`#${post.id}: ${post.title}`}
          </h2>

          <p data-cy="PostBody">
            {post.body}
          </p>
        </div>

        <div className="block">
          {postComments && !postComments.length && (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          )}

          {postComments && Boolean(postComments.length) && (
            [(<p className="title is-4">Comments:</p>),
              ...postComments.map((comment) => (
                <article
                  className="message is-small"
                  data-cy="Comment"
                  key={comment.id}
                >
                  <div className="message-header">
                    <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                      {comment.name}
                    </a>
                    <button
                      data-cy="CommentDelete"
                      type="button"
                      className="delete is-small"
                      aria-label="delete"
                      onClick={() => onCommentDelete(comment.id)}
                    >
                      delete button
                    </button>
                  </div>

                  <div className="message-body" data-cy="CommentBody">
                    {comment.body}
                  </div>
                </article>
              )),
            ])}

          {!isFormVisible && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              onClick={() => setIsFormVisible(true)}
            >
              Write a comment
            </button>
          )}
        </div>

        {isFormVisible && (
          <NewCommentForm onCommentAdd={onCommentAdd} />
        )}
      </div>
    </div>
  );
};
