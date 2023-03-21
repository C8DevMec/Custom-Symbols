(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'c8logger',  
        displayName : 'C8 Manual Logger',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,  
        iconUrl: 'Images/chrome.table.white.svg', 
        configTitle: 'Format Symbol',
        noExpandSelector : '.no-expand',
        inject : ['$http'],
        getDefaultConfig: function () {  
            return {  
                DataShape: 'Table',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 400,  
                Width: 400,
                Interval : 5000,
                Tags : [],
                TagDetails : {},
                DisplayColumn : {
                    TagName : true,
                    DisplayName : true,
                    CurrentValue : true,
                    Timestamp : true
                }
            };  
        },  
        visObjectType: symbolVis  
    };  

    symbolVis.prototype.init = function init(scope, elem, $http) { 
        this.onDataUpdate = dataUpdate;  
        this.onConfigChange = configChanged;
        this.onDatasourceChange = dataSourceChanged; 
        this.onResize = resize;  
        scope.values = [];
        scope.loaded = false;

        function resize(size) {

        }

        function configChanged(oldConfig, newConfig) {
            console.log(oldConfig, newConfig);
            scope.runtimeData.DisplayColumn = scope.config.DisplayColumn;
            scope.runtimeData.Traces = scope.symbol.DataSources.map(function (d) {
                var ds = d.split('\\');
                ds = ds[ds.length - 1];
                ds = ds.split('?');
                var label = ds[0];
                return label;
            });

            scope.loaded = false;
        }

        function dataSourceChanged(d) {
            scope.runtimeData.Traces = scope.symbol.DataSources.map(function (d) {
                var ds = d.split('\\');
                ds = ds[ds.length - 1];
                ds = ds.split('?');
                var label = ds[0];
                return label;
            });
        }

        function dataUpdate(output) { 
            if(!output.Rows) {
                console.log("no data");
                return;
            }

            if(scope.config.Tags.length != scope.symbol.DataSources.length) {
                scope.config.Tags = [];
                scope.symbol.DataSources.forEach(function(d, idx) {
                    var ds = d.split('\\');
                    ds = ds[ds.length - 1];
                    ds = ds.split('?');
                    var label = ds[0];

                    if(label) {
                        if(scope.config.Tags.indexOf(label) == -1) {
                            scope.config.Tags.push(label);
                        }
                        if(scope.config.TagDetails[label] == undefined) {
                            scope.config.TagDetails[label] = {
                                tag_name : label,
                                display_name : label
                            }
                        }
                    }
                });
            }

            if(!scope.loaded) {
                scope.values = [];
                scope.config.Tags.forEach(function (t, idx) {
                    scope.values.push({
                        tag : t,
                        display_name : scope.config.TagDetails[t].display_name,
                        value : '',
                        timestamp_date : null,
                        timestamp_time : new Date('01-01-1970 00:00:00')
                    })
                });

                scope.loaded = true;
            }
        }

        scope.writeData = function () {
            scope.writing = true;
            $http({
                url : 'https://192.168.2.1:8083/public/api/write-data',
                method : 'POST',
                data : scope.values,
            }).then(function (output) {

                var response = output.data;
                if(response.status == 'success') {
                    var message_content = response.message;
                    message_content += '\n\nTimestamp: ' + response.data.timestamp;
                    response.data.values.forEach(function (d) {
                        message_content += '\n' + d.tag_name + ' : ' + d.value;
                    });

                    alert(message_content);
                }
                else {
                    alert(response.message);
                }

                scope.loaded = false;
                scope.writing = false;
                scope.$emit('refreshDataForAllSymbols');
            }, function (err) {
                scope.writing = false;
                alert('Something went wrong.\nPlease Try again.')
            });
        }

        scope.runtimeData.selectTrace = function (t) {
            scope.runtimeData.Trace = scope.config.TagDetails[t];
        
            console.log(scope.runtimeData.Trace)
        }

        scope.runtimeData.updateConfig = function (tag, display) {
            scope.config.TagDetails[tag].display_name = display;
            // console.log()
        }

        scope.runtimeData.updateDisplayColumn = function (column, value) {
            scope.config.DisplayColumn[column] = value;
        }

        scope.runtimeData.saveConfig = function (idx, header) {
            scope.config.Headers[idx] = header;
        }
    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  