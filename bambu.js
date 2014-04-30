/** 
  Bambu generates thematic carto.js strings and Esri simple renderers.

  Currently under active development.

  Copyright 2014 Esri

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0 
*/
function Bambu() {

  // defaults 
  var colors = 'div-orange-yellow-pink',
    classification = 'equal_interval',
    classes = 5,
    style = '',
    data = [],
    output = "Esri",
    type = "size",
    id = '#',
    field = 'null',
    opacity = 255,
    default_fill,
    stroke = [224, 224, 224],
    fill = [41,128,185,255]
    size = 10,
    width = 1,
    geomType = 'esriGeometryPoint';

  // returnable class
  var bambu = function(){};



  /*
  * Generates class breaks to be based to style generators
  * Defaults to "Equal Interval"
  *
  */
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



  /*
  * Generate CartoCSS
  *
  * TODO: create carto css for SIZE option
  */
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



  /*
  * Generate Esri simple renderer
  *
  *
  */
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

      ramp = [];
      
      for (var b = 0; b < breaks.length; b++){
        var break_val = breaks[b];
        if ( Ramps.colors[ colors ][ 6 ][b] ) {
          var c = hexToRgb(Ramps.colors[ colors ][ 6 ][b]);
          ramp.push( c );
        }
      }

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
        console.log('i', i);
        console.log('color on ramp', ramp[i])
        breakInfo = {
          classMaxValue: maxVal,
          symbol: esriSymbol(geomType, stroke, (( geomType == 'esriGeometryPolygon') ? ramp[i] : fill), opacity, radius)
        };
        style.classBreakInfos.push(breakInfo);
      });

      return style;

    }
      return style;
  }



  /*
  * bambu options
  *
  *
  */
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


  /*
  *
  * Helpers 
  *
  */
  function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }

  function hexToRgb(hex) {
    var arr = [];
    hex = hex.replace(/#/g, '');
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    var a = opacity;
    
    arr.push(parseInt(r));
    arr.push(parseInt(g));
    arr.push(parseInt(b));
    arr.push(parseInt(a));

    return arr;
  }


  return bambu;
}


if (typeof module !== 'undefined' && module.exports) {
  //_ = require('underscore');
  colorbrewer = require('./colorbrewer.js');
  module.exports.Bambu = Bambu;
}
