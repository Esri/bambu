# Bambu.js

### A library for generating thematic carto.js styles and Esri renderers from arrays of data

Bambu is very simple Javascript library for classifying arrays of data, and can be used in Node.js or within a Browwer. Bambu.js will create Carto.js style strings OR simple classified Esri renderers. 

Right now Bambu supports Quantile and Equal Interval classifications.

## Examples

    function carto() {
      var data = [0,35,2,41,46,10,9,5,3,23,55,76,64,42,22,22,37,6,77,8,3,1,3,4,5,11,14,17,34];
      
      var bambu = Bambu()
        .id('test')
        .field('val')
        .data(data, true) // passing true forces a classification to run, creating a style string
        .classification('quantile')
        .output('CartoCSS')
        .type('color')
        .colors('Reds')
        .classes(5);
      
      // to access the style string we call style() 
      var style = bambu.style();
      
      // we can update the style very easily by calling any of the methods above
      var new_style = bambu.colors('Blues').classify();
      
      // depending on the size of our data array we can choose to delay a re-classification
      // or force it generate a new one
      bambu.colors('YlGnBu', false).classes(9); // delays re-classification
      
      var style = bambu.classify();
      console.log(style);

      //OUTPUTS
      //#test {  polygon-opacity: 1; [val > 0] { polygon-fill: #ffffd9; } [val > 3] { polygon-fill: #edf8b1; } [val > 5] { polygon-fill: #c7e9b4; } [val > 8] { polygon-fill: #7fcdbb; } [val > 11] { polygon-fill: #41b6c4; } [val > 22] { polygon-fill: #1d91c0; } [val > 34] { polygon-fill: #225ea8; } [val > 41] { polygon-fill: #253494; }}
    } 


    function esri() {
      var data = [0,1000];
      
      var bambu = Bambu()
        .id('test')
        .field('val')
        .data(data, true)
        .output('Esri')
        .type('size')
        .geomType('esriGeometryPoint')
        .classification('equal_interval')
        .colors('Reds')
        .classes(5);
      
      // to access the style string we call style() 
      var style = bambu.style();
      
      // we can update the style very easily by calling any of the methods above
      var new_style = bambu.colors('Blues').classify();
      
      // depending on the size of our data array we can choose to delay a re-classification
      // or force it generate a new one
      bambu.colors('YlGnBu', false).classes(9); // delays re-classification
      
      var style = bambu.classify();
      console.log(style);

      //OUTPUTS
      //{"type":"classBreaks","defaultSymbol":{"type":"esriSMS","style":"esriSMSCircle","angle":0,"xoffset":0,"yoffset":0,"color":[41,128,185,10],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[224,224,224,10]}},"defaultLabel":"Other Values","classificationMethod":"esriClassifyEqualInterval","field":"val","minValue":0,"classBreakInfos":[{"classMaxValue":0,"symbol":{"type":"esriSMS","style":"esriSMSCircle","size":10,"angle":0,"xoffset":0,"yoffset":0,"color":[41,128,185,1],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[224,224,224,1]}}},{"classMaxValue":111,"symbol":{"type":"esriSMS","style":"esriSMSCircle","size":20,"angle":0,"xoffset":0,"yoffset":0,"color":[41,128,185,1],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[224,224,224,1]}}},{"classMaxValue":222,"symbol":{"type":"esriSMS","style":"esriSMSCircle","size":30,"angle":0,"xoffset":0,"yoffset":0,"color":[41,128,185,1],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[224,224,224,1]}}},{"classMaxValue":333,"symbol":{"type":"esriSMS","style":"esriSMSCircle","size":40,"angle":0,"xoffset":0,"yoffset":0,"color":[41,128,185,1],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[224,224,224,1]}}},{"classMaxValue":444,"symbol":{"type":"esriSMS","style":"esriSMSCircle","size":50,"angle":0,"xoffset":0,"yoffset":0,"color":[41,128,185,1],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[224,224,224,1]}}},{"classMaxValue":555,"symbol":{"type":"esriSMS","style":"esriSMSCircle","size":60,"angle":0,"xoffset":0,"yoffset":0,"color":[41,128,185,1],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[224,224,224,1]}}},{"classMaxValue":666,"symbol":{"type":"esriSMS","style":"esriSMSCircle","size":70,"angle":0,"xoffset":0,"yoffset":0,"color":[41,128,185,1],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[224,224,224,1]}}},{"classMaxValue":777,"symbol":{"type":"esriSMS","style":"esriSMSCircle","size":80,"angle":0,"xoffset":0,"yoffset":0,"color":[41,128,185,1],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[224,224,224,1]}}},{"classMaxValue":888,"symbol":{"type":"esriSMS","style":"esriSMSCircle","size":90,"angle":0,"xoffset":0,"yoffset":0,"color":[41,128,185,1],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[224,224,224,1]}}},{"classMaxValue":1000,"symbol":{"type":"esriSMS","style":"esriSMSCircle","size":100,"angle":0,"xoffset":0,"yoffset":0,"color":[41,128,185,1],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[224,224,224,1]}}}]}
    } 


    carto();
    esri();


## Dependencies

1. colorbrewer.js (see ./colorbrewer.js) 

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing

Copyright 2014 Esri

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

A copy of the license is available in the repository's [LICENSE.txt](https://github.com/Esri/bambu-js/blob/master/LICENSE.txt) file.

[](Esri Tags: ArcGIS Esri JSAPI Simple Renderers)
[](Esri Language: JavaScript)