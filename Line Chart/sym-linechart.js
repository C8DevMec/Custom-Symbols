(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'linechart',  
        displayName : 'C8 Line Chart',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,  
        iconUrl: 'Images/line-v2.png', 
        configTitle: 'Format Symbol',
        getDefaultConfig: function () {  
            return {  
                DataShape: 'TimeSeries',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 400,  
                Width: 400,
                Interval : 5000,
                Title : 'Calibr8 Bar Chart'
            };  
        },
        visObjectType: symbolVis  
    };  


    symbolVis.prototype.init = function init(scope, elem) { 
        this.onDataUpdate = dataUpdate;  
        this.onConfigChange = configChanged;
        this.onResize = resize;  
        scope.div_id = Math.ceil(Math.random() * 10000000)

        scope.chart = null;
        scope.attributes = [];
        scope.timestamps = [];

        scope.runtimeData.traces = [];
        scope.runtimeData.selected_trace = 0;

        scope.chart_loaded = false;

        function loadTraces() {
            scope.attributes = scope.symbol.DataSources.forEach(function (d) {
                if(d.substring(0, 2) == 'pi') {
                    var label = d.split('\\');
                }
                else {
                    var label = d.split('|');
                }
                return label[label.length - 1].replace(/\?.*/, '');
            });

        }

        scope.runtimeData.deleteTrace = function(a) {
            if(confirm("Are you sure?")) {
                if(scope.symbol.DataSources[a]) {
                    scope.symbol.DataSources.splice(a, 1);
                }

                scope.chart.series[a].remove();
                scope.$root.$broadcast('refreshDataForChangedSymbols'); 

                scope.runtimeData.traces.splice(a, 1);
                scope.runtimeData.selected_trace = 0;
            }
        }

        function configChanged(config, oldConfig) {  
            loadTraces();
        };  
    
    
        function resize(width, height) {

            //scope.chart.setSize(width, height, true);

        }

        function dataUpdate(output) {
            if(!output) {
                return;
            }

            try {
                am4core = am4core;
                am4charts = am4charts;
                am4internal_webpackJsonp = am4internal_webpackJsonp;
            }
            catch(ex) {
                setTimeout(function () {
                    scope.$root.$broadcast('refreshDataForChangedSymbols'); 
                }, 500)
            }

            if(scope.chart_loaded) {
                console.log(am4internal_webpackJsonp );
            }
            else {
                setTimeout(function () {
                    am4core.useTheme(am4themes_animated);
                    var chart = am4core.create("linechart-" + scope.div_id, am4charts.XYChart);
                    chart.data = [];
                    for(i = 0; i <= 10; i++) {
                        chart.data.push({
                        "date" : ( i <= 9 ? "0" + i : i) + ":00:00",
                        "value" : Math.random() * 100
                        }); 
                    }
                    // Set input format for the dates
                    chart.dateFormatter.inputDateFormat = "hh:mm:ss";

                    // Create axes
                    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

                    // Create series
                    var series = chart.series.push(new am4charts.LineSeries());
                    series.dataFields.valueY = "value";
                    series.dataFields.dateX = "date";
                    series.tooltipText = "{caption}"
                    series.strokeWidth = 2;
                    series.minBulletDistance = 15;

                    var series2 = chart.series.push(new am4charts.LineSeries());
                    series2.dataFields.valueY = "value[1]";
                    series2.dataFields.dateX = "date";
                    series2.tooltipText = "{caption}"
                    series2.strokeWidth = 2;
                    series2.minBulletDistance = 15;

                    // Make bullets grow on hover
                    var bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.strokeWidth = 2;
                    bullet.circle.radius = 4;
                    bullet.circle.fill = am4core.color("#000");

                    var bullethover = bullet.states.create("hover");
                    bullethover.properties.scale = 1.3;

                    // Make a panning cursor
                    chart.cursor = new am4charts.XYCursor();
                    chart.cursor.behavior = "panXY";
                    chart.cursor.xAxis = dateAxis;
                    chart.cursor.snapToSeries = series;

                    scope.chart_loaded = true;
                }, 500)
            }
        }  
    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  