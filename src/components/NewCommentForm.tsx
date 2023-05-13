import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { CommentData } from '../types/Comment';

interface Props {
  onCommentAdd: (comment: CommentData) => void
}

export const NewCommentForm: React.FC<Props> = ({ onCommentAdd }) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [body, setBody] = useState('');
  const [bodyError, setBodyError] = useState(false);

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // eslint-disable-next-line no-useless-escape, max-len
    const isValidEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));

    if (!name) {
      setNameError(true);
    }

    if (!isValidEmail) {
      setEmailError(true);
    }

    if (!body) {
      setBodyError(true);
    }

    if (nameError || bodyError || !isValidEmail) {
      return;
    }

    onCommentAdd({ name, email, body });
    setBody('');
  };

  return (
    <form data-cy="NewCommentForm" onSubmit={handleConfirm}>
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={classNames('input', {
              'is-danger': nameError,
            })}
            value={name}
            onChange={(e) => {
              setNameError(false);
              setName(e.target.value);
            }}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {nameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {nameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={classNames('input', {
              'is-danger': emailError,
            })}
            value={email}
            onChange={(e) => {
              setEmailError(false);
              setEmail(e.target.value);
            }}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {emailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {emailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={classNames('textarea', {
              'is-danger': bodyError,
            })}
            value={body}
            onChange={(e) => {
              setBodyError(false);
              setBody(e.target.value);
            }}
          />
        </div>

        {bodyError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="button is-link is-light"
            onClick={() => {
              setName('');
              setBody('');
              setEmail('');
              setBodyError(false);
              setEmailError(false);
              setNameError(false);
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
