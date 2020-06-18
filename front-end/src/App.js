import React from 'react';
// import GraphTest from './GraphTest';
import LineGraph from './LineGraph';
import AddSalary from './AddSalary';
import AddExpense from './AddExpense';
import PlanNav from './PlanNav';

function App() {
  return (
    <>
      <PlanNav />
      <LineGraph />
      <AddSalary />
      <AddExpense />
    </>
  );
}

export default App;
