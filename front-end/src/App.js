import React from 'react';
// import GraphTest from './GraphTest';
import LineGraph from './LineGraph';
import AddSalary from './AddSalary';
import AddExpense from './AddExpense';
import PlanNav from './PlanNav';
import PageWrapper from './PageWrapper';
import Graph from './VXTest'
import LineChart from './LineChart'
function App() {
  return (
    <>


      <PageWrapper />
      <PlanNav />
      <LineChart />
      {/* <LineGraph /> */}
      {/* <AddSalary /> */}
      <AddExpense />
    </>
  );
}

export default App;
