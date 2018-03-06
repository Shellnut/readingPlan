const app = angular.module('myApp', ['ui.grid', 'ui.grid.edit']);

app.controller('homeCtrl', ['$scope', '$http', 'uiGridConstants', 'appService', function ($scope, $http, uiGridConstants, appService) {

    $scope.gridOptions = {
        enableFiltering: true
    };

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

            appService.submit(id, data).then((result) => {
                $scope.loading = false;
            });
        });

    };

    $scope.loading = true;

    $scope.gridOptions.columnDefs = [
        {
            name: 'date',
            sort: { direction: 'asc', priority: 0 },
            filter: {
                condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                placeholder: 'Month',
                term: ('0' + (new Date().getMonth() + 1)).slice(-2)
            },
        },
        {name: 'content', enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents"><a target="_blank" href="http://esvapi.org/v2/rest/passageQuery?key=IP&passage={{row.entity.content}}&output-format=mp3">{{row.entity.content}}</a></div>'},
        {name: 'josh', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: '<div class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.josh"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>'},
        {name: 'corey', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: '<div class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.corey"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>'},
        {name: 'kenny', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: '<div class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.kenny"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>'},
        {name: 'devon', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: '<div class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.devon"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>'},
        {name: 'leal', enableFiltering: false, cellEditableCondition: false, type: 'boolean', cellTemplate: '<div class="ui-grid-cell-contents"><select class="select" ng-change="grid.appScope.selectReading(row.entity)" ng-model="row.entity.leal"><option value=""></option><option value="r">R</option><option value="x">X</option></select></div>'},
        {name: 'comments', enableFiltering: false, cellEditableCondition: false, cellTemplate: '<div class="ui-grid-cell-contents"><button class="btn btn-primary btn-xs" ng-click="grid.appScope.commentBtn(row.entity)"><i class="fa fa-circle"></i></button></div>'}
    ];

    appService.getData().then((result) => {

        $scope.loading = false;

        // New date
        const date = new Date();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // add one because month starts at 0
        const day = ('0' + date.getDate()).slice(-2); // 01, 02, etc.
        const year = date.getUTCFullYear(); // 2017, 2018, etc.
        const today = `${month}/${day}/${year}`;

        // Get today
        result.data.forEach(val => {
            if (val.date === today) {
                $scope.today = val;
            }
        });
        $scope.gridOptions.data = result.data;
    });

    appService.getPrayer().then(results => {
        $scope.prayer = results.data[0].prayer;
    });

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

        appService.submit(id, data).then(() => {
            $scope.loading = false;
        });

    };

    $scope.commentBtn = (val) => {
        $scope.today = val;
    };

    $scope.submitComment = () => {
        $scope.loading = true;
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
        appService.submit(id, data).then(() => {
            $scope.loading = false;
        });
    };

    // Submit Prayer
    $scope.submitPrayer = () => {
        $scope.loading = true;
        appService.setPrayer([{prayer: $scope.prayer}]).then(() => {
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