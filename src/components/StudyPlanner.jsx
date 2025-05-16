// src/components/StudyPlanner.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase'; // Import auth and db from firebase config
import { ref, set, onValue, off } from 'firebase/database'; // Import Realtime Database functions
import { toast } from 'react-toastify'; // For user notifications
import '../styles/StudyPlanner.css';
import {
  PlusCircle,
  CheckCircle,
  Trash2,
  Edit,
  Save,
  Calendar,
  Clock,
  ExternalLink, // Added for prompt link
} from 'lucide-react';

const StudyPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueTime, setNewDueTime] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const [currentUserId, setCurrentUserId] = useState(null); // New state for current user's UID
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // New state for unsaved changes
  const [initialLoadComplete, setInitialLoadComplete] = useState(false); // To prevent initial "unsaved changes" prompt

  const [editIndex, setEditIndex] = useState(null); // Stores the ID of the task being edited
  const [editTaskData, setEditTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
  });

  // --- Effect to listen for auth changes and load data ---
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUserId(user.uid);
        loadStudyPlannerData(user.uid); // Load data for the logged-in user
      } else {
        setIsLoggedIn(false);
        setCurrentUserId(null);
        setTasks([]); // Clear tasks if user logs out
        setHasUnsavedChanges(false); // No unsaved changes if no user
        setInitialLoadComplete(true); // Treat as loaded even if no user
      }
    });

    return () => {
      unsubscribeAuth(); // Cleanup auth listener
      // Detach Realtime Database listener if it was attached
      if (currentUserId) {
        off(ref(db, `users/${currentUserId}/studyPlannerData/tasks`));
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // --- Effect to track unsaved changes ---
  useEffect(() => {
    // Only set unsaved changes if the initial load is complete
    // and if there's a logged-in user and tasks exist.
    // This prevents showing "unsaved changes" immediately after loading saved data.
    if (initialLoadComplete && isLoggedIn && currentUserId) {
        // You could implement a deeper comparison here if 'tasks' array changes
        // without actual user interaction (e.g., from an external update).
        // For now, any change to `tasks` while logged in implies unsaved changes.
        setHasUnsavedChanges(true);
    } else if (!isLoggedIn) {
        setHasUnsavedChanges(false); // Clear if not logged in
    }
  }, [tasks, isLoggedIn, currentUserId, initialLoadComplete]);

  // Function to load data from Firebase
  const loadStudyPlannerData = (uid) => {
    const userTasksRef = ref(db, `users/${uid}/studyPlannerData/tasks`);
    // onValue creates a real-time listener
    onValue(userTasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Firebase returns objects with numeric keys, convert back to array
        const loadedTasks = Object.values(data);
        setTasks(loadedTasks);
        setHasUnsavedChanges(false); // Data is loaded, so no unsaved changes initially
        toast.success('Study plan loaded successfully!');
      } else {
        setTasks([]);
        toast.info('No saved study plan found. Start adding tasks!');
      }
      setInitialLoadComplete(true); // Mark initial load as complete
    }, (error) => {
      console.error("Error loading study planner data:", error);
      toast.error('Failed to load study plan.');
      setTasks([]); // Clear tasks on load error
      setInitialLoadComplete(true); // Still mark as complete to allow new changes
    });
  };

  // Function to save data to Firebase
  const saveStudyPlannerData = async () => {
    if (!currentUserId) {
      toast.warn('Please log in to save your study plan!');
      return;
    }

    try {
      // Set the entire 'tasks' array under the user's studyPlannerData/tasks path
      await set(ref(db, `users/${currentUserId}/studyPlannerData/tasks`), tasks);
      setHasUnsavedChanges(false); // Data is now saved
      toast.success('Study plan saved successfully!');
    } catch (error) {
      console.error("Error saving study planner data:", error);
      toast.error('Failed to save study plan. Please try again.');
    }
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) {
      toast.warn('Task title cannot be empty.');
      return;
    }

    const newTask = {
      // Use a unique ID for each task, important for Firebase updates and React keys
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      dueDate: newDueDate,
      dueTime: newDueTime,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    // The useEffect for hasUnsavedChanges will handle showing the prompt after this update
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewDueDate('');
    setNewDueTime('');
  };

  // Changed to use task ID for deletion
  const deleteTask = (idToRemove) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== idToRemove));
  };

  // Changed to use task ID for toggling complete status
  const toggleComplete = (idToToggle) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === idToToggle ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Changed to use task ID for starting edit
  const startEditing = (idToEdit) => {
    const task = tasks.find(task => task.id === idToEdit);
    if (task) {
        setEditIndex(idToEdit); // Store the ID being edited
        setEditTaskData({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            dueTime: task.dueTime,
        });
    }
  };

  // Changed to use task ID for saving edit
  const saveEdit = (idToSave) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === idToSave
          ? {
              ...task,
              title: editTaskData.title,
              description: editTaskData.description,
              dueDate: editTaskData.dueDate,
              dueTime: editTaskData.dueTime,
            }
          : task
      )
    );
    setEditIndex(null); // Clear edit mode
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
        {!initialLoadComplete && isLoggedIn ? (
            <p className="loading-message">Loading your saved tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="no-tasks-message">No tasks added yet. Start planning your studies!</p>
        ) : (
          tasks.map((task) => ( // Use task.id as key
            <div
              className={`task-card ${task.completed ? 'completed' : ''}`}
              key={task.id}
            >
              <div className="task-header">
                {editIndex === task.id ? (
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

              {editIndex === task.id ? (
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
                  {editIndex === task.id ? (
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
                  {editIndex === task.id ? (
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
                  onClick={() => toggleComplete(task.id)} // Pass ID
                >
                  <CheckCircle size={18} />
                  {task.completed ? 'Undo' : 'Complete'}
                </button>

                {editIndex === task.id ? (
                  <button
                    className="save-button"
                    onClick={() => saveEdit(task.id)} // Pass ID
                  >
                    <Save size={18} />
                    Save
                  </button>
                ) : (
                  <button
                    className="edit-button"
                    onClick={() => startEditing(task.id)} // Pass ID
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                )}

                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)} // Pass ID
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Conditional Save Prompt for Guest Users */}
      {!isLoggedIn && initialLoadComplete && (
        <div className="save-prompt">
          <p>Want to save your study plan for later?</p>
          <div className="prompt-actions">
            <Link to="/login" className="prompt-link">
              <ExternalLink size={16} /> Login
            </Link>
            <Link to="/signup" className="prompt-link">
              <ExternalLink size={16} /> Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* Conditional Save Button for Logged-in Users with Unsaved Changes */}
      {isLoggedIn && hasUnsavedChanges && tasks.length > 0 && (
        <div className="save-changes-container">
          <p>You have unsaved changes!</p>
          <button className="save-data-button" onClick={saveStudyPlannerData}>
            <Save size={20} /> Save My Study Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;