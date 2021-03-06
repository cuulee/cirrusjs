cirrus.interaction = {};

cirrus.interaction.hovering = function(config){

    var hoveringContainer = config.container.select('.hovering')
        .style({
            width: config.chartWidth + 'px',
            height: config.chartHeight + 'px',
            position: 'absolute',
            opacity: 0
        });

    if(!!hoveringContainer.on('mousemove')){
        return false;
    }

    //TODO how to display tooltips on a contour map?
    if(config.subtype === 'contour'){
        return false;
    }

    hoveringContainer
        .on('mousemove', function(){
            var mouse = d3.mouse(this);
            var x = config.shapeLayout[0].map(function(d, i){
                return d.x;
            });
            var y = config.shapeLayout[0].map(function(d, i){
                return d.y;
            });

            var mouseOffsetX = config.shapeLayout[0][0].width / 2;
            var idxUnderMouse = d3.bisect(x, mouse[0] - mouseOffsetX);
            idxUnderMouse = Math.min(idxUnderMouse, x.length - 1);

            var hoverData = {
                mouse: mouse,
                x: x,
                idx: idxUnderMouse
            };

            setHovering(hoverData);

            config.events.hover(hoverData);
        })
        .on('mouseenter', function(){
            hoveringContainer.style({opacity: 1});
        })
        .on('mouseout', function(){
            hoveringContainer.style({opacity: 0});
            config.events.hoverOut();
        });

    var hoverLine = cirrus.interaction.hoverLine(config);
    var tooltip = cirrus.interaction.tooltip(config);

    config.internalEvents.on('setHover', function(hoverData){
        setHovering(hoverData);
    });

    config.internalEvents.on('hideHover', function(){
        hoveringContainer.style({opacity: 0});
    });

    var setHovering = function(hoverData){
        var tooltipsData = config.shapeLayout.map(function(d, i){
            return d[hoverData.idx];
        });

        var y = tooltipsData.map(function(d){
            return d.y;
        });
        y.sort(function(a, b){
            return a - b;
        });

        var idxY = d3.bisectRight(y, hoverData.mouse[1]);
        idxY = Math.min(y.length - idxY, y.length - 1);

        if(!config.multipleTooltip){
            tooltipsData = [tooltipsData[idxY]];
        }

        var dataUnderMouse = config.shapeLayout[idxY][hoverData.idx];

        hoveringContainer.style({opacity: 1});
        hoverLine(dataUnderMouse);
        tooltip(tooltipsData);
    };
};

cirrus.interaction.tooltip = function(config){

    return function(tooltipsData){
        var hoveringContainer = config.container.select('.hovering');

        var tooltip = hoveringContainer.selectAll('.tooltip')
            .data(tooltipsData);
        tooltip.enter().append('div')
            .attr({'class': 'tooltip'})
            .style({
                position: 'absolute',
                'pointer-events': 'none',
                'z-index': 2
            });
        tooltip
            .html(function(d, i){
                return config.tooltipFormatter(d);
            })
            .style({
                left: function(d, i){
                    return d.x + 'px';
                },
                top: function(d, i){
                    return d.y + 'px';
                },
                'background-color': function(d, i){
                    return d.color;
                }
            });
        tooltip.exit().remove();
    }
};

cirrus.interaction.hoverLine = function(config){

    var hoverLine = config.container.select('.hovering')
        .append('div')
        .attr({'class': 'hover-line'})
        .style({
            position: 'absolute',
            width: '1px',
            height: config.chartHeight + 'px',
            left: config.margin.left + 'px',
            'pointer-events': 'none'
        });

    return function(dataUnderMouse){

        hoverLine.style({
            left: dataUnderMouse.x + 'px'
        });
    };
};