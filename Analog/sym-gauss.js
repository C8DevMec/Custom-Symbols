(function (PV) {  
    
    function symbolVis() { }  
    PV.deriveVisualizationFromBase(symbolVis);  

    var definition = {  
        typeName: 'gauss',  
        displayName : 'C8 Analog Value',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,  
        iconUrl: 'Images/analog.png', 
        configTitle: 'Format Symbol',
        getDefaultConfig: function () {  
            return {  
                DataShape: 'Value',  
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 400,  
                Width: 600,
                Interval : 5000,
                ShowUnit : false,
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
                MarkerColor : '#000',
                ValueSize : 30,
                ValueColor : '#000',
                LabelSize : 10,
                LabelColor : '#000',
                Units : '',
                Background : '#fff'

            };  
        },
        visObjectType: symbolVis  
    };  


    symbolVis.prototype.init = function init(scope, elem) { 
        this.onDataUpdate = dataUpdate;  
        this.onConfigChange = configChanged;
        this.onResize = resize;  
        scope.containerId = 'gauss-' + Math.ceil(Math.random() * 10000000)

        scope.chart = null;
        scope.axis = null;
        scope.axis2 = null;
        scope.lowRange = null;
        scope.normalRange = null;
        scope.highRange = null;
        scope.hand = null;
        scope.value = null;

        scope.chartLoaded = false;

        scope.runtimeData.Background = function (value) {
            if(arguments.length === 0) {
                return scope.config.Background;
            }
            else {
                return scope.config.Background = value;
            }
        }

        scope.runtimeData.ShowUnit = function (value) {
            if(arguments.length === 0) {
                return scope.config.ShowUnit;
            }
            else {
                return scope.config.ShowUnit = value;
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

        scope.runtimeData.LabelSize = function (value) {
            if(arguments.length === 0) {
                return scope.config.LabelSize;
            }
            else {
                return scope.config.LabelSize = value;
            }
        }

        scope.runtimeData.LabelColor = function (value) {
            if(arguments.length === 0) {
                return scope.config.LabelColor;
            }
            else {
                return scope.config.LabelColor = value;
            }
        }

        scope.runtimeData.ValueSize = function (value) {
            if(arguments.length === 0) {
                return scope.config.ValueSize;
            }
            else {
                return scope.config.ValueSize = value;
            }
        }

        scope.runtimeData.ValueColor = function (value) {
            if(arguments.length === 0) {
                return scope.config.ValueColor;
            }
            else {
                return scope.config.ValueColor = value;
            }
        }

        scope.runtimeData.MarkerColor = function (value) {
            if(arguments.length === 0) {
                return scope.config.MarkerColor;
            }
            else {
                return scope.config.MarkerColor = value;
            }
        } 

        function configChanged(config, oldConfig) {
            if(config != oldConfig) {

                scope.chart.background.fill = am4core.color(config.Background); 
                scope.lowRange.axisFill.fill = config.LowRange.Fill;
                scope.normalRange.axisFill.fill = config.NormalRange.Fill;
                scope.highRange.axisFill.fill = config.HighRange.Fill;


                scope.lowRange.value = scope.config.LowRange.Min;
                scope.lowRange.endValue = scope.config.LowRange.Max;

                scope.normalRange.value = scope.config.NormalRange.Min;
                scope.normalRange.endValue = scope.config.NormalRange.Max;

                scope.highRange.value = scope.config.HighRange.Min;
                scope.highRange.endValue = scope.config.HighRange.Max;

                scope.axis.min = parseFloat(config.Axis.Min);
                scope.axis.max = parseFloat(config.Axis.Max);

                scope.axis2.min = parseFloat(config.Axis.Min);
                scope.axis2.max = parseFloat(config.Axis.Max);

                scope.value.fontSize = parseFloat(config.ValueSize);
                scope.axis.fontSize = parseFloat(config.LabelSize);

                scope.axis.renderer.line.stroke = scope.config.LabelColor;
                scope.axis.renderer.ticks.template.stroke = scope.config.LabelColor;
                scope.axis.renderer.labels.template.fill = am4core.color(scope.config.LabelColor);
                scope.value.fill = scope.config.ValueColor;
                scope.hand.fill = scope.config.MarkerColor;
                scope.hand.stroke = scope.config.MarkerColor;


                if(config.ShowUnit != oldConfig.ShowUnit) {
                    scope.chartLoaded = false;
                    scope.$emit('refreshDataForAllSymbols');
                }

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
                scope.config.Unit = output.Units;
            }
            
            if(scope.chartLoaded) {

                // if(output.Value >= scope.config.LowRange.Min && output.Value <= scope.config.LowRange.Max) {
                //     scope.value.fill = scope.config.LowRange.Fill;
                // }

                // else if(output.Value >= scope.config.NormalRange.Min && output.Value <= scope.config.NormalRange.Max) {
                //     scope.value.fill = scope.config.NormalRange.Fill;
                // }

                // else if(output.Value >= scope.config.HighRange.Min && output.Value <= scope.config.HighRange.Max) {
                //     scope.value.fill = scope.config.HighRange.Fill;
                // }

                var animation = new am4core.Animation(scope.hand, {
                      property: "value",
                      to: parseFloat(output.Value)
                }, 1000, am4core.ease.cubicOut).start();
            }
            else {

                setTimeout(function () {
                    loadChart(output);    
                }, 2000)
            }
        }

        function loadChart(data) {
            am4core.ready(function() {
                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                // create chart
                scope.chart = am4core.create(scope.containerId, am4charts.GaugeChart);
                scope.chart.innerRadius = am4core.percent(82);


                scope.axis = scope.chart.xAxes.push(new am4charts.ValueAxis());
                scope.axis.min = scope.config.Axis.Min;
                scope.axis.max = scope.config.Axis.Max;
                scope.axis.strictMinMax = true;
                scope.axis.renderer.radius = am4core.percent(80);
                scope.axis.renderer.inside = true;
                scope.axis.renderer.line.strokeOpacity = 1;
                scope.axis.renderer.line.stroke = scope.config.LabelColor;
                scope.axis.renderer.ticks.template.disabled = false
                scope.axis.renderer.ticks.template.strokeOpacity = 1;
                scope.axis.renderer.ticks.template.stroke = scope.config.LabelColor;
                scope.axis.renderer.ticks.template.length = 10;
                scope.axis.renderer.grid.template.disabled = true;
                scope.axis.renderer.labels.template.radius = 40;
                scope.axis.renderer.labels.template.fill = am4core.color(scope.config.LabelColor);
                scope.axis.renderer.labels.template.adapter.add("text", function(text) {
                    return text;
                });
                scope.axis.fontSize = scope.config.LabelSize;


                /**
                * Axis for ranges
                */

                var colorSet = new am4core.ColorSet();

                scope.axis2 = scope.chart.xAxes.push(new am4charts.ValueAxis());
                scope.axis2.min = scope.config.Axis.Min;
                scope.axis2.max = scope.config.Axis.Max;
                scope.axis2.strictMinMax = true;
                scope.axis2.renderer.labels.template.disabled = true;
                scope.axis2.renderer.ticks.template.disabled = true;
                scope.axis2.renderer.grid.template.disabled = true;

                scope.lowRange = scope.axis2.axisRanges.create();
                scope.lowRange.value = scope.config.LowRange.Min;
                scope.lowRange.endValue = scope.config.LowRange.Max;
                scope.lowRange.axisFill.fillOpacity = 1;
                scope.lowRange.axisFill.fill = scope.config.LowRange.Fill;

                scope.normalRange = scope.axis2.axisRanges.create();
                scope.normalRange.value = scope.config.NormalRange.Min;
                scope.normalRange.endValue = scope.config.NormalRange.Max;
                scope.normalRange.axisFill.fillOpacity = 1;
                scope.normalRange.axisFill.fill = scope.config.NormalRange.Fill;

                scope.highRange = scope.axis2.axisRanges.create();
                scope.highRange.value = scope.config.HighRange.Min;
                scope.highRange.endValue = scope.config.HighRange.Max;
                scope.highRange.axisFill.fillOpacity = 1;
                scope.highRange.axisFill.fill = scope.config.HighRange.Fill;

                scope.value = scope.chart.radarContainer.createChild(am4core.Label);
                scope.value.isMeasured = false;
                scope.value.fontSize = scope.config.ValueSize;
                scope.value.x = am4core.percent(50);
                scope.value.y = am4core.percent(100);
                scope.value.horizontalCenter = "middle";
                scope.value.verticalCenter = "bottom";
                scope.value.text = parseFloat(data.Value.replace(',').replace(' '));
                scope.value.fill = scope.config.ValueColor;

                if(scope.config.ShowUnit) {
                    scope.value2 = scope.chart.radarContainer.createChild(am4core.Label);
                    scope.value2.isMeasured = false;
                    scope.value2.fontSize = 20;
                    scope.value2.x = am4core.percent(50);
                    scope.value2.y = am4core.percent(0);
                    scope.value2.horizontalCenter = "middle";
                    scope.value2.verticalCenter = "top";
                    scope.value2.text = scope.config.Unit;
                    scope.value2.fill = scope.config.ValueColor;
                }

                // if(data.Value >= scope.config.LowRange.Min && data.Value <= scope.config.LowRange.Max) {
                //     scope.value.fill = scope.config.LowRange.Fill;
                // }

                // else if(data.Value >= scope.config.NormalRange.Min && data.Value <= scope.config.NormalRange.Max) {
                //     scope.value.fill = scope.config.NormalRange.Fill;
                // }

                // else if(data.Value >= scope.config.HighRange.Min && data.Value <= scope.config.HighRange.Max) {
                //     scope.value.fill = scope.config.HighRange.Fill;
                // }

                /**
                * Hand
                */

                scope.hand = scope.chart.hands.push(new am4charts.ClockHand());
                scope.hand.axis = scope.axis2;
                scope.hand.innerRadius = am4core.percent(20);
                scope.hand.startWidth = 10;
                scope.hand.pin.disabled = true;
                scope.hand.value = parseFloat(data.Value.replace(',').replace(' '));
                scope.hand.fill = scope.config.MarkerColor;
                scope.hand.stroke = scope.config.MarkerColor;

                scope.hand.events.on("propertychanged", function(ev) {
                    scope.value.text = scope.axis2.positionToValue(scope.hand.currentPosition).toFixed(1);
                    scope.axis2.invalidate();
                });


                scope.chartLoaded = true;
            })
        }
    }
    
    PV.symbolCatalog.register(definition);  
})(window.PIVisualization);  