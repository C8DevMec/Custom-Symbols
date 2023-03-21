(function (PV) {

    function symbolVis() { }
    PV.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'custom-table',
        displayName: 'C8 Table (Multiple Attributes)',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: 'Images/chrome.table.white.svg',
        configTitle: 'Configure Table',
        getDefaultConfig: function () {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 400,
                Width: 400,
                Interval: 5000,
                TableType: 0,
                Columns: [],
                Headers: [],
                FontSize : 14,
                HeadersName : {},
            };
        },
        visObjectType: symbolVis
    };

    symbolVis.prototype.init = function init(scope, elem) {
        this.onDataUpdate = dataUpdate;
        this.onConfigChange = configChanged;
        this.onResize = resize;
        this.onDatasourceChange = dataSourceChanged;
        scope.headers = [];
        scope.display_data = [];
        scope.load_count = 0;
        scope.currentPage = 1;
        scope.rowsPerPage = 10;
        scope.pageOffset = 0;
        scope.runtimeData.FontSize = scope.config.FontSize;
        scope.runtimeData.HeadersName = scope.config.Headers;
       
     
        function dataUpdate(output) {
            data = output.Data;
            scope.rows = parseTimeSeriesData(data);
            scope.totalPages = Math.ceil(scope.rows.length / scope.rowsPerPage);
        }

        function parseTimeSeriesData(data, granularity = 'm', offset = 0) {
            if (data.length == 0) {
                return [];
            }
            var base = data[0].Values; 
            scope.base = data[0].Values; 
            datasources = [];
            data.forEach(function (d, index) {
                if (d.Values.length == 0) {
                    datasources[index] = {};
                }
                else {
                    d.Values.forEach(function (v, v_index) { 
                        if (datasources[index] == undefined) { 
                            datasources[index] = {};
                        }
                        datasources[index][v.Time] = v; 
                    });
                }
            });
        
            rows = [];
            for (var i = 0; i < base.length; i++) {
                var b = base[i];
                var timestamp = b.Time;
                var columns = [];
                var seconds = new Date(timestamp).getSeconds(); 
                var minutes = new Date(timestamp).getMinutes(); 
                var hours = new Date(timestamp).getHours(); 
        
                datasources.forEach(function (d, index) {
                    if (d[timestamp] != undefined) {
                        columns.push(d[timestamp]);
                    }
                    else {
                        columns.push({ Time: timestamp, Value: '' });
                    }
                });
        
                rows.push({
                    timestamp: timestamp,
                    columns: columns
                });
            }
            return rows;
        }

        scope.nextPage = function() {
            if (scope.currentPage < scope.totalPages) {
                scope.currentPage++;
                scope.pageOffset = (scope.currentPage * scope.rowsPerPage) - scope.rowsPerPage;
            }
        }

        scope.prevPage = function() {
            if (scope.currentPage > 1) {
                scope.currentPage--;
                scope.pageOffset = (scope.currentPage * scope.rowsPerPage) - scope.rowsPerPage;
            }
        }

        scope.goToPage = function(pageNum) {
            if (pageNum > 0 && pageNum <= scope.totalPages) {
                scope.currentPage = pageNum;
                scope.pageOffset = (scope.currentPage * scope.rowsPerPage) - scope.rowsPerPage;
            }
        }
        
        function configChanged(oldConfig, config) {
            console.log(config, oldConfig);
            scope.config.Headers = [];
            scope.symbol.DataSources.forEach(function (d, i) {
                let attribute = d.split('\\');
                if (attribute[0] == 'af:') {
                    attribute = attribute[attribute.length - 1].replace(/\?[A-Za-z0-9\-]+/g, '');
                }
                else {
                    attribute = attribute[attribute.length - 1].replace(/\?.+/, '');
                }
                scope.config.Headers[i] = { idx: i, name: attribute };
                // scope.config.HeadersName = scope.config.Headers[i];
                // console.log(scope.config.HeadersName.name)
            });
        };

        function resize(width, height) {
           
        }

        function dataSourceChanged() {
            scope.config.Headers = [];
            scope.symbol.DataSources.forEach(function (d, i) {
                let attribute = d.split('\\');
                if (attribute[0] == 'af:') {
                    attribute = attribute[attribute.length - 1].replace(/\?[A-Za-z0-9\-]+/g, '');
                }
                else {
                    attribute = attribute[attribute.length - 1].replace(/\?.+/, '');
                }
                scope.config.Headers[i] = { idx: i, name: attribute };
               
            });
        }

        scope.runtimeData.changeFontSize = function(fontSize) {
            scope.config.FontSize = fontSize;
        }
        scope.runtimeData.saveConfig = function (idx, header) {
            scope.config.Headers[idx] = header;
            console.log(scope.runtimeData.Trace)
        }

        // scope.runtimeData.selectHeader = function () {
        //     scope.runtimeData.trace = scope.config.HeadersName
        //     console.log(scope.runtimeData.trace)
        //     // scope.config.Headers[idx] = header;
        // }

        scope.runtimeData.updateConfig = function (Newname){
            scope.config.HeadersName.name = Newname
            console.log(scope.config.HeadersName.name);
        }


        scope.remove = function (idx) {
            if (confirm("Are you sure?")) {
                scope.symbol.DataSources.splice(idx, 1);

                scope.$emit('refreshDataForAllSymbols');
            }
        }
    }

    PV.symbolCatalog.register(definition);
})(window.PIVisualization);  