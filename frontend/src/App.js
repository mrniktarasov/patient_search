import {useState} from 'react';
import styles from './App.module.css';
import DropSearch from './components/Search';
import PatientInfo  from "./components/PatientInfo";


function App() {
    const [searchString, setSearchString] = useState('');

  return (
      <div className={styles.container}>
        <DropSearch setSearchString={setSearchString}/>
        <PatientInfo searchString={searchString}/>
      </div>
  );
}

export default App;
