var app = angular.module('testPass', ['ui.router', 'ngTouch', 'ui.grid', 'ui.grid.pagination','ui.grid.autoResize','ui.grid.expandable', 'ui.grid.selection', 'ui.grid.pinning','ui.grid.resizeColumns']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('summary', {
			url:'/summary?testPassName',
			 views: {
				    '': {
				      templateUrl: 'summary.html'
				    },
				  },
		})
		.state('error', {
			url: '/error?testPassName',
			templateUrl: 'error.html'
		})
});

app.factory('myService', function() {
	 var savedData = {}
	 function set(data) {
	   savedData = data;
	 }
	 function get() {
	  return savedData;
	 }

	 return {
	  set: set,
	  get: get
	 }

	});

app.controller('testCTRL', ['$scope', 'myService', '$http', '$state','$log', '$stateParams', function ($scope, myService, $http, $state, $log, $stateParams) {
    
    $scope.loader = {
        loading: false
    };
    
    function HeaderCtrl($scope) {
        $scope.header = {name: "header.html", url: "header.html"};
    }
    
    $scope.homeClick = function(){
        window.location = "index.html";
  }
    
    $scope.homeImage = "/resources/images/home-1.png";
    
    $scope.backGroundImage = "/resources/images/BackgroundImage.jpg";
    
    $scope.filterOptions = {
            filterText: ''
        };
    
    $scope.testPass = {
    		 enableColumnResizing: true,
    		enableFiltering: true,
    	    paginationPageSizes: [25, 50, 75, 100, 125],
    	    paginationPageSize: 25,
    	    columnDefs: [
    	    	{ name: 'rowNum', displayName: 'Sl No', cellTemplate: 
    	    	'<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>' 
    	    		,enableFiltering: false, width:"5%"},
    	      { name: 'name',displayName: 'Test Pass Name', width: "30%"},
    	      { name: 'pass',displayName: 'Pass', type: 'number' ,enableFiltering: false},
    	      { name: 'fail',displayName: 'Fail', type: 'number' ,enableFiltering: false},
    	      { name: 'skip',displayName: 'Skip', type: 'number' ,enableFiltering: false},
    	      { name: 'total',displayName: 'Total', type: 'number', cellTemplate:'<div>{{row.entity.pass + row.entity.fail + row.entity.skip}}</div>' 
    	    	  ,enableFiltering: false},
    	      { name: 'View' ,displayName: 'View', enableSorting: false, enableFiltering: false,
    	    	  cellTemplate: '<a ui-sref="summary({ testPassName: 1234 })" ng-click="grid.appScope.readTestsOfRun(row.entity.name)" ui-sref-opts="{reload: true}">Summary</a>   <a href="#" ng-click="grid.appScope.readErrorOfRun(row.entity.name)">Errors</a>',  width: "15%"}
    	    ],
    	onRegisterApi: function (gridApi) {

    	$scope.grid1Api = gridApi;

    	}
    	  };
    

    //Read all entries
   $scope.getAll = function () {
        
        $scope.loader.loading = true;
        
        $http.get("api/list/TestPass")
            .then(function (response) {
                if (response.error === 2) {
					//if error code is returned from node code, then there are no entries in db!
					$scope.statustext = "There are currently no Testpass available!";
					$scope.loader.loading = false;
				} else {
					$scope.testPass.data = response.data.TestPass;
					//Turn off spinner
					$scope.loader.loading = false;
					$scope.statustext = "";
				}
            });
            /*.error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.statustext = "There was an error fetching data, please check database connection!";
            });*/
    };
    
       
    $scope.readTestsOfRun = function(name){
    	myService.set(name);
    	$state.go('summary');
    };
    
    $scope.readErrorOfRun = function(name){
    	myService.set(name);
    	$state.go('error');
    };
}]);


/*app.controller('SummaryController', ['$scope', 'myService', '$http', '$state','$log', function ($scope, myService, $http, $state, $log) {
    var name = myService.get();
	
	$scope.summaryData = {
    	    paginationPageSizes: [25, 50, 75, 100, 125],
    	    paginationPageSize: 25,
    	    columnDefs: [
    	    	{ name: 'rowNum', displayName: 'Sl No', cellTemplate: 
    	    	'<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>', width:"5%"},
    	      { name: 'classname', displayName: 'Class Name', width:"30%"},
    	      { name: 'pass', displayName: 'Pass', type: 'number' },
    	      { name: 'fail', displayName: 'Fail', type: 'number' },
    	      { name: 'skip', displayName: 'Skip', type: 'number' },
    	      { name: 'total', displayName: 'Total', type: 'number', cellTemplate:'<div>{{row.entity.pass + row.entity.fail + row.entity.skip}}</div>' }
    	    ]
    	  };
	
	 // Summary details
    $scope.readTests = function () {
    	
        
        $scope.loader.loading = true;

        // get id 
        $http.get('api/list/Summary' + name)
            .then(function (response) {
            	 if (response.error === 2) {
 					//if error code is returned from node code, then there are no entries in db!
 					$scope.statustext = "There are currently no Test cases available!";
 					$scope.loader.loading = false;
 				} else {
 					$scope.summaryData.data = response.data.Summary;
 					//Turn off spinner
 					$scope.loader.loading = false;
 					$scope.statustext = "";
 				}
             });
    };
	
}]);*/

app.controller('ErrorController', ['$scope', 'myService', '$http', '$state','$log', function ($scope, myService, $http, $state, $log) {
    var name = myService.get();
	
    $scope.errorData = {
    		enableFiltering: true,
    	    paginationPageSizes: [25, 50, 75, 100, 125],
    	    paginationPageSize: 25,
    	    columnDefs: [
    	    	{ name: 'rowNum', displayName: 'Sl No', cellTemplate: 
    	    	'<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>' 
    	    		,enableFiltering: false, width:"5%"},
    	      { name: 'exception_name',displayName: 'Exception Name', width: "50%"},
    	      { name: 'count',displayName: 'Count', type: 'number' ,enableFiltering: false}
    	     ],
    	onRegisterApi: function (gridApi) {

    	$scope.grid1Api = gridApi;

    	}
    	  };
    
	 // Error  details
    $scope.readErrorListOfRun = function () {
    	
        
        $scope.loader.loading = true;

        // get id 
        $http.get('api/list/Error' + name)
            .then(function (response) {
            	 if (response.error === 2) {
 					//if error code is returned from node code, then there are no entries in db!
 					$scope.statustext = "There are currently no Test cases available!";
 					$scope.loader.loading = false;
 				} else {
 					$scope.errorData.data = response.data.ErrorList;
 					//Turn off spinner
 					$scope.loader.loading = false;
 					$scope.statustext = "";
 				}
             });
    };
	
}]);

app.controller('SummaryController', ['$scope', 'myService', '$http', '$state','$log','$timeout','$stateParams', function ($scope, myService, $http, $state, $log, $timeout, $stateParams) {
	 var name = myService.get();
	 if(name == undefined){
		 name = $stateParams.testPassName;
	 }
	 console.log("state param in summary controller "+$stateParams.testPassName)
	var vm = this;
	var rowHeight = 30;

	vm.gridOptions = {
			enableFiltering: true,
			expandableRowTemplate: 'expandableRowTemplate.html',
			expandableRowHeight: 400,
			onRegisterApi: function (gridApi) {
					gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
							if (row.isExpanded) {
									row.entity.subGridOptions = {
											enableFiltering: true,
											columnDefs: [
												{ name: 'TestCaseID', displayName: 'Test Case ID', width:'10%'},
												{ name: 'methodname', displayName: 'Method Name', width:'40%'},
												{ name: 'status', displayName: 'Status', width:'10%'},
												{ name: 'exception_name', displayName: 'Exception Name', width:'20%'},
												{ name: 'executionTime', displayName: 'Duration', enableFiltering: false, width:'10%'},
												{ name: 'bugId', displayName: 'Defect', width:'10%'},
												{ name: 'filePath', displayName: 'Screenshot', width:'10%'}
									]};
								

									$http.get('/api/list/Class',
											{
						                params:{testPassName: name, className: row.entity.classname}
						            })
											.then(function(response) {
													row.entity.subGridOptions.data = response.data.ClassSummary;
											});
								
							}
					});
			}
	};
	
	vm.gridOptions.columnDefs = [
    	      { name: 'classname', displayName: 'Class Name', width:"30%"},
    	      { name: 'owner', displayName: 'Owner'},
    	      { name: 'pass', displayName: 'Pass', type: 'number', enableFiltering: false},
    	      { name: 'fail', displayName: 'Fail', type: 'number', enableFiltering: false},
    	      { name: 'skip', displayName: 'Skip', type: 'number', enableFiltering: false },
    	      { name: 'total', displayName: 'Total', type: 'number', cellTemplate:'<div>{{row.entity.pass + row.entity.fail + row.entity.skip}}</div>',enableFiltering: false}
    	    ];
	// get id 
    $http.get('api/list/Summary' + name)
        .then(function (response) {
        	 if (response.error === 2) {
					//if error code is returned from node code, then there are no entries in db!
					$scope.statustext = "There are currently no Test cases available!";
					$scope.loader.loading = false;
				} else {
					vm.gridOptions.data = response.data.Summary;
					console.log("response data is "+vm.gridOptions.data);
					//Turn off spinner
					$scope.loader.loading = false;
					$scope.statustext = "";
				}
         });
    
    $state.go('summary', {'testPassName': name})
}]);

app.controller('ThirdCtrl', ['$scope', 'myService', '$http', '$state','$log','$timeout', function ($scope, myService, $http, $state, $log, $timeout) {
	 var name = myService.get();
	var vm = this;
	var rowHeight = 30;

	vm.gridOptions = {
			enableFiltering: true,
			expandableRowTemplate: 'expandableRowTemplate.html',
			expandableRowHeight: 400,
			onRegisterApi: function (gridApi) {
					gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
							if (row.isExpanded) {
									row.entity.subGridOptions = {
											enableFiltering: true,
											columnDefs: [
												{ name: 'TestCaseID', displayName: 'Test Case ID'},
												{ name: 'assignedto', displayName: 'Owner'},
												{ name: 'classname', displayName: 'Class Name'},
												{ name: 'methodname', displayName: 'Method Name'},
												{ name: 'status', displayName: 'Status'},
												{ name: 'executionTime', displayName: 'Duration', enableFiltering: false},
												{ name: 'bugId', displayName: 'Defect'}
									]};
								

									$http.get('/api/list/exception',
											{
						                params:{testPassName: name, exceptionName: row.entity.exception_name}
						            })
											.then(function(response) {
													row.entity.subGridOptions.data = response.data.ExceptionSummary;
											});
								
							}
					});
			}
	};
	
	vm.gridOptions.columnDefs = [
		{ name: 'rowNum', displayName: 'Sl No', cellTemplate: 
	    	'<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>' 
	    		,enableFiltering: false, width:"5%"},
	      { name: 'exception_name',displayName: 'Exception Name', width: "50%"},
	      { name: 'count',displayName: 'Count', type: 'number' ,enableFiltering: false}
   	    ];
	 // get id 
    $http.get('api/list/Error' + name)
        .then(function (response) {
        	 if (response.error === 2) {
					//if error code is returned from node code, then there are no entries in db!
					$scope.statustext = "There are currently no Test cases available!";
					$scope.loader.loading = false;
				} else {
					vm.gridOptions.data = response.data.ErrorList;
					//Turn off spinner
					$scope.loader.loading = false;
					$scope.statustext = "";
				}
         });
}]);



