import React, { Component } from 'react';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import Task from './Task';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';

class App extends Component {
  state = { hideCompleted: false, text: '' }

  handleSubmit = (e) => {
    e.preventDefault();
    const { text } = this.state;
    Meteor.call('tasks.insert', text);
    this.setState({ text: '' });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  toggleHideCompleted = () => {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks = () => {
    const { currentUser } = this.props;
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted)
      filteredTasks = filteredTasks.filter( task => !task.checked );
    return filteredTasks.map( task => {
      const currentUserId = currentUser && currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  renderFilter = () => {
    const { hideCompleted } = this.state;
    return (
      <label className='hide-completed'>
        <input
          type='checkbox'
          readOnly
          checked={hideCompleted}
          onClick={this.toggleHideCompleted}
        />
      </label>
    )
  }

  renderForm = () => {
    const { text } = this.state;
    return (
      <form className='new-task' onSubmit={this.handleSubmit}>
        <input
          name='text'
          value={text}
          onChange={this.handleChange}
          placeholder='Type to add new tasks'
        />
      </form>
    )
  }

  render() {
    const { currentUser, incompleteCount } = this.props;
    return (
      <div className='container'>
        <header>
          <h1>Todo List ({incompleteCount})</h1>
          { this.renderFilter() }
          <AccountsUIWrapper />
          { currentUser && this.renderForm() }
        </header>
        <ul>
          { this.renderTasks() }
        </ul>
      </div>
    );
  }

}

export default withTracker(() => {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 }}).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(App);
