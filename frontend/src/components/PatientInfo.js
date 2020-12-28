import {useState, useEffect} from 'react';
import {url} from "../constants";
import styles from './PatientInfo.module.css';


function PatientInfo(props) {
    const {searchString} = props;
    const [patientData, setPatientData] = useState({});
    let list = [];
    useEffect(() => {
        if(searchString.length > 0) {
            fetchList(url + '/names/' + searchString)
                .then(response => JSON.parse(response))
                .then(data => {
                    setPatientData(data)
                })
                .catch(error => console.log(error))
        }
    }, [searchString]);
    for(let [key, value] of Object.entries(patientData)) {
        list.push(
            <li key={key}>
                <span className={styles.name}>{validateName(key)} : </span>
                <span className={styles.value}>{round(value, 4)}</span>
            </li>
        );
    }
    let component = (
        <ul className={styles.info}>
            {list}
        </ul>
    )
    return searchString.length > 0 ? component : null;
}

async function fetchList(url) {
    const result = await fetch(url);
    return await result.json()
}

function validateName(name) {
    return name.split('_').join(' ');
}

function round(value, places) {
    const float = parseFloat(value)
    if(!float) return value;
    return float.toFixed(places);
}

export default PatientInfo;