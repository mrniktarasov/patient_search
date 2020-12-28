import {useState, useEffect, useReducer, useRef, useCallback} from 'react';
import {Search, Label} from 'semantic-ui-react';
import './Search.css';
import {url} from "../constants";
import Fuse from 'fuse.js';


const initialState = {
    loading: false,
    results: [],
    value: '',
}

function searchReducer(state, action) {
    switch (action.type) {
        case 'CLEAN_QUERY':
            return initialState
        case 'START_SEARCH':
            return { ...state, loading: true, value: action.query }
        case 'FINISH_SEARCH':
            return { ...state, loading: false, results: action.results }
        case 'UPDATE_SELECTION':
            return { ...state, value: action.selection }

        default:
            throw new Error()
    }
}

const searchOptions = keys => ({
    shouldSort: true,
    threshold: 0,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [...keys]
});

const resultRenderer = ({item}) => <Label content={item} />

function filterList(list, filter){
    if (!filter) return list;

    const fuse = new Fuse(list, searchOptions(['body']));
    return fuse.search(filter);
}

function DropSearch(props) {
    const {setSearchString} = props;
    const [list, setList] = useState([]);
    const [state, dispatch] = useReducer(searchReducer, initialState);
    const { loading, results, value } = state;

    const timeoutRef = useRef();
    const handleSearchChange = useCallback((e, data) => {
        clearTimeout(timeoutRef.current);
        dispatch({ type: 'START_SEARCH', query: data.value });

        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                dispatch({ type: 'CLEAN_QUERY' });
                return;
            }

            const filteredList = filterList(list, data.value)
            dispatch({
                type: 'FINISH_SEARCH',
                results: filteredList,
            })
        }, 300)
    }, [list])
    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    useEffect(() => {
        fetchList(url + '/names/')
            .then(response => JSON.parse(response))
            .then(data => {
                setList(Object.values(data))
            })
            .catch(error => console.log(error))
    }, []);

    return (
        <Search
            dropdown = {6}
            loading={loading}
            onResultSelect={(e, data) => {
                dispatch({type: 'UPDATE_SELECTION', selection: data.result.item});
                setSearchString(data.result.item);
            }}
            onSearchChange={handleSearchChange}
            resultRenderer={resultRenderer}
            results={results}
            value={value}
        />
    );
}

async function fetchList(url) {
    const result = await fetch(url);
    return await result.json();
}

export default DropSearch;