import React, { useState, useEffect } from 'react';

import { FiChevronDown } from 'react-icons/fi';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import { Container, CardContainer, Card, TableContainer, Icon } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const storagedTransactions = localStorage.getItem(
      '@GoFinances:transactions',
    );
    if (storagedTransactions) {
      return JSON.parse(storagedTransactions);
    }
    return [];
  });
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [active, setActive] = useState<boolean[]>([false, false, false, false]);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const {
        data: { balance: balanceApi, transactions: transactionsApi },
      } = await api.get('/transactions');
      localStorage.setItem(
        '@GoFinances:transactions',
        JSON.stringify(transactionsApi),
      );
      setTransactions(transactionsApi);
      localStorage.setItem('@GoFinances:balance', JSON.stringify(balanceApi));
      setBalance(balanceApi);
    }
    loadTransactions();
  }, []);

  function compareTitle(a: Transaction, b: Transaction): number {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  }
  function compareValue(a: Transaction, b: Transaction): number {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  }
  function compareCategory(a: Transaction, b: Transaction): number {
    if (a.category < b.category) {
      return -1;
    }
    if (a.category > b.category) {
      return 1;
    }
    return 0;
  }
  function compareDate(a: Transaction, b: Transaction): number {
    if (a.category < b.category) {
      return -1;
    }
    if (a.category > b.category) {
      return 1;
    }
    return 0;
  }
  function orderBy(key: string, order = 'asc', list: Transaction[]): void {
    let newArray = list;
    if (key === 'title') {
      setActive([true, false, false, false]);
      newArray = list.sort(compareTitle);
    } else if (key === 'price') {
      setActive([false, true, false, false]);
      newArray = list.sort(compareValue);
    } else if (key === 'category') {
      setActive([false, false, true, false]);
      newArray = list.sort(compareCategory);
    } else {
      setActive([false, false, false, true]);
      newArray = list.sort(compareDate);
    }
    setTransactions(newArray);
  }
  console.log(transactions[0].category.title);
  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {`${Number(balance.income).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                style: 'currency',
                currency: 'BRL',
              })}`}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {`${Number(balance.outcome).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                style: 'currency',
                currency: 'BRL',
              })}`}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {' '}
              {`${Number(balance.total).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                style: 'currency',
                currency: 'BRL',
              })}`}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  Título
                  <Icon
                    size={14}
                    active={active[0]}
                    onClick={() => orderBy('title', 'asc', transactions)}
                  />
                </th>
                <th>
                  Preço
                  <Icon
                    active={active[1]}
                    size={14}
                    onClick={() => orderBy('price', 'asc', transactions)}
                  />
                </th>
                <th>
                  Categoria
                  <Icon
                    active={active[2]}
                    size={14}
                    onClick={() => orderBy('category', 'asc', transactions)}
                  />
                </th>
                <th>
                  Data
                  <Icon
                    active={active[3]}
                    size={14}
                    onClick={() => orderBy('date', 'asc', transactions)}
                  />
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr>
                  <td className="title">{transaction.title}</td>
                  <td className={`${transaction.type}`}>
                    {`${transaction.type === 'income' ? '' : '-'} ${Number(
                      transaction.value,
                    ).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      style: 'currency',
                      currency: 'BRL',
                    })}`}
                  </td>
                  <td>{transaction.title}</td>
                  <td>
                    {`${new Date(transaction.created_at).toLocaleDateString(
                      'pt-BR',
                    )}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
