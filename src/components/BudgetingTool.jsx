// src/components/BudgetingTool.jsx
import React, { useState } from 'react';
import '../styles/BudgetingTool.css';

const BudgetingTool = () => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddExpense = () => {
    if (expenseName && expenseAmount) {
      if (editingIndex !== null) {
        const updatedExpenses = [...expenses];
        updatedExpenses[editingIndex] = { name: expenseName, amount: parseFloat(expenseAmount) };
        setExpenses(updatedExpenses);
        setEditingIndex(null);
      } else {
        setExpenses([...expenses, { name: expenseName, amount: parseFloat(expenseAmount) }]);
      }
      setExpenseName('');
      setExpenseAmount('');
    }
  };

  const handleEditExpense = (index) => {
    setExpenseName(expenses[index].name);
    setExpenseAmount(expenses[index].amount);
    setEditingIndex(index);
  };

  const handleDeleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
    if (editingIndex === index) {
      setExpenseName('');
      setExpenseAmount('');
      setEditingIndex(null);
    }
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const remainingBudget = income ? income - totalExpenses : 0;

  const getBudgetComment = () => {
    if (income === '' || income === 0) return '';

    const percentageLeft = (remainingBudget / income) * 100;

    if (remainingBudget < 0) {
      return { text: 'Brooo 💸 You\'re in minus! Time to chill on spending.', type: 'danger', emoji: '💀' };
    } else if (remainingBudget === 0) {
      return { text: 'Uh-oh 😬 You\'re outta cash!', type: 'warning', emoji: '🛑' };
    } else if (percentageLeft <= 50) {
      return { text: 'Careful fam 🤏 Budget halfway gone!', type: 'caution', emoji: '⚡' };
    } else {
      return { text: 'You\'re killing it! 🔥 Plenty of budget left.', type: 'success', emoji: '🤑' };
    }
  };

  const budgetComment = getBudgetComment();

  return (
    <div className="budgeting-tool-container">
      <h2 className="heading">Budgeting Tool</h2>

      <div className="card">
        <label>Enter Monthly Income:</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(parseFloat(e.target.value) || '')}
          placeholder="Enter your income"
        />
      </div>

      <div className="card">
        <h3>{editingIndex !== null ? 'Edit Expense' : 'Add Expense'}</h3>
        <input
          type="text"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          placeholder="Expense name"
        />
        <input
          type="number"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          placeholder="Amount"
        />
        <button className="add-btn" onClick={handleAddExpense}>
          {editingIndex !== null ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>

      <div className="card">
        <h3>Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-light">No expenses yet. Ballin' 💸</p>
        ) : (
          <ul className="expense-list">
            {expenses.map((expense, index) => (
              <li key={index} className="expense-item">
                <span>{expense.name}: ₹{expense.amount.toFixed(2)}</span>
                <div className="expense-actions">
                  <button className="edit-btn" onClick={() => handleEditExpense(index)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteExpense(index)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card summary-card">
        <h3>Summary</h3>
        <p>Total Expenses: ₹{totalExpenses.toFixed(2)}</p>
        <p>Remaining Budget: ₹{remainingBudget.toFixed(2)}</p>

        {budgetComment.text && (
          <p className={`budget-comment ${budgetComment.type}`}>
            <span className="emoji">{budgetComment.emoji}</span> {budgetComment.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetingTool;
