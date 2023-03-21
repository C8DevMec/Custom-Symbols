(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'dga-table-v2',  
        displayName : 'C8 DGA Table V2',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,  
        iconUrl: 'Images/table-icon.svg', 
        configTitle: 'Format Symbol',
        noExpandSelector: '.no-expand', 
        inject : ['$filter'], 
        getDefaultConfig: function () {  
            return {  
                DataShape: 'TimeSeries',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 400,  
                Width: 400,
                TableType : 0,
                Columns : [],
                ColumnHeaders : [
                    {id : 1, title : 'TDCG', show : true},
                    {id : 2, title : 'Expert Advice', show : true},
                    {id : 3, title : 'Complimentary Ratio Fault', show : true},
                    {id : 4, title : 'H2 Level', show : true},
                    {id : 5, title : 'CH4 Level', show : true},
                    {id : 6, title : 'C2H2 Level', show : true},
                    {id : 7, title : 'C2H4 Level', show : true},
                    {id : 8, title : 'C2H6 Level', show : true},
                    {id : 9, title : 'CO Level', show : true},
                    {id : 10, title : 'CO2 Level', show : true},
                    {id : 11, title : 'N2 Level', show : true},
                    {id : 12, title : 'O2 Level', show : true},
                    {id : 13, title : 'NEI Oil', show : true},
                    {id : 14, title : 'NEI Paper', show : true},
                    {id : 15, title : 'Rogers Ratio', show : true},
                    {id : 16, title : 'IEC Ratio', show : true},
                    {id : 17, title : 'Duvals 1 FaultCode', show : true},
                    {id : 18, title : 'Duvals 4 FaultCode', show : true},
                    {id : 19, title : 'Duvals 5 FaultCode', show : true},
                    {id : 20, title : 'Duvals Pentagon 2 FaultCode', show : true},
                ],
                Changed : 1
            };  
        },  
        visObjectType: symbolVis  
    };  

    //'CO Level','CO2 Level','N2 Level','O2 Level','NEI Oil', 'NEI Paper','Rogers Ratio','IEC Ratio','Duvals 1 FaultCode','Duvals 4 FaultCode','Duvals 5 FaultCode','Duvals Pentagon 2 FaultCode'

    symbolVis.prototype.init = function init(scope, elem, $filter) { 
        this.onDataUpdate = dataUpdate;  
        this.onConfigChange = configChanged;  
        this.onResize = resize;  
        
        scope.showExpertAdviceModal = false;
        scope.Math = window.Math;
        scope.page = 1;
        scope.items = 20;
        scope.offset = 0;
        scope.total_page = 1;
        scope.table_resizer_loaded = false;
        scope.headers = [
            'TDCG', 'Expert Advice', 'Complimentary Ratio Fault','H2 Level','CH4 Level','C2H2 Level','C2H4 Level','C2H6 Level','CO Level','CO2 Level','N2 Level','O2 Level','NEI Oil', 'NEI Paper','Rogers Ratio','IEC Ratio','Duvals 1 FaultCode','Duvals 4 FaultCode','Duvals 5 FaultCode','Duvals Pentagon 2 FaultCode'
        ];
        scope.runtimeData.ColumnHeaders = scope.config.ColumnHeaders;
        

        scope.rows = [];


        setTimeout(function (){
            if(!scope.table_resizer_loaded) {
                tableResizer();
                scope.table_resizer_loaded = true;  
            }
        }, 5000);



        function configChanged(config, oldConfig) {
        };
    
    
        function resize(width, height) {  
        }

        function tableResizer() {
            var thElm;
            var startOffset;

            Array.prototype.forEach.call(
              document.querySelectorAll("table.custom-table th"),
              function (th, idx) {

                var grip = document.createElement('div');
                grip.innerHTML = "&nbsp;";
                grip.style.top = 0;
                grip.style.right = 0;
                grip.style.bottom = 0;
                grip.style.width = '5px';
                grip.style.position = 'absolute';
                grip.style.cursor = 'col-resize';
                grip.addEventListener('mousedown', function (e) {
                    thElm = th;
                    startOffset = th.offsetWidth - e.pageX;
                });

                if(th.getElementsByTagName('div').length == 0) {
                    th.appendChild(grip);
                }
              });

            document.addEventListener('mousemove', function (e) {
              if (thElm) {
                thElm.style.width = startOffset + e.pageX + 'px';
              }
            });

            document.addEventListener('mouseup', function (e) {
                try {
                    var table_id = thElm.parentElement.parentElement.parentElement.id;
                    index = Array.from(thElm.parentElement.children).indexOf(thElm);
                    scope.config.Columns[index] = {width : startOffset + e.pageX + 'px'};;
                    scope.config.Changed = scope.config.Changed + 1;

                    thElm = undefined;
                } catch(ex) {
                    
                }
                
            });
        }

        function dataUpdate(output) { 
            var rows = output.Data[0].Values.map(function (r) {
                return {
                    Time : r.Time,
                    Value : r.Value.split(';')
                }
            });

            console.log(rows);

            scope.rows = rows.reverse();
        }

        scope.runtimeData.toggleHeader = function (idx, show) {
            scope.config.ColumnHeaders[idx].show = show;
        }

        scope.showExpertAdvice = function (v) {
            //0 = Expert Advice
            //1 = TDCG

            console.log(v);
            scope.show_expert_advice = true;

            var expert_advice = new ExpertAdvice();
            scope.expert_advice = expert_advice.expert_advices[v[1]];
            scope.complimentary_ratio = expert_advice.complimentaryRatioList[v[2]];
            scope.expert_advice.tdcg = v[0];
        }

        scope.closeExpertAdvice = function () {
            scope.show_expert_advice = false;
        }

        scope.runtimeData.selectHeader = function (idx) {
            scope.runtimeData.selectedAttr = idx;
            scope.runtimeData.selectedHeader = scope.runtimeData.ColumnHeaders[idx];
        }
        scope.runtimeData.changeHeaderText = function (text) {
            var headers = scope.config.ColumnHeaders;
            headers[scope.runtimeData.selectedAttr].text = text;
            scope.config.ColumnHeaders = headers;
        }

        scope.runtimeData.moveTrace = function (idx) {
            var target = idx + movement;
            var temp = scope.symbol.DataSources[target];
            scope.symbol.DataSources[target] = scope.symbol.DataSources[idx];
            scope.symbol.DataSources[idx] = temp; 

            scope.$emit('refreshDataForAllSymbols');
        }

        scope.goToPage = function (page) {
            scope.page = page;
            scope.offset = (scope.page * scope.items) - scope.items;
        }
        scope.paginate = function (page) {
            scope.page = scope.page + page;
            scope.offset = (scope.page * scope.items) - scope.items;
        }


    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  