app.service('appService', ['$http',  function($http) {

    const env = 'mydb';
    const url = `https://api.mongolab.com/api/1/databases/${env}/collections/`;
    const apiKey = `?apiKey=7dwZtQjBFYhef4N4WHi6xuTnveN4{pin}`;

    // Reading plan data
    this.getAllData = (pin) => $http.get(`${url}readingPlan${apiKey.replace('{pin}', pin)}`);
    this.getDailyData = (pin, id) => $http.get(`${url}readingPlan/${id}${apiKey.replace('{pin}', pin)}`);
    this.submit = (pin, id, data) => $http.put(`${url}readingPlan/${id}${apiKey.replace('{pin}', pin)}`, data);

    // Prayer
    this.getPrayer = (pin) => $http.get(`${url}prayer${apiKey.replace('{pin}', pin)}`);
    this.setPrayer = (pin, data) => $http.put(`${url}prayer${apiKey.replace('{pin}', pin)}`, data);

    // Daily message status
    this.setMessageStatus = (pin, data) => $http.put(`${url}messageStatus${apiKey.replace('{pin}', pin)}`, data);
    this.getMessageStatus = (pin) => $http.get(`${url}messageStatus${apiKey.replace('{pin}', pin)}`);

    // Storing data
    this.putAllData = (pin, data) => $http.put(`${url}readingPlan${apiKey.replace('{pin}', pin)}`, data);

}]);
