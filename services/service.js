app.service('appService', ['$http',  function($http) {

    // Dynamo
    var docClient;

    // Set AWS Config
    function setAWSConfig(pin) {

        var p1 = pin[0].charCodeAt();
        var p2 = pin[1].charCodeAt();
        var p3 = pin[2].charCodeAt();
        var p4 = pin[3].charCodeAt();

        var accessKeyId = String.fromCharCode(p1+11) +
            String.fromCharCode(p1+21) +
            String.fromCharCode(p1+19) +
            String.fromCharCode(p1+11) +
            String.fromCharCode(p1+35) +
            String.fromCharCode(p2-66) +
            String.fromCharCode(p2-46) +
            String.fromCharCode(p2-38) +
            String.fromCharCode(p2-46) +
            String.fromCharCode(p2-30) +
            String.fromCharCode(p3+12) +
            String.fromCharCode(p3+2) +
            String.fromCharCode(p3-24) +
            String.fromCharCode(p3-3) +
            String.fromCharCode(p3-10) +
            String.fromCharCode(p4-15) +
            String.fromCharCode(p4-11) +
            String.fromCharCode(p4-9) +
            String.fromCharCode(p4-2) +
            String.fromCharCode(p4+4);

        var secretAccessKey = String.fromCharCode(p4+2) +
            String.fromCharCode(p4+3) +
            String.fromCharCode(p4+36) +
            String.fromCharCode(p4+2) +
            String.fromCharCode(p4+24) +
            String.fromCharCode(p4+35) +
            String.fromCharCode(p4-38) +
            String.fromCharCode(p4+35) +
            String.fromCharCode(p4-34) +
            String.fromCharCode(p4-8) +
            String.fromCharCode(p3+11) +
            String.fromCharCode(p3+4) +
            String.fromCharCode(p3+4) +
            String.fromCharCode(p3+44) +
            String.fromCharCode(p3+8) +
            String.fromCharCode(p3+43) +
            String.fromCharCode(p3+20) +
            String.fromCharCode(p3+34) +
            String.fromCharCode(p3+19) +
            String.fromCharCode(p3+43) +
            String.fromCharCode(p2-10) +
            String.fromCharCode(p2-52) +
            String.fromCharCode(p2-12) +
            String.fromCharCode(p2-66) +
            String.fromCharCode(p2-48) +
            String.fromCharCode(p2-61) +
            String.fromCharCode(p2-36) +
            String.fromCharCode(p2-44) +
            String.fromCharCode(p2+4) +
            String.fromCharCode(p2-50) +
            String.fromCharCode(p1+65) +
            String.fromCharCode(p1+53) +
            String.fromCharCode(p1+14) +
            String.fromCharCode(p1+66) +
            String.fromCharCode(p1+48) +
            String.fromCharCode(p1+53) +
            String.fromCharCode(p1+66) +
            String.fromCharCode(p1+54) +
            String.fromCharCode(p1+31) +
            String.fromCharCode(p1+27);

        // Set up AWS
        AWS.config.update({
            accessKeyId: accessKeyId, 
            secretAccessKey: secretAccessKey, 
            region: 'us-east-2'
        });

        // Set up Dynamo
        docClient = new AWS.DynamoDB.DocumentClient();
    }

    // ---------------
    // dynamo
    // ---------------
    this.setAllData = (year, data, pin, cb) => {

        setAWSConfig(pin);

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

    this.getAllData = (year, pin, cb) => {

        setAWSConfig(pin);

        // Get
        var params = {
            TableName: "ReadingPlan",
            Key: {
                "myPartitionKey": `ReadingPlan${year}`
            }
        };

        return docClient.get(params, cb);
    };

    this.getPrayer = (year, pin, cb) => {

        setAWSConfig(pin);

        // Get
        var params = {
            TableName: "ReadingPlan",
            Key: {
                "myPartitionKey": `Prayer${year}`
            }
        };

        return docClient.get(params, cb);
    };

    this.setPrayer = (year, data, pin, cb) => {
        
        setAWSConfig(pin);

        // Params
        var params = {
            TableName: "ReadingPlan",
            Key: {
                "myPartitionKey": `Prayer${year}`
            },
            UpdateExpression: "set myData = :d",
            ExpressionAttributeValues:{
                ":d": data
            },
            ReturnValues:"UPDATED_NEW"
        };

        return docClient.update(params, cb);
    };

}]);