const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))
let transactions = localStorage.getItem('transaction') !== null ? localStorageTransactions : []

const removeTransaction = ID =>{
    transactions = transactions.filter(transaction => id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionsIntoDOM = ({amount, name, id}) => {
    const operator = amount < 0 ? '-' : '+'//se o valor for true e menor que zero, vai armazenar uma string com sinal de subtração-, se for false vai armazenar string soma +
    const CSSClass = amount < 0 ? 'minus' : 'plus' //mesma coisa da linha acima
    const amountWithoutOperator = Math.abs(amount) //O método Math.abs() em Java retorna o valor absoluto de um número. Ou seja, ele remove qualquer sinal negativo e retorna sempre um número positivo ou zero.
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `${name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" inClick="removeTransaction(${id})">x</button>`
    transactionsUl.append(li)   
}

const getExpenses = (transactionsAmounts) => Math.abs(transactionsAmounts.filter(value => value < 0).reduce((accumulator, value) => accumulator + value, 0)).toFixed(2)

const getIncome = (transactionsAmounts) => transactionsAmounts.filter(value => value > 0).reduce((accumulator, value) => accumulator + value, 0).toFixed(2)

const getTotal = (transactionsAmounts) => transactionsAmounts.reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2)

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({amount}) => amount) //map() transforma sua array em uma nova, sem modificar a original
    const total = getTotal(transactionsAmounts)
    const income = getIncome(transactionsAmounts)
    const expense = getExpenses(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionsIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () =>{
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateId = () => Math.round(Math.random() * 1000) // gera um id aleatorio de 0 a 1000

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id:generateId(), 
        name: transactionName, 
        amount: Number(transactionAmount)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if(isSomeInputEmpty) { //verifica se os campos de entrada  estão vazios ou contêm apenas espaços em branco antes de prosseguir com alguma ação.
        alert('Por favor, preecha nome e valor da transação!')
        return        
    }
    addToTransactionsArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()

    cleanInputs()

}

form.addEventListener('submit', handleFormSubmit)
