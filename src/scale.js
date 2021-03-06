cirrus.scale = {};

cirrus.scale.x = function(config){

    var keys = cirrus.utils.extractValues(config.visibleData, 'x');
    var allKeys = d3.merge(keys);

    var range = [config.outerPadding, config.chartWidth - config.outerPadding];
    var scaleX = null;
    if(config.scaleType === 'time'){
        scaleX = d3.time.scale().range(range);
        allKeys = allKeys.map(function(d, i){
            return new Date(d);
        });

        scaleX.domain(d3.extent(allKeys));
    }
    else if(config.scaleType === 'ordinal'){
        scaleX = d3.scale.linear().range(range);
        scaleX.domain([0, keys[0].length - 1]);
    }
    else{
        scaleX = d3.scale.linear().range(range);
        scaleX.domain(d3.extent(allKeys));
    }

    return scaleX;
};

cirrus.scale.y = function(config){

    var values = d3.merge(cirrus.utils.extractValues(config.visibleData, 'y'));

    return d3.scale.linear().range([0, config.chartHeight]).domain([0, d3.max(values)]);
};

cirrus.scale.color = function(config){

    var values = d3.merge(cirrus.utils.extractValues(config.visibleData, 'color'));

    return d3.scale.linear().range(['yellow', 'red']).domain([0, d3.max(values)]);
};