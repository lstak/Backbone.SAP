﻿Backbone.SAP
===================

Backbone.SAP extends Backbone Models and Collections so you can easily work access business data in SAP systems through [SAP Gateway](http://www.sdn.sap.com/irj/sdn/gateway). The data exchange with SAP Gateway is based on the [OData](http://www.odata.org) AtomPub XML format. 

* Usage

Include backbone-sap.js in your index.html:
 
```html


<!doctype html>
<html>
   ....
<script src="jquery.js"></script>

<script src="underscore.js"></script>
<script src="backbone.js"></script>
<script src="backbone-sap.js"></script>
  ...

</html>

```

Now let's look at how you can use Backbone.SAP. The examples are based on the Flight data available on the [SAP Gateway demo system](http://www.sdn.sap.com/irj/sdn/index?rid=/webcontent/uuid/1051f6d9-e87a-2e10-d188-e2786c7878b1)

```js

// You define a Fligth Model for items by extending Backbone.SP.Item
// Required parameters are the SharePoint site and the name of the list

var Flight = Backbone.SAP.Model.extend();


var Flights = Backbone.SAP.Collection.extend({
    model: Flight,
    url: 'https://gw.esworkplace.sap.com/sap/opu/odata/IWBEP/RMTSAMPLEFLIGHT_2/FlightCollection/'
});


var flights = new Flights()

flights.fetch({
    success: function () {
        console.log(flights)
    }
});

....

// get first model from flights collection
var flight = flights.at(0);

flight.get('AirLineID') // -> 'AZ'

....
// you can also use OData query parameters to remote filter the collection.
flights.fetch({
    data: {
        $filter: "AirLineID eq 'AZ'"
    }
});

```
