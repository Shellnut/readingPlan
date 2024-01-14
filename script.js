const app = angular.module('myApp', ['ui.grid']);

app.controller('homeCtrl', ['$scope', function($scope) {

    // New date
    const date = new Date();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // add one because month starts at 0
    const day = ('0' + date.getDate()).slice(-2); // 01, 02, etc.
    const year = date.getFullYear(); // 2017, 2018, etc.
    const today = `${month}/${day}/${year}`;

    // Current Year
    $scope.year = year;
    $scope.today = today;

    // 5 days ago
    const fiveDaysAgoDate = new Date(new Date() - (1000 * 60 * 60 * 24 * 5));
    const fiveDaysAgoMonth = ('0' + (fiveDaysAgoDate.getMonth() + 1)).slice(-2); // add one because month starts at 0
    const fiveDaysAgoDay = ('0' + fiveDaysAgoDate.getDate()).slice(-2); // 01, 02, etc.
    const fiveDaysAgoYear = fiveDaysAgoDate.getFullYear(); // 2017, 2018, etc.
    const fiveDaysAgoToday = `${fiveDaysAgoMonth}/${fiveDaysAgoDay}/${fiveDaysAgoYear}`;

    // Grid options
    $scope.gridOptions = {
        enableFiltering: true
    };

    // Grid
    $scope.gridOptions.columnDefs = [
        {
            name: 'date',
            sort: {
                direction: 'asc',
                priority: 0
            },
            type: 'date',
            width: '175',
            filter: {
                condition: (searchTerm, cellValue) => new Date(searchTerm.split(String.fromCharCode(92)).join('')) <= new Date(cellValue),
                placeholder: 'date',
                term: $scope.year.toString() === year.toString() ? fiveDaysAgoToday : '',
            },
            cellEditableCondition: false,
            cellTemplate: `<div class="ui-grid-cell-contents" ng-class="{'bg-success': row.entity.date === '${today}'}">{{row.entity.date === '${today}' ? row.entity.date + ' Today' : row.entity.date }}</div>`
        },
        {
            name: 'content',
            enableFiltering: true,
            cellTemplate: `<div class="ui-grid-cell-contents" ng-class="{'bg-success': row.entity.date === '${today}'}" ><a target="_blank" href="https://audio.esv.org/hw/{{row.entity.content}}.mp3">{{row.entity.content}}</a></div>`
        }

    ];

    $scope.gridOptions.data = readingContent;

}]);
