// src/components/BudgetingTool.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase'; // Import auth and db
import { ref, set, onValue, off } from 'firebase/database'; // Import Realtime Database functions
import { toast } from 'react-toastify'; // For user notifications
import '../styles/BudgetingTool.css';
import { Save, ExternalLink } from 'lucide-react'; // Import icons

const BudgetingTool = () => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [editingId, setEditingId] = useState(null); // Changed to store ID, not index
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // --- Effect to listen for auth changes and load data ---
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUserId(user.uid);
        loadBudgetingData(user.uid);
      } else {
        setIsLoggedIn(false);
        setCurrentUserId(null);
        setIncome('');
        setExpenses([]);
        setHasUnsavedChanges(false);
        setInitialLoadComplete(true); // Treat as loaded even if no user
      }
    });

    return () => {
      unsubscribeAuth();
      // Detach Realtime Database listener if it was attached
      if (currentUserId) {
        off(ref(db, `users/${currentUserId}/budgetingData`));
      }
    };
  }, []);

  // --- Effect to track unsaved changes ---
  useEffect(() => {
    if (initialLoadComplete && isLoggedIn && currentUserId) {
      setHasUnsavedChanges(true);
    } else if (!isLoggedIn) {
      setHasUnsavedChanges(false);
    }
  }, [income, expenses, isLoggedIn, currentUserId, initialLoadComplete]);


  // Function to load data from Firebase
  const loadBudgetingData = (uid) => {
    const userBudgetRef = ref(db, `users/${uid}/budgetingData`);
    onValue(userBudgetRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIncome(data.totalIncome || ''); // Use totalIncome from Firebase
        // Ensure expenses are an array. Firebase might store an empty array as null/undefined.
        setExpenses(data.expenses ? Object.values(data.expenses) : []);
        setHasUnsavedChanges(false);
        toast.success('Budget data loaded successfully!');
      } else {
        setIncome('');
        setExpenses([]);
        toast.info('No saved budget data found. Start managing your budget!');
      }
      setInitialLoadComplete(true);
    }, (error) => {
      console.error("Error loading budgeting data:", error);
      toast.error('Failed to load budget data.');
      setIncome('');
      setExpenses([]);
      setInitialLoadComplete(true);
    });
  };

  // Function to save data to Firebase
  const saveBudgetingData = async () => {
    if (!currentUserId) {
      toast.warn('Please log in to save your budget!');
      return;
    }

    try {
      // Firebase Realtime Database prefers flat objects.
      // Store expenses as an object with IDs as keys for easier updates/deletions.
      const expensesObject = expenses.reduce((obj, item) => {
          obj[item.id] = item;
          return obj;
      }, {});

      await set(ref(db, `users/${currentUserId}/budgetingData`), {
        totalIncome: parseFloat(income) || 0,
        expenses: expensesObject,
      });
      setHasUnsavedChanges(false);
      toast.success('Budget saved successfully!');
    } catch (error) {
      console.error("Error saving budgeting data:", error);
      toast.error('Failed to save budget. Please try again.');
    }
  };

  const handleAddExpense = () => {
    if (expenseName && expenseAmount) {
      const parsedAmount = parseFloat(expenseAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        toast.warn('Please enter a valid positive amount for the expense.');
        return;
      }

      if (editingId !== null) {
        setExpenses((prevExpenses) =>
          prevExpenses.map((exp) =>
            exp.id === editingId
              ? { ...exp, name: expenseName, amount: parsedAmount, date: new Date().toISOString().split('T')[0] } // Update date on edit
              : exp
          )
        );
        setEditingId(null);
      } else {
        const newExpense = {
          id: Date.now().toString(), // Unique ID for each expense
          name: expenseName,
          amount: parsedAmount,
          date: new Date().toISOString().split('T')[0], // Current date
        };
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
      }
      setExpenseName('');
      setExpenseAmount('');
    } else {
      toast.warn('Please enter both expense name and amount.');
    }
  };

  const handleEditExpense = (idToEdit) => {
    const expenseToEdit = expenses.find(exp => exp.id === idToEdit);
    if (expenseToEdit) {
      setExpenseName(expenseToEdit.name);
      setExpenseAmount(expenseToEdit.amount);
      setEditingId(idToEdit);
    }
  };

  const handleDeleteExpense = (idToDelete) => {
    setExpenses((prevExpenses) => prevExpenses.filter((exp) => exp.id !== idToDelete));
    if (editingId === idToDelete) {
      setExpenseName('');
      setExpenseAmount('');
      setEditingId(null);
    }
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const remainingBudget = (parseFloat(income) || 0) - totalExpenses;

  const getBudgetComment = () => {
    if (income === '' || parseFloat(income) === 0) return { text: '', type: '', emoji: '' };

    const percentageLeft = (remainingBudget / parseFloat(income)) * 100;

    if (remainingBudget < 0) {
      return { text: 'Brooo 💸 You\'re in minus! Time to chill on spending.', type: 'danger', emoji: '💀' };
    } else if (remainingBudget === 0) {
      return { text: 'Uh-oh 😬 You\'re outta cash!', type: 'warning', emoji: '🛑' };
    } else if (percentageLeft <= 20) { // More aggressive warning for low budget
      return { text: 'Careful fam 🤏 Budget almost gone!', type: 'caution', emoji: '⚡' };
    } else if (percentageLeft <= 50) {
      return { text: 'Doing good, but keep an eye on it! 😉 Budget halfway gone.', type: 'info', emoji: '🧐' };
    } else {
      return { text: 'You\'re killing it! 🔥 Plenty of budget left.', type: 'success', emoji: '🤑' };
    }
  };

  const budgetComment = getBudgetComment();

  return (
    <div className="budgeting-tool-container">
      <h2 className="heading">Budgeting Tool</h2>
      <p className="subtitle">Manage your income and expenses to stay on track!</p>

      <div className="card">
        <label>Enter Monthly Income (₹):</label>
        <input
          type="number"
          value={income}
          onChange={(e) => {
            const val = e.target.value;
            setIncome(val === '' ? '' : Math.max(0, parseFloat(val))); // Ensure non-negative
          }}
          placeholder="e.g., 50000"
        />
      </div>

      <div className="card">
        <h3>{editingId !== null ? 'Edit Expense' : 'Add New Expense'}</h3>
        <input
          type="text"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          placeholder="Expense name (e.g., Rent, Groceries)"
        />
        <input
          type="number"
          value={expenseAmount}
          onChange={(e) => {
            const val = e.target.value;
            setExpenseAmount(val === '' ? '' : Math.max(0, parseFloat(val))); // Ensure non-negative
          }}
          placeholder="Amount (e.g., 12000)"
        />
        <button className="add-btn" onClick={handleAddExpense}>
          {editingId !== null ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>

      <div className="card">
        <h3>Your Expenses</h3>
        {expenses.length === 0 ? (
          <p className="no-expenses-message">No expenses added yet. What a saver! 💸</p>
        ) : (
          <ul className="expense-list">
            {expenses.map((expense) => (
              <li key={expense.id} className="expense-item">
                <span>{expense.name}: ₹{expense.amount.toFixed(2)} ({expense.date})</span>
                <div className="expense-actions">
                  <button className="edit-btn" onClick={() => handleEditExpense(expense.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card summary-card">
        <h3>Budget Summary</h3>
        <p className="summary-line">Total Income: <span className="income-val">₹{parseFloat(income).toFixed(2)}</span></p>
        <p className="summary-line">Total Expenses: <span className="expense-val">₹{totalExpenses.toFixed(2)}</span></p>
        <p className="summary-line remaining-budget">Remaining Budget: <span className={remainingBudget < 0 ? 'negative' : 'positive'}>₹{remainingBudget.toFixed(2)}</span></p>

        {budgetComment.text && (
          <p className={`budget-comment ${budgetComment.type}`}>
            <span className="emoji">{budgetComment.emoji}</span> {budgetComment.text}
          </p>
        )}
      </div>

      {/* Conditional Save Prompt for Guest Users */}
      {!isLoggedIn && initialLoadComplete && (
        <div className="save-prompt">
          <p>Want to save your budget for later?</p>
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
      {isLoggedIn && hasUnsavedChanges && (
        <div className="save-changes-container">
          <p>You have unsaved changes!</p>
          <button className="save-data-button" onClick={saveBudgetingData}>
            <Save size={20} /> Save My Budget
          </button>
        </div>
      )}
    </div>
  );
};

export default BudgetingTool;