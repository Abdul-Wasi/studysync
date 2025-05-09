// src/components/StudyPlanner.jsx
import React, { useState } from 'react';
import '../styles/StudyPlanner.css';
import {
  PlusCircle,
  CheckCircle,
  Trash2,
  Edit,
  Save,
  Calendar,
  Clock,
} from 'lucide-react';

const StudyPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueTime, setNewDueTime] = useState('');

  const [editIndex, setEditIndex] = useState(null);
  const [editTaskData, setEditTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
  });

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      dueDate: newDueDate,
      dueTime: newDueTime,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewDueDate('');
    setNewDueTime('');
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const startEditing = (index) => {
    const task = tasks[index];
    setEditIndex(index);
    setEditTaskData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
    });
  };

  const saveEdit = (index) => {
    const updated = [...tasks];
    updated[index] = {
      ...updated[index],
      ...editTaskData,
    };
    setTasks(updated);
    setEditIndex(null);
  };

  return (
    <div className="study-planner-container">
      <h2>📘 Study Planner</h2>
      <p className="planner-subtitle">Organize your tasks and stay productive</p>

      <div className="add-task-section">
        <div style={{ flex: 2 }}>
          <label className="task-label">Task Title</label>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title"
          />
        </div>

        <div style={{ flex: 3 }}>
          <label className="task-label">Task Description</label>
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        <div className="date-time-inputs">
          <div>
            <label className="task-label">Due Date</label>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </div>
          <div>
            <label className="task-label">Due Time</label>
            <input
              type="time"
              value={newDueTime}
              onChange={(e) => setNewDueTime(e.target.value)}
            />
          </div>
        </div>

        <button className="add-task-button" onClick={addTask}>
          <PlusCircle size={20} /> Add Task
        </button>
      </div>

      <div className="task-list">
        {tasks.map((task, index) => (
          <div
            className={`task-card ${task.completed ? 'completed' : ''}`}
            key={index}
          >
            <div className="task-header">
              {editIndex === index ? (
                <input
                  type="text"
                  className="task-title-input"
                  value={editTaskData.title}
                  onChange={(e) =>
                    setEditTaskData({ ...editTaskData, title: e.target.value })
                  }
                />
              ) : (
                <h3 className="task-title">{task.title}</h3>
              )}
            </div>

            {editIndex === index ? (
              <textarea
                className="task-description-input"
                rows={2}
                value={editTaskData.description}
                onChange={(e) =>
                  setEditTaskData({
                    ...editTaskData,
                    description: e.target.value,
                  })
                }
              />
            ) : (
              <p className="task-description">{task.description}</p>
            )}

            <div className="task-due-date">
              <Calendar size={18} />
              <span>
                {editIndex === index ? (
                  <input
                    type="date"
                    className="date-input"
                    value={editTaskData.dueDate}
                    onChange={(e) =>
                      setEditTaskData({
                        ...editTaskData,
                        dueDate: e.target.value,
                      })
                    }
                  />
                ) : (
                  task.dueDate || 'No due date'
                )}
              </span>
            </div>

            <div className="task-due-time">
              <Clock size={18} />
              <span>
                {editIndex === index ? (
                  <input
                    type="time"
                    className="time-input"
                    value={editTaskData.dueTime}
                    onChange={(e) =>
                      setEditTaskData({
                        ...editTaskData,
                        dueTime: e.target.value,
                      })
                    }
                  />
                ) : (
                  task.dueTime || 'No due time'
                )}
              </span>
            </div>

            <div className="task-actions">
              <button
                className="complete-button"
                onClick={() => toggleComplete(index)}
              >
                <CheckCircle size={18} />
                {task.completed ? 'Undo' : 'Complete'}
              </button>

              {editIndex === index ? (
                <button
                  className="save-button"
                  onClick={() => saveEdit(index)}
                >
                  <Save size={18} />
                  Save
                </button>
              ) : (
                <button
                  className="edit-button"
                  onClick={() => startEditing(index)}
                >
                  <Edit size={18} />
                  Edit
                </button>
              )}

              <button
                className="delete-button"
                onClick={() => deleteTask(index)}
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlanner;
