const app = angular.module('myApp', ['ngRoute', 'ui.grid', 'ui.grid.edit']);

app.controller('homeCtrl', ['$scope', '$http', '$window', 'uiGridConstants', 'appService', function($scope, $http, $window, uiGridConstants, appService) {

    // DONE: TODO: Add in a 1 time 4 digit pin that is 4 digits from the API key using local storage
    // TODO: Add in race conditions and refresh page if there are any concurrent updates
    // DONE: TODO: Highlight today
    // DONE: TODO filter by date better
    // TODO: Add colors by person

    // variables
    let messagesStatus;

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
    $scope.prayer = '';
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
    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;

        gridApi.edit.on.afterCellEdit($scope, function(val) {

            $scope.submitData();

        });

    };

    // Update the year
    $scope.updateYear = function() {
        localStorage.setItem('year', $scope.year); // update the year in local storage
        location.reload();
    }

    // Column defaults
    const setColumnDefs = () => {
        $scope.gridOptions.columnDefs = [{
                name: 'date',
                sort: {
                    direction: 'asc',
                    priority: 0
                },
                type: 'date',
                filter: {
                    condition: (searchTerm, cellValue) => new Date(searchTerm.split(String.fromCharCode(92)).join('')) <= new Date(cellValue),
                    placeholder: 'date',
                    term: $scope.year.toString() === year.toString() ? fiveDaysAgoToday : '',
                },
                cellEditableCondition: false,
                cellTemplate: `<div class="ui-grid-cell-contents" ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}">{{row.entity.date === '${today}' ? row.entity.date + ' Today' : row.entity.date }}</div>`
            },
            {
                name: 'content',
                enableFiltering: true,
                cellTemplate: `<div class="ui-grid-cell-contents" ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" ><a target="_blank" href="https://audio.esv.org/hw/{{row.entity.content}}.mp3">{{row.entity.content}}</a></div>`
            },
            {
                name: 'josh',
                headerCellClass: 'josh',
                enableFiltering: false,
                cellEditableCondition: false,
                type: 'boolean',
                cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.submitData(row.entity)" ng-model="row.entity.josh"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`
            },
            {
                name: 'corey',
                headerCellClass: 'corey',
                enableFiltering: false,
                cellEditableCondition: false,
                type: 'boolean',
                cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.submitData(row.entity)" ng-model="row.entity.corey"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`
            },
            {
                name: 'kenny',
                headerCellClass: 'kenny',
                enableFiltering: false,
                cellEditableCondition: false,
                type: 'boolean',
                cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.submitData(row.entity)" ng-model="row.entity.kenny"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`
            },
            {
                name: 'devon',
                headerCellClass: 'devon',
                enableFiltering: false,
                cellEditableCondition: false,
                type: 'boolean',
                cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.submitData(row.entity)" ng-model="row.entity.devon"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`
            },
            {
                name: 'leal',
                headerCellClass: 'leal',
                enableFiltering: false,
                cellEditableCondition: false,
                type: 'boolean',
                cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.submitData(row.entity)" ng-model="row.entity.leal"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`
            },
            {
                name: 'comments',
                enableFiltering: false,
                cellEditableCondition: false,
                cellTemplate: `<div class="ui-grid-cell-contents" ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}"><button class="btn btn-xs" ng-class="row.entity.comments ? 'btn-danger' : 'btn-primary'" ng-click="grid.appScope.commentBtn(row.entity)"><i class="fa fa-circle"></i></button></div>`
            }
        ];
    };

    // Get the data from the DB
    const getAllData = () => {
        // Only get data if pin exists
        if ($scope.pin) {
            // Steps to get data
            async.series([
                // Step X: Get Data
                (cb_0) => {
                    appService.getAllData($scope.year, $scope.pin, (err, data) => {
                        if (err) {
                            cb_0(err);
                        } else {
                            // Set the result
                            var result = JSON.parse(data.Item.myData);

                            var dateIncluded = false;
                            result.forEach((val, i) => {
                                if (val.date === today) {
                                    $scope.today = val;
                                    dateIncluded = true;
                                    setColumnDefs();
                                }
                            });

                            // If today is not included, set the column definitions so that the view doesn't break
                            if (!dateIncluded) {
                                $scope.today = result[0];
                                setColumnDefs();
                            }

                            $scope.gridOptions.data = result;

                            cb_0(null);

                        }

                    });
                },
                // Step X: Get Prayer Requests
                (cb_0) => {
                    // Get prayer
                    appService.getPrayer($scope.year, $scope.pin, (err, data) => {
                        if (err) {
                            cb_0(err);
                        } else {
                            $scope.prayer = data.Item.myData;
                            cb_0(null);
                        }
                    })
                }
            ], (err) => {
                $scope.loading = false;
                if (err) {
                    $scope.error = 'Something went wrong. Please refresh ' + JSON.stringify(err);
                    localStorage.setItem('pin', '');
                    localStorage.setItem('name', '');
                }
                // TODO: CHECK TO SEE WHY THIS IS NEEDED!!!!
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        } else {
            $scope.loading = false;
            // TODO: CHECK TO SEE WHY THIS IS NEEDED!!!!
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

    };
    getAllData();

    // Change day
    $scope.commentBtn = (val) => {
        $scope.today = val;
    };

    // Submit data
    $scope.submitData = () => {

        // Set loading equal to true
        $scope.loading = true;

        // Submit the data
        appService.setAllData($scope.year, $scope.gridOptions.data, $scope.pin, (err, data) => {
            if (err) {
                $scope.loading = false;
                if (err) {
                    localStorage.setItem('pin', '');
                    localStorage.setItem('name', '');
                    $scope.error = 'Something went wrong. Please refresh ' + JSON.stringify(err);
                }
            } else {
                $scope.loading = false;
            }
            // TODO: CHECK TO SEE WHY THIS IS NEEDED!!!!
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        })

    };

    // Submit Prayer
    $scope.submitPrayer = () => {

        // Set loading equal to true
        $scope.loading = true;

        appService.setPrayer($scope.year, $scope.prayer, $scope.pin, (err, data) => {
            if (err) {
                $scope.loading = false;
                if (err) {
                    localStorage.setItem('pin', '');
                    localStorage.setItem('name', '');
                    $scope.error = 'Something went wrong. Please refresh ' + JSON.stringify(err);
                }
            } else {
                $scope.loading = false;
                // TODO: CHECK TO SEE WHY THIS IS NEEDED!!!!
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        })

    };

}]);
