import './App.css';
import Form from './pages/form/Form';
import AllLeads from './pages/allLeads/AllLeads';
import { useState } from 'react';

function App() {
  const [showForm, setShowForm] = useState(true);

  return (
    <>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'View Leads' : 'Capture Lead'}
      </button>
      {showForm ? <Form /> : <AllLeads />}
    </>
  );
}

export default App;
