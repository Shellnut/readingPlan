app.service('appService', ['$http',  function($http) {

    const url = 'https://api.mongolab.com/api/1/databases/mydb/collections/';
    const apiKey = `?apiKey=7dwZtQjBFYhef4N4WHi6xuTnveN46vNQ`;

    // Reading plan data
    this.getData = () => $http.get(`${url}readingPlan${apiKey}`);
    this.submit = (id, data) => $http.put(`${url}readingPlan/${id}${apiKey}`, data);

    // Prayer
    this.getPrayer = () => $http.get(`${url}prayer${apiKey}`);
    this.setPrayer = (data) => $http.put(`${url}prayer${apiKey}`, data);

    // Storing data
    this.putData = (data) => $http.put(`${url}readingPlan${apiKey}`, data);

}]);