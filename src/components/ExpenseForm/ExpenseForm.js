import React, { useEffect, useRef } from "react";
import styles from "./ExpenseForm.module.css";
import { toast } from "react-toastify";

const ExpenseForm = ({
  addExpense,
  expenseToUpdate,
  updateExpense,
  resetExpenseToUpdate,
}) => {
  const expenseTextInput = useRef();
  const expenseAmountInput = useRef();

  useEffect(() => {
    if (!expenseToUpdate) return;
    expenseTextInput.current.value = expenseToUpdate.text;
    expenseAmountInput.current.value = expenseToUpdate.amount;
  }, [expenseToUpdate]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const expenseText = expenseTextInput.current.value;
    const expenseAmount = expenseAmountInput.current.value;
    if (parseInt(expenseAmount) === 0) {
      toast.error("Amount can't be 0");
      return;
    }
    if (!expenseToUpdate) {
      const expense = {
        text: expenseText,
        amount: expenseAmount,
        id: new Date().getTime(),
      };
      addExpense(expense);
      clearInput();
      toast.success("Expense added successfully!");
      return;
    }

    const expense = {
      text: expenseText,
      amount: expenseAmount,
      id: expenseToUpdate.id,
    };
    console.log(expense);
    const result = updateExpense(expense);
    if (!result) return;
    clearInput();
    resetExpenseToUpdate();
    toast.success("Expense updated successfully!");
  };

  const clearInput = () => {
    expenseAmountInput.current.value = "";
    expenseTextInput.current.value = "";
  };

  return (
    <form className={styles.form} onSubmit={onSubmitHandler}>
      <h3>{expenseToUpdate ? "Edit " : "Add new "}transaction</h3>
      <label htmlFor="expenseText">Text</label>
      <input
        id="expenseText"
        className={styles.input}
        type="text"
        placeholder="Enter text..."
        ref={expenseTextInput}
        required
      />
      <div>
        <label htmlFor="expenseAmount">Amount</label>
        <div>(negative - expense,positive-income)</div>
      </div>
      <input
        className={styles.input}
        id="expenseAmount"
        type="number"
        placeholder="Enter amount..."
        ref={expenseAmountInput}
        required
      />
      <button className={styles.submitBtn}>
        {expenseToUpdate ? "Edit " : "Add "} Transaction
      </button>
    </form>
  );
};

export default ExpenseForm;
