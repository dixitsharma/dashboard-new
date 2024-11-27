import {
  CostExplorerClient,
  GetCostAndUsageCommand,
  GetCostAndUsageWithResourcesCommand
} from '@aws-sdk/client-cost-explorer';
export const handler = async (event) => {
  try {
    const response = await secretClient.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );
    const secret = JSON.parse(response.SecretString);
    const writeFileToS3 = (data, fileName, type) => {
      // const params = {
      //     Bucket: bucketName, // your bucket name
      //     Key: fileName, // Date.now() is use for creating unique file name
      //     ACL: 'public-read',
      //     Body: data,
      //     ContentType: type//'text/csv',
      //   };
      //   s3.upload(params, (s3Err, data) => {
      //     if (s3Err) {
      //       throw s3Err;
      //     }
      //     return res.status(200).json({ message: `File uploaded successfully at ${data.Location}` });
      //   });
    }
    const accountMap = {
      orange: '833923177614',
      red: '565378680304',
      green: '767904627276'
    };
    const getGroups = (groupBy, groups, CommandType) => {
      let label = '';
      switch (groupBy) {
        case 'resource': {
          label = 'resource_ID';
          CommandType = GetCostAndUsageWithResourcesCommand;
          groups.push({ Type: 'DIMENSION', Key: 'RESOURCE_ID' });
          break;
        }
        case 'service': {
          label = 'services';
          groups.push({ Type: 'DIMENSION', Key: 'SERVICE' });
          break;
        }
        case 'product': {
          label = 'products';
          groups.push({ Type: 'TAG', Key: 'Product' });
          break;
        }
        case 'region': {
          label = 'region';
          groups.push({ Type: 'DIMENSION', Key: 'REGION' });
          break;
        }
        case 'instance_type': {
          label = 'instance_type';
          groups.push({ Type: 'DIMENSION', Key: 'INSTANCE_TYPE' });
          break;
        }
        case 'charge_type': {
          label = 'charge_type';
          groups.push({ Type: 'DIMENSION', Key: 'RECORD_TYPE' });
          break;
        }
        case 'usage_type': {
          label = 'usage_type';
          groups.push({ Type: 'DIMENSION', Key: 'USAGE_TYPE' });
          break;
        }
        case 'aws_charge_types': {
          label = 'cc_aws_charge_types';
          groups.push({ Type: 'COST_CATEGORY', Key: 'AWS Charge Types' });
          break;
        }
        case 'aws_shared_services': {
          label = 'cc_aws_shared_services';
          groups.push({ Type: 'COST_CATEGORY', Key: 'AWS Shared Services' });
          break;
        }
        case 'aws_coder_and_coder_plus': {
          label = 'cc_aws_coder_and_coder_plus';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Coder and Coder Plus' });
          break;
        }
        case 'cc_development': {
          label = 'cc_development';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Development' });
          break;
        }
        case 'cc_environment': {
          label = 'cc_environment';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Environment' });
          break;
        }
        case 'cc_experience': {
          label = 'cc_experience';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Experience' });
          break;
        }
        case 'cc_non_hosting': {
          label = 'cc_non_hosting';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Non Hosting' });
          break;
        }
        case 'cc_platform_total_cost': {
          label = 'cc_platform_total_cost';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Platform - Total Cost' });
          break;
        }
        case 'cc_portfolio': {
          label = 'cc_portfolio';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Portfolio' });
          break;
        }
        case 'cc_product_group': {
          label = 'cc_product_group';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Product Group' });
          break;
        }
        case 'cc_product_tier': {
          label = 'cc_product_tier';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Product Tier - 1' });
          break;
        }
        case 'cc_production': {
          label = 'cc_production';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Production' });
          break;
        }
        case 'cc_production_and_development': {
          label = 'cc_production_and_development';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Production and Development' });
          break;
        }
        case 'cc_products_module': {
          label = 'cc_products_module';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Products_Module' });
          break;
        }
        case 'cc_safety_gateway': {
          label = 'cc_safety_gateway';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Safety Gateway' });
          break;
        }
        case 'cc_sub_processes': {
          label = 'cc_sub_processes';
          groups.push({ Type: 'COST_CATEGORY', Key: 'Sub Processes' });
          break;
        }
        case 'operation': {
          label = 'operation';
          groups.push({ Type: 'DIMENSION', Key: 'OPERATION' });
          break;
        }
        case 'az': {
          label = 'availability_zone';
          groups.push({ Type: 'DIMENSION', Key: 'AZ' });
          break;
        }
        case 'platform': {
          label = 'platform';
          groups.push({ Type: 'DIMENSION', Key: 'PLATFORM' });
          break;
        }
        case 'purchase_type': {
          label = 'purchase_type';
          groups.push({ Type: 'DIMENSION', Key: 'PURCHASE_TYPE' });
          break;
        }
        case 'tenancy': {
          label = 'tenancy';
          groups.push({ Type: 'DIMENSION', Key: 'TENANCY' });
          break;
        }
        case 'database_engine': {
          label = 'database_engine';
          groups.push({ Type: 'DIMENSION', Key: 'DATABASE_ENGINE' });
          break;
        }
        case 'billing_entity': {
          label = 'billing_entity';
          groups.push({ Type: 'DIMENSION', Key: 'BILLING_ENTITY' });
          break;
        }
        case 'legal_entity': {
          label = 'legal_entity';
          groups.push({ Type: 'DIMENSION', Key: 'LEGAL_ENTITY_NAME' });
          break;
        }
        case 'rt_tenant': {
          label = 'rt_tenant';
          groups.push({ Type: 'TAG', Key: 'Tenant' });
          break;
        }
        case 'rt_aws_batch_compute_environment': {
          label = 'rt_aws_batch_compute_environment';
          groups.push({ Type: 'TAG', Key: 'aws:batch:compute-environment' });
          break;
        }
        case 'rt_aws_batch_job_definition': {
          label = 'rt_aws_batch_job_definition';
          groups.push({ Type: 'TAG', Key: 'aws:batch:job-definition' });
          break;
        }
        case 'rt_aws_batch_job_queue': {
          label = 'rt_aws_batch_job_queue';
          groups.push({ Type: 'TAG', Key: 'aws:batch:job-queue' });
          break;
        }
        case 'rt_aws_createdBy': {
          label = 'rt_aws_createdBy';
          groups.push({ Type: 'TAG', Key: 'aws:createdBy' });
          break;
        }
        case 'rt_aws_ecs_clusterName': {
          label = 'rt_aws_ecs_clusterName';
          groups.push({ Type: 'TAG', Key: 'aws:ecs:clusterName' });
          break;
        }
        case 'rt_aws_ecs_serviceName': {
          label = 'rt_aws_ecs_serviceName';
          groups.push({ Type: 'TAG', Key: 'aws:ecs:serviceName' });
          break;
        }
        case 'rt_aws_eks_cluster_name': {
          label = 'rt_aws_eks_cluster_name';
          groups.push({ Type: 'TAG', Key: 'aws:eks:cluster-name' });
          break;
        }
        case 'rt_company': {
          label = 'rt_company';
          groups.push({ Type: 'TAG', Key: 'Company' });
          break;
        }
        case 'rt_cost': {
          label = 'rt_cost';
          groups.push({ Type: 'TAG', Key: 'Cost' });
          break;
        }
        case 'rt_cost_center': {
          label = 'rt_cost_center';
          groups.push({ Type: 'TAG', Key: 'CostCenter' });
          break;
        }
        case 'rt_customer': {
          label = 'rt_customer';
          groups.push({ Type: 'TAG', Key: 'Customer' });
          break;
        }
        case 'rt_environment': {
          label = 'rt_environment';
          groups.push({ Type: 'TAG', Key: 'Environment' });
          break;
        }
        case 'rt_name': {
          label = 'rt_name';
          groups.push({ Type: 'TAG', Key: 'Name' });
          break;
        }
        case 'rt_owner': {
          label = 'rt_owner';
          groups.push({ Type: 'TAG', Key: 'Owner' });
          break;
        }
        case 'rt_type': {
          label = 'rt_type';
          groups.push({ Type: 'TAG', Key: 'Type' });
          break;
        }
        case 'rt_workspace_user': {
          label = 'rt_workspace_user';
          groups.push({ Type: 'TAG', Key: 'Workspace_User' });
          break;
        }
        case 'rt_aws_application': {
          label = 'rt_aws_application';
          groups.push({ Type: 'TAG', Key: 'awsApplication' });
          break;
        }
        case 'rt_custodian_cleanup': {
          label = 'rt_custodian_cleanup';
          groups.push({ Type: 'TAG', Key: 'custodian_cleanup' });
          break;
        }
      }
      return { groups, label, CommandType };
    }
    const getCosts = async ({ account, granularity, groupBy }, nextGenToken = null, finalData = []) => {
      const client = new CostExplorerClient({
        region: 'us-east-1',
        credentials: {
          accessKeyId: secret.aws_access_key_id,
          secretAccessKey: secret.aws_secret_access_key,
          sessionToken: secret.aws_session_token
         }//fromSSO({ profile: 'CostExplorer' })
      });
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14).toISOString();
      // const firstDay = new Date(today.getFullYear(), today.getMonth() - 12, 1).toISOString();
      // const lastDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
      const lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      let filter = undefined;
      if (account != null) {
        filter = {
          Dimensions: {
            Key: 'LINKED_ACCOUNT',
            Values: [accountMap[account]]
          }
        };
      }

      let label = [];
      // let CommandType = GetCostAndUsageWithResourcesCommand;
      let CommandType = GetCostAndUsageCommand;
      // const groups = [ { Type: 'DIMENSION', Key: 'RESOURCE_ID' } ];
      const groups = [];
      // console.log(groupBy);
      groupBy = typeof groupBy == 'string' ? groupBy?.split(',') : groupBy;
      if (groupBy) {
        if (groupBy.length === 2) {
          const returnVal = getGroups(groupBy[0], groups, CommandType);
          const returnVal2 = getGroups(groupBy[1], groups, returnVal.CommandType);
          label.push(returnVal.label);
          label.push(returnVal2.label);
          CommandType = returnVal2.CommandType;
          // console.log(groups);
        } else {
          const returnVal2 = getGroups(groupBy[0], groups, CommandType);
          label.push(returnVal2.label);
          CommandType = returnVal2.CommandType;
        }
      }
      const commandValue = {
        Granularity: granularity.toUpperCase(),
        Metrics: ['UnblendedCost', 'UsageQuantity'],
        TimePeriod: {
          Start: firstDay.substring(0, firstDay.indexOf('T')),
          End: lastDay.substring(0, lastDay.indexOf('T'))
        },
        GroupBy: groups,
        Filter: filter
      }
      if (nextGenToken) {
        commandValue["NextPageToken"] = nextGenToken;
      }
      // const params = {TimePeriod:{Start:'2024-11-20', End:'2024-11-27'}, Granularity:'DAILY', Metrics:['UnblendedCost', 'UsageQuantity']}
      const command = new CommandType(commandValue);
      const response = await client.send(command);
      // statusCode: 200,
      // body: JSON.stringify('Hello from Lambda!'),
      return JSON.stringify(response);
      // console.log(response)
      // return getCosts({account: 'green',granularity: 'daily',groupBy: 'resource'});
    }
    return getCosts({ account: 'green', granularity: 'daily', groupBy: 'resource' });
  }
  catch (error) {
    console.error("Error retrieving secret:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to retrieve secret.",
        error: error.message,
      }),
    };
  }
};
