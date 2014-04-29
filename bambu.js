/** 
  Bambu generates thematic carto.js strings

  Currently under active development and is being used to style 
  vector tile json data in modestmaps via Carto.js & VECNIK.js.

  MIT License - Copryright 2012 
*/
function Bambu() {

  // defaults 
  var colors = 'Reds',
    classification = 'quantile',
    classes = 5,
    style = '',
    data = [],
    output = "Esri",
    type = "color",
    id = '#',
    field = 'null',
    opacity = 1,
    default_fill,
    stroke = [224, 224, 224],
    fill = [41,128,185,255]
    size = 10,
    width = 1,
    geomType = 'esriGeometryPoint';

  // returnable class
  var bambu = function(){};

  // regenerates the classification 
  bambu.classify = function(){

    var vals = data.sort(function(a, b) {
      return a - b;
    });

    switch (classification){
      case 'quantile':
          var breaks = [];

          for (var i = 0; i < classes; i++) {
            breaks.push( vals[Math.ceil(i * (vals.length - 1) / classes)])
          }

          break;
      case 'equal_interval':
          var breaks = [],
            range = vals[vals.length - 1] - vals[0];

          for (var i=0; i < classes; i++) {
            breaks.push(Math.floor(vals[0] + i * range / classes))
          }

          breaks[classes] = vals[vals.length - 1];
          break;
    }

    var out;
    if ( output === "CartoCSS" ) {
      out = bambu.createCartoStyle( breaks );
    } else if ( output === "Esri" ) {
      out = bambu.createEsriStyle( breaks, vals );
    }

    return out;
  }

  bambu.createCartoStyle = function(breaks) {
    var bins = [];
    if ( type === "size" ) {
      style = "TODO: carto css SIZE";
    } else if ( type === "color" ) {
      style = '#'+ id +' { ' + ((default_fill) ? 'polygon-fill: ' + default_fill + '; ' : ' polygon-opacity: '+ opacity+'; ');

      for (var b = 0; b < breaks.length-1; b++){
        var break_val = breaks[b];
        bins.push('['+field+' > '+break_val+'] { polygon-fill: ' + rgb2hex(colorbrewer[colors][classes][b]) + '; }');
      }

      style = style + bins.join(' ') + '}';
    }
    return style;
  }

  bambu.createEsriStyle = function(breaks, vals) {

    function defaultSymbol(geomType){
      var symbol;
      switch ( geomType ) {
  
        case "esriGeometryPoint":
          symbol = {
            type: "esriSMS",
            style: "esriSMSCircle",
            size: 10,
            angle: 0,
            xoffset: 0,
            yoffset: 0,
            color: esriColor(fill, opacity),
            outline: esriLineSymbol(stroke, opacity)
          };
          break;
  
        case "esriGeometryPolyline":
          symbol = {
            type: "esriSLS",
            style: "esriSLSSolid",
            color: esriColor(fill, opacity),
            width: 1
          };
          break;
  
        case "esriGeometryPolygon":
          symbol = {
            type: "esriSFS",
            style: "esriSFSSolid",
            color: esriColor(fill, opacity),
            outline: esriLineSymbol(stroke)
          };
          break;
  
      }
      return symbol;
    }

    function esriColor( colors , alpha ){
      console.log('[ colors[0], colors[1], colors[2], alpha ]', [ colors[0], colors[1], colors[2], alpha ])
      return [ colors[0], colors[1], colors[2], alpha ];
    }

    function esriSymbol(geometryType, stroke, fill, opacity, radius){
      var symbol;
      if (geometryType === "esriGeometryPolygon"){
        symbol = esriFillSymbol(fill, stroke, opacity);
      }
      else if (geometryType === "esriGeometryPolyline"){
        symbol = esriLineSymbol(stroke, opacity);
      }
      else{
        symbol = esriPointSymbol( stroke, fill, opacity, radius);
      }
      return symbol;
    }

    function esriPointSymbol( stroke, fill, opacity, size ){
      var symbol = defaultSymbol("esriGeometryPoint");
        symbol.color = esriColor( fill, opacity );
        symbol.outline = esriLineSymbol( stroke, opacity);
        symbol.size = size;
      return symbol;
    }

    function esriLineSymbol( stroke, opacity, width ){
      var symbol = defaultSymbol("esriGeometryPolyline");
      if (! stroke){
        return symbol;
      }
      symbol.color = esriColor( stroke, opacity || opacity);
      symbol.width = width;
      return symbol;
    }
  
  
    function esriFillSymbol( fill, stroke, opacity ){
      var symbol = defaultSymbol("esriGeometryPolygon");
      if (! stroke || ! fill){
        return symbol;
      }
      symbol.color = esriColor(fill, opacity || opacity);
      symbol.outline = esriLineSymbol( stroke, opacity );
      return symbol;
    }

    if ( type === "size" ) {

      //var breaks = generateBreaks( classes, style.field.min, style.field.max);
  
      style = {
        type: "classBreaks",
        defaultSymbol: esriSymbol( geomType, stroke, (( geomType == 'esriGeometryPolygon') ? ramp[0] : fill), size),
        defaultLabel: "Other Values",
        classificationMethod: 'esriClassifyEqualInterval',
        field: field,
        minValue: vals[0]
      };
  
      var i, radius, maxVal, breakInfo;
  
      style.classBreakInfos = [];
  
      breaks.forEach( function(b, i){
        maxVal = b;
        radius = size * (i+1);
        breakInfo = {
          classMaxValue: maxVal,
          symbol: esriSymbol(geomType, stroke, (( geomType == 'esriGeometryPolygon') ? ramp[i] : fill), opacity, radius)
        };
        style.classBreakInfos.push(breakInfo);
      });

      return style;

    } else if ( type === "color" ) {

      style = 'Esri Renderer COLOR!';

    }
      return style;
  }

  bambu.output = function(x, gen){
    if (!arguments.length) return output;
    output = x;
    if (gen) bambu.classify();
    return bambu;
  };

  bambu.id = function(x, gen){
    if (!arguments.length) return id;
    id = x;
    if (gen) bambu.classify();
    return bambu;
  };

  bambu.data = function(x, gen){
    if (!arguments.length) return data;
    data = x;
    if (gen) bambu.classify();
    return bambu; 
  };

  bambu.field = function(x, gen){
    if (!arguments.length) return field;
    field = x;
    if (gen) bambu.classify();
    return bambu;
  };

  bambu.colors = function(x, gen){
    if (!arguments.length) return colors;
    colors = x;
    if (gen) bambu.classify();
    return bambu;
  };

  bambu.type = function(x, gen){
    if (!arguments.length) return type;
    type = x;
    if (gen) bambu.classify();
    return bambu;
  };

  bambu.geomType = function(x, gen){
    if (!arguments.length) return geomType;
    geomType = x;
    if (gen) bambu.classify();
    return bambu;
  };

   bambu.classes = function(x, gen){
    if (!arguments.length) return classes;
    classes = Math.min(x,9);
    classes = Math.max(classes,3);
    if (gen) bambu.classify();
    return bambu;
  };

  bambu.classification = function(x, gen){
    if (!arguments.length) return classification;
    classification = x;
    if (gen) bambu.classify();
    return bambu;
  };

  bambu.opacity = function(x, gen){
    if (!arguments.length) return opacity;
    opacity = x;
    if (gen) bambu.classify();
    return bambu;
  };  

  bambu.style = function(){
    return style;
  };


  function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }


  return bambu;
}


if (typeof module !== 'undefined' && module.exports) {
  //_ = require('underscore');
  colorbrewer = require('./colorbrewer.js');
  module.exports.Bambu = Bambu;
}
