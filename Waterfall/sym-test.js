(function (PV) {
    'use strict';

    function symbolVis(){}
    PV.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'test',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: 'scripts/app/editor/symbols/ext/icons/sym-test.svg',
        getDefaultConfig: function(){
            return{
                Height: 80,
                Width: 640,
                DataShape: 'TimeSeries',
                DataQueryMode: 'ModeEvents',
                SelectionDataMeasure1: "",
                SelectionDataMeasure2: "",
                SelectionDataMeasure3: "",
                SelectionDataMeasure4: "",
            }
        },
        visObjectType: symbolVis,
        configOptions: function(){
            return [
                {
                title: 'Format...',
                mode: 'format',
                // typesOfDataMeasure: ['absolute', 'relative', 'total']
            }
            ];
        }
    }

    symbolVis.prototype.init = function(scope, elem){
        this.onDataUpdate = dataUpdate; 
        var script_tag = document.createElement('script');  
        script_tag.setAttribute("type", "text/javascript");  
        script_tag.setAttribute("src", "Scripts/app/editor/symbols/ext/libraries/plotly-2.12.1.min.js");  
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    
        function dataUpdate(data){
            console.log(data);

            scope.config.lenData = data.Data.length;
            scope.lenData = data.Data.length;
            console.log('lenData: ' + scope.lenData);

            var waterfallTitle = scope.config.WaterfallChartTitle
            console.log("TYPE " + typeof scope.config.WaterfallChartTitle);
            console.log("Title " + waterfallTitle);
            var YRange = scope.config.SelectedYRange
            console.log("YRange " + YRange);
            console.log(typeof YRange);
            
            var allDataXValues = [];        // Attribute names
            var allDataYValues = [];        // end value for each tag depending on timerange
            var dataMeasure = [];           // absolute, relative, total types

            // DICT for selection of either 'relative', 'absolute', or 'total' data measure for bars
            var selectDict = {
                "0": scope.config.SelectionDataMeasure1,
                "1": scope.config.SelectionDataMeasure2,
                "2": scope.config.SelectionDataMeasure3,
                "3": scope.config.SelectionDataMeasure4,
                "4": scope.config.SelectionDataMeasure5,
                "5": scope.config.SelectionDataMeasure6,
                "6": scope.config.SelectionDataMeasure7,
                "7": scope.config.SelectionDataMeasure8,
                "8": scope.config.SelectionDataMeasure9,
                "9": scope.config.SelectionDataMeasure10,
                "10": scope.config.SelectionDataMeasure11,
                "11": scope.config.SelectionDataMeasure12,
                "12": scope.config.SelectionDataMeasure13,
                "13": scope.config.SelectionDataMeasure14,
                "14": scope.config.SelectionDataMeasure15,
                "15": scope.config.SelectionDataMeasure16,
                "16": scope.config.SelectionDataMeasure17,
                "17": scope.config.SelectionDataMeasure18,
                "18": scope.config.SelectionDataMeasure19,
                "19": scope.config.SelectionDataMeasure20,
            };

            var barName = {
                // ... ADD data structure for BarName variables here
                // use the convention: scope.config.InputBarName<1-20>
                "0": scope.config.InputBarName1,        // starts to #1, 2, 3 ..
                "1": scope.config.InputBarName2,
                "2": scope.config.InputBarName3,
                "3": scope.config.InputBarName4,
                "4": scope.config.InputBarName5,
                "5": scope.config.InputBarName6,
                "6": scope.config.InputBarName7,
                "7": scope.config.InputBarName8,
                "8": scope.config.InputBarName9,
                "9": scope.config.InputBarName10,
                "10": scope.config.InputBarName11,
                "11": scope.config.InputBarName12,
                "12": scope.config.InputBarName13,
                "13": scope.config.InputBarName14,
                "14": scope.config.InputBarName15,
                "15": scope.config.InputBarName16,
                "16": scope.config.InputBarName17,
                "17": scope.config.InputBarName18,
                "18": scope.config.InputBarName19,
                "19": scope.config.InputBarName20,
            };
            console.log("typeBar" + typeof scope.config.InputBarName1);

            // HIDE and SHOW conventions for SelectionDataMeasure option for each bar
            console.log(typeof scope.config.lenData);
            if (scope.config.lenData == 1){
                scope.config.makeShow1 = "1";
                scope.config.makeHide2 = "ng-hide"
                scope.config.makeHide3 = "ng-hide"
                // scope.config.SelectionDataMeasure1 then set class to ng-hide 
            }
            if (scope.config.lenData == 2){
                // scope.config.makeHide = "config.SelectionDataMeasure2"
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeHide3 = "ng-hide"
                // scope.config.SelectionDataMeasure1 then set class to ng-hide 
            }
            if (scope.config.lenData == 3){
                // scope.config.makeHide = "config.SelectionDataMeasure2"
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeHide4 = "ng-hide"
                // scope.config.SelectionDataMeasure1 then set class to ng-hide 
            }
            if (scope.config.lenData == 4){
                // scope.config.makeHide = "config.SelectionDataMeasure2"
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                // scope.config.SelectionDataMeasure1 then set class to ng-hide 
            }
            if (scope.config.lenData == 5){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                
            }
            if (scope.config.lenData == 6){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                
            }
            if (scope.config.lenData == 7){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                
            }
            if (scope.config.lenData == 8){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                
            }
            if (scope.config.lenData == 9){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                
            }
            if (scope.config.lenData == 10){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                scope.config.makeShow10 = "10";
                
            }
            if (scope.config.lenData == 11){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                scope.config.makeShow10 = "10";
                scope.config.makeShow11 = "11";
                
            }
            if (scope.config.lenData == 12){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                scope.config.makeShow10 = "10";
                scope.config.makeShow11 = "11";
                scope.config.makeShow12 = "12";
                
            }
            if (scope.config.lenData == 13){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                scope.config.makeShow10 = "10";
                scope.config.makeShow11 = "11";
                scope.config.makeShow12 = "12";
                scope.config.makeShow13 = "13";
                
            }
            if (scope.config.lenData == 14){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                scope.config.makeShow10 = "10";
                scope.config.makeShow11 = "11";
                scope.config.makeShow12 = "12";
                scope.config.makeShow13 = "13";
                scope.config.makeShow14 = "14";
                
            }
            if (scope.config.lenData == 15){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                scope.config.makeShow10 = "10";
                scope.config.makeShow11 = "11";
                scope.config.makeShow12 = "12";
                scope.config.makeShow13 = "13";
                scope.config.makeShow14 = "14";
                scope.config.makeShow15 = "15";
                
            }
            if (scope.config.lenData == 16){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                scope.config.makeShow10 = "10";
                scope.config.makeShow11 = "11";
                scope.config.makeShow12 = "12";
                scope.config.makeShow13 = "13";
                scope.config.makeShow14 = "14";
                scope.config.makeShow15 = "15";
                scope.config.makeShow16 = "16";
                
            }
            if (scope.config.lenData == 17){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                scope.config.makeShow10 = "10";
                scope.config.makeShow11 = "11";
                scope.config.makeShow12 = "12";
                scope.config.makeShow13 = "13";
                scope.config.makeShow14 = "14";
                scope.config.makeShow15 = "15";
                scope.config.makeShow16 = "16";
                scope.config.makeShow17 = "17";
                
            }
            if (scope.config.lenData == 18){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                scope.config.makeShow10 = "10";
                scope.config.makeShow11 = "11";
                scope.config.makeShow12 = "12";
                scope.config.makeShow13 = "13";
                scope.config.makeShow14 = "14";
                scope.config.makeShow15 = "15";
                scope.config.makeShow16 = "16";
                scope.config.makeShow17 = "17";
                scope.config.makeShow18 = "18";
                
            }
            if (scope.config.lenData == 19){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                scope.config.makeShow10 = "10";
                scope.config.makeShow11 = "11";
                scope.config.makeShow12 = "12";
                scope.config.makeShow13 = "13";
                scope.config.makeShow14 = "14";
                scope.config.makeShow15 = "15";
                scope.config.makeShow16 = "16";
                scope.config.makeShow17 = "17";
                scope.config.makeShow18 = "18";
                scope.config.makeShow19 = "19";

                
            }
            if (scope.config.lenData == 20){
                
                scope.config.makeShow1 = "1";
                scope.config.makeShow2 = "2";
                scope.config.makeShow3 = "3";
                scope.config.makeShow4 = "4";
                scope.config.makeShow5 = "5";
                scope.config.makeShow6 = "6";
                scope.config.makeShow7 = "7";
                scope.config.makeShow8 = "8";
                scope.config.makeShow9 = "9";
                scope.config.makeShow10 = "10";
                scope.config.makeShow11 = "11";
                scope.config.makeShow12 = "12";
                scope.config.makeShow13 = "13";
                scope.config.makeShow14 = "14";
                scope.config.makeShow15 = "15";
                scope.config.makeShow16 = "16";
                scope.config.makeShow17 = "17";
                scope.config.makeShow18 = "18";
                scope.config.makeShow19 = "19";
                scope.config.makeShow20 = "20";
                
            }

            // var strHolder = "#SelectionDataMeasure" + "2"
            // var selectedDataMeasure2 = $(strHolder).val()
            // console.log(selectedDataMeasure2);

            for (let entry=0; entry < scope.lenData; entry++){      // iterate each tag
                console.log("entry = " + entry);

                var len = data.Data[entry].Values.length;

                // var varStr = '#SelectionDataMeasure' + entry + '';
                // console.log(varStr);
                // var forSelectedDataMeasure = $(varStr).val()
                var entryplusone = entry + 1;
                // var forSelectedDataMeasure = eval("scope.config.SelectionDataMeasure" + entryplusone);
                // var forSelectedDataMeasure = scope.config.SelectionDataMeasure1 + entryplusone;
                var SelectedDataMeasureAtIndex;
                if (selectDict[entry] == ''){       // no selected data measure type yet in config html      // use this as reference
                    SelectedDataMeasureAtIndex = 'relative';
                }
                else{
                    SelectedDataMeasureAtIndex = selectDict[entry];
                }
                
                console.log("selected at " + entry + " = " + SelectedDataMeasureAtIndex);
                dataMeasure.push(SelectedDataMeasureAtIndex);

                // Parsing of Tag and Atrribute
                var theLabel = data.Data[entry].Label;
                var labelName = theLabel;
                var labelSplit = [];
                var labelSplit = labelName.split('|');
                var elementName = labelSplit[0];
                var attributeName = labelSplit[1];
                console.log("attributeName " + attributeName);
                var inputAttributeName;
                //Attribute name with spaces and forwards slash converted to <br>
                var wrapAttributeName = attributeName.replaceAll(" / ", "/<br>").replaceAll(" ", "<br>");   
                console.log("wrapAttributeName " + wrapAttributeName);
            

                // if (barName[entry] == ''){
                //     allDataXValues.push(wrapAttributeName)
                // }
                // else{
                //     allDataXValues.push(barName[entry])
                // }
            

                if (barName[entry] == undefined){
                    allDataXValues.push(wrapAttributeName)
                }
                if (barName[entry] != "" || barName[entry] != undefined){ 
                    allDataXValues.push(barName[entry])
                }
                else{
                    allDataXValues.push(wrapAttributeName)
                }
                
                console.log("inputted at " + entry + " = " + barName[entry]);
                    
            
              
                // console.log(typeof parseFloat(data.Data[entry].Values[len-1].Value.replaceAll(",","")));
                allDataYValues.push(parseFloat(data.Data[entry].Values[len-1].Value.replaceAll(",","")).toFixed(2));

            }
            console.log(allDataXValues);
            console.log(allDataXValues.length);
            console.log(allDataYValues);
            console.log(allDataYValues.length);
            console.log(dataMeasure);
            console.log(dataMeasure.length);

            scope.maxOfY = Math.max.apply(null, allDataYValues);
            console.log("maxOfY: " + scope.maxOfY);

            var dataW = [{
                name: "Waterfall Chart",
                type: "waterfall",
                orientation: "v",
                measure: dataMeasure,
                x : allDataXValues,
                textposition: "outside",        
                text: allDataYValues,
                y: allDataYValues,
                connector: {
                    line: {
                        color: "rgb(63, 63, 63)"
                    },
                    visible: false
                },
                 decreasing: { marker: { color: "Red" }},
                 increasing: { marker: { color: "Green"} },
                 totals: { marker: { color: "Gold"} },
                // marker: {
                //     color: 'rgb(142,124,195)'
                //   }
                // textangle: -90,
            }];
          
            var layout = {
                title: waterfallTitle,
                waterfallgap: 0.3,
                // hoverlabel: false,
                hovermode: false,
                xaxis: {
                    autorange: true,
                    layer: "below traces",
                    type: "category",
                    title: "",
                    tickfont: {size: 10},
                    ticks: "outside",
                    showticklabels: true,
                    cliponaxis: true,
                    tickwrap: true,
                    tickangle: '0',
                    // tickson: "boundaries",
                    dividerwidth: 2,
                    autosize: false,
                },
                yaxis: {
                    type: "line", 
                    range: [0, scope.rangeOfY],
                    // autorange: true,
                },
                textposition: "inside",
                // autosize: true,
                constraintext: "inside"
                // showlegend: true,
            };

            if (scope.config.WaterfallChartTitle != ""){
                layout.title = scope.config.WaterfallChartTitle;
                // console.log("Title modified to: " + layout.title);
            }
            
            // if (scope.config.SelectedYRange != scope.rangeOfY){
            //     scope.rangeOfY = scope.config.SelectedYRange;
            // }
            // if (scope.config.SelectedYRange == null){
            //     scope.rangeOfY = scope.maxOfY*1.25;
            // }
            // else{
            //     scope.rangeOfY = scope.config.SelectedYRange;
            // }
            scope.rangeOfY = scope.config.SelectedYRange;

            console.log("rangeOfY: " + scope.rangeOfY);

            // if (scope.config.InputBarName0 != ""){
            //      = scope.config.InputBarName0;
                
            // }
            
            Plotly.newPlot('waterfallChart', dataW, layout);
            console.log("Plotted!");

        }
        
       
    }

    PV.symbolCatalog.register(definition);

}) (window.PIVisualization);