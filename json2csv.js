// const { Command } = require('commander');
// const program = new Command();
const converter = require('json-2-csv');
const fs = require('fs');

// (async () => {
//     const awsCommand = (await import('./aws/aws.mjs')).default;

//     program
//         .version('0.1.0')
//         .description("A set of tools for Acorn DevOps");

//     // Load sub commands
//     program.addCommand(awsCommand(program));

//     // Parse
//     program.parse(process.argv);
// })();
    const value = require('../output/green-monthly-byproduct.json')
// fetch('./../output/green-monthly-byproduct.json').then((result => result.json())).then(value => {
    const finalJson = [];
    
    if (value && value.ResultsByTime) {
        value.ResultsByTime.forEach(value => {
            value.Groups.forEach((data) => {
                finalJson.push({
                    "Product": data.Keys[1].split('$')[1] ?? '',
                    "Services": data.Keys[0],
                    "Cost":  data.Metrics.UnblendedCost.Amount,
                    "Start": value.TimePeriod.Start,
                    "End": value.TimePeriod.End,
                })
            })

        });
    }
    console.log(finalJson);
    // Convert JSON to CSV
    const csv = converter.json2csv(finalJson);//, (err, csv) => {
        // console.log(err, "ERror");
        console.log("CSV", csv)
        // if (err) {
        //     throw err;
        // }

        // Write CSV to a file
        fs.writeFileSync('output1.csv', csv);
        console.log('CSV file has been created');
    // });
// }).catch(err => { console.log(err) }
// )

