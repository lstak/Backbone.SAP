/******************************************************************
*  Backbone.SAP Gateway Collection and Model 
* 
*  Author: Luc Stakenborg
*  Date: Mar 6, 2012
* 
*  Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php 
*  Copyright (c) 2012, Luc Stakenborg, Oxida B.V.
******************************************************************
*/


(function (Backbone, _, $) {

    // create namespace
    Backbone.SAP = {};

    // We can use the built-in Backbone sync method,
    // but we must override the dataType parameter to 
    // use 'xml' instead of 'json' 
    Backbone.SAP.sync = function (method, model, options) {
        _.extend(options, {
            dataType: 'xml'
        });

        Backbone.sync(method, model, options)
    },

    Backbone.SAP.Model = Backbone.Model.extend({

        // in AtomPub format, the id property always contains the url of the resource
        url: function () {
            return this.id;
        },

        sync: Backbone.SAP.sync,

        parse: function (entry) {

            // helper function to convert XML properties definition into a JS object
            function parseProperties(node) {
                var attrs = {},
                    nodes = node.children();

                nodes.each(function () {
                    var node = this,
                        name = node.localName,
                        $node = $(node);

                    // If property has a type attribute, it is
                    // a ComplexType, which has nested properties
                    if ($node.attr('m:type')) {
                        // parse ComplexTypes recursively
                        attrs[name] = parseProperties($node);
                    } else {
                        attrs[name] = $node.text();
                    }
                })

                return attrs;
            };

            var id = $('id', entry).text(),
                node = $('properties', entry),
                model = parseProperties(node)

            model.id = id;

            return model
        }
    });


    Backbone.SAP.Collection = Backbone.Collection.extend({

        sync: Backbone.SAP.sync,

        parse: function (xml, xhr) {
            // Return an array of 'entry' nodes
            // The model.parse() method will parse the 
            // individual entry nodes
            return $('entry', xml).get()
        }

    });

} (Backbone, _, $));