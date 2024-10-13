import './App.css';
import { useState, useEffect } from 'react';
import { CsvToJson } from './utility/CsvToJson';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Products from './components/Products';
import Services from './components/Services';
import { Card } from '@mui/material';
import Loader from './utility/Loader';

function App() {
  dayjs.extend(isBetween);
  const [isLoding, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));
  const [jsonData, readFile] = CsvToJson();
  useEffect(() => {
    setIsLoading(true);
    readFile();
  }, []);
  useEffect(() => {
    setDashboardData(jsonData);
  }, [jsonData]);
  useEffect(() => {
    // setTimeout(()=>{
      // setIsLoading(true);
      refreshData(startDate, endDate);
  // })
  }, [ jsonData]);

  const refreshData = (stDate, enDate) => {
    if (jsonData) {
      const data = jsonData.filter(val => {
        const dateToCheck = dayjs(val.Date);
        return dateToCheck.isBetween(stDate, enDate);
      });
      setDashboardData(data); 
      setIsLoading(false);
    }
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {isLoding && <Loader background="rgba(0,0,0,0.5)" />}
      <div className="App">
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div>
            <DateTimePicker
             inputProps={{ size: 'small' }}
              label="Start Date"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
                refreshData(newValue, endDate);
              }}
            />
            <DateTimePicker
              inputProps={{ size: 'small' }}
              className='ml-20'
              label="End Date"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
                refreshData(startDate, newValue);
              }}
            />
          </div>
          <Card sx={{height: '550px'}}>
          <Products productsData={dashboardData} startDate={startDate?.format('MM/DD/YYYY')} endDate={endDate?.format('MM/DD/YYYY')}></Products>
          </Card>
          <Card>
          <Services productsData={dashboardData} startDate={startDate?.format('MM/DD/YYYY')} endDate={endDate?.format('MM/DD/YYYY')}></Services>
          </Card>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default App;
