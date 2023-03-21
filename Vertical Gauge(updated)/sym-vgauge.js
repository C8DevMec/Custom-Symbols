(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'vgauge',  
        displayName : 'C8 Vertical Gauge',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,  
        iconUrl: 'Images/chrome.gauge_vertical.svg', 
        configTitle: 'Format Symbol',
        getDefaultConfig: function () {  
            return {  
                DataShape: 'Value',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 400,  
                Width: 230,
                Interval : 5000,
                IsPercent : false,
                Axis : {
                    Min : 0,
                    Max : 100
                },
                LowRange:{
                    Min : 0,
                    Max : 30,
                    Fill : '#02e032'
                },
                NormalRange: {
                    Min : 30,
                    Max : 60,
                    Fill : '#eff700'
                },
                HighRange : {
                    Min : 60,
                    Max : 100,
                    Fill : '#f70000'
                },
                BackgroundFill : '#fff',
                OutlineColor : '#000',
                MarkerColor : 'blue',
                ValueColor : '#000',
                ValueUnit : '',
                ShowUOM : true,
                ShowValue : true
            };  
        },
        visObjectType: symbolVis  
    };  


    symbolVis.prototype.init = function init(scope, elem) { 
        this.onDataUpdate = dataUpdate;  
        this.onConfigChange = configChanged;
        this.onResize = resize;  
        scope.containerId = 'vertical-gauge-' + Math.ceil(Math.random() * 10000000)

        scope.chart = null;
        scope.chart = null;
        scope.scale = null;
        scope.scaleBar = null;
        scope.axis = null;
        scope.chartLoaded = false;
        scope.markerLabel = null;

        scope.runtimeData.showUOMCheckbox = scope.config.ShowValue ? true : false;
        scope.runtimeData.isPercent = function (value) {
            if(arguments.length === 0) {
                return scope.config.IsPercent;
            }
            else {
                return scope.config.IsPercent = value;
            }
        }

        scope.runtimeData.ShowValue = function (value) {
            if(arguments.length === 0) {
                return scope.config.ShowValue;
            }
            else {
                scope.runtimeData.showUOMCheckbox = value;
                return scope.config.ShowValue = value;
            }
        }
        scope.runtimeData.ShowUOM = function (value) {
            if(arguments.length === 0) {
                return scope.config.ShowUOM;
            }
            else {
                return scope.config.ShowUOM = value;
            }
        }

        scope.runtimeData.min = function (value) {
            if(arguments.length === 0) {
                return scope.config.Axis.Min;
            }
            else {
                return scope.config.Axis.Min = value;
            }
        }

        scope.runtimeData.max = function (value) {
            if(arguments.length === 0) {
                return scope.config.Axis.Max;
            }
            else {
                return scope.config.Axis.Max = value;
            }
        }

        scope.runtimeData.backgroundFill = function (value) {
            if(arguments.length === 0) {
                return scope.config.BackgroundFill;
            }
            else {
                return scope.config.BackgroundFill = value;
            }
        }

        scope.runtimeData.outlineColor = function (value) {
            if(arguments.length === 0) {
                return scope.config.OutlineColor;
            }
            else {
                return scope.config.OutlineColor = value;
            }
        }

        scope.runtimeData.markerColor = function (value) {
            if(arguments.length === 0) {
                return scope.config.MarkerColor;
            }
            else {
                return scope.config.MarkerColor = value;
            }
        }

        scope.runtimeData.lowFill = function (value) {
            if(arguments.length === 0) {
                return scope.config.LowRange.Fill;
            }
            else {
                return scope.config.LowRange.Fill = value;
            }
        }

        scope.runtimeData.normalFill = function (value) {
            if(arguments.length === 0) {
                return scope.config.NormalRange.Fill;
            }
            else {
                return scope.config.NormalRange.Fill = value;
            }
        }

        scope.runtimeData.highFill = function (value) {
            if(arguments.length === 0) {
                return scope.config.HighRange.Fill;
            }
            else {
                return scope.config.HighRange.Fill = value;
            }
        }

        scope.runtimeData.LowRangeMin = function (value) {
            if(arguments.length === 0) {
                return scope.config.LowRange.Min;
            }
            else {
                return scope.config.LowRange.Min = value;
            }
        }

        scope.runtimeData.LowRangeMax = function (value) {
            if(arguments.length === 0) {
                return scope.config.LowRange.Max;
            }
            else {
                return scope.config.LowRange.Max = value;
            }
        }

        scope.runtimeData.NormalRangeMin = function (value) {
            if(arguments.length === 0) {
                return scope.config.NormalRange.Min;
            }
            else {
                return scope.config.NormalRange.Min = value;
            }
        }

        scope.runtimeData.NormalRangeMax = function (value) {
            if(arguments.length === 0) {
                return scope.config.NormalRange.Max;
            }
            else {
                return scope.config.NormalRange.Max = value;
            }
        }

        scope.runtimeData.HighRangeMin = function (value) {
            if(arguments.length === 0) {
                return scope.config.HighRange.Min;
            }
            else {
                return scope.config.HighRange.Min = value;
            }
        }

        scope.runtimeData.HighRangeMax = function (value) {
            if(arguments.length === 0) {
                return scope.config.HighRange.Max;
            }
            else {
                return scope.config.HighRange.Max = value;
            }
        }

        function configChanged(config, oldConfig) {
            if(config != oldConfig) {
                changeConfig();
            }
        };  
    
    
        function resize(width, height) {
            //scope.chart.setSize(width, height, true);

        }

        function dataUpdate(output) {
            if(!output) {
                return;
            }
            if(output.Units != undefined) {
                if(scope.config.ValueUnit != output.Units) {
                    scope.config.ValueUnit = output.Units;
                }
            }
            
            if(scope.chartLoaded) {
              var pointVal = parseFloat(output.Value.replace(',', ''));
              scope.chart.data([pointVal]);
              scope.markerLabel.format(pointVal + (scope.config.ShowUOM ? scope.config.ValueUnit : ''));
            }
            else {

                anychart.onDocumentReady(function () {
                    loadChart(output);    
                });
                scope.chartLoaded = true;
            }
        }

        function loadChart(data) {

             // create data
             var pointVal = parseFloat(data.Value.replace(',', ''));
             var data = [pointVal];

             // set the gauge type
             var gauge = anychart.gauges.linear();

             // set the data for the gauge
             gauge.data(data);

             // set the layout
             gauge.layout('vertical');

             // create a color scale
             var scaleBarColorScale = anychart.scales.ordinalColor().ranges(
                [
                  {
                     from: scope.config.LowRange.Min,
                     to: scope.config.LowRange.Max,
                     color: [scope.config.LowRange.Fill, scope.config.LowRange.Fill]
                  },
                  {
                     from: scope.config.NormalRange.Min,
                     to: scope.config.NormalRange.Max,
                     color: [scope.config.NormalRange.Fill, scope.config.NormalRange.Fill]
                  },
                  {
                     from: scope.config.HighRange.Min,
                     to: scope.config.HighRange.Max,
                     color: [scope.config.HighRange.Fill, scope.config.HighRange.Fill]
                  },
                ]
             );

             // create a Scale Bar
             var scaleBar = gauge.scaleBar(0);

             // set the height and offset of the Scale Bar (both as percentages of the gauge height)
             scaleBar.width('30%');
             scaleBar.offset('31.5%');

             // use the color scale (defined earlier) as the color scale of the Scale Bar
             scaleBar.colorScale(scaleBarColorScale);

             var datasource = scope.symbol.DataSources[0].split('|');
             var label = datasource[datasource.length - 1];
             // add a marker pointer
             var marker = gauge.marker(0);
             // set the offset of the pointer as a percentage of the gauge width
             marker.offset('61%');
             // set the marker type
             marker.type('triangle-left');
             marker.width(15);
             marker.name(label);
             marker.color(scope.config.MarkerColor);
            marker.stroke(scope.config.MarkerColor);

             // set the zIndex of the marker
             marker.zIndex(10);

            var labels = marker.labels();
            labels.enabled(scope.config.ShowValue);
            labels.fontColor(scope.config.MarkerColor);
            labels.fontWeight(400);
            labels.width(140);
            labels.hAlign("left");
            labels.vAlign("center");
            labels.offsetX("100");
            labels.offsetY(8);
            labels.position("outside");
            labels.format(pointVal + (scope.config.ShowUOM ? scope.config.ValueUnit : ''));
            

             // configure the scale

             var scale = gauge.scale();
             scale.minimum(scope.config.Axis.Min);
             scale.maximum(scope.config.Axis.Max);
             scale.ticks().interval(Math.ceil(scope.config.Axis.Max/10));

             // configure the axis
             var axis = gauge.axis();
             axis.minorTicks(true)
             axis.minorTicks().stroke('#cecece');
             axis.width('1%');
             axis.offset('29.5%');
             axis.orientation('left');


             // format axis labels
             axis.labels().format('{%value}');
             axis.labels().fontSize(9);

             axis.stroke(scope.config.OutlineColor);
             axis.ticks().stroke(scope.config.OutlineColor);
             axis.minorTicks().stroke(scope.config.OutlineColor);

             // set paddings
             gauge.padding([20, 40]);

             // set the container id
             gauge.container(scope.containerId);
             gauge.background().fill(scope.config.BackgroundFill);

             // initiate drawing the gauge
             gauge.draw();


             scope.chart = gauge;
             scope.scale = scale;
             scope.scaleBar = scaleBar;
             scope.axis = axis;
             scope.marker = marker;
             scope.markerLabel = labels;
        }

        function changeConfig() {
          var scaleBarColorScale = anychart.scales.ordinalColor().ranges(
              [
                {
                   from: scope.config.LowRange.Min,
                   to: scope.config.LowRange.Max,
                   color: [scope.config.LowRange.Fill, scope.config.LowRange.Fill]
                },
                {
                   from: scope.config.NormalRange.Min,
                   to: scope.config.NormalRange.Max,
                   color: [scope.config.NormalRange.Fill, scope.config.NormalRange.Fill]
                },
                {
                   from: scope.config.HighRange.Min,
                   to: scope.config.HighRange.Max,
                   color: [scope.config.HighRange.Fill, scope.config.HighRange.Fill]
                },
              ]
            );

          var scaleBar = scope.chart.scaleBar(0);
          scaleBar.colorScale(scaleBarColorScale);

          scope.scaleBar = scaleBar;
          scope.axis.labels().format('{%value}' + (scope.config.IsPercent ? '%' : ''));
          scope.scale.minimum(scope.config.Axis.Min);
          scope.scale.maximum(scope.config.Axis.Max);

          scope.chart.background().fill(scope.config.BackgroundFill);

          scope.axis.stroke(scope.config.OutlineColor);
          scope.axis.ticks().stroke(scope.config.OutlineColor);
          scope.axis.minorTicks().stroke(scope.config.OutlineColor);
          scope.axis.labels().fontColor(scope.config.OutlineColor);


          scope.marker.color(scope.config.MarkerColor);
          scope.marker.stroke(scope.config.MarkerColor);

          scope.markerLabel.enabled(scope.config.ShowValue);
          scope.markerLabel.format('{%value}' + (scope.config.ShowUOM ? scope.config.ValueUnit : ''));
          scope.markerLabel.fontColor(scope.config.MarkerColor);
        }
    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  