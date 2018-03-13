const app = angular.module('myApp', ['ngRoute', 'ui.grid', 'ui.grid.edit']);

app.controller('homeCtrl', ['$scope', '$http', '$window', 'uiGridConstants', 'appService', function ($scope, $http, $window, uiGridConstants, appService) {

    // TODO: Add in a 1 time 4 digit pin that is 4 digits from the API key using local storage
    // TODO: Add in race conditions and refresh page if there are any concurrent updates
    // TODO: Highlight today
    // TODO filter by date better

    // variables
    let messagesStatus;

    // New date
    const date = new Date();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // add one because month starts at 0
    const day = ('0' + date.getDate()).slice(-2); // 01, 02, etc.
    const year = date.getUTCFullYear(); // 2017, 2018, etc.
    const today = `${month}/${day}/${year}`;

    // 5 days ago
    const fiveDaysAgoDate = new Date(new Date() - (1000 * 60 * 60 * 24 * 5));
    const fiveDaysAgoMonth = ('0' + (fiveDaysAgoDate.getMonth() + 1)).slice(-2); // add one because month starts at 0
    const fiveDaysAgoDay = ('0' + fiveDaysAgoDate.getDate()).slice(-2); // 01, 02, etc.
    const fiveDaysAgoYear = fiveDaysAgoDate.getUTCFullYear(); // 2017, 2018, etc.
    const fiveDaysAgoToday = `${fiveDaysAgoMonth}/${fiveDaysAgoDay}/${fiveDaysAgoYear}`;



    // Default Params
    $scope.pin = localStorage.getItem('pin') || '';
    $scope.name = localStorage.getItem('name') || '';
    $scope.loading = true;
    $scope.error = '';

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
            $scope.loading = true;

            const id = val._id.$oid;
            const data = {
                comments: val.comments,
                content: val.content,
                corey: val.corey,
                date: val.date,
                devon: val.devon,
                josh: val.josh,
                kenny: val.kenny,
                leal: val.leal,
            };

            appService.submit($scope.pin, id, data).then(() => {
                $scope.loading = false;
            });
        });

    };

    // Column defaults

    const setColumnDefs = () => {
        $scope.gridOptions.columnDefs = [
            {
                name: 'date',
                sort: { direction: 'asc', priority: 0 },
                filter: {
                    condition: (searchTerm, cellValue) => new Date(searchTerm.split(String.fromCharCode(92)).join('')) <= new Date(cellValue),
                    placeholder: 'date',
                    term: fiveDaysAgoToday,
                },
                cellTemplate: `<div class="ui-grid-cell-contents" ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}">{{row.entity.date === '${today}' ? row.entity.date + ' Today' : row.entity.date }}</div>`
            },
            {name: 'content', enableFiltering: false, cellTemplate: `<div class="ui-grid-cell-contents" ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" ><a target="_blank" href="http://esvapi.org/v2/rest/passageQuery?key=IP&passage={{row.entity.content}}&output-format=mp3">{{row.entity.content}}</a></div>`},
            {name: 'josh', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.josh"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`},
            {name: 'corey', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.corey"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`},
            {name: 'kenny', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.kenny"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`},
            {name: 'devon', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.devon"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`},
            {name: 'leal', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: `<div ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}" class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.leal"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>`},
            {name: 'comments', enableFiltering: false, cellEditableCondition: false, cellTemplate: `<div class="ui-grid-cell-contents" ng-class="{'bg-success': row.entity.date === grid.appScope.today.date}"><button class="btn btn-xs" ng-class="row.entity.unread ? 'btn-danger' : 'btn-primary'" ng-click="grid.appScope.commentBtn(row.entity); row.entity.unread=false"><i class="fa fa-circle"></i></button></div>`}
        ];
    };



    // Get the data from the DB
    const getData = () => {

        if ($scope.pin) {

            async.series([
                // Step X: Get User Info
                (cb_0) => {
                    // Get Message Status
                    appService.getMessageStatus($scope.pin).then(results => {
                        messagesStatus = results.data[0] || cb_0(' Error: Can\'t find getMessageStatus data. Please refresh');
                        cb_0(null);
                    }, (err) => {
                        cb_0(err);
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
                    appService.setMessageStatus($scope.pin, messagesStatus).then(() => {
                        cb_0(null);
                    }, (err) => {
                        $scope.error = err;
                        cb_0(err);
                    });
                },
                // Step X: Get Data
                (cb_0) => {
                    appService.getData($scope.pin).then((result) => {
                            // Get today
                            result.data.forEach((val, i) => {
                                if (val.date === today) {
                                    $scope.today = val;
                                    setColumnDefs();
                                }
                                if (messagesStatus[$scope.name] && messagesStatus[$scope.name].includes(val.date)) {
                                    result.data[i].unread = true;
                                }
                            });
                            $scope.gridOptions.data = result.data;
                            cb_0(null);
                    });
                },
                // Step X: Get Prayer Requests
                (cb_0) => {
                    // Get prayer
                    appService.getPrayer($scope.pin).then(results => {
                        $scope.prayer = results.data[0].prayer;
                        cb_0(null);
                    }, (err) => {
                        cb_0(err)
                    });
                }
            ], (err) => {
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
    getData();

    // Submit '', X, R daily reading
    $scope.selectReading = (val) => {

        $scope.loading = true;

        const id = val._id.$oid;
        const data = {
            comments: val.comments,
            content: val.content,
            corey: val.corey,
            date: val.date,
            devon: val.devon,
            josh: val.josh,
            kenny: val.kenny,
            leal: val.leal,
        };

        appService.submit($scope.pin, id, data).then(() => {
            $scope.loading = false;
        });

    };

    // Change day
    $scope.commentBtn = (val) => {
        $scope.today = val;
        $scope.loading = true;

        // Remove date from
        if (messagesStatus.hasOwnProperty($scope.name)) {
            const index = messagesStatus[$scope.name].indexOf(val.date);
            if (index > -1) {
                messagesStatus[$scope.name].splice(index, 1);
            }
        }

        // Ship off message status to DB
        appService.setMessageStatus($scope.pin, messagesStatus).then(() => {
            $scope.loading = false;
        }, (err) => {
            $scope.loading = false;
            $scope.error = err;
        });

    };

    // Submit comment
    $scope.submitComment = () => {

        // Set loading equal to true
        $scope.loading = true;

        // Set data to be updated in the comment field
        const id = $scope.today._id.$oid;
        const data = {
            comments: $scope.today.comments,
            content: $scope.today.content,
            corey: $scope.today.corey,
            date: $scope.today.date,
            devon: $scope.today.devon,
            josh: $scope.today.josh,
            kenny: $scope.today.kenny,
            leal: $scope.today.leal,
        };


        async.series([
            // Step #1: Save comment
            (cb_0) => {
                appService.submit($scope.pin, id, data).then(() => {
                    cb_0(null);
                }, (err) => {
                    cb_0(err);
                });
            },
            // Step #2: Inject unread into others
            (cb_0) => {
                // Inject into others
                for (let val in messagesStatus) {
                    if (messagesStatus.hasOwnProperty(val)) {
                        if (val !== $scope.name && !val.includes('_')) {
                            const index = messagesStatus[val].indexOf($scope.today.date);
                            // Only push if it doesn't exist
                            if (index < 0) {
                                messagesStatus[val].push($scope.today.date);
                            }
                        }
                    }
                    else {
                        messagesStatus[val] = [$scope.today.date];
                    }
                }
                // Ship off message status to DB
                appService.setMessageStatus($scope.pin, messagesStatus).then(() => {
                    cb_0(null);
                }, (err) => {
                    cb_0(err);
                });
            },

        ], (err) => {
            $scope.loading = false;
            if (err) {
                localStorage.setItem('pin', '');
                localStorage.setItem('name', '');
                $scope.error = 'Something went wrong. Please refresh ' + JSON.stringify(err);
            }
        });
    };

    // Submit Prayer
    $scope.submitPrayer = () => {
        $scope.loading = true;
        appService.setPrayer(pin, [{prayer: $scope.prayer}]).then(() => {
            $scope.loading = false;
        });
    }

}]);

// appService.setPrayer({prayer: 'prayer'}).then(results => {
//     $scope.loading = false;
// });

// function compare(a,b) {
//     if (a.date < b.date)
//         return -1;
//     if (a.date > b.date)
//         return 1;
//     return 0;
// }
//
// var b = a.sort(compare);

// var b = a.map(val => {
//
//     // New date of node server
//     var date = new Date(val.Date);
//     var month = ('0' + (date.getMonth() + 1)).slice(-2); // add one because month starts at 0
//     var day = ('0' + date.getDate()).slice(-2); // 01, 02, etc.
//     var year = date.getUTCFullYear(); // 2017, 2018, etc.
//     const today = `${month}/${day}/${year}`;
//
//     return {
//         date: today,
//         content: val.content,
//         josh: val.josh,
//         corey: val.corey,
//         kenny: val.kenny,
//         devon: val.devon,
//         leal: val.leal,
//         comments: ''
//     }
//
// });