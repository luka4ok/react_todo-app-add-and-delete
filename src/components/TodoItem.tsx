/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import cn from 'classnames';

import { DispatchContext } from '../store/TodoContext';
import { StateContext } from '../store/TodoContext';
import { useErrorMessage } from './useErrorMessage';
import { deleteTodo } from '../api/todos';

import { Todo } from '../types/Todo';
import { ActionType } from '../types/Actions';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { currentlyLoadingItemsIds } = useContext(StateContext);
  const handleError = useErrorMessage();
  const dispatch = useContext(DispatchContext);

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        dispatch({ type: ActionType.DeleteTodo, payload: todoId });
        dispatch({
          type: ActionType.SetCurrentlyLoadingItemsIds,
          payload: [...currentlyLoadingItemsIds, todoId],
        });
        dispatch({ type: ActionType.SetIsInputFocused, payload: true });
      })
      .catch(() => {
        handleError('Unable to delete a todo');
        dispatch({ type: ActionType.SetIsInputFocused, payload: true });
      })
      .finally(() => {
        dispatch({
          type: ActionType.SetCurrentlyLoadingItemsIds,
          payload: currentlyLoadingItemsIds.filter(id => id !== todoId),
        });
      });

    dispatch({
      type: ActionType.SetCurrentlyLoadingItemsIds,
      payload: [...currentlyLoadingItemsIds, todoId],
    });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label htmlFor={`todoCheckbox-${todo.id}`} className="todo__status-label">
        <input
          id={`todoCheckbox-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': currentlyLoadingItemsIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};