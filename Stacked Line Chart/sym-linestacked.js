(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'linestacked',  
        displayName : 'C8 Line Stacked Chart',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,  
        iconUrl: 'Images/chrome.trend.svg', 
        configTitle: 'Format Symbol',
        noExpandSelector : '.no-expand',
        getDefaultConfig: function () {  
            return {  
                DataShape: 'TimeSeries',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 300,  
                Width: 600,
                Interval : 1,
                DisplayType : 1,
                DefaultColors : [
                    '#D98880', '#C39BD3', '#76D7C4', '#7DCEA0', '#F7DC6F', '#E59866', '#85929E', '#922B21', '#6C3483', '#2471A3', '#148F77',
                    '#D68910', '#BA4A00', '#7FB3D5','#212F3C'
                ],
                OutlineColor : '#000',
                BackgroundColor : '#fff',
                TimeFilter : true
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

        scope.startTime = moment(timeProvider.getServerStartTime());
        scope.endTime = moment(timeProvider.getServerEndTime());

        scope.containerId = 'linestacked-' + Math.ceil(Math.random() * 10000000);
        
        var date = new Date();
        scope.from = {
            month_idx : date.getMonth(),
            day : date.getDate() <= 9 ? '0' + date.getDate() : date.getDate().toString(),
            year : date.getFullYear()
        }
        scope.to = {
            month_idx : date.getMonth(),
            day : date.getDate() + 1 <= 9 ? '0' + (date.getDate() + 1) : (date.getDate() + 1).toString(),
            year : date.getFullYear()
        }

        scope.months = [
            {idx : 0, id : '01', name : 'Jan', days : 31},
            {idx : 1, id : '02', name : 'Feb', days :28},
            {idx : 2, id : '03', name : 'Mar', days : 31},
            {idx : 3, id : '04', name : 'Apr', days : 30},
            {idx : 4, id : '05', name : 'May', days : 31},
            {idx : 5, id : '06', name : 'Jun', days : 30},
            {idx : 6, id : '07', name : 'Jul', days : 31},
            {idx : 7, id : '08', name : 'Aug', days : 31},
            {idx : 8, id : '09', name : 'Sep', days : 30},
            {idx : 9, id : '10', name : 'Oct', days : 31},
            {idx : 10, id : '11', name : 'Nov', days : 30},
            {idx : 11, id : '12', name : 'Dec', days : 31},
        ];

        scope.days = [];
        for(i = 1; i <= 31; i++) {
            var day_str = i <= 9 ? '0' + i : i;
            scope.days.push(day_str.toString());
        }

        scope.years = [];
        for(i = date.getFullYear(); i >= date.getFullYear() - 20; i--) {
            scope.years.push(i);
        }

        scope.chart = null;
        scope.chartConfig = null;
        scope.chartLoaded = false;
        scope.runtimeData.trace = 0;
        scope.lastData = null;
        scope.firstData = null;
        scope.runtimeData.traces = scope.symbol.DataSources.map(function (d) {
            if(d.substring(0, 2) == 'pi') {
                var label = d.split('\\');
            }
            else {
                var label = d.split('|');
            }
            return label[label.length - 1].replace(/\?.*/, '');
        });

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
                scope.lastData = null;
            }
        };  
    
    
        function resize(width, height) {
            //scope.chart.setSize(width, height, true);

        }

        function datasourceChanged(datasource) {
            scope.runtimeData.traces = scope.symbol.DataSources.map(function (d) {
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

            var data = getChartData(output);
            if(scope.chartLoaded) {
                scope.chartConfig.data.labels = data.labels;
                scope.chartConfig.data.datasets = data.datasets;
                scope.chart.update();
            }
            else {
                setTimeout(function () {
                    loadChart(data.labels, data.datasets);
                }, 1000)
                
            }

        }

        function getChartData(output) {
            // var chartObj = {};
            // var dataSources = [];

            // scope.symbol.DataSources.forEach(function (d) {
            //     var label = d.split('|');

            //     dataSources.push(label[label.length - 1].replace(' ', ''));
            // });

            // output.Data.forEach(function (d, idx) {
            //     var values = getFormattedData(d.Values);

            //     values.forEach(function (v) {
            //         if(chartObj[v.Time] == undefined) {
            //             chartObj[v.Time] = [];
            //         }
            //         chartObj[v.Time][idx] = parseFloat(v.Value);
            //     })
            // });



            // chartData = [];

            // for(i in chartObj) {
            //     var obj = {};
            //     obj.time = i;
            //     dataSources.forEach(function (d,idx) {
            //         obj[d] = chartObj[i][idx];
            //     });
            //     chartData.push(obj);
            // }

            var chartData = {};
            var datasets = [];
            var labels = [];
            output.Data.forEach(function (data, idx) {
                if(datasets[idx] == undefined) {
                    datasets[idx] = {};
                }

                var label = scope.runtimeData.traces[idx];

                datasets[idx].label = label.split('|').length > 1 ? label.split('|')[1] : label.split('|')[0];
                datasets[idx].borderColor = scope.config.DefaultColors[idx];
                datasets[idx].borderWidth = 2;
                datasets[idx].backgroundColor = getBackground(scope.config.DefaultColors[idx]);
                datasets[idx].data = [];

                data.Values.forEach(function (d) {
                    if(scope.config.TimeFilter) {
                        if(moment(d.Time) >= scope.startTime && moment(d.Time) <= scope.endTime) { //If the date is within the time range
                            var formattedTime = moment(d.Time).format(' hh:mm A');
                            if(chartData[d.Time] == undefined) {
                                chartData[d.Time] = [];
                            }

                            if(labels.indexOf(formattedTime) < 0 ){
                                labels.push(formattedTime);
                            }

                            chartData[d.Time][idx] = !isNaN(d.Value.replace(',', '') * 1) ? parseFloat(d.Value.replace(',', '')) : 0;
                        }
                    }
                    else {
                        var formattedTime = moment(d.Time).format(' hh:mm A');
                        if(chartData[d.Time] == undefined) {
                            chartData[d.Time] = [];
                        }

                        if(labels.indexOf(formattedTime) < 0 ){
                            labels.push(formattedTime);
                        }

                        chartData[d.Time][idx] = !isNaN(d.Value.replace(',', '') * 1) ? parseFloat(d.Value.replace(',', '')) : 0;
                    }
                    
                });
            });


            scope.symbol.DataSources.forEach(function (ds, idx) {
                for(i in chartData) {
                    datasets[idx].data.push(chartData[i][idx]);
                }
            });


            return {"labels" : labels, "datasets" : datasets};
        }

        function getBackground(color) {
            var percent = 40;
            var r = parseInt(color.substring(1,3),16);
            var g = parseInt(color.substring(3,5),16);
            var b = parseInt(color.substring(5,7),16);

            r = parseInt(r * (100 + percent) / 100);
            g = parseInt(g * (100 + percent) / 100);
            b = parseInt(b * (100 + percent) / 100);

            r = (r < 255) ? r : 255;  
            g = (g < 255) ? g : 255;  
            b = (b < 255) ? b : 255;  

            var rr = ((r.toString(16).length == 1) ? "0" + r.toString(16) : r.toString(16));
            var gg = ((g.toString(16).length == 1) ? "0" + g.toString(16) : g.toString(16));
            var bb = ((b.toString(16).length == 1) ? "0" + b.toString(16) : b.toString(16));

            // return "#" + rr + gg + bb;
            return 'rgba('+ r +','+ g +','+ b +',0.3)';
        }


        function loadChart(labels, datasets) {
            scope.chartConfig = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    defaultColor  : '#fff',
                    defaultFontColor : '#fff',
                    responsive: true,
                    hover: {
                        mode: 'index'
                    },
                    scales: {
                        x: {
                            scaleLabel: {
                                display: true,
                                labelString: 'Time',
                            },
                        },
                        y: {
                            stacked: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Value'
                            }
                        }
                    },
                    animation : false
                }
            };


            var ctx = document.getElementById(scope.containerId).getContext('2d');
            scope.chart = new Chart(ctx, scope.chartConfig);
            scope.chartLoaded = true;
        }

        scope.filterByDate = function () {
            var start_mo = scope.months[scope.from.month_idx];
            var end_mo = scope.months[scope.to.month_idx];

            var startTime = scope.from.year + '-' + start_mo.id + '-' + scope.from.day + ' 00:00:00';
            var endTime = scope.to.year + '-' + end_mo.id + '-' + scope.to.day + ' 00:00:00';

            scope.startTime = moment(startTime);
            scope.endTime = moment(endTime);

            scope.$emit('RefreshDataForAllSymbols');
        }

    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  