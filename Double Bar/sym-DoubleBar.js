(function (PV) {
    'use strict';

    function symbolVis(){}
    PV.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'DoubleBar',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
        iconUrl: '/Scripts/app/editor/symbols/ext/Icons/DoubleBar.png',
        getDefaultConfig: function(){
            return{
                Height: 400,
                Width: 800,
                DataShape: 'TimeSeries',
                DataQueryMode: 'ModeSingleton',
                TheBarChartTitle: ""
                // ,ChangeTitle: 'Change Title'
            }
        },
        visObjectType: symbolVis,
        configOptions: function(){
            return [
                {
                title: 'Format',
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
            console.log("DATA = ", data);

            scope.config.lenData = data.Data.length;

            var xlabels = [];       // xlabels  
                 
            var actual = [];        // end value for each tag depending on timerange
            var target = [];        // end value for each tag depending on timerange

            var actualColor = scope.config.ColorPickerActual;
            console.log("ACTUAL " + actualColor);

            var targetColor = scope.config.ColorPickerTarget;
            console.log("TARGET " + targetColor);

            var lenData = data.Data.length;
            console.log("lenData = ", lenData);
            
            var barName = {
                // ... ADD data structure for BarName variables here
                // use the convention: scope.config.InputBarName<1-20>
                "0": scope.config.InputBarName1,        // starts to #1, 2, 3 ..
                "2": scope.config.InputBarName3,
                "4": scope.config.InputBarName5,
                "6": scope.config.InputBarName7,
               
            };

            if (scope.config.lenData == 1){
                scope.config.makeShow1 = "1";
                
               
            }
            if (scope.config.lenData == 3){
               
                scope.config.makeShow1 = "1";
               
                scope.config.makeShow3 = "3";
               
                
            }
            if (scope.config.lenData == 5){
                
                scope.config.makeShow1 = "1";
               
                scope.config.makeShow3 = "3";
               
                scope.config.makeShow5 = "5";
                
            }
            if (scope.config.lenData == 7){
                
                scope.config.makeShow1 = "1";
              
                scope.config.makeShow3 = "3";
               
                scope.config.makeShow5 = "5";
               
                scope.config.makeShow7 = "7";
                
            }

            for (let entry=0; entry < lenData; entry++){      -
                    console.log("entry = " + entry);
    
                    var len = data.Data[entry].Values.length;
                    console.log("len = ", len);
                   
                    scope.theLabel = data.Data[entry].Label;
                    console.log("label = ", scope.theLabel);
                    
                    
                   
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

                    // if (barName[0] == undefined){
                    //     xlabels.push(wrapAttributeName)
                    // }
                    // if (barName[0] != "" || barName[0] != undefined){ 
                    //     xlabels.push(barName[0])
                    // }
                    // else{
                    //     xlabels.push(wrapAttributeName)
                    // }

                    // if (barName[2] == undefined){
                    //     xlabels.push(wrapAttributeName)
                    // }
                    // if (barName[2] != "" || barName[2] != undefined){ 
                    //     xlabels.push(barName[2])
                    // }
                    // else{
                    //     xlabels.push(wrapAttributeName)
                    // }

                    // if (barName[4] == undefined){
                    //     xlabels.push(wrapAttributeName)
                    // }
                    // if (barName[4] != "" || barName[4] != undefined){ 
                    //     xlabels.push(barName[4])
                    // }
                    // else{
                    //     xlabels.push(wrapAttributeName)
                    // }

                    // if (barName[6] == undefined){
                    //     xlabels.push(wrapAttributeName)
                    // }
                    // if (barName[6] != "" || barName[6] != undefined){ 
                    //     xlabels.push(barName[6])
                    // }
                    // else{
                    //     xlabels.push(wrapAttributeName)
                    // }

                  
                    // If no input -> we will set labels
                    if (barName[0] == undefined || barName[0] == "") {                                                           // determine xlabels base on number of tags
                        xlabels.push(wrapAttributeName)                 
                        console.log("xlabelsAfterPush = ", xlabels);
                    }
                    else if (barName[2] == undefined || barName[2] == "") { 
                        xlabels.push(barName[2])        
                    }
                    else if (barName[4] == undefined || barName[4] == "") { 
                        xlabels.push(barName[4])        
                    }


                    if (barName[0] == "" || barName[0] == undefined){ 
                        xlabels[0] = "block1";
                                     
                    }
                    else{
                        xlabels[0] = scope.config.InputBarName1;       
                    }

                    if (barName[2] == "" || barName[2] == undefined){ 
                        xlabels[1] = "block2";                 
                    }
                    else{                      
                        xlabels[1] = scope.config.InputBarName3;     
                    }

                    if (barName[4] == "" || barName[4] == undefined){ 
                        xlabels[2] = "block3";          
                    }
                    else{                      
                        xlabels[2] = scope.config.InputBarName5;    
                    }

                    if (barName[6] == "" || barName[6] == undefined){ 
                        xlabels[3] = "block4";                 
                    }
                    else{
                        xlabels[3] = scope.config.InputBarName7;   
                    }


                    // else{
                    //     xlabels[entry] = wrapAttributeName;   
                    // }
                    // else if (barName[2] != "" || barName[2] != undefined){ 
                    //     xlabels.push(barName[0])
                    //     xlabels.push(barName[2])
                    // }
                    // else{
                    //     xlabels.push("Yow")      
                    // }
                    // else if (barName[2] != "" || barName[2] != undefined){ 
                    //     xlabels.push(barName[2])
                    // }
                    // else if (barName[4] != "" || barName[4] != undefined){ 
                    //     xlabels.push(barName[4])
                    // }
                  
                    // else if (barName[2] == undefined) {                                                           // determine xlabels base on number of tags
                    //     xlabels.push(wrapAttributeName)                 
                    //     console.log("xlabelsAfterPush = ", xlabels);
                        
                      
                    // }

                   
                  

                //    if (barName[0] != "" || barName[0] != undefined){ 
                //         xlabels.push(barName[0])
                //         console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx = ", xlabels);
                //     }
                    // else if (barName[2] != "" || barName[2] != undefined){ 
                    //     xlabels.push(barName[2])
                    //     console.log(xlabels);
                    // }

                    console.log("inputted at "  + " = " + barName[0]);

                   
                  
                    


                    // if (barName[2] == undefined) {
                    //     xlabels.push(wrapAttributeName)                   
                    //     console.log("xlabelsAfterPush3 = ", xlabels);
                       
                    // }
                    // else if (barName[4] == undefined) {
                    //     xlabels.push(wrapAttributeName)              
                    //     console.log("xlabelsAfterPush5 = ", xlabels);
                       
                    // }
                    // else if (barName[6] == undefined) {
                    //     xlabels.push(wrapAttributeName)           
                    //     console.log("xlabelsAfterPush7 = ", xlabels);
                    // }



                   
                    if ((entry == 0) || (entry == 2) || (entry == 4) || (entry == 6)){                 // determine where the value will plot; either actual or target
                        actual.push(data.Data[entry].Values[len-1].Value);
                        console.log("actualAfterPush = ", actual);
                    }
                    if ((entry == 1) || (entry == 3) || (entry == 5) || (entry == 7)){
                        target.push(data.Data[entry].Values[len-1].Value);
                        console.log("targetAfterPush = ", target);
                    }                                     
            }

           

            var AllActual = {
                x: xlabels,               
                y: actual,
                hovertemplate: '%{y} %',
                name: 'Actual',
                type: 'bar',               
                marker: {
                    color: actualColor
                  }
                };
          
            var AllTarget = {
                x: xlabels,           
                y: target,
                hovertemplate: '%{y} %',
                name: 'Target',
                type: 'bar',
                marker: {
                    color: targetColor
                  }
                };
          
            var data = [AllActual, AllTarget];
              
              var layout = {
                barmode: 'group',
              };
  
            Plotly.newPlot('DoubleBar', data, layout);

            }

         }
    PV.symbolCatalog.register(definition);

}) (window.PIVisualization);