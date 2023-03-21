(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'duvalt1',  
        displayName : 'Duvals Triangle 1',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,  
        iconUrl: 'Images/duvalst1.svg', 
        configTitle: 'Format Duvals Triangle 1',
        noExpandSelector: '.no-expand',  
        getDefaultConfig: function () {  
            return {  
                DataShape: 'TimeSeries',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 400,  
                Width: 400,
                Interval : 5000,
                FillColor : {
                    PD : "pink",
                    T1 : "orange",
                    T2 : "LimeGreen",
                    T3 : "HotPink",
                    DT : "blue",
                    D1 : "SkyBlue",
                    D2 : "#679A00",
                }
            };  
        },
        visObjectType: symbolVis  
    };


    symbolVis.prototype.init = function init(scope, elem) { 
        this.onDataUpdate = dataUpdate;  
        this.onConfigChange = configChanged;
        this.onResize = resize;

        scope.libraries_loaded = false;
        scope.div_id = Math.floor(Math.random() * 100000);

        scope.triangle_loaded = false;
        scope.chart2 = null;
        scope.xScale2 = null;
        scope.yScale2 = null;
        scope.animated = false;
        scope.animation_ongoing = false;
        scope.dpl_tt = null;
        scope.duvT1Zones = [];

        scope.runtimeData.datasources = scope.symbol.DataSources.map(function (d) {
            var ds_arr = d.split("\\");
            return ds_arr[ds_arr.length - 1];
        });
        scope.runtimeData.selected_ds = 0;

        scope.runtimeData.removeTrace = function (idx) {
            scope.symbol.DataSources.splice(idx);
            scope.$emit('refreshDataForAllSymbols');
        }

        scope.runtimeData.moveTrace = function (idx, movement) {

            var old_idx = idx;
            var new_idx = idx + movement;
            var a = angular.copy(scope.symbol.DataSources[new_idx]);
            var b = angular.copy(scope.symbol.DataSources[old_idx]);
            scope.symbol.DataSources[new_idx] = b;
            scope.symbol.DataSources[old_idx] = a;

            scope.runtimeData.datasources = scope.symbol.DataSources.map(function (d) {
                var ds_arr = d.split("\\");
                return ds_arr[ds_arr.length - 1];
            });

            scope.runtimeData.selected_ds = new_idx;

            scope.$emit('refreshDataForAllSymbols');
        }

        scope.reanimate = function () {
            scope.animated = false;
            scope.$emit('refreshDataForChangedSymbols');
        }


        function configChanged(config, oldConfig) {
            if(config.FillColor != oldConfig.FillColor) {
                var color_config = {
                    pd_color : scope.config.FillColor.PD,
                    t1_color : scope.config.FillColor.T1,
                    t2_color : scope.config.FillColor.T2,
                    t3_color : scope.config.FillColor.T3,
                    dt_color : scope.config.FillColor.DT,
                    d1_color : scope.config.FillColor.D1,
                    d2_color : scope.config.FillColor.D2
                }
                duvals1.changeConfig(color_config);
            }
        };  


        function resize(width, height) {  
            
        }

        function dataUpdate(data) {
            if(!scope.libraries_loaded) {
               loadLibraries(); 
            }

            if(!data) {
                return;
            }

            try{
                d3 = d3;
                moment = moment;
                duvals1 = duvals1;
            }
            catch(ex) {
                setTimeout(function() {
                    scope.$emit('refreshDataForAllSymbols');
                }, 500);
            }

            if(scope.runtimeData.datasources.length != scope.symbol.DataSources.length) {
                scope.runtimeData.datasources = scope.symbol.DataSources.map(function (d) {
                    var ds_arr = d.split("\\");
                    return ds_arr[ds_arr.length - 1];
                });
                scope.runtimeData.selected_ds = 0;
            }

            var parsedData = getParsedData(data.Data);

            if(!scope.triangle_loaded) {
                var color_config = {
                    pd_color : scope.config.FillColor.PD,
                    t1_color : scope.config.FillColor.T1,
                    t2_color : scope.config.FillColor.T2,
                    t3_color : scope.config.FillColor.T3,
                    dt_color : scope.config.FillColor.DT,
                    d1_color : scope.config.FillColor.D1,
                    d2_color : scope.config.FillColor.D2
                }
                duvals1.load('#t1-' + scope.div_id, color_config, parsedData);
                scope.triangle_loaded = true;
                scope.animated  = true;
            }
            else {
                if(scope.animated) {
                    duvals1.refreshData(parsedData);
                }
                else {
                    duvals1.reanimate(parsedData);
                    scope.animated  = true;
                }
            }
        }
        
        function getParsedData(raw_data) {
            var data = cleanData(raw_data);
            if(data.length < 3) {
                return [];
            }
            var data_arr = [];
            var plot_count = 0;
            data.forEach(function(d, i) {
                d.forEach(function (dt)  {
                    if(data_arr[i] === undefined) {
                        data_arr[i] = {}; 
                    }

                    var timestamp = new Date(dt.Time);
                    data_arr[i][timestamp.getTime()] = dt.Value;
                });
            });


            var chart_data = [];
            var idx = 0;
            var plot_count = data[0].length;
            for(var i in data_arr[0]) {
                var c2h4 = parseFloat(data_arr[0][i]);
                var c2h2 = data_arr[1][i] ? parseFloat(data_arr[1][i]) : 0;
                var ch4 = data_arr[2][i] ? parseFloat(data_arr[2][i]) : 0;
                var fault = data_arr[3] != undefined ? data_arr[3][i] : 'Undefined';

                if(fault != 'Normal') {
                    var chart_data_obj = {
                        c2h4 : c2h4,
                        c2h2 : c2h2,
                        ch4 : ch4,
                        timestamp : moment(parseInt(i)).format("DD/MM/YYYY HH:mm:ss"),
                        interpretation : fault,
                    }

                    chart_data.push(chart_data_obj);

                    idx += 1;
                }
            }

            return chart_data;
        }


        function cleanData(data) {
            var new_data = [];
            data.forEach(function(d, i) {
                new_data[i] = [];
                d.Values.forEach(function (d2) {

                    if(d2.Value != 'Pt Created') {
                        new_data[i].push(d2);
                    }
                });
            });

            console.log(new_data);

            return new_data;
        }

        function loadLibraries() {
            var libraries = [];
            try {
                d3 = d3;
            }
            catch(err) {
              libraries.push('Scripts/app/editor/symbols/ext/libraries/d3/d3.min.js');
            }

            try {
                moment = moment;
            }
            catch(err) {
                libraries.push('Scripts/app/editor/symbols/ext/libraries/moment.min.js');
            }
            
            try {
                duvals1 = duvals1;
            }
            catch(err) {
              libraries.push('Scripts/app/editor/symbols/ext/libraries/duvals/triangle1.js');
            }
            
            libraries.forEach(function (src) {
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = src;
                s.async = false;
                document.head.appendChild(s);
            });
            
            scope.libraries_loaded = true;
        }


        scope.runtimeData.FillColorPD = function (value) {
            if(arguments.length === 0) {
                return scope.config.FillColor.PD = scope.config.FillColor.PD;
            }
            else {
                return scope.config.FillColor.PD = value;
            }
        }

        scope.runtimeData.FillColorT1 = function (value) {
            if(arguments.length === 0) {
                return scope.config.FillColor.T1 = scope.config.FillColor.T1;
            }
            else {
                return scope.config.FillColor.T1 = value;
            }
        }

        scope.runtimeData.FillColorT2 = function (value) {
            if(arguments.length === 0) {
                return scope.config.FillColor.T2 = scope.config.FillColor.T2;
            }
            else {
                return scope.config.FillColor.T2 = value;
            }
        }

        scope.runtimeData.FillColorT3 = function (value) {
            if(arguments.length === 0) {
                return scope.config.FillColor.T3 = scope.config.FillColor.T3;
            }
            else {
                return scope.config.FillColor.T3 = value;
            }
        }

        scope.runtimeData.FillColorDT = function (value) {
            if(arguments.length === 0) {
                return scope.config.FillColor.DT = scope.config.FillColor.DT;
            }
            else {
                return scope.config.FillColor.DT = value;
            }
        }

        scope.runtimeData.FillColorD1 = function (value) {
            if(arguments.length === 0) {
                return scope.config.FillColor.D1 = scope.config.FillColor.D1;
            }
            else {
                return scope.config.FillColor.D1 = value;
            }
        }

        scope.runtimeData.FillColorD2 = function (value) {
            if(arguments.length === 0) {
                return scope.config.FillColor.D2 = scope.config.FillColor.D2;
            }
            else {
                return scope.config.FillColor.D2 = value;
            }
        }
    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  