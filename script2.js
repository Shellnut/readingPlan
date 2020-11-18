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

            // Set loading to true
            $scope.loading = true;
            // Get and set params
            const id = val._id.$oid;
            val.color = getColor();
            let raceCondition = false;

            async.series([
                (cb_0) => {
                    appService.getDailyData($scope.pin, $scope.year, id).then((results) => {
                        // Get race condition status
                        raceCondition = checkRaceCondition(results.data);
                        cb_0(null);
                    }, (err) => {
                        cb_0(err);
                    });
                },
                (cb_0) => {
                    if (raceCondition) {
                        $scope.raceCondition = true;
                        cb_0(null);
                    }
                    else {
                        // Set Data
                        const data = setData(val, true);
                        // Submit Data
                        appService.submit($scope.pin, $scope.year, id, data).then(() => {
                            cb_0(null);
                        }, (err) => {
                            cb_0(err);
                        });
                    }
                },
            ], (err) => {
                $scope.loading = false;
                if (err) {
                    $scope.error = 'Something went wrong. Please refresh ' + JSON.stringify(err);
                }
            });

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
    };

    // Get the data from the DB
    const getAllData = () => {
        // Only get data if pin exists
        if ($scope.pin) {
            // Steps to get data
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
                    appService.getAllData($scope.pin, $scope.year).then((result) => {
                            // Get today
                            var dateIncluded = false;
                            result.data.forEach((val, i) => {
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
 
                            $scope.gridOptions.data = result.data;
                            cb_0(null);
                    });
                },
                // Step X: Get Prayer Requests
                (cb_0) => {
                    // Get prayer
                    appService.getPrayer($scope.pin, $scope.year).then(results => {
                        if (results.data.length < 1) {
                            $scope.prayer = '';   
                        }
                        else {
                            $scope.prayer = results.data[0].prayer;
                        }
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
    getAllData();

    // Submit '', X, R daily reading
    $scope.selectReading = (val) => {

        // Set loading to true and get/set data
        $scope.loading = true;
        let raceCondition = false;
        const id = val._id.$oid;

        async.series([
            (cb_0) => {
                appService.getDailyData($scope.pin, $scope.year, id).then((results) => {
                    // Get race condition status
                    raceCondition = checkRaceCondition(results.data);
                    cb_0(null);
                }, (err) => {
                    cb_0(err);
                });
            },
            (cb_0) => {
                if (raceCondition) {
                    $scope.raceCondition = true;
                    cb_0(null);
                }
                else {
                    const data = setData(val, true);
                    // Submit data
                    appService.submit($scope.pin, $scope.year, id, data).then(() => {
                        cb_0(null);
                    }, (err) => {
                        cb_0(err);
                    });
                }
            }
        ], (err) => {
            $scope.loading = false;
            if (err) {
                $scope.error = 'Something went wrong. Please refresh ' + JSON.stringify(err);
            }
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

        // check race condition
        let raceCondition = false;

        // Set data to be updated in the comment field
        const id = $scope.today._id.$oid;

        // Set data and set newLastUpdate
        const data = setData($scope.today, true);

        // Async submit
        async.series([
            // Step #0: Check race condition
            (cb_0) => {
                appService.getDailyData($scope.pin, $scope.year, id).then((results) => {
                    // Get race condition status
                    raceCondition = checkRaceCondition(results.data);
                    // Move onto next one
                    cb_0(null);
                }, (err) => {
                    cb_0(err);
                });
            },
            // Step #1: Save comment
            (cb_0) => {
                if (raceCondition) {
                    $scope.raceCondition = true;
                    cb_0(null);
                }
                else {
                    appService.submit($scope.pin, $scope.year, id, data).then(() => {
                        cb_0(null);
                    }, (err) => {
                        cb_0(err);
                    });
                }
            },
            // Step #2: Inject unread into others
            (cb_0) => {
                // Check for race condition
                if (raceCondition) {
                    $scope.raceCondition = true;
                    cb_0(null);
                }
                else {
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
                }
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
        let raceCondition = false;

        async.series([
            // Step #1: Get DB prayer and check for race condition
            (cb_0) => {
                // Get prayer
                appService.getPrayer($scope.pin, $scope.year).then((results) => {
                    // Check race condition
                    raceCondition = checkRaceCondition(results.data[0]);
                    cb_0(null);
                }, (err) => {
                    // Send error if there's an error
                    cb_0(err);
                });
            },
            // Step #2: Set prayer
            (cb_0) => {
                // Check for race condition
                if (raceCondition) {
                    $scope.raceCondition = true;
                    cb_0(null);
                }
                else {
                    // Set prayer data
                    const prayerData = [{
                        prayer: $scope.prayer,
                        lastUpdatedName: $scope.name,
                        lastUpdatedTime: new Date().getTime()
                    }];
                    // Set prayer
                    appService.setPrayer($scope.pin, $scope.year, prayerData).then(() => {
                        // Finish request
                        cb_0(null);
                    }, (err) => {
                        // Send error if there's an error
                        cb_0(err);
                    });
                }

            }
        ], (err)=> {
            $scope.loading = false;
            if (err) {
                // Set error to false
                $scope.error = 'Something went wrong. Please refresh ' + JSON.stringify(err);
            }
        });
    };

    // $scope.updateMongoData = () => {
        // console.log(tempData.data);
        // const evenMoreTempData = tempData.data.map(val => {
        //     return {
        //         color: val.color,
        //         comments: val.comments,
        //         content: val.content,
        //         corey: val.corey,
        //         date: val.date,
        //         devon: val.devon,
        //         josh: val.josh,
        //         kenny: val.kenny,
        //         lastUpdatedName: val.lastUpdatedName,
        //         lastUpdatedTime: val.lastUpdatedTime,
        //         leal: val.leal
        //     }
        // });
        //
        // console.log(evenMoreTempData.slice(4, evenMoreTempData.length));
        //
        // appService.putAllData($scope.pin, updateData, (err, results) => {
        //     if (err) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log(results);
        //     }
        // })
        // const evenMoreTempData = tempData.data.map(val => {
        //     return {
        //         color: val.color,
        //         comments: val.comments,
        //         content: val.content,
        //         corey: val.corey,
        //         date: val.date,
        //         devon: val.devon,
        //         josh: val.josh,
        //         kenny: val.kenny,
        //         lastUpdatedName: val.lastUpdatedName,
        //         lastUpdatedTime: val.lastUpdatedTime,
        //         leal: val.leal
        //     }
        // });
        //
        //
        // const twentyNinteenData = [];
        //
        // // declaring variables
        // var text = '';
        // var year = 2019;
        // var firstDay = new Date(year, 0, 1);
        //
        //
        // readingPlan.forEach((val, index) => {
        //
        //     // Days
        //     var curDay = new Date(firstDay.getTime() + (index * 1000 * 60 * 60 * 24));
        //     var day = curDay.getDate();
        //     var dayOfWeek = curDay.getDay();
        //     var weekday;
        //     var type;
        //     if (dayOfWeek === 0) {
        //         type = 'Gospels'; weekday = 'Sunday';
        //     }
        //     else if (dayOfWeek === 1) {
        //         type = 'Law'; weekday = 'Monday';
        //     }
        //     else if (dayOfWeek === 2) {
        //         type = 'History'; weekday = 'Tuesday';
        //     }
        //     else if (dayOfWeek === 3) {
        //         type = 'Psalms'; weekday = 'Wednesday';
        //     }
        //     else if (dayOfWeek === 4) {
        //         type = 'Poetry'; weekday = 'Thursday';
        //     }
        //     else if (dayOfWeek === 5) {
        //         type = 'Prophecy'; weekday = 'Friday';
        //     }
        //     else if (dayOfWeek === 6) {
        //         type = 'Epistles'; weekday = 'Saturday';
        //     }
        //
        //     var month = curDay.getMonth() + 1;
        //
        //     twentyNinteenData.push({
        //         color: "black",
        //         comments: `${weekday} ${type}.`,
        //         content: val,
        //         corey: '',
        //         date: `${month}/${day}/${year}`,
        //         devon: '',
        //         josh: '',
        //         kenny: '',
        //         leal: '',
        //         lastUpdatedName: 'kenny',
        //         lastUpdatedTime: 1543553009299
        //     });
        // });
        //
        // // send to dynamo
        // const allData = evenMoreTempData.concat(twentyNinteenData);
    // };

    // // Update mongo data 2 (used to make 2020 data)
    // $scope.updateMongoData = function() {
    //     var updateData = [];
    //     for (var i=0; i<400; i++) {

    //     var date = new Date();
    //     date.setDate(date.getDate() + i);

    //     var month = ('0' + (date.getMonth() + 1)).slice(-2); // add one because month starts at 0
    //     var day = ('0' + date.getDate()).slice(-2); // 01, 02, etc.
    //     var year = date.getUTCFullYear(); // 2017, 2018, etc.
    //     var today = `${month}/${day}/${year}`;

    //     var a = {
    //         "comments": "",
    //         "content": "Psalm " + (Math.floor(Math.random() * 150) + 1),
    //         "corey": "",
    //         "date": today,
    //         "devon": "",
    //         "josh": "",
    //         "kenny": "",
    //         "leal": "",
    //         "color": "",
    //         "lastUpdatedName": "",
    //         "lastUpdatedTime": 1577631727281
    //     };

    //     updateData.push(a);

    //     }

    //     console.log($scope.pin, $scope.year, updateData);

    //     appService.putAllData($scope.pin, $scope.year, updateData, (err, results) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         else {
    //             console.log(results);
    //         }
    //     })

    // }

    // used to update 2017 data
    // $scope.updateMongoData = function() {
    //     var _2017 = [];
    //     appService.putAllData($scope.pin, 2017, _2017, (err, results) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         else {
    //             console.log(results);
    //         }
    //     })   
    // }

    // Check race condition
    const checkRaceCondition = (data) => {
        // Vars
        let raceCondition = false;
        const lastUpdatedName = data.lastUpdatedName || $scope.name;
        const lastUpdatedTime = data.lastUpdatedTime || new Date(0).getTime();
        // Check if last update was you
        if (lastUpdatedName !== $scope.name) {
            if (lastUpdatedTime > sessionTime) {
                raceCondition = true;
            }
        }
        // Return race condition
        return raceCondition;
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
