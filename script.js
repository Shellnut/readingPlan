const app = angular.module('myApp', ['ngRoute', 'ui.grid', 'ui.grid.edit']);

app.controller('homeCtrl', ['$scope', '$http', '$window', 'uiGridConstants', 'appService', function ($scope, $http, $window, uiGridConstants, appService) {

    // DONE: TODO: Add in a 1 time 4 digit pin that is 4 digits from the API key using local storage
    // TODO: Add in race conditions and refresh page if there are any concurrent updates
    // DONE: TODO: Highlight today
    // DONE: TODO filter by date better
    // TODO: Add colors by person

    // variables
    let messagesStatus;
    let sessionTime = new Date().getTime();

    // New date
    const date = new Date();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // add one because month starts at 0
    const day = ('0' + date.getDate()).slice(-2); // 01, 02, etc.
    const year = date.getFullYear(); // 2017, 2018, etc.
    const today = `${month}/${day}/${year}`;

    // 5 days ago
    const fiveDaysAgoDate = new Date(new Date() - (1000 * 60 * 60 * 24 * 5));
    const fiveDaysAgoMonth = ('0' + (fiveDaysAgoDate.getMonth() + 1)).slice(-2); // add one because month starts at 0
    const fiveDaysAgoDay = ('0' + fiveDaysAgoDate.getDate()).slice(-2); // 01, 02, etc.
    const fiveDaysAgoYear = fiveDaysAgoDate.getFullYear(); // 2017, 2018, etc.
    const fiveDaysAgoToday = `${fiveDaysAgoMonth}/${fiveDaysAgoDay}/${fiveDaysAgoYear}`;

    // Default Params
    $scope.pin = localStorage.getItem('pin') || '';
    $scope.name = localStorage.getItem('name') || '';
    $scope.loading = true;
    $scope.error = '';
    $scope.raceCondition = false;
    $scope.years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
    $scope.year = localStorage.getItem('year') || new Date().getFullYear().toString();
    localStorage.setItem('year', $scope.year); // update the year in local storage

    // Submit Pin
    $scope.submitPin = () => {
        $scope.pin = $scope.pinInput;
        $scope.name = $scope.nameInput;
        localStorage.setItem('pin', $scope.pin);
        localStorage.setItem('name', $scope.name.toLowerCase().trim());
        $window.location.reload();
    };

    // Grid options
    $scope.gridOptions = {
        enableFiltering: true
    };

    // On ui-grid change
    $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;

        gridApi.edit.on.afterCellEdit($scope, function (val) {

            console.log(val);
            $scope.submitData();

        });

    };

    $scope.updateYear = function() {
        localStorage.setItem('year', $scope.year); // update the year in local storage
        location.reload();
    }

    // Column defaults
    const setColumnDefs = () => {
        $scope.gridOptions.columnDefs = [
            {
                name: 'date',
                sort: { direction: 'asc', priority: 0 },
                type: 'date',
                filter: {
                    condition: (searchTerm, cellValue) => new Date(searchTerm.split(String.fromCharCode(92)).join('')) <= new Date(cellValue),
                    placeholder: 'date',
                    term: $scope.year.toString() === year.toString() ? fiveDaysAgoToday : '',
                },
                cellEditableCondition: false,
                cellTemplate: `<div class="ui-grid-cell-contents" ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}">{{row.entity.date === '${today}' ? row.entity.date + ' Today' : row.entity.date }}</div>`
            },
            {name: 'content', enableFiltering: true, cellTemplate: `<div class="ui-grid-cell-contents" ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" ><a target="_blank" ng-style="{color: row.entity.color || ''}" href="http://esvapi.org/v2/rest/passageQuery?key=IP&passage={{row.entity.content}}&output-format=mp3">{{row.entity.content}}</a></div>`},
            {name: 'josh', headerCellClass: 'josh', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.josh"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`},
            {name: 'corey', headerCellClass: 'corey', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.corey"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`},
            {name: 'kenny', headerCellClass: 'kenny', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.kenny"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`},
            {name: 'devon', headerCellClass: 'devon', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.devon"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`},
            {name: 'leal', headerCellClass: 'leal', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.leal"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`},
            {name: 'comments', enableFiltering: false, cellEditableCondition: false, cellTemplate: `<div class="ui-grid-cell-contents" ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}"><button class="btn btn-xs" ng-class="row.entity.unread ? 'btn-danger' : 'btn-primary'" ng-click="grid.appScope.commentBtn(row.entity); row.entity.unread=false"><i class="fa fa-circle"></i></button></div>`}
        ];
        console.log($scope.gridOptions.columnDefs);
    };

    // Get the data from the DB
    const getAllData = () => {
        // Only get data if pin exists
        if ($scope.pin) {
            // Steps to get data
            async.series([
                // Step X: Get User Info
                (cb_0) => {
                    // Get Message Status2
                    appService.getMessageStatus2((err, data) => {
                        if (err) {
                            cb_0(err);
                        }
                        else {
                            messagesStatus = JSON.parse(data.Item.myData);
                            cb_0(null);
                        }
                    });
                },
                // Step X: Remove today's date
                (cb_0) => {
                    // Remove date from
                    if (messagesStatus.hasOwnProperty($scope.name)) {
                        const index = messagesStatus[$scope.name].indexOf(today);
                        if (index > -1) {
                            messagesStatus[$scope.name].splice(index, 1);
                        }
                    }
                    // Ship off message status to DB
                    appService.setMessageStatus2(messagesStatus, (err, data) => {
                        if (err) {
                            console.log('err', err);
                            $scope.error = err;
                            cb_0(err);
                        }
                        else {
                            console.log('setMessageStatus', data);
                            cb_0(null);
                        }
                    });
                },
                // Step X: Get Data
                (cb_0) => {
                    appService.getAllData2($scope.year, (err, data) => {

                        if (err) {
                            console.log('getAllData2 error', err);
                            cb_0(err);
                        }
                        else {
                            // Set the result
                            var result = {
                                data: JSON.parse(data.Item.myData)
                            };

                            var dateIncluded = false;
                            result.data.forEach((val, i) => {
                                console.log(val.date)
                                if (val.date === today) {
                                    $scope.today = val;
                                    dateIncluded = true;
                                    setColumnDefs();
                                }
                                if (messagesStatus[$scope.name] && messagesStatus[$scope.name].includes(val.date)) {
                                    result.data[i].unread = true;
                                }
                            });

                            // If today is not included, set the column definitions so that the view doesn't break
                            if (!dateIncluded) {
                                setColumnDefs();
                            }

                            console.log('dynamo', result.data);

                            $scope.gridOptions.data = result.data;

                            cb_0(null);

                        }

                    });
                },
                // Step X: Get Prayer Requests
                (cb_0) => {
                    // Get prayer
                    appService.getPrayer2($scope.year, (err, data) => {
                        if (err) {
                            cb_0(err);
                        }
                        else {
                            // Set the result
                            var results = {
                                data: data.Item.myData
                            };
                            if (results.data.length < 1) {
                                $scope.prayer = '';   
                            }
                            else {
                                $scope.prayer = results.data;
                                console.log('prayer', $scope.prayer);
                            }
                            cb_0(null);
                        }
                    })
                }
            ], (err) => {
                console.log('TEST');
                $scope.loading = false;
                if (err) {
                    $scope.error = 'Something went wrong. Please refresh ' + JSON.stringify(err);
                    localStorage.setItem('pin', '');
                    localStorage.setItem('name', '');
                }
            });
        }
        else {
            $scope.loading = false;
        }

    };
    getAllData();

    // Submit data
    $scope.submitData = () => {

        // Set loading equal to true
        $scope.loading = true;

        appService.setAllData2($scope.year, $scope.gridOptions.data, (err, data) => {
            if (err) {
                $scope.loading = false;
                if (err) {
                    localStorage.setItem('pin', '');
                    localStorage.setItem('name', '');
                    $scope.error = 'Something went wrong. Please refresh ' + JSON.stringify(err);
                }   
            }
            else {
                console.log('update successful', data);
                $scope.loading = false;
            }
        })

    };

    // Submit Prayer
    $scope.submitPrayer2 = () => {

        // Set loading equal to true
        $scope.loading = true;

        appService.setPrayer2($scope.year, $scope.prayer, (err, data) => {
            if (err) {
                $scope.loading = false;
                if (err) {
                    localStorage.setItem('pin', '');
                    localStorage.setItem('name', '');
                    $scope.error = 'Something went wrong. Please refresh ' + JSON.stringify(err);
                }   
            }
            else {
                console.log('update successful', data);
                $scope.loading = false;
            }
        })
        
    };

    // Submit Prayer
    $scope.submitPrayer = () => {

        $scope.loading = true;

        appService.setPrayer2($scope.year, $scope.prayer, (err, data) => {
            if (err) {
                console.log('there was an error with prayer', err);
            }
            else {
                console.log('prayer updated', data);
            }
        })

    };

    // Get the color of the user for the colors of the reading content
    const getColor = () => {
        const nameColors = {
            devon: 'black',
            leal: 'brown',
            corey: 'green',
            kenny: 'orange',
            josh: 'navy'
        };
        return nameColors[$scope.name];
    };

    // Generic set data
    const setData = (data, newLastUpdate) => {
        return {
            comments: data.comments,
            content: data.content,
            corey: data.corey,
            date: data.date,
            devon: data.devon,
            josh: data.josh,
            kenny: data.kenny,
            leal: data.leal,
            color: data.color || getColor(),
            lastUpdatedName: newLastUpdate ? $scope.name : data.lastUpdatedName,
            lastUpdatedTime: newLastUpdate ? new Date().getTime(): data.lastUpdatedTime
        };
    }

}]);
