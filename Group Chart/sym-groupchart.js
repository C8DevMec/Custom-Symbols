(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'groupchart',  
        displayName : 'C8 Group Chart',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,  
        iconUrl: 'Images/bar-graph.svg', 
        configTitle: 'Format Symbol',
        noExpandSelector : '.no-expand',
        getDefaultConfig: function () {  
            return {  
                DataShape: 'TimeSeries',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 400,  
                Width: 600,
                Interval : 5000,
                Fill : '#407cff',
                Title : 'Calibr8 Group Chart',
                DateFormat : 'en',
                DisplayType : 'Hourly'
            };  
        },
        visObjectType: symbolVis  
    };  


    symbolVis.prototype.init = function init(scope, elem) { 
        this.onDataUpdate = dataUpdate;  
        this.onConfigChange = configChanged;
        this.onResize = resize;  
        this.onDatasourceChange = dataSourceChanged;
        scope.containerId = 'groupchart-' + Math.ceil(Math.random() * 10000000)

        scope.chart = null;
        scope.chartLoaded = false;
        scope.filter = {
            date : new Date(),
            month : new Date().getMonth().toString(),
            year : new Date().getFullYear()
        }

        scope.months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        scope.years = [];
        for(i = new Date().getFullYear(); i >= new Date().getFullYear() - 20; i--) {
            scope.years.push(i);
        }

        scope.runtimeData.fill = function (value) {
            if(arguments.length === 0) {
                return scope.config.Fill;
            }
            else {
                return scope.config.Fill = value;
            }
        }

        scope.runtimeData.DisplayTypes = ['Hourly', 'Daily'];
        scope.runtimeData.DisplayType = function (value) {
            if(arguments.length === 0) {
                return scope.config.DisplayType;
            }
            else {
                return scope.config.DisplayType = value;
            }
        }

        function dataSourceChanged(d) {
            scope.chartLoaded = false;
        }

        function configChanged(config, oldConfig) {
            if(config != oldConfig) {
                scope.chartLoaded = false;
                scope.$emit('refreshDataForAllSymbols');
            }

            scope.runtimeData.Traces = scope.symbol.DataSources.map(function (d) {
                var ds_arr = d.split('|');
                var datasource = ds_arr[ds_arr.length - 1];
                return datasource.substring(0, datasource.indexOf('?'));
            });
        };
    
    
        function resize(width, height) {
            //scope.chart.setSize(width, height, true);

        }

        function dataUpdate(output) {
            if(!output) {
                return;
            }
            
            var formattedData = formatData(output.Data);
            if(scope.chartLoaded) {
                // scope.chart.series = formattedData.series;
                formattedData.series.forEach(function (s, idx) {
                    scope.chart.series[idx].setData(s.data);
                })
                scope.chart.redraw();
                // scope.chart.series.update();
            }
            else {
                loadChart(formattedData);
            }
        }

        function formatData(attributes) {
            var timestamps = [];
            if(scope.config.DisplayType == 'Hourly') {
                var date = new Date(scope.filter.date);
                for(i = 0; i < 24; i++) {
                    var hour = i <= 9 ? '0' + i : i.toString();
                    var time = date.toLocaleDateString() + ' ' + hour + ':00:00';
                    timestamps.push(time);
                }
            }
            else if(scope.config.DisplayType == 'Daily') {
                for(i = 0; i < 31; i++) {
                    var month = scope.months[scope.filter.month];
                    var day = i <= 9 ? '0' + i : i;
                    var year = scope.filter.year;

                    var date = month + ' ' + day + ', ' + year;
                    var date_obj = new Date(date);
                    if(date_obj != 'Invalid Date') {
                        timestamps.push(date_obj.toLocaleDateString());
                    }
                }
            }

            var series = [];
            attributes.forEach(function (d, idx) {
                series[idx] = {
                    name : scope.runtimeData.Traces[idx],
                    data : []
                };
                d.Values.forEach(function (v) {
                    if(!(v.Value == 'No Data' || v.Value == 'Pt Created')) {
                        if (scope.config.DateFormat == 'en') { // If the date format is english format
                            var date = new Date(v.Time);
                        }
                        else { // If the date format is british format
                            var date = v.Time.split('/');
                            date = date[1] + '/' + date[0] + '/' + date[2];
                            date = new Date(date);
                        }

                        if(scope.config.DisplayType == 'Hourly') {
                            var filter_date = new Date(scope.filter.date);
                            if(filter_date.toLocaleDateString() == date.toLocaleDateString()) {
                                var hour = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString();
                                timestamp = date.toLocaleDateString() + ' ' + hour + ':00:00';
                                if(timestamps.indexOf(timestamp) == -1) {
                                    timestamps.push(timestamp);
                                }

                                var timestamp_idx = timestamps.indexOf(timestamp);
                                series[idx].data[timestamp_idx] = series[idx].data[timestamp_idx] == undefined ? 0 : parseFloat(v.Value.replace(',', ''));
                            }
                        }
                        else {
                            if(scope.filter.month == date.getMonth() && scope.filter.year == date.getFullYear()) {
                                var timestamp = date.toLocaleDateString();
                                var timestamp_idx = timestamps.indexOf(timestamp);

                                if(series[idx].data[timestamp_idx] == undefined || series[idx].data[timestamp_idx]) {
                                    series[idx].data[timestamp_idx] = parseFloat(v.Value.replace(',', '').trim());
                                }
                            }
                        }
                    }
                });
            });

            
            if(scope.config.DisplayType == 'Hourly') {
                var categories = timestamps.map(function (t) {
                    var date = new Date(t);
                    return date.getHours();
                });
    
                series.map(function (s) {
                    timestamps.forEach(function (t, idx) {
                        if(s.data[idx] == undefined) {
                            s.data[idx] = 0;
                        }
                    });
    
                    return s;
                });
            }
            else {
                var categories = timestamps.map(function (t) {
                    var date = new Date(t);
                    return date.getDate();
                });
    
                series.map(function (s) {
                    timestamps.forEach(function (t, idx) {
                        if(s.data[idx] == undefined) {
                            s.data[idx] = 0;
                        }
                    });
    
                    return s;
                });
            }
            

            // console.log({categories : categories, series : series});
            
            return {categories : categories, series : series};
        }

        function loadChart(data) {
            scope.chart = Highcharts.chart(scope.containerId, {
                chart: {
                    type: 'column'
                },
                title: {
                    text: scope.config.Title
                },
                // subtitle: {
                //     text: 'Source: WorldClimate.com'
                // },
                xAxis: {
                    categories: data.categories,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Value'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: data.series
            });
            // scope.chart = chart;
            scope.chartLoaded = true;
        }

        scope.runtimeData.removeTrace = function (t) {
            var index = scope.runtimeData.Traces.indexOf(t);
            scope.runtimeData.Traces.splice(index, 1);
            scope.symbol.DataSources.splice(index, 1);
            
            scope.$emit('refreshDataForAllSymbols');
        }
    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  