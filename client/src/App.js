import { useState, useEffect, createContext } from 'react';
import './App.css';
import { Lomake } from './components/Lomake';
import Taulukko from './components/Taulukko';

export const Context = createContext(undefined);

function App() {

  const [log, setLog] = useState([])

  const haeData = async () => {
    await fetch("http://localhost:3001/")
    .then((response) => response.json())
    .then((data) => setLog(data.data))
  }

  useEffect(() => {
    haeData()
  }, [])
  

  return (
  <Context.Provider value={{log, setLog, haeData}}> 
    <div className="App">
    <Lomake/>
    <Taulukko/>
    </div>
  </Context.Provider>
  );
}

export default App;
