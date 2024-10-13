import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Chart } from "react-google-charts";
import Resources from './Resources';
function Services(props) {
    const columns = [
        { field: 'product', headerName: 'Product', width: 250  },
        { field: 'id', headerName: 'Services', width: 120 },
        { field: 'cost', headerName: 'Cost', width: 150 },

    ];
    const [products, setProducts] = useState({});
    const [serviceData, setServiceData] = useState([]);
    const [chartData, setChartData] = useState([['Services', 'Percentage', {role: 'tooltip'}]]);
    const [totalCost, setTotalCost] = useState(0);
    const calcPercent = (total, percentage) => {
        return parseFloat(((percentage * 100) / total).toFixed(2));
    }
    useEffect(() => {
        const productList = {};
        props.productsData.forEach(value => {
            if (productList[value.Product]) {
                productList[value.Product].push({
                    product: value.Product, service: value.Service,
                    cost: value.total_cost, resources: value.Resource, operation: value.line_item_operation
                });
            } else {
                productList[value.Product] = [{
                    product: value.Product, service: value.Service,
                    cost: value.total_cost, resources: value.Resource, operation: value.line_item_operation
                }];
            }
        });
        setProducts(productList);

    }, [props.productsData]);
    const setServicesData = (prodVal) => {
        if (!prodVal) {
            setTotalCost(0);
            setServiceData([]);
            setChartData([['Services', 'Percentage', {role: 'tooltip'}]]);
            return;
        }
        let totalCostVal = 0;
        const dataMap = new Map();
        const productsData = products[prodVal];
        productsData.forEach(value => {
            if (dataMap.has(value.service)) {
                const service = dataMap.get(value.service);
                dataMap.set(value.service, { service: value.service, cost: Number(value.cost) + service.cost });
            } else {
                dataMap.set(value.service, { service: value.service, cost: Number(value.cost) });
            }
            totalCostVal += Number(value.cost);
        });
        const dataArray = Array.from(dataMap.values());
        const data = [['Services', 'Percentage', {role: 'tooltip'}]];
        const values = dataArray.map((val) => {
            const cost = parseFloat(val.cost.toFixed(2))
            const percentage = calcPercent(totalCostVal, cost);
            data.push([val.service, cost > 0 ? cost : 0, `${val.service}, $${cost} (${percentage}%)`]);
            return { id: val.service, cost: '$' + cost, product: prodVal }
        });
        setTotalCost(totalCostVal);
        setServiceData(values);
        setChartData(data);
    }
    const [selectedProduct, setSelectedProduct] = useState('');
    return (
        <>
            <div style={{ display: 'flex', marginTop: 10, marginLeft: 10  }}>
                <Autocomplete
                    value={selectedProduct}
                    onChange={(event, newValue) => {
                        setSelectedProduct(newValue);
                        setServicesData(newValue);
                    }}
                    id="controllable-states-combo"
                    options={Object.keys(products)}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Product" />}
                />
            </div>
            <div style={{ display: 'flex', marginTop: 10, height: '550px' }}>
                <Box sx={{ height: 400, width: '45%', mx: 5, mt: 2 }}>
                    <h5>AWS Services from {props.startDate} to {props.endDate} </h5>
                    <DataGrid
                        rows={[{ id: '', cost: '$' + totalCost.toFixed(2), product: 'Total' }, ...serviceData]}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 100,
                                },
                            },
                        }}
                        pageSizeOptions={[50, 100, 200]}
                        disableRowSelectionOnClick
                    />
                </Box>
                <Chart
                    chartType="PieChart"
                    data={chartData}
                    options={{ title: `Total Cost: $${totalCost.toFixed(2)}` ,
                    pieSliceText: "label",
                     legend: {
                        position: "bottom",
                        alignment: "center",
                        textStyle: {
                          color: "#233238",
                          fontSize: 14,
                        },
                      }, }}
                      width={"90%"}
                    height={"525px"}
                />
            </div>
            <div style={{marginTop: 10}}>
                
            <Resources product={selectedProduct} productsData={products[selectedProduct]?? []} 
            startDate={props?.startDate}
             endDate={props?.endDate}></Resources>
            </div>
        </>
    );
}

export default Services;
