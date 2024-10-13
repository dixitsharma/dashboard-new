import Papa from 'papaparse';
import { useState } from 'react';

export const CsvToJson = () => {
    const [jsonData, setJsonData] = useState([]);
    const readFile = () => {
        Papa.parse('../monthly.csv', {
            download: true,
            quotes: false, //or array of booleans
            quoteChar: '"',
            escapeChar: '"',
            delimiter: ",",
            header: true, //or array of strings
            complete: (result) => {
                setJsonData(result.data);
            },
        });
    }
    return [jsonData, readFile];
}