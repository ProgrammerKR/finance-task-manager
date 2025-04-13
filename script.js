// Income Tracker
const incomeForm = document.getElementById('incomeForm');
const incomeList = document.getElementById('incomeList');
const totalIncome = document.getElementById('totalIncome');

// Expense Tracker
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalExpenses = document.getElementById('totalExpenses');

// To-Do List
const todoForm = document.getElementById('todoForm');
const todoList = document.getElementById('todoList');

// Analytics Elements
const analyticsIncome = document.getElementById('analyticsIncome');
const analyticsExpenses = document.getElementById('analyticsExpenses');
const balance = document.getElementById('balance');

// Chart Instances
let categoryChart, timeChart;

// Initialize Data from Local Storage
let incomes = [];
let expenses = [];
let todos = [];

function loadFromLocalStorage() {
    try {
        const storedIncomes = localStorage.getItem('incomes');
        incomes = storedIncomes ? JSON.parse(storedIncomes) : [];

        const storedExpenses = localStorage.getItem('expenses');
        expenses = storedExpenses ? JSON.parse(storedExpenses) : [];

        const storedTodos = localStorage.getItem('todos');
        todos = storedTodos ? JSON.parse(storedTodos) : [];
    } catch (e) {
        console.error('Error loading from local storage:', e);
        incomes = [];
        expenses = [];
        todos = [];
    }
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('incomes', JSON.stringify(incomes));
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (e) {
        console.error('Error saving to local storage:', e);
    }
}

// Render Incomes
function renderIncomes() {
    incomeList.innerHTML = '';
    let total = 0;

    incomes.forEach((income, index) => {
        total += income.amount;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${income.description}</td>
            <td>₹${income.amount.toFixed(2)}</td>
            <td>${income.category}</td>
            <td>${income.date}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editIncome(${index})"><i class="pxi pxi-edit"></i> Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteIncome(${index})"><i class="pxi pxi-trash"></i> Delete</button>
            </td>
        `;
        incomeList.appendChild(row);
    });

    totalIncome.textContent = total.toFixed(2);
    updateAnalytics();
}

// Add Income
incomeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('incomeDescription').value.trim();
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const category = document.getElementById('incomeCategory').value;

    if (!description || isNaN(amount) || !category) return;

    const income = {
        description,
        amount,
        category,
        date: new Date().toLocaleDateString('en-IN')
    };

    incomes.push(income);
    saveToLocalStorage();
    renderIncomes();
    incomeForm.reset();
});

// Edit Income
function editIncome(index) {
    const income = incomes[index];
    document.getElementById('incomeDescription').value = income.description;
    document.getElementById('incomeAmount').value = income.amount;
    document.getElementById('incomeCategory').value = income.category;

    incomes.splice(index, 1);
    saveToLocalStorage();
    renderIncomes();
}

// Delete Income with Confirmation
function deleteIncome(index) {
    if (confirm('Are you sure you want to delete this income?')) {
        incomes.splice(index, 1);
        saveToLocalStorage();
        renderIncomes();
    }
}

// Render Expenses
function renderExpenses() {
    expenseList.innerHTML = '';
    let total = 0;

    expenses.forEach((expense, index) => {
        total += expense.amount;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editExpense(${index})"><i class="pxi pxi-edit"></i> Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteExpense(${index})"><i class="pxi pxi-trash"></i> Delete</button>
            </td>
        `;
        expenseList.appendChild(row);
    });

    totalExpenses.textContent = total.toFixed(2);
    updateAnalytics();
}

// Add Expense
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('expenseDescription').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;

    if (!description || isNaN(amount) || !category) return;

    const expense = {
        description,
        amount,
        category,
        date: new Date().toLocaleDateString('en-IN')
    };

    expenses.push(expense);
    saveToLocalStorage();
    renderExpenses();
    expenseForm.reset();
});

// Edit Expense
function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('expenseDescription').value = expense.description;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseCategory').value = expense.category;

    expenses.splice(index, 1);
    saveToLocalStorage();
    renderExpenses();
}

// Delete Expense with Confirmation
function deleteExpense(index) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses.splice(index, 1);
        saveToLocalStorage();
        renderExpenses();
    }
}

// Render To-Do List
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `list-group-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div>
                <input type="checkbox" class="form-check-input me-2" ${todo.completed ? 'checked' : ''} onclick="toggleTodo(${index})">
                <span>${todo.task}</span> <small class="text-muted">(Due: ${todo.dueDate})</small>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editTodo(${index})"><i class="pxi pxi-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTodo(${index})"><i class="pxi pxi-trash"></i></button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// Add To-Do
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = document.getElementById('todoTask').value.trim();
    const dueDate = document.getElementById('todoDueDate').value;

    if (!task || !dueDate) return;

    const todo = {
        task,
        dueDate,
        completed: false
    };

    todos.push(todo);
    saveToLocalStorage();
    renderTodos();
    todoForm.reset();
});

// Toggle To-Do Completion
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveToLocalStorage();
    renderTodos();
}

// Edit To-Do
function editTodo(index) {
    const todo = todos[index];
    document.getElementById('todoTask').value = todo.task;
    document.getElementById('todoDueDate').value = todo.dueDate;

    todos.splice(index, 1);
    saveToLocalStorage();
    renderTodos();
}

// Delete To-Do with Confirmation
function deleteTodo(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos.splice(index, 1);
        saveToLocalStorage();
        renderTodos();
    }
}

// Update Analytics and Charts
function updateAnalytics() {
    const totalInc = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
    const totalExp = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const bal = totalInc - totalExp;

    analyticsIncome.textContent = totalInc.toFixed(2);
    analyticsExpenses.textContent = totalExp.toFixed(2);
    balance.textContent = bal.toFixed(2);
    balance.style.color = bal >= 0 ? '#10b981' : '#ff4d4f';

    // Category Chart Data (Expenses)
    const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'];
    const categoryTotals = categories.map(cat => {
        return expenses
            .filter(exp => exp.category === cat)
            .reduce((sum, exp) => sum + (exp.amount || 0), 0);
    });

    // Time Chart Data (Income vs Expenses)
    const dates = [...new Set([...incomes.map(inc => inc.date), ...expenses.map(exp => exp.date)])].sort();
    const incomeByDate = dates.map(date => {
        return incomes
            .filter(inc => inc.date === date)
            .reduce((sum, inc) => sum + (inc.amount || 0), 0);
    });
    const expenseByDate = dates.map(date => {
        return expenses
            .filter(exp => exp.date === date)
            .reduce((sum, exp) => sum + (exp.amount || 0), 0);
    });

    // Destroy existing charts if they exist
    if (categoryChart) categoryChart.destroy();
    if (timeChart) timeChart.destroy();

    // Category Pie Chart
    categoryChart = new Chart(document.getElementById('categoryChart'), {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: categoryTotals,
                backgroundColor: ['#ff6f61', '#6b7280', '#facc15', '#10b981', '#3b82f6'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#2a2a72' }
                }
            }
        }
    });

    // Time Line Chart (Income vs Expenses)
    timeChart = new Chart(document.getElementById('timeChart'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Income (₹)',
                    data: incomeByDate,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Expenses (₹)',
                    data: expenseByDate,
                    borderColor: '#ff6f61',
                    backgroundColor: 'rgba(255, 111, 97, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#2a2a72' }
                }
            },
            scales: {
                x: { ticks: { color: '#2a2a72' } },
                y: {
                    ticks: { color: '#2a2a72' },
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize App
loadFromLocalStorage();
renderIncomes();
renderExpenses();
renderTodos();
