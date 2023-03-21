//Dependency Amcharts 4
(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'donut',  
        displayName : 'C8 Donut Chart',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,  
        iconUrl: 'Images/donut.png', 
        configTitle: 'Format Symbol',
        getDefaultConfig: function () {  
            return {  
                DataShape: 'Table',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 400,  
                Width: 600,
                Interval : 5000,
                IsPercent : false,
                DefaultColors : [
                    '#D98880', '#C39BD3', '#7FB3D5','#76D7C4', '#7DCEA0', '#F7DC6F', '#E59866', '#85929E', '#922B21', '#6C3483', '#2471A3', '#148F77',
                    '#D68910', '#BA4A00', '#212F3C'
                ]
            };  
        },
        visObjectType: symbolVis  
    };  


    symbolVis.prototype.init = function init(scope, elem) { 
        this.onDataUpdate = dataUpdate;  
        this.onConfigChange = configChanged;
        this.onDatasourceChange = datasourceChanged;
        this.onResize = resize;  
        scope.containerId = 'donut-' + Math.ceil(Math.random() * 10000000)

        scope.chart = null;
        scope.pieSeries = null;
        scope.chartLoaded = false;

        scope.runtimeData.trace = 0;
        scope.runtimeData.traces = scope.symbol.DataSources.map(function (d) {
            // var label = d.replace('pi:\\\\', '').replace('af:\\\\').split('|');
            if(d.substring(0, 2) == 'pi') {
                var label = d.split('\\');
            }
            else {
                var label = d.split('|');
            }
            return label[label.length - 1].replace(/\?.*/, '');
        });

        scope.runtimeData.traces = scope.symbol.DataSources.map(function (d) {
            if(d.substring(0, 2) == 'pi') {
                var label = d.split('\\');
            }
            else {
                var label = d.split('|');
            }
            return label[label.length - 1].replace(/\?.*/, '');
        });

        scope.runtimeData.TraceColor = function (value) {
            if(arguments.length === 0) {
                return scope.config.DefaultColors[scope.runtimeData.trace];
            }
            else {
                return scope.config.DefaultColors[scope.runtimeData.trace] = value;
            }
        }

        scope.runtimeData.IsPercent = function (value) {
            if(arguments.length === 0) {
                return scope.config.IsPercent;
            }
            else {
                return scope.config.IsPercent = value;
            }
        }


        function configChanged(config, oldConfig) {
            if(config != oldConfig) {
                if(config.DefaultColors != oldConfig.DefaultColors) {
                    scope.symbol.DataSources.forEach(function (d, idx) {
                        scope.pieSeries.colors.list[idx] = new am4core.color(scope.config.DefaultColors[idx]);
                    })
                }

                scope.pieSeries.labels.template.text = "{category}: {value.value}" + (scope.config.IsPercent ? '%' : '');
                scope.pieSeries.slices.template.tooltipText = "{category}: {value.value}" + (scope.config.IsPercent ? '%' : '');
            }
        };  
    
    
        function resize(width, height) {
            //scope.chart.setSize(width, height, true);

        }

        function datasourceChanged(datasource) {
            scope.runtimeData.traces = scope.symbol.DataSources.map(function (d) {
                // var label = d.replace('pi:\\\\', '').replace('af:\\\\').split('|');
                if(d.substring(0, 2) == 'pi') {
                    var label = d.split('\\');
                }
                else {
                    var label = d.split('|');
                }
                return label[label.length - 1].replace(/\?.*/, '');
            });

            scope.chartLoaded = false;
            scope.$emit('RefreshDataForAllSymbols');
        }

        function dataUpdate(output) {
            if(!output) {
                return;
            }
            
            if(scope.chartLoaded) {
                // var animation = new am4core.Animation(scope.chart, {
                //       property: "value",
                //       to: parseFloat(output.Value)
                // }, 1000, am4core.ease.cubicOut).start();
                
                output.Rows.forEach(function (row, idx) {
                    scope.chart.data[idx].value = row.Value;
                })

                scope.chart.validateData();


            }
            else {
                setTimeout(function () {
                    loadChart(output);    
                }, 2000)
            }
        }

        function loadChart(data) {
            am4core.ready(function() {

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                // Create chart instance
                var chart = am4core.create(scope.containerId, am4charts.PieChart);

                // Add data
                chart.data = [];
                data.Rows.forEach(function (row, idx) {
                    var label = scope.runtimeData.traces[idx];

                    chart.data.push({
                        'parameter' : label,
                        'value' : parseFloat(row.Value)
                    })
                })

                // Set inner radius
                chart.innerRadius = am4core.percent(50);

                // Add and configure Series
                var pieSeries = chart.series.push(new am4charts.PieSeries());
                pieSeries.dataFields.value = "value";
                pieSeries.dataFields.category = "parameter";
                pieSeries.slices.template.stroke = am4core.color("#fff");
                pieSeries.slices.template.strokeWidth = 2;
                pieSeries.slices.template.strokeOpacity = 1;


                // This creates initial animation
                pieSeries.hiddenState.properties.opacity = 1;
                pieSeries.hiddenState.properties.endAngle = -90;
                pieSeries.hiddenState.properties.startAngle = -90;

                pieSeries.colors.list = [];

                pieSeries.labels.template.text = "{category}: {value.value}" + (scope.config.IsPercent ? '%' : '');
                pieSeries.slices.template.tooltipText = "{category}: {value.value}" + (scope.config.IsPercent ? '%' : '');

                scope.symbol.DataSources.forEach(function (d, idx) {
                    pieSeries.colors.list.push(new am4core.color(scope.config.DefaultColors[idx]));
                })

                scope.chart = chart;
                scope.chartLoaded = true;
                scope.pieSeries = pieSeries;

            }); // end am4core.ready()
        }
    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  