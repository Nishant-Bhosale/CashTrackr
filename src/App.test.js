import { render, screen } from "@testing-library/react";
import App from "./App";
import user from "@testing-library/user-event";
import { within } from "@testing-library/dom";

describe("App renders correctly", () => {
  test("A new transaction should be added when the form is submitted", async () => {
    user.setup();
    render(<App />);
    const textInput = screen.getByPlaceholderText(/enter text.../i);
    const amountInput = screen.getByPlaceholderText(/enter amount.../i);
    const addBtn = screen.getByRole("button", { name: "Add Transaction" });

    await user.type(textInput, "Test income");
    await user.type(amountInput, "900");
    await user.click(addBtn);

    const transaction = screen.getByRole("listitem");
    expect(transaction).toHaveTextContent(/Test income/i);
    expect(transaction).toHaveTextContent(/\$\900/i);
  });

  test("Total, income and expense is updated when a new transaction is added to the list", async () => {
    user.setup();
    render(<App />);

    const textInput = screen.getByPlaceholderText(/enter text.../i);
    const amountInput = screen.getByPlaceholderText(/enter amount.../i);
    const addBtn = screen.getByRole("button", { name: "Add Transaction" });

    await user.type(textInput, "Test income");
    await user.type(amountInput, "900");
    await user.click(addBtn);

    const grandTotal = screen.getByRole("heading", { level: 1, name: /900/ });
    const incomeText = screen.getByText("+$", { exact: false });
    const expenseText = screen.getByText("-$", { exact: false });

    expect(grandTotal).toBeInTheDocument();
    expect(incomeText).toHaveTextContent(/900/);
    expect(expenseText).toHaveTextContent(/0/);

    await user.type(textInput, "Test expense");
    await user.type(amountInput, "-300");
    await user.click(addBtn);

    const afterGrandTotal = screen.getByRole("heading", {
      level: 1,
      name: /600/,
    });
    const afterIncomeText = screen.getByText("+$", { exact: false });
    const afterExpenseText = screen.getByText("-$", { exact: false });

    expect(afterGrandTotal).toBeInTheDocument();
    expect(afterIncomeText).toHaveTextContent(/900/);
    expect(afterExpenseText).toHaveTextContent(/300/);
  });

  test("Edit and delete icons render after hovering a transaction", async () => {
    user.setup();
    render(<App />);

    const textInput = screen.getByPlaceholderText(/enter text.../i);
    const amountInput = screen.getByPlaceholderText(/enter amount.../i);
    const addBtn = screen.getByRole("button", { name: "Add Transaction" });

    await user.type(textInput, "Test income");
    await user.type(amountInput, "900");
    await user.click(addBtn);

    const transaction = screen.getByRole("listitem");

    await user.hover(transaction);

    const editIcon = within(transaction).getByAltText(/edit/i);
    const deleteIcon = within(transaction).getByAltText(/delete/i);

    expect(editIcon).toBeInTheDocument();
    expect(deleteIcon).toBeInTheDocument();
  });

  test("Transaction should be deleted after clicking the delete button", async () => {
    user.setup();
    render(<App />);

    const textInput = screen.getByPlaceholderText(/enter text.../i);
    const amountInput = screen.getByPlaceholderText(/enter amount.../i);
    const addBtn = screen.getByRole("button", { name: "Add Transaction" });

    await user.type(textInput, "Test income");
    await user.type(amountInput, "900");
    await user.click(addBtn);

    await user.type(textInput, "Test income2");
    await user.type(amountInput, "300");
    await user.click(addBtn);

    const transaction = screen.getByText("Test income2");

    await user.hover(transaction);

    const deleteIcon = within(transaction).getByAltText(/delete/i);

    await user.click(deleteIcon);
    const deletedTransaction = screen.queryByText("Test income2");
    expect(deletedTransaction).not.toBeInTheDocument();
  });
});
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
