
SANKEY_DATA = [];

define(["jquery", "text!./sankey.css"], function ($, properties) {
    'use strict';
    var path = "/extensions/sankey/";
    return {
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
		// this is IMPORTANT!
                    qWidth: 4,
                    qHeight: 250
                }]
            }
        },
        definition: {
		type: "items",
		component: "accordion",
		items: {
			dimensions: {
				uses: "dimensions",
				min: 2,
				max: 2
			}
           		,
			measures: {
				uses: "measures",
				min: 1,
				max: 1
			},
			sorting: {
				uses: "sorting"
			},
			settings: {
				uses: "settings"
			}
		}
	},
        selections: {
            swipe: false,
            dataArea: {
                captureInput: false
            }
        },
        snapshot: {
            canTakeSnapshot: true
        },
	paint: function ($element, layout) {
		    
	    try {
		var self = this, lastrow = 0

	        var script = document.createElement('script');
	        script.type = 'text/javascript';
	        script.src = "https://www.google.com/jsapi?autoload={'modules':[{'name':'visualization','version':'1.1','packages':['sankey'], 'callback': drawSankeyChart}]}";

	        document.getElementsByTagName('head')[0].appendChild(script)

		
	        $element.html('<div id="sankey_basic" style="height: 100%"></div>');


		SANKEY_DATA = [];
		this.backendApi.eachDataRow( function ( rownum, row ) {
			lastrow = rownum;
			var newdata = [];

			$.each( row, function ( key, cell ) {
				if ( cell.qIsOtherCell ) {
					cell.qText = this.backendApi.getDimensionInfos()[key].othersLabel;
				}
				newdata.push(!isNaN( cell.qNum ) ? parseInt(cell.qText, 10) : cell.qText);
			} );
			SANKEY_DATA.push(newdata);

		} );



		        
	    }
	    catch(err)
	    {
	        alert(err.message);
	    }
	}

    };

	

});


function drawSankeyChart() {

    var data = new google.visualization.DataTable();

    data.addColumn('string', 'From');
    data.addColumn('string', 'To');
    data.addColumn('number', 'Weight');



    data.addRows(SANKEY_DATA);    
    
    // Set chart options
    var options = {
//	  width: 450,
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
    chart.draw(data, options);



}


