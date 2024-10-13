import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Chart } from "react-google-charts";
function Products(props) {
    const columns = [
        { field: 'id', headerName: 'Product', width: 250 },
        { field: 'cost', headerName: 'Cost', width: 100 },
        { field: 'percentage', headerName: 'Percentage Share', width: 150 },
    ];
    const [productData, setProductData] = useState([]);
    const [chartData, setChartData] = useState([['Product', 'Percentage', {role: 'tooltip'}]]);
    const [totalCost, setTotalCost] = useState(0);
    const calcPercent = (total, percentage) => {
        return parseFloat(((percentage * 100) / total).toFixed(2));
    }
    useEffect(() => {
        let totalCostVal = 0;
        const dataMap = new Map();
        props.productsData.forEach(value => {
            if (dataMap.has(value.Product)) {
                const product = dataMap.get(value.Product);
                dataMap.set(value.Product, { product: value.Product, cost: Number(value.total_cost) + product.cost });
            } else {
                dataMap.set(value.Product, { product: value.Product, cost: Number(value.total_cost) });
            }
            totalCostVal += Number(value.total_cost);
        });
        const dataArray = Array.from(dataMap.values());
        const data = [['Product', 'Percentage', {role: 'tooltip'}]];
        const values = dataArray.map((val) => {
            const cost = parseFloat(val.cost.toFixed(2));
            const percentage = calcPercent(totalCostVal, cost);
            data.push([val.product, cost > 0 ? cost : 0, `${val.product}, $${cost} (${percentage}%)`]);
            return { id: val.product, cost: '$' + cost, percentage: percentage + '%' }
        });
        setTotalCost(totalCostVal);
        setProductData(values);
        setChartData(data);
    }, [props.productsData]);
    return (
        <>
            <div style={{ display: 'flex', marginTop: 10 }}>
                <Box sx={{ height: 400, width: '45%', mx: 5, mt: 2 }}>
                    <h5>Products from {props.startDate} to {props.endDate} </h5>
                    <DataGrid
                        rows={[...productData, { id: 'Total', cost: '$' + totalCost.toFixed(2), percentage: '100%' }]}
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
                    options={{
                        title: `Total Cost: $${totalCost.toFixed(2)}`,
                        pieSliceText: "label",
                        legend: {
                            position: "bottom",
                            alignment: "center",
                            textStyle: {
                                color: "#233238",
                                fontSize: 14,
                            },
                        },
                    }}
                    width={"90%"}
                    height={"525px"}
                />
            </div>
        </>
    );
}

export default Products;
