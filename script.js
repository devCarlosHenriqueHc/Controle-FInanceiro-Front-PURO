const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

// URL da API
const API_URL = "http://localhost:8080/api/v1/transactions";

// Busca transações na API e atualiza a interface
const fetchTransactions = async () => {
    try {
        const response = await fetch(API_URL);
        const transactions = await response.json();
        updateTransactions(transactions);
    } catch (error) {
        console.error("Erro ao buscar transações:", error);
    }
};

// Atualiza a lista de transações
const updateTransactions = (transactions) => {
    transactionsUl.innerHTML = '';
    transactions.forEach(addTransactionsIntoDOM);
    updateBalanceValues(transactions);
};

// Remove transação da API
const removeTransaction = async (id) => {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTransactions();
    } catch (error) {
        console.error("Erro ao remover transação:", error);
    }
};

// Adiciona transação na interface
const addTransactionsIntoDOM = ({ amount, name, id }) => {
    const operator = amount < 0 ? '-' : '+';
    const CSSClass = amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(amount);
    const li = document.createElement('li');

    li.classList.add(CSSClass);
    li.innerHTML = `${name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onclick="removeTransaction(${id})">x</button>`;
    transactionsUl.append(li);
};

// Calcula despesas
const getExpenses = (transactionsAmounts) => Math.abs(transactionsAmounts.filter(value => value < 0).reduce((acc, value) => acc + value, 0)).toFixed(2);

// Calcula receitas
const getIncome = (transactionsAmounts) => transactionsAmounts.filter(value => value > 0).reduce((acc, value) => acc + value, 0).toFixed(2);

// Calcula saldo total
const getTotal = (transactionsAmounts) => transactionsAmounts.reduce((acc, transaction) => acc + transaction, 0).toFixed(2);

// Atualiza os valores de saldo, receitas e despesas
const updateBalanceValues = (transactions) => {
    const transactionsAmounts = transactions.map(({ amount }) => amount);
    const total = getTotal(transactionsAmounts);
    const income = getIncome(transactionsAmounts);
    const expense = getExpenses(transactionsAmounts);

    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `R$ ${expense}`;
};

// Envia nova transação para a API
const addTransactionToAPI = async (transactionName, transactionAmount) => {
    const transaction = {
        name: transactionName,
        amount: Number(transactionAmount)
    };
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaction)
        });
        fetchTransactions();
    } catch (error) {
        console.error("Erro ao adicionar transação:", error);
    }
};

// Limpa os campos de entrada
const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
};

// Manipula o envio do formulário
const handleFormSubmit = async (event) => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

    if (isSomeInputEmpty) {
        alert('Por favor, preencha nome e valor da transação!');
        return;
    }
    await addTransactionToAPI(transactionName, transactionAmount);
    cleanInputs();
};

// Inicializa as transações
fetchTransactions();

form.addEventListener('submit', handleFormSubmit);
