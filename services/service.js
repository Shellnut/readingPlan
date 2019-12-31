app.service('appService', ['$http',  function($http) {

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