import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import classnames from 'classnames';

export default class Task extends React.Component {

  toggleChecked = () => {
    const { task } = this.props;
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

  togglePrivate = () => {
    const { task } = this.props;
    Meteor.call('tasks.setPrivate', task._id, ! task.private);
  }

  deleteTask = () => {
    const { task } = this.props;
    Meteor.call('tasks.remove', task._id)
  }

  render() {
    const { showPrivateButton, task } = this.props;
    const taskClassName = classnames({
      checked: task.checked,
      private: task.private,
    });
    return (
      <li className={taskClassName}>
        <button
          className='delete'
          onClick={this.deleteTask}
        >
          Delete
        </button>
        <input
          type='checkbox'
          readOnly
          checked={task.checked}
          onClick={this.toggleChecked}
        />
        {showPrivateButton && (
          <button className='toggle-private' onClick={this.togglePrivate}>
            { task.private ? 'Private' : 'Public' }
          </button>
        )}
        <span className='text'>
          <strong>{task.username}</strong>: {task.text}
        </span>
      </li>
    );
  }
}
