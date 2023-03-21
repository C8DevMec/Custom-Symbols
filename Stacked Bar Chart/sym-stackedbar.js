(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'stackedbar',  
        displayName : 'C8 Stacked Bar Chart',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,  
        iconUrl: 'Images/bar-graph.svg', 
        configTitle: 'Format Symbol',
        getDefaultConfig: function () {  
            return {  
                DataShape: 'TimeSeries',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 400,  
                Width: 600,
                Interval : 1,
                DisplayType : 1,
                DefaultColors : [
                    '#D98880', '#C39BD3', '#7FB3D5','#76D7C4', '#7DCEA0', '#F7DC6F', '#E59866', '#85929E', '#922B21', '#6C3483', '#2471A3', '#148F77',
                    '#D68910', '#BA4A00', '#212F3C'
                ],
                OutlineColor : '#000',
                BackgroundColor : '#fff'
            };  
        },
        inject : ['timeProvider'],
        visObjectType: symbolVis  
    };  


    symbolVis.prototype.init = function init(scope, elem, timeProvider) { 
        this.onDataUpdate = dataUpdate;  
        this.onConfigChange = configChanged;
        this.onDatasourceChange = datasourceChanged;
        this.onResize = resize;  
        this.timeProvider = timeProvider;
        scope.containerId = 'stackedbar-' + Math.ceil(Math.random() * 10000000)

        scope.chart = null;
        scope.pieSeries = null;
        scope.chartLoaded = false;
        scope.runtimeData.trace = 0;
        scope.runtimeData.traces = scope.symbol.DataSources.map(function (d) {
            if(d.substring(0, 2) == 'pi') {
                var label = d.split('\\');
            }
            else {
                var label = d.split('|');
            }
            return label[label.length - 1].replace(/\?.*/, '');
        });

        scope.runtimeData.granularities = [
            {id : 1, label : 'Daily'},
            {id : 2, label : 'Hourly'},
        ];

        scope.runtimeData.granularity = function (value) {
            if(arguments.length === 0) {
                return scope.config.DisplayType;
            }
            else {
                return scope.config.DisplayType = value;
            }
        }

        scope.runtimeData.removeTrace = function (idx) {
            scope.symbol.DataSources.splice(idx, 1);

            scope.runtimeData.traces = scope.symbol.DataSources.map(function (d) {
                if(d.substring(0, 2) == 'pi') {
                    var label = d.split('\\');
                }
                else {
                    var label = d.split('|');
                }
                return label[label.length - 1].replace(/\?.*/, '');
            });
        }

        scope.runtimeData.TraceColor = function (value) {
            if(arguments.length === 0) {
                return scope.config.DefaultColors[scope.runtimeData.trace];
            }
            else {
                return scope.config.DefaultColors[scope.runtimeData.trace] = value;
            }
        }

        scope.runtimeData.BackgroundColor = function (value) {
            if(arguments.length === 0) {
                return scope.config.BackgroundColor;
            }
            else {
                return scope.config.BackgroundColor = value;
            }
        }

        scope.runtimeData.OutlineColor = function (value) {
            if(arguments.length === 0) {
                return scope.config.OutlineColor;
            }
            else {
                return scope.config.OutlineColor = value;
            }
        }

        function configChanged(config, oldConfig) {
            if(config != oldConfig) {
                scope.chartLoaded = false;
            }
        };  
    
    
        function resize(width, height) {
            //scope.chart.setSize(width, height, true);

        }

        function datasourceChanged(datasources) {
            scope.runtimeData.traces = datasources.map(function (d) {
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

                var chartObj = {};

                var dataSources = scope.runtimeData.traces;

                output.Data.forEach(function (d, idx) {
                    var values = getFormattedData(d.Values);

                    values.forEach(function (v) {
                        if(chartObj[v.Time] == undefined) {
                            chartObj[v.Time] = [];
                        }
                        chartObj[v.Time][idx] = parseFloat(v.Value);
                    })
                });


                chartData = [];

                for(i in chartObj) {
                    var obj = {};
                    obj.time = i;
                    dataSources.forEach(function (d,idx) {
                        obj[d.replace(' ', '')] = chartObj[i][idx];
                    });
                    chartData.push(obj);
                }

                scope.chart.data = chartData;
                // scope.chart.invalidateRawData();
            }
            else {
                setTimeout(function () {
                    loadChart(output);    
                }, 1000);
            }
        }

        function getFormattedData(data) {
            var dataObj = {};
            var formattedData = [];
            if(scope.config.DisplayType == 1) {
                data.forEach(function (d) {
                    var date = moment(d.Time).format('MMM-DD');
                    if(date.toLowerCase() != 'invalid date') {
                        if(dataObj[date] == undefined) {
                            dataObj[date] = !isNaN(parseFloat(d.Value.replace(',', ''))) ? parseFloat(d.Value.replace(',', '')) : 0;
                        }
                    }
                });

                for(i in dataObj) {
                    formattedData.push({
                        Time : i,
                        Value : dataObj[i]
                    });
                }
            }

            else if(scope.config.DisplayType == 2) {
                data.forEach(function (d) {
                    var date = moment(d.Time).format('MMM-DD HH:mm');
                    if(dataObj[date] == undefined) {
                        dataObj[date] = 0;
                    }
                    dataObj[date] += !isNaN(parseFloat(d.Value.replace(',', ''))) ? parseFloat(d.Value.replace(',', '')) : 0;
                });

                for(i in dataObj) {
                    formattedData.push({
                        Time : i,
                        Value : dataObj[i]
                    });
                }
            }

            return formattedData;
        }

        function loadChart(data) {
            am4core.ready(function() {

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                // Create chart instance
                var chart = am4core.create(scope.containerId, am4charts.XYChart);
                chart.background.fill = scope.config.BackgroundColor;
                chart.startDuration = 0;

                // Add data
                // chart.data = [{
                //   "year": "2016",
                //   "europe": 2.5,
                //   "namerica": 2.5,
                //   "asia": 2.1,
                //   "lamerica": 0.3,
                //   "meast": 0.2,
                //   "africa": 0.1
                // }];


                var chartObj = {};
                var dataSources = [];
                data.Data.forEach(function (d, idx) {
                    var label = scope.runtimeData.traces[idx];
                    dataSources.push(label);
                    var values = getFormattedData(d.Values);
                    values.forEach(function (v) {
                        if(chartObj[v.Time] == undefined) {
                            chartObj[v.Time] = [];
                        }
                        chartObj[v.Time][idx] = parseFloat(v.Value);
                    })
                });

                chart.data = [];

                for(i in chartObj) {
                    var obj = {};

                    obj.time = i;
                    dataSources.forEach(function (d,idx) {
                        obj[d.replace(' ', '')] = chartObj[i][idx];
                    })
                    chart.data.push(obj);
                }

                // Create axes
                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "time";
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.grid.template.stroke = am4core.color(scope.config.OutlineColor);
                categoryAxis.renderer.labels.template.fill = am4core.color(scope.config.OutlineColor);
                categoryAxis.fontSize = '12px';
                categoryAxis.fill = scope.config.OutlineColor;

                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.renderer.inside = true;
                valueAxis.renderer.labels.template.disabled = true;
                valueAxis.renderer.labels.template.fill = am4core.color(scope.config.OutlineColor);
                valueAxis.renderer.grid.template.stroke = am4core.color(scope.config.OutlineColor);
                valueAxis.min = 0;
                valueAxis.isShowing = true;
                valueAxis.fill = scope.config.OutlineColor;

                // Create series
                function createSeries(field, name, fill) {
                  
                  // Set up series
                  var series = chart.series.push(new am4charts.ColumnSeries());
                  series.name = name;
                  series.dataFields.valueY = field;
                  series.dataFields.categoryX = "time";
                  series.sequencedInterpolation = true;
                  series.fill = fill;
                  series.stroke = fill;

                  // Make it stacked
                  series.stacked = true;
                  
                  // Configure columns
                  series.columns.template.width = am4core.percent(60);
                  series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:12px]{categoryX}: {valueY}";

                  // Add label
                  var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                  // labelBullet.label.text = "{valueY}";
                  labelBullet.fontSize = '12px';
                  labelBullet.locationY = 0.5;
                  labelBullet.label.hideOversized = true;

                  return series;
                }

                data.Data.forEach(function (d, idx) {
                    var label = dataSources[idx]
                    createSeries(label.replace(' ', ''), label, scope.config.DefaultColors[idx]);
                });

                // Legend
                chart.legend = new am4charts.Legend();
                chart.legend.labels.template.fill = am4core.color(scope.config.OutlineColor);

                scope.chart = chart;
                scope.chartLoaded = true;

            }); // end am4core.ready()
        }
    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  