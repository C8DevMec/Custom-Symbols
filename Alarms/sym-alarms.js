(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'alarms',  
        displayName : 'Alarms',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,  
        iconUrl: 'Images/table-icon.svg', 
        configTitle: 'Format Symbol',
        inject : ['$http', '$filter'],
        noExpandSelector : '.no-expand',
        getDefaultConfig: function () {  
            return {  
                DataShape: 'Table',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 400,  
                Width: 400,
                Interval : 5000,
                TableType : 0,
                AFServer : 'WIN-M0NR4DJTABA',
                AFDatabase : 'JEP Alarm',
                AFTable : 'Alarms Table',
								ColumnNames : [],
								ColumnDetails : {}
            };  
        },  
        visObjectType: symbolVis  
    };  

    symbolVis.prototype.init = function init(scope, elem, $http, $filter) { 
        this.onDataUpdate = dataUpdate;  
        this.onConfigChange = configChanged;  
        this.onResize = resize;  
        this.onDataSourceChange = dataSourceChanged;
        scope.configDataLoaded = false;
        scope.tableData = null;
        scope.page = 1;
        scope.items = 20;
        scope.offset = 0;
        scope.Math = window.Math;

        scope.APIUrl = 'https://localhost:8084/public/api';
        scope.runtimeData.AFServer = scope.config.AFServer;
        scope.runtimeData.AFDatabase = scope.config.AFDatabase;
        scope.runtimeData.AFTable = scope.config.AFTable;
        scope.runtimeData.Columns = {};
        scope.runtimeData.ColumnNames = [];
				scope.loadingData = false;
				scope.data = {};
        // scope.runtimeData.tablePath = scope.config.tablePath

				// scope.runtimeData.removeTrace = function (t) {
				// 	console.log(t);
				// 	// var idx = scope.symbol.DataSources.indexOf(t);
				// 	// scope.symbol.DataSources.splice(idx);

				// 	// scope.runtimeData.Traces = [];
				// 	// scope.symbol.DataSources.forEach(function(d) {
				// 	// 	scope.runtimeData.Traces.push(d);
				// 	// });
				// }

        function configChanged(config, oldConfig) {
            
        };

        function dataSourceChanged() {
					scope.configDataLoaded = false;
        }
    
        function resize(width, height) {  
        }

        function dataUpdate(output) {
					if(!output.Rows) {
							return;
					}

					if(scope.loadingData) {
						return;
					}
					scope.data = formatData(output.Rows);
					console.log(scope.data);

					if(!scope.configDataLoaded) {
						scope.runtimeData.Traces = scope.symbol.DataSources.map(function (s) {
							s = s.split('|');
							attribute = s[1];
							return attribute.substring(0,  attribute.indexOf('?'));
						});

						scope.loadingData = true;
						scope.tableData = {};

						scope.columnNumber = 0;
						
						scope.config.ColumnNames.forEach(function(c) {
							if(scope.config.ColumnDetails[c] == undefined) {
								scope.config.ColumnDetails[c] = {
									enabled : true
								}
							}
							if(scope.config.ColumnDetails[c].enabled) {
								scope.columnNumber += 1;
							}
						});
						
						$http({
							url : scope.APIUrl + '/config/table',
							method : 'GET',
							params : {afServer : scope.config.AFServer, afDatabase : scope.config.AFDatabase, table : scope.config.AFTable}
						}).then(function (output) {
							var response = output.data;

							scope.tableData.columns = [];
							
							scope.columnNumber = 0;

							var columns = angular.copy(scope.config.ColumnDetails);
							var columnNames = angular.copy(scope.config.ColumnNames);

							for(c in response.Columns) {
								if(columns[c] == undefined) {
									columns[c] = {
										enabled : true
									};
								}

								if(columns[c].enabled) {
									scope.columnNumber += 1;
								}
								
								if(columnNames.indexOf(c) == -1) {
									columnNames.push(c);
								}
							}

							scope.config.ColumnDetails = columns;
							scope.config.ColumnNames = columnNames;

							scope.runtimeData.ColumnDetails = columns;
							scope.runtimeData.ColumnNames = columnNames;

							scope.tableData.columns = columnNames;
							scope.tableData.rows = response.Rows;

							scope.loadingData = false;
							scope.configDataLoaded = true;
							// scope.$emit('refreshDataForChangedSymbols');
						});
					}

					if(scope.configDataLoaded) {
							var data = formatData(output.Rows);
					}
        }

				function getStructure() {
					var structure = {};
					scope.symbol.DataSources.forEach(function (datasource) {
						var ds = datasource.split("|");
						var path = ds[0].substring(0,  ds[0].indexOf('?')).replace("af:\\\\", "").split('\\');
						var element = path[path.length - 1];
						var attribute = ds[1] != undefined ? ds[1].substring(0,  ds[1].indexOf('?')) : '';
						
						if(structure[element] == undefined) {
							structure[element] = {};
						}
						if(structure[element][attribute] == undefined) {
							structure[element][attribute] = {};
						}

						structure[element][attribute] = {
							Value : null,
							Time : null
						}
					});

					return structure;
				}

				function formatData(data) {
					var structure = getStructure();
					data.forEach(function(d, idx) {
						var datasource = scope.symbol.DataSources[idx];
						var ds = datasource.split("|");
						var path = ds[0].substring(0,  ds[0].indexOf('?')).replace("af:\\\\", "").split('\\');
						var element = path[path.length - 1];
						var attribute = ds[1] != undefined ? ds[1].substring(0,  ds[1].indexOf('?')) : '';
						
						if(structure[element][attribute] != undefined) {
							structure[element][attribute] = {
								Value : d.Value,
								Time : d.Time
							}
						}
					});

					return structure;
				}

        scope.paginate = function (p) {
            scope.page += p;
            scope.offset = (scope.page * scope.items) - scope.items;
        }

        scope.goToPage = function (p) {
            scope.page = p;
            scope.offset = (scope.page * scope.items) - scope.items;
            console.log(scope.page);
        }

        scope.onColumnMoveStart = function (event, index, col) {
            console.log(event)
            // if (options.columnReorder && !(scope.columnConfig[col] && scope.columnConfig[col].lockOrder)) {
            //     onColumnEventStart(event, index, PV.TableMoveColumnHandler);
            // }
        };

        scope.onColumnResizeStart = function (event, index) {
            console.log(event);
            // if (options.columnResize) {
            //     onColumnEventStart(event, index, PV.TableResizeColumnHandler);
            // }
        };

				scope.runtimeData.toggleColumnDetails = function(column) {
					scope.config.ColumnDetails[column] = scope.runtimeData.ColumnDetails[column];
				}

    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  