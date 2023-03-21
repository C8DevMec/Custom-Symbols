(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'timeseries',  
        displayName : 'C8 Timeseries',
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
                base: "hey",
            };  
        },
        visObjectType: symbolVis  
    };  


    symbolVis.prototype.init = function init(scope, elem) { 
        this.onDataUpdate = dataUpdate;  

        scope.timeseriesLoaded = false;
        scope.headers = [];
    
        function resize(width, height) {

            //scope.chart.setSize(width, height, true);

        }

        function dataUpdate(output) {
            console.log("BEGIN");
            console.log(output);

            if (!output) {
                return;
            }

            scope.headers = scope.symbol.DataSources.map(function (datasource) {

                let attribute  = datasource.split('\\');
                attribute = attribute[attribute.length - 1].replace(/\?.+/, '');

                return attribute;
            })

            console.log(scope.headers);

            scope.rows = parseTimeSeriesData(output.Data, 'm')
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

                if(granularity == 'm') {
                    if(seconds != offset) {
                        continue; //Skip the iteration
                    }
                }
                else if(granularity == 'h') {
                    if(minutes != offset) {
                        continue; //Skip the iteration
                    }
                }
                else if(granularity == 'd') {
                    if(hours != offset) {
                        continue;  //Skip the iteration
                    }
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
            }

            return rows;
        }
    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  