// src/components/StudyPlanner.jsx
import React, { useState } from 'react';
import '../styles/StudyPlanner.css';
import { PlusCircle, CheckCircle, Trash2, Edit, Save, Calendar, Clock } from 'lucide-react';

const StudyPlanner = () => {
  const [tasks, setTasks] = useState([]); // Start with empty task list
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueTime, setNewDueTime] = useState('');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDescription,
      dueDate: newDueDate,
      dueTime: newDueTime,
      completed: false,
      editing: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewDueDate('');
    setNewDueTime('');
  };

  const handleCompleteTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, editing: true } : task
    ));
  };

  const handleSaveTask = (id) => {
    if (!tasks.find(t => t.id === id).title.trim()) {
      handleDeleteTask(id);
      return;
    }
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, editing: false } : task
    ));
  };

  const handleUpdateTask = (id, field, value) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  return (
    <div className="study-planner-container">
      <h1>📅 Study Planner</h1>
      <p className="planner-subtitle">Organize your study schedule and boost your productivity.</p>

      <div className="add-task-section">
        <label htmlFor="new-task-title" className="task-label">Task Title</label>
        <input
          id="new-task-title"
          type="text"
          placeholder="Enter task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="task-input"
        />
        <label htmlFor="new-task-description" className="task-label">Task Description</label>
        <input
          id="new-task-description"
          type="text"
          placeholder="Enter task description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          className="task-input"
        />
        <div className='date-time-inputs'>
          <label htmlFor="new-due-date" className="task-label">Due Date</label>
          <input
            id="new-due-date"
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="date-input"
          />
          <label htmlFor="new-due-time" className="task-label">Due Time</label>
          <input
            id="new-due-time"
            type="time"
            value={newDueTime}
            onChange={(e) => setNewDueTime(e.target.value)}
            className="time-input"
          />
        </div>
        <button onClick={handleAddTask} className="add-task-button">
          <PlusCircle className="add-icon" />
          Add Task
        </button>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
            {task.editing ? (
              <>
                <label htmlFor={`edit-task-title-${task.id}`} className="task-label">Task Title</label>
                <input
                  id={`edit-task-title-${task.id}`}
                  type="text"
                  value={task.title}
                  onChange={(e) => handleUpdateTask(task.id, 'title', e.target.value)}
                  className="task-title-input"
                />
                <label htmlFor={`edit-task-description-${task.id}`} className="task-label">Task Description</label>
                <input
                  id={`edit-task-description-${task.id}`}
                  type="text"
                  value={task.description}
                  onChange={(e) => handleUpdateTask(task.id, 'description', e.target.value)}
                  className="task-description-input"
                />
                <div className='date-time-inputs'>
                  <label htmlFor={`edit-due-date-${task.id}`} className="task-label">Due Date</label>
                  <input
                    id={`edit-due-date-${task.id}`}
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => handleUpdateTask(task.id, 'dueDate', e.target.value)}
                    className="date-input"
                  />
                  <label htmlFor={`edit-due-time-${task.id}`} className="task-label">Due Time</label>
                  <input
                    id={`edit-due-time-${task.id}`}
                    type="time"
                    value={task.dueTime}
                    onChange={(e) => handleUpdateTask(task.id, 'dueTime', e.target.value)}
                    className="time-input"
                  />
                </div>
                <div className="task-actions">

                  <button onClick={() => handleSaveTask(task.id)} className="save-button">
                    <Save className="save-icon" />
                    Save
                  </button>
                  <button onClick={() => handleDeleteTask(task.id)} className="delete-button">
                    <Trash2 className="delete-icon" />
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="task-actions">
                    <button onClick={() => handleCompleteTask(task.id)} className="complete-button">
                      {task.completed ? <CheckCircle className="check-icon" /> : <></>}
                      {task.completed ? 'Completed' : 'Complete'}
                    </button>
                    <button onClick={() => handleEditTask(task.id)} className="edit-button">
                      <Edit className="edit-icon" />
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} className="delete-button">
                      <Trash2 className="delete-icon" />
                      Delete
                    </button>
                  </div>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-due-date">
                  <Calendar className='calendar-icon' />
                  <span>Due: {task.dueDate}</span>
                </div>
                <div className="task-due-time">
                  <Clock className='clock-icon' />
                  <span>Time: {task.dueTime}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlanner;
