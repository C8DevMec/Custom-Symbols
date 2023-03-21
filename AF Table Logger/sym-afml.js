(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'afml',  
        displayName : 'AF Table Logger',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,  
        iconUrl: 'Images/table-icon.svg', 
        configTitle: 'Format Symbol',
        inject : ['$http', '$filter'],
        noExpandSelector : '.no-expand',
        getDefaultConfig: function () {  
            return {  
                DataShape: 'Value',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 400,  
                Width: 400,
                Interval : 5000,
                TableType : 0,
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
        scope.items = 20;
        scope.offset = 0;
        scope.page = 1; 
        scope.tableData = [];
        scope.columns = [];
        scope.rows = [];
        scope.new = {};
        scope.editIndex = -1;
        scope.editRowDetails = {};
        scope.loaded = false;
        scope.piwebapi = 'https://' + window.location.host + '/piwebapi';
        scope.tableWebId = '';
        scope.auth = 'YWRtaW5pc3RyYXRvcjpDOEBkbTFu';

        function configChanged(config, oldConfig) {
            
        };

        function dataSourceChanged() {
            scope.loaded = false;
        }
    
    
        function resize(width, height) {  

        }

        function dataUpdate(output) {
            if(!output.Value) {
                return;
            }
            if(!scope.loaded) {
                $http({
                    url : scope.piwebapi + '/tables?selectedfields=webid&path=' + output.Value,
                    method : 'GET',
                    headers : {
                        Authorization : 'Basic ' + scope.auth
                    }
                }).then(function (output) {
                    scope.tableWebId = output.data.WebId;
                    $http({
                        url : scope.piwebapi + '/tables/' + scope.tableWebId + '/data',
                        method : 'GET',
                        headers : {
                            Authorization : 'Basic ' + scope.auth
                        }
                    }).then(function (output) {

                        scope.columns = [];

                        var response = output.data;

                        for(c in response.Columns) {
                            scope.columns.push({name : c, datatype : response.Columns[c]});
                        }

                        scope.rows = response.Rows;

                        console.log(scope.rows);
                        console.log(scope.columns);

                    }, function (err) {
        
                    });
                }, function (err) {

                });

                scope.loaded = true;
            }
        }
        

    

        scope.refreshData = function () {
            scope.loaded = false;
            scope.$emit('refreshDataForAllSymbols');
        }

        scope.saveChanges = function () {
            var data = {};
            data.Columns = {};
            data.Rows = scope.rows;

            scope.columns.forEach(function (c) {
                data.Columns[c.name] = c.datatype;
            });

            $http({
                url : scope.piwebapi + '/tables/'+ scope.tableWebId +'/data',
                method : 'PUT',
                data : data,
                headers : {
                    'Authorization' : 'Basic ' + scope.auth,
                }
            }).then(function (output) {
                alert("Changes have been saved.");
            }, function (err) {
                console.log(err);
            });
        }

        scope.insertData = function () {
            var count = 0;
            for(i in scope.new) {
                count += 1;
            };

            if(count == scope.columns.length) {
                scope.rows.unshift(scope.new);
                scope.new = {};
            }
            else {
                alert("Fill out all fields.");
            }
        }

        scope.editData = function (idx) {
            scope.editRowDetails = angular.copy(scope.rows[idx]);          
            scope.editIndex = idx;             
        }

        scope.updateData = function (idx) {
            scope.rows[idx] = scope.editRowDetails;
            scope.editIndex = -1;
        }

        scope.updateAllData = function () {
            var csvValue = []; 
            Papa.parse(document.getElementById('uploadfile').files[0],
            {
                download: true,
                header: true,
                skipEmptyLines: true,
                    complete: function(results){
                        var rows = [];
                        results.data.forEach(function (row) {
                            if(row.Unit) {
                                rows.push({
                                    Unit : row.Unit,
                                    'Attribute Name' : row['Attribute Name'],
                                    Description : row.Description,
                                    Value : row.Value,
                                    UOM : row.UOM
                                });
                            }
                        });

                        console.log(results.data);

                        scope.columns = [
                            {name: 'Unit', datatype: 'String'},
                            {name: 'Attribute Name', datatype: 'String'},
                            {name: 'Description', datatype: 'String'},
                            {name: 'Value', datatype: 'String'},
                            {name: 'UOM', datatype: 'String'}
                        ];
                        scope.rows = rows;
                        alert("File has been uploaded. Click on Save Changes to update the values.");
                    }   
            });               
        }

        scope.cancelEdit = function () {
            scope.editIndex = -1;
        }

        scope.deleteData = function (idx) {
            if(confirm("Are you sure?")) {
                scope.rows.splice(idx, 1);
            }
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

    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  