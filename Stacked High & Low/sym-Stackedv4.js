(function (CS) {
    function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'Stackedv4',
        iconUrl: '/Scripts/app/editor/symbols/ext/Icons/Stackedv4.png',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: 'ModePlotValues',
                Height: 350,
                Width: 700,
                SelectionInterval: "",
                SelectionOffSet: "",
                SelectionHighLimit: "",
                SelectionLowLimit: "",
                SelectionLabel1: "",
                SelectionLabel2: ""
            };
        },
        visObjectType: symbolVis,
        configOptions: function(){
            return [
                {
                title: 'Configuration',
                mode: 'formatTitle'
            }
            ];
        },
        // configTitle: 'Change bar chart title'
    };
    

    

    symbolVis.prototype.init = function (scope) {

        this.onDataUpdate = dataUpdate;
        var script_tag = document.createElement('script');  
        script_tag.setAttribute("type", "text/javascript");  
        script_tag.setAttribute("src", "libraries/plotly-2.12.1.min.js");  
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);

        class trace{
          constructor(x, y, name, type, marker, font) {
              this.x = x
              this.y = y
              this.name = name
              this.type = type
              this.marker = marker
              this.font = font
          } 
        }

        function getDateRangesHourly(startTime, endTime, selectedOffsetMinute) {
          var dateRanges = []
          //console.log("DATERANGES", dateRanges);
          
          startTime.setMinutes(selectedOffsetMinute,0,0,0)
          dateRanges.push(startTime)
         // console.log("DATERANGES2", dateRanges);
          
          var tom = new Date(startTime)

          while (tom <= endTime) {
            var tomPush = new Date(tom)
            tomPush.setMinutes(selectedOffsetMinute,0,0,0)
            tomPush.setHours(tomPush.getHours() +1)
           // var test = tomPush.getHours().toString() + 'H'
            dateRanges.push(tomPush)
            console.log("tompush2", tomPush);
           
            tom = tomPush
            //console.log("PUSHED")
          }

          /*var borderDate = new Date(endTime)
          borderDate.setDate(borderDate.getDate() + 1)
          dateRanges.push(borderDate)*/
          /*console.log(dateRanges)*/
          console.log("dateRanges")
          console.log(dateRanges)
          return dateRanges
          
        }
        

        function whichTraceHourly(val, selectedHighCategory, selectedLowCategory) {
          val = parseFloat(val)
          if (val < selectedLowCategory) {
            console.log("trace1")
            return 0          
          } 
          else if (val > selectedHighCategory){
            console.log("trace2")
            return 1
          }
          
          //return 2
          else {
            console.log("inBetween")
            //return 1 
            return 2
          }
        }

        function whichIndexHourly(rowTime, x_ranges, selectedOffsetMinute) {
          rowTime = new Date(rowTime)
         
          rowTime.setMinutes(selectedOffsetMinute,0,0,0)
          rowTime.setHours(rowTime.getHours() +1)
         
          console.log("chwnqt")

          for (var i = x_ranges.length - 1; i >= 0; i--) {
            if (rowTime >= x_ranges[i]) {
                return i
            }
          }
        }

        function mapperHourly(magSet, x_ranges, t1y, selectedOffsetMinute, selectedHighCategory, selectedLowCategory, selectedLabel1, selectedLabel2) {
          console.log("mapping start", x_ranges)
          var non_zero = []
          var finTraces = []
          var selectedHighCategoryString = '>' + selectedHighCategory + ' (High)'
          var selectedLowCategoryString = '<' + selectedLowCategory + ' (Low)'
          var names = [selectedLabel2, selectedLabel1, '']
          var markers = [{color:'rgb(142,142,142)'},{color:'rgb(44,105,47)'}, {color:'rgb(255,255,255)'}]
          var y_traces = [new Array(x_ranges.length).fill(0), new Array(x_ranges.length).fill(0), new Array(x_ranges.length).fill(0)]
          for (let j = 0; j < magSet.length; j++) {
            let pre_trace = whichTraceHourly(magSet[j]['Value'], selectedHighCategory, selectedLowCategory)
            let pre_index = whichIndexHourly(magSet[j]['Time'], x_ranges, selectedOffsetMinute)
            console.log("charans")
            console.log(pre_trace, pre_index)
            //t1y[pre_index]+=1
            non_zero.push([pre_trace, pre_index])
            pre_trace = 0
            pre_index = 0
            
          }
          console.log(non_zero)
          console.log(y_traces)
          console.log("checkpoint");
          console.log(non_zero.length);
          for (let k = 0; k < non_zero.length; k++){
            console.log("k " + k); 
            console.log(non_zero[k][0], non_zero[k][1]);
            if (non_zero[k][0]==2){
              console.log(" 2 was returned");
            }
            else{
              y_traces[non_zero[k][0]][non_zero[k][1]]+=1
            }
          }
          for (let m = 0; m < y_traces.length; m++) {
            finTraces.push(new trace(x_ranges, y_traces[m], names[m], 'bar', markers[m], {size:50}))
          }
          console.log("ito na bes", finTraces)
          console.log("X_RANGES");
          console.log(x_ranges)
          console.log(x_ranges.length)
          console.log(y_traces[0].length)
          return finTraces
        }    

        function getDateRangesDaily(startTime, endTime) {
          var dateRanges = []
          dateRanges.push(startTime)

          var tom = new Date(startTime)

          while (tom <= endTime) {
            var tomPush = new Date(tom)
            tomPush.setHours(0,0,0,0)
            tomPush.setDate(tom.getDate() + 1)
            dateRanges.push(tomPush)
            tom = tomPush
            console.log("PUSHED")
            console.log("date", dateRanges)
          }

          /*var borderDate = new Date(endTime)
          borderDate.setDate(borderDate.getDate() + 1)
          dateRanges.push(borderDate)*/
          /*console.log(dateRanges)*/
          return dateRanges
                
        }
        

        function whichTraceDaily(val, selectedHighCategory, selectedLowCategory) {
          val = parseFloat(val)
          if (val < selectedLowCategory) {
            console.log("trace1")
            return 0          
          } 
          else if (val > selectedHighCategory){
            console.log("trace2")
            return 1
          }
          
          //return 2
          else {
            console.log("inBetween")
            //return 1 
            return 2
          }
        }

        function whichIndexDaily(rowTime, x_ranges) {
          rowTime = new Date(rowTime)
          console.log("chwnqt")

          for (var i = x_ranges.length - 1; i >= 0; i--) {
            if (rowTime >= x_ranges[i]) {
                return i
            }
          }
        }

        function mapperDaily(magSet, x_ranges, t1y, selectedHighCategory, selectedLowCategory, selectedLabel1, selectedLabel2) {
          console.log("mapping start", x_ranges)
          var non_zero = []
          var finTraces = []
          var selectedHighCategoryString = '>' + selectedHighCategory + ' (High)'
          var selectedLowCategoryString = '<' + selectedLowCategory + ' (Low)'
          var names = [selectedLabel2, selectedLabel1, '']
          var markers = [{color:'rgb(142,142,142)'},{color:'rgb(44,105,47)'}, {color:'rgb(255,255,255)'}]
          var y_traces = [new Array(x_ranges.length).fill(0), new Array(x_ranges.length).fill(0), new Array(x_ranges.length).fill(0)]
          for (let j = 0; j < magSet.length; j++) {
            let pre_trace = whichTraceDaily(magSet[j]['Value'], selectedHighCategory, selectedLowCategory)
            let pre_index = whichIndexDaily(magSet[j]['Time'], x_ranges)
            console.log("charans")
            console.log(pre_trace, pre_index)
            //t1y[pre_index]+=1
            non_zero.push([pre_trace, pre_index])
            pre_trace = 0
            pre_index = 0
            
          }
          console.log(non_zero)
          console.log(y_traces)
          for (let k = 0; k < non_zero.length; k++){
            if (non_zero[k][0]==2){
              console.log(" 2 was returned");
            }
            else{
              y_traces[non_zero[k][0]][non_zero[k][1]]+=1
            }
          }
          for (let m = 0; m < y_traces.length; m++) {
            finTraces.push(new trace(x_ranges, y_traces[m], names[m], 'bar', markers[m], {size:50}))
          }
          console.log("ito na bes", finTraces)
          console.log(x_ranges)
          console.log(x_ranges.length)
          console.log(y_traces[0].length)
          return finTraces
        }    

        function getDateRangesMonthly(startTime, endTime) {
          var dateRanges = []
          console.log("DATERANGES", dateRanges);
          startTime.setDate(1)
          dateRanges.push(startTime)
  
          var tom = new Date(startTime)
  
          while (tom <= endTime) {
            var tomPush = new Date(tom)
            tomPush.setDate(1)
            tomPush.setMonth(tomPush.getMonth() + 1)
            dateRanges.push(tomPush)
            tom = tomPush
            console.log("PUSHED")
            console.log("date", dateRanges)
          }
  
          /*var borderDate = new Date(endTime)
          borderDate.setDate(borderDate.getDate() + 1)
          dateRanges.push(borderDate)*/
          /*console.log(dateRanges)*/
          return dateRanges
                
        }
        
  
        function whichTraceMonthly(val, selectedHighCategory, selectedLowCategory) {
          val = parseFloat(val)
          if (val < selectedLowCategory) {
            console.log("trace1")
            return 0          
          } 
          else if (val > selectedHighCategory){
            console.log("trace2")
            return 1
          }
          
          //return 2
          else {
            console.log("inBetween")
            //return 1 
            return 2
          }
        }
  
        function whichIndexMonthly(rowTime, x_ranges) {
          rowTime = new Date(rowTime)
          rowTime.setDate(1)
          console.log("chwnqt")
  
          for (var i = x_ranges.length - 1; i >= 0; i--) {
            if (rowTime >= x_ranges[i]) {
                return i
            }
          }
        }
  
        function mapperMonthly(magSet, x_ranges, t1y, selectedHighCategory, selectedLowCategory, selectedLabel1, selectedLabel2) {
          console.log("mapping start", x_ranges)
          var non_zero = []
          var finTraces = []
          var selectedHighCategoryString = '>' + selectedHighCategory + ' (High)'
          var selectedLowCategoryString = '<' + selectedLowCategory + ' (Low)'
          var names = [selectedLabel2, selectedLabel1, '']
          var markers = [{color:'rgb(142,142,142)'},{color:'rgb(44,105,47)'}, {color:'rgb(255,255,255)'}]
          var y_traces = [new Array(x_ranges.length).fill(0), new Array(x_ranges.length).fill(0), new Array(x_ranges.length).fill(0)]
          for (let j = 0; j < magSet.length; j++) {
            let pre_trace = whichTraceMonthly(magSet[j]['Value'], selectedHighCategory, selectedLowCategory)
            let pre_index = whichIndexMonthly(magSet[j]['Time'], x_ranges)
            console.log("charans")
            console.log(pre_trace, pre_index)
            //t1y[pre_index]+=1
            non_zero.push([pre_trace, pre_index])
            pre_trace = 0
            pre_index = 0
            
          }
          console.log(non_zero)
          console.log(y_traces)
          for (let k = 0; k < non_zero.length; k++){
            if (non_zero[k][0]==2){
              console.log(" 2 was returned");
            }
            else{
              y_traces[non_zero[k][0]][non_zero[k][1]]+=1
            }
          }
          for (let m = 0; m < y_traces.length; m++) {
            finTraces.push(new trace(x_ranges, y_traces[m], names[m], 'bar', markers[m], {size:50}))
          }
          console.log("ito na bes", finTraces)
          console.log(x_ranges)
          console.log(x_ranges.length)
          console.log(y_traces[0].length)
          return finTraces
        }    


        function dataUpdate(data) {
          console.log("BEGIN")
          var selectedRadio = scope.config.SelectionInterval;
          var selectedOffsetMinute = scope.config.SelectionOffSet;
          var selectedHighCategory = scope.config.SelectionHighLimit;
          var selectedLowCategory = scope.config.SelectionLowLimit;
          var selectedLabel1 = scope.config.SelectionLabel1;
          var selectedLabel2 = scope.config.SelectionLabel2;

          // console.log("selectedRadio: " + selectedRadio);
          console.log("selectedRadioChecker: " + scope.config.SelectionInterval);
          console.log(typeof selectedRadio);

          console.log("selectedOffsetMinute: " + selectedOffsetMinute);
          console.log("selectedOptionChecker: " + scope.config.SelectionOffSet);
          selectedOffsetMinute = parseInt(selectedOffsetMinute)
          console.log(typeof selectedOffsetMinute);

          console.log("selectedHighCategory: " + selectedHighCategory);
          console.log("selectedHighCategoryChecker: " + scope.config.SelectionHighLimit);
          selectedHighCategory = parseFloat(selectedHighCategory)
          console.log(selectedHighCategory);
          console.log(typeof selectedHighCategory);


          console.log("selectedLowCategory: " + selectedLowCategory);
          console.log("selectedLowCategoryChecker: " + scope.config.SelectionLowLimit);
          selectedLowCategory = parseFloat(selectedLowCategory)
          console.log(selectedLowCategory);
          console.log(typeof selectedLowCategory);

          console.log("selectedLabel1: " + selectedLabel1);
          console.log("selectedLabel1Checker: " + scope.config.SelectionLabel1);
          console.log(typeof selectedLabel1);

          if (selectedLabel1.length == 0){
            selectedLabel1 = 'Label 1';
          }

          console.log("selectedLabel2: " + selectedLabel2);
          console.log("selectedLabel2Checker: " + scope.config.SelectionLabel2);
          console.log(typeof selectedLabel2);

          if (selectedLabel2.length == 0){
            selectedLabel2 = 'Label 2';
          }

          scope.names = [1, 2, 3];

          if (selectedRadio == 'Hourly'){
            var endTimeString = data.Data[0].EndTime
            var startTimeString = data.Data[0].StartTime

            var endTime = new Date(endTimeString)
            var startTime = new Date(startTimeString)
            //startTime.setHours(0,0,0,0)

            console.log("startTime", startTime)
            console.log("endTime", endTime)

            var magSet = data.Data[0].Values
            console.log("MAGNITUDE SET")
            console.log(magSet)

            var x_ranges = getDateRangesHourly(startTime , endTime, selectedOffsetMinute)
            console.log("x_ranges + ", x_ranges)
            var y_ranges = new Array(x_ranges.length)
            y_ranges.fill(0)
            console.log("y_ranges")
            console.log(y_ranges)
            var selectedHighCategoryLegend = '>' + selectedHighCategory;
            var selectedLowCategoryLegend = '<' + selectedLowCategory;
            var trace1 = new trace(x_ranges, y_ranges, selectedLowCategoryLegend, 'bar')
            var trace2 = new trace(x_ranges, y_ranges, selectedHighCategoryLegend, 'bar')
            var trace3 = new trace(x_ranges, y_ranges, 'dummy', 'bar')
            
            console.log(trace1, trace2, trace3)
            console.log(magSet)
            console.log('end data');
            var t1y = y_ranges
            var t2y = y_ranges
          
            var whichTraceDict={
              "trace1": t1y,
              "trace2": t2y,
            
            }
            
            var toPlot = mapperHourly(magSet, getDateRangesHourly(startTime, endTime, selectedOffsetMinute), t1y, selectedOffsetMinute, selectedHighCategory, selectedLowCategory, selectedLabel1, selectedLabel2)
            console.log("toplot")
            console.log(toPlot)
            console.log(t1y,t2y)
            console.log("TRACES");
            console.log(trace1, trace2)
            console.log(trace1.x[0]);

            startTime.setHours(startTime.getHours() +1)
            console.log("IM HEREEEEE", startTime);

            var layout = {barmode: 'stack', font:{size:20}, hoverlabel:{font:{size:26}}, xaxis:{autotick:false, automargin:true, /*tickformat: '%I %p'*/ tickformat: '%H' , tick0: startTime, dtick: 1*60*60*1000, ticksuffix: 'H' }, yaxis:{rangemode:'nonnegative'}, height:350 };

            //console.log("LAYOUT", layout);

            var selectedRadio = scope.config.SelectionInterval;
            console.log("selectedRadio: " + selectedRadio);
            
            Plotly.newPlot('stack-bar-graphv2', toPlot, layout);
          }
          else if (selectedRadio == 'Daily'){
            // mapper -> mapperDaily
            // getDateRanges -> getDateRangesDaily
            //
            var endTimeString = data.Data[0].EndTime
            var startTimeString = data.Data[0].StartTime

            var endTime = new Date(endTimeString.split(" ")[0])
            var startTime = new Date(startTimeString.split(" ")[0])

            var magSet = data.Data[0].Values

            var x_ranges = getDateRangesDaily(startTime, endTime)
            var y_ranges = new Array(x_ranges.length)
            y_ranges.fill(0)
            var selectedHighCategoryLegend = '>' + selectedHighCategory;
            var selectedLowCategoryLegend = '<' + selectedLowCategory;
            var trace1 = new trace(x_ranges, y_ranges, selectedLowCategory, 'bar')
            var trace2 = new trace(x_ranges, y_ranges, selectedHighCategoryLegend, 'bar')
            var trace3 = new trace(x_ranges, y_ranges, 'dummy', 'bar')
            
            console.log(trace1, trace2, trace3)
            console.log(magSet)
            console.log('end data');
            /*main*/
            /*console.log("start loop")*/
            var t1y = y_ranges
            var t2y = y_ranges
            var t3y = y_ranges
          
            var whichTraceDict={
              "trace1": t1y,
              "trace2": t2y,
              "trace3": t3y,           
            }
            var toPlot = mapperDaily(magSet, getDateRangesDaily(startTime, endTime), t1y, selectedHighCategory, selectedLowCategory, selectedLabel1, selectedLabel2)
            console.log(t1y,t2y,t3y)
            console.log(trace1, trace2, trace3)
            /*console.log("end loop")
            console.log("charan")
            console.log(dataSet)*/

            //var finDataSet = [trace1, trace2, trace3, trace4]

            var layout = {barmode: 'stack', font:{size:20}, hoverlabel:{font:{size:26}}, xaxis:{autotick:false, automargin:true}, yaxis:{rangemode:'nonnegative'}, height:350 };

            Plotly.newPlot('stack-bar-graphv2', toPlot, layout);
          }
          else if (selectedRadio == 'Monthly'){
            var endTimeString = data.Data[0].EndTime
            var startTimeString = data.Data[0].StartTime

            var endTime = new Date(endTimeString.split(" ")[0])
            var startTime = new Date(startTimeString.split(" ")[0])

            var magSet = data.Data[0].Values
            
            var x_ranges = getDateRangesMonthly(startTime, endTime)
            console.log("x_ranges " + x_ranges);
            var y_ranges = new Array(x_ranges.length)
            y_ranges.fill(0)
            var selectedHighCategoryLegend = '>' + selectedHighCategory;
            var selectedLowCategoryLegend = '<' + selectedLowCategory;
            var trace1 = new trace(x_ranges, y_ranges, selectedLowCategoryLegend, 'bar')
            var trace2 = new trace(x_ranges, y_ranges, selectedHighCategoryLegend, 'bar')
            var trace3 = new trace(x_ranges, y_ranges, 'dummy', 'bar')
            
            console.log(trace1, trace2, trace3)
            console.log(magSet)
            console.log('end data');
            /*main*/
            /*console.log("start loop")*/
            var t1y = y_ranges
            var t2y = y_ranges
            var t3y = y_ranges
          
            var whichTraceDict={
              "trace1": t1y,
              "trace2": t2y,
              "trace3": t3y,           
            }
            var toPlot = mapperMonthly(magSet, getDateRangesMonthly(startTime, endTime), t1y, selectedHighCategory, selectedLowCategory, selectedLabel1, selectedLabel2)
            console.log(t1y,t2y,t3y)
            console.log(trace1, trace2, trace3)
            /*console.log("end loop")
            console.log("charan")
            console.log(dataSet)*/

            //var finDataSet = [trace1, trace2, trace3, trace4]

            var layout = {barmode: 'stack', font:{size:20}, hoverlabel:{font:{size:26}}, xaxis:{autotick:false, automargin:true, tickformat: '%b', dtick: 30*24*60*60*1000}, yaxis:{rangemode:'nonnegative'}, height:350 };

            Plotly.newPlot('stack-bar-graphv2', toPlot, layout);
          }
          else{
            //default interval functions dito
            console.log("NO radio button selected.");
          }


        }
    }
    CS.symbolCatalog.register(definition);
})(window.PIVisualization);