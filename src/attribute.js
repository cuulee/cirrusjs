dadavis.attribute = {
    bar: {},
    line: {},
    point: {},
    axis: {}
};

dadavis.attribute.bar.simple = function(config, cache){
    return cache.layout.map(function(d, i){
        return d.map(function(dB, iB){
            var gutterW = dB.paddedW / 100 * config.gutterPercent;
            return {
                x: dB.paddedX,
                y: dB.y,
                width: dB.paddedW - gutterW,
                height: dB.h
            };
        });
    });
};

dadavis.attribute.bar.percent = function(config, cache){
    return cache.layout.map(function(d, i){
        return d.map(function(dB, iB){
            var gutterW = dB.paddedW / 100 * config.gutterPercent;
            return {
                x: dB.paddedX,
                y: dB.stackedPercentY,
                width: dB.paddedW - gutterW,
                height: dB.stackedPercentH
            };
        });
    });
};

dadavis.attribute.bar.stacked = function(config, cache){
    return cache.layout.map(function(d, i){
        return d.map(function(dB, iB){
            var gutterW = dB.paddedW / 100 * config.gutterPercent;
            return {
                x: dB.paddedX,
                y: dB.stackedY,
                width: dB.paddedW - gutterW,
                height: dB.stackedH
            };
        });
    });
};

dadavis.attribute.point.stacked = function(config, cache){
    return {
        cx: function(d, i){
            if(cache.noPadding){
                return d.x;
            }
            else{
                return d.paddedX + d.paddedW / 2
            }
        },
        // cx: function(d, i){ return d.x + d.w / 2; },
        cy: function(d, i){
            return d.stackedY;
        }
    };
};

dadavis.attribute.line.simple = function(config, cache){
    return cache.layout.map(function(d, i){
        return d.map(function(dB, iB){
            return [dB.x, dB.y];
        });
    });
};

dadavis.attribute.line.stacked = function(config, cache){
    return cache.layout.map(function(d, i){
        return d.map(function(dB, iB){
            return [dB.x, dB.stackedY];
        });
    });
};

dadavis.attribute.line.area = function(config, cache){
    return cache.layout.map(function(d, i){
        var line = d.map(function(dB, iB){
            return [dB.x, dB.stackedY];
        });

        var previousLine = null;
        if(i === 0){
            previousLine = d.map(function(dB, iB){
                return [dB.x, cache.chartHeight];
            }).reverse();
        }
        else{
            previousLine = cache.layout[i - 1].map(function(dB, iB){
                return [dB.x, dB.stackedY];
            }).reverse();
        }

        return line.concat(previousLine);
    });
};

dadavis.attribute.axis.labelX = function(config, cache){
    var labelAttr = {};
    if(config.axisXAngle < 0){
        labelAttr = {
            left: function(d, i){
                if(cache.noPadding){
                    return d.index * d.w - this.offsetWidth + 'px';
                }
                else{
                    return d.index * d.paddedW + d.paddedW / 2 - this.offsetWidth + 'px';
                }
            },
            'transform-origin': '100%',
            transform: 'rotate(' + config.axisXAngle + 'deg)'
        };
    }
    else if(config.axisXAngle > 0){
        labelAttr = {
            left: function(d, i){
                if(cache.noPadding){
                    return d.index * d.w + 'px';
                }
                else{
                    return d.index * d.paddedW + d.paddedW / 2 + 'px';
                }
            },
            'transform-origin': '0%',
            transform: 'rotate(' + config.axisXAngle + 'deg)'
        };
    }
    else{
        labelAttr = {
            left: function(d, i){
                if(cache.noPadding){
                    return d.index * d.w - this.offsetWidth / 2 + 'px';
                }
                else{
                    return d.index * d.paddedW + d.paddedW / 2 - this.offsetWidth / 2 + 'px';
                }
            }
        }
    }

    labelAttr.display = function(d, i){
        return (i % (cache.axisXTickSkipAuto || config.axisXTickSkip)) ? 'none' : 'block';
    };
    labelAttr.top = config.tickSize + 'px';
    return labelAttr;
};

dadavis.attribute.axis.tickX = function(config, cache){
    return {
        left: function(d, i){
            if(cache.noPadding){
                return d.index * d.w - this.offsetWidth + 'px';
            }
            else{
                return d.index * d.paddedW + d.paddedW / 2 - this.offsetWidth + 'px';
            }
        },
        width: 1 + 'px',
        height: function(d, i){
            return ((i % (cache.axisXTickSkipAuto || config.axisXTickSkip)) ? config.minorTickSize : config.tickSize) + 'px';
        }
    };
};

dadavis.attribute.axis.labelY = function(config, cache){
    return {
        position: 'absolute',
        left: function(d, i){
            var labelW = this.offsetWidth;
            return config.margin.left - labelW - config.tickSize + 'px';
        },
        top: function(d, i){
            var labelH = this.offsetHeight;
            return d.labelY - labelH / 2 + 'px';
        }
    };
};

dadavis.attribute.axis.tickY = function(config, cache){
    return {
        width: config.tickSize + 'px',
        height: 1 + 'px',
        position: 'absolute',
        left: config.margin.left - config.tickSize + 'px',
        top: function(d, i){
            return d.labelY + 'px';
        }
    };
};
