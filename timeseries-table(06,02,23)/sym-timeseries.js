(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'timeseries',  
        displayName : 'C8 Timeseries Table',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,  
        iconUrl: 'Images/timeseries.png', 
        configTitle: 'Format Symbol',
        getDefaultConfig: function () {  
            return {  
                DataShape: 'TimeSeries',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 400,  
                Width: 400,
                Interval : 5000,
                Title : 'Calibr8 Timeseries',
                Offset : 0,
                Granularity : 'm'
            };  
        },
        visObjectType: symbolVis  
    };  


    symbolVis.prototype.init = function init(scope, elem) { 
        this.onDataUpdate = dataUpdate;  

        scope.timeseriesLoaded = false;
        scope.headers = [];

        scope.runtimeData.IntervalType = {
            'm' : 'Minute',
            'h' : 'Hour',
            'd' : 'Day',
            'n' : 'Month'
        };
    

        function dataUpdate(output) {
            console.log(output);

            if (!output) {
                return;
            }

            scope.headers = scope.symbol.DataSources.map(function (datasource) {
                let attribute  = datasource.split('\\');
                if(attribute[0] == 'af:') {
                    attribute = attribute[attribute.length - 1].replace(/\?[A-Za-z0-9\-]+/g, '');
                }
                else {
                    attribute = attribute[attribute.length - 1].replace(/\?.+/, '');
                }
                

                return attribute;
            });

            console.log(scope.headers);
            scope.rows = parseTimeSeriesData(output.Data, scope.config.Granularity, scope.config.Offset);
        }  
        
        scope.runtimeData.granularity = function (value) {
            if(arguments.length === 0) {
                return scope.config.Granularity = scope.config.Granularity;
            }
            else {
                return scope.config.Granularity = value;
            }
        }
        scope.runtimeData.offset = function (value) {
            if(arguments.length === 0) {
                return scope.config.Offset = scope.config.Offset;
            }
            else {
                return scope.config.Offset = value;
            }
        }

        function parseTimeSeriesData(data, granularity = 'm', offset = 0) {
            if(data.length == 0) {
                return [];
            }

            var base = data[0].Values; //Getting the values of the first attribute
            scope.base = data[0].Values; //Getting the values of the first attribute
            datasources = [];
            data.forEach(function (d, index) {
                d.Values.forEach(function (v, v_index) { //Iterate the values per attribute
                    if(datasources[index] == undefined) { //Create object if not yet defined
                        datasources[index] = {};
                    }
                    datasources[index][v.Time] = v; //Making timestamp as the object key
                });
            });

            rows = [];
            for(var i = 0; i < base.length; i++) {
                var b = base[i];
                var timestamp = b.Time;
                var columns = [];
                var seconds = new Date(timestamp).getSeconds(); //get the seconds of the timestamp
                var minutes = new Date(timestamp).getMinutes(); // get the minutes of the timestamp
                var hours = new Date(timestamp).getHours(); //get the hours of the timestamp
                var days = new Date(timestamp).getDate(); //get the days of the timestamp

    
                if(granularity == 'm') {
                    if(seconds != offset) {
                        continue; //Skip the iteration
                    }
                }
                else if(granularity == 'h') {
                    if(minutes != offset || seconds != 0) {
                        continue; //Skip the iteration
                    }
                }
                else if(granularity == 'd') {
                    if(hours != offset || minutes != 0 || seconds != 0) {
                        continue; //Skip the iteration
                    }
                    // else if (minutes != 0){
                    //     continue; //Skip the iteration
                    // }
                    // else if (seconds != 0){
                    //     continue; //Skip the iteration
                    // }
                }
                else if(granularity == 'n') {
                    if(days != offset || hours != 0 || minutes != 0 || seconds != 0) {
                        continue; //Skip the iteration
                    }
                    // else if(hours != 0) {
                    //     continue; //Skip the iteration
                    // }
                    // else if (minutes != 0){
                    //     continue; //Skip the iteration
                    // }
                    // else if (seconds != 0){
                    //     continue; //Skip the iteration
                    // }
                }

                //Consolidate all values with the same timestamp from each datasource and make it 1 row
                datasources.forEach(function (d, index) {
                    if(d[timestamp] != undefined) {
                        columns.push(d[timestamp]);
                    }
                    else {
                        columns.push({Time : timestamp, Value : ''});
                    }
                });
                
                rows.push({
                    timestamp : timestamp,
                    columns : columns
                });
                console.log(rows);
            }

            return rows;
        }
    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  