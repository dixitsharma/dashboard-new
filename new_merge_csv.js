const fs = require('fs');
const csv = require('fast-csv');

// const files = ['red-daily-byaws_charge_types.csv', 'red-daily-byaws_coder_and_coder_plus.csv', 'red-daily-byaws_shared_services.csv','red-daily-byaz.csv','red-daily-bybilling_entity.csv','red-daily-bycc_development.csv','red-daily-bycc_environment.csv','red-daily-bycc_experience.csv','red-daily-bycc_non_hosting.csv','red-daily-bycc_platform_total_cost.csv','red-daily-bycc_portfolio.csv','red-daily-bycc_product_group.csv','red-daily-bycc_product_tier.csv','red-daily-bycc_production_and_development.csv','red-daily-bycc_production.csv','red-daily-bycc_products_module.csv','red-daily-bycc_safety_gateway.csv','red-daily-bycc_sub_processes.csv','red-daily-bycharge_type.csv','red-daily-bydatabase_engine.csv','red-daily-byinstance_type.csv','red-daily-bylegal_entity.csv','red-daily-byoperation.csv','red-daily-byplatform.csv','red-daily-byproduct.csv','red-daily-bypurchase_type.csv','red-daily-byregion.csv','red-daily-byrt_aws_application.csv','red-daily-byrt_aws_batch_compute_environment.csv','red-daily-byrt_aws_batch_job_definition.csv','red-daily-byrt_aws_batch_job_queue.csv','red-daily-byrt_aws_createdBy.csv','red-daily-byrt_aws_ecs_clusterName.csv','red-daily-byrt_aws_ecs_serviceName.csv','red-daily-byrt_aws_eks_cluster_name.csv','red-daily-byrt_company.csv','red-daily-byrt_cost_center.csv','red-daily-byrt_cost.csv','red-daily-byrt_custodian_cleanup.csv','red-daily-byrt_customer.csv','red-daily-byrt_environment.csv','red-daily-byrt_name.csv','red-daily-byrt_owner.csv','red-daily-byrt_tenant.csv','red-daily-byrt_type.csv','red-daily-byrt_workspace_user.csv','red-daily-byservice.csv','red-daily-bytenancy.csv','red-daily-byusage_type.csv'];
const files = ['red-daily-byproduct.csv', 'red-daily-byservice.csv'];
const results = [];
const headersSet = new Set();
const month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14).toISOString();
const currentMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14).getMonth();

function concatCSVAndOutput(csvFilePaths, outputFilePath) {
  const promises = csvFilePaths.map((path) => {
    path = `daily_output/${firstDay.substring(0, firstDay.indexOf('T'))}/${path}`;
    return new Promise((resolve) => {
      const dataArray = [];
      return csv
        .parseFile(path, { headers: true })
        .on('data', function (data) {
          dataArray.push(data);
        })
        .on('end', function () {
          resolve(dataArray);
        });
    });
  });

  return Promise.all(promises)
    .then((results) => {
      // console.log(results);

      const csvStream = csv.format({ headers: true });
      const writableStream = fs.createWriteStream(outputFilePath);

      writableStream.on('finish', function () {
        console.log('DONE!');
      });
      let resultData = results[0];
      csvStream.pipe(writableStream);
      results.forEach((result, index) => {
        if (index) {
          const missingCols = Object.keys(result[0]).filter(
            (val) => !Object.keys(resultData[0]).includes(val));
          const missingCols2 = Object.keys(resultData[0]).filter(
            (val) => !Object.keys(result[0]).includes(val));
          // console.log(missingCols, missingCols2);
          const finalData = [];
          result.forEach((data) => {
            let isExist = false;
            resultData = resultData.map((value) => {
              if (value.Resource_ID === data.Resource_ID
                &&
                value.Cost === data.Cost &&
                value.Start === data.Start
              ) {
                missingCols.forEach((val) => {
                  value[val] = data[val];
                })
                isExist = true;
                return value;
              } else {
                missingCols.forEach((val) => {
                  if (!value.hasOwnProperty(val)) {
                    value[val] = '';
                  }
                })
                return value;
              }
            })
            if (!isExist) {
              // console.log(missingCols2,"=============================", data.Resource_ID)
              missingCols2.forEach((val) => {
                data[val] = '';
              })
              finalData.push(data);
            }
          });
          //   console.log(finalData,"===================")
          resultData = [...resultData, ...finalData];
        }
      });
      resultData.forEach((data) => {
        csvStream.write(data);
      });
      // let resultData = [];
      // csvStream.pipe(writableStream);
      // results.forEach((result) => {
      //   result.forEach((data) => {
      //     csvStream.write(data);
      //   });
      // });
      csvStream.end();

    });
}

(function () {
  const path = month[currentMonth];
  fs.mkdirSync(path, { recursive: true });
  concatCSVAndOutput(files, `${path}/${firstDay.substring(0, firstDay.indexOf('T'))}_red.csv`)
    .then(() => { console.log('CSV files merged successfully') });
})();
