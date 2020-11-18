app.service('appService', ['$http',  function($http) {

    // Dynamo
    var docClient;

    // Set AWS Config
    function setAWSConfig() {
        // Set up AWS
        AWS.config.update({
            accessKeyId: 'AKIAY4HPHXZPZ6IVY4FA', 
            secretAccessKey: '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', 
            region: 'us-east-2'
        });

        // Set up Dynamo
        docClient = new AWS.DynamoDB.DocumentClient();
    }

    // ---------------
    // dynamo
    // ---------------
    this.setAllData2 = (year, data, cb) => {

        setAWSConfig();

        // Params
        var params = {
            TableName: "ReadingPlan",
            Key: {
                "myPartitionKey": `ReadingPlan${year}`
            },
            UpdateExpression: "set myData = :d",
            ExpressionAttributeValues:{
                ":d": JSON.stringify(data)
            },
            ReturnValues:"UPDATED_NEW"
        };

        return docClient.update(params, cb);
    };

    this.getAllData2 = (year, cb) => {

        setAWSConfig();

        // Get
        var params = {
            TableName: "ReadingPlan",
            Key: {
                "myPartitionKey": `ReadingPlan${year}`
            }
        };

        return docClient.get(params, cb);
    };

    this.getMessageStatus2 = (cb) => {
        setAWSConfig();

        // Params
        var params = {
            TableName: "ReadingPlan",
            Key: {
                "myPartitionKey": "MessageStatus"
            }
        };

        return docClient.get(params, cb);
    };

    this.setMessageStatus2 = (messagesStatus, cb) => {
        setAWSConfig();

        // Params
        var params = {
            TableName: "ReadingPlan",
            Key: {
                "myPartitionKey": "MessageStatus"
            },
            UpdateExpression: "set myData = :d",
            ExpressionAttributeValues:{
                ":d": JSON.stringify(messagesStatus)
            },
            ReturnValues:"UPDATED_NEW"
        };

        return docClient.update(params, cb);
    };

    this.getPrayer2 = (year, cb) => {

        setAWSConfig();

        // Get
        var params = {
            TableName: "ReadingPlan",
            Key: {
                "myPartitionKey": `Prayer${year}`
            }
        };

        return docClient.get(params, cb);
    };

    
    this.setPrayer2 = (year, data, cb) => {
        
        setAWSConfig();

        // Params
        var params = {
            TableName: "ReadingPlan",
            Key: {
                "myPartitionKey": `Prayer${year}`
            },
            UpdateExpression: "set myData = :d",
            ExpressionAttributeValues:{
                ":d": JSON.stringify(data)
            },
            ReturnValues:"UPDATED_NEW"
        };

        return docClient.update(params, cb);
    };


    // ---------------
    // mLab
    // ---------------

    const url = 'https://api.mongolab.com/api/1/databases/mydb/collections/';
    const apiKey = `?apiKey=7dwZtQjBFYhef4N4WHi6xuTnveN4{pin}`;

    // Reading plan data
    this.getAllData = (pin, year) => $http.get(`${url}readingPlan${year}${apiKey.replace('{pin}', pin)}`);
    this.getDailyData = (pin, year, id) => $http.get(`${url}readingPlan${year}/${id}${apiKey.replace('{pin}', pin)}`);
    this.submit = (pin, year, id, data) => $http.put(`${url}readingPlan${year}/${id}${apiKey.replace('{pin}', pin)}`, data);

    // Prayer
    this.getPrayer = (pin, year) => $http.get(`${url}prayer${year}${apiKey.replace('{pin}', pin)}`);
    this.setPrayer = (pin, year, data) => $http.put(`${url}prayer${year}${apiKey.replace('{pin}', pin)}`, data);

    // Daily message status
    this.setMessageStatus = (pin, data) => $http.put(`${url}messageStatus${apiKey.replace('{pin}', pin)}`, data);
    this.getMessageStatus = (pin) => $http.get(`${url}messageStatus${apiKey.replace('{pin}', pin)}`);

    // Storing data
    this.putAllData = (pin, year, data) => $http.put(`${url}readingPlan${year}${apiKey.replace('{pin}', pin)}`, data);

}]);