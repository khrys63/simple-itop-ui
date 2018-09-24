# simple-itop-ui
A simple UI for iTop.
  
You use [iTop](https://www.combodo.com/itop) ([iTop on GitHub](https://github.com/Combodo/iTop)) as your internal CMDB with the following structure :
* Location -> Rack -> Server
* Location -> Rack -> Enclosure -> Server
* Location -> Rack -> Enclosure -> NetworkDevice

This project will give you a simple page to show your datacenter and navigate between racks :
* on the left, all racks of your location
* on the right, the detail of each U of each rack and the content of each enclosure

### Authentication
Authentication based on iTop.

![iTop login](screenshot/itoplogin.png)

Warning : 
- The REST/JSON API requires iTop 2.0.1 or newer.
- The REST/JSON API is restricted in iTop 2.5 or newer to the users having the profile REST Services User.

### Installing
Copy file on your website server.
Modify <js/properties.js> to update your iTop webservice url (function getITopUrl).

A simple URL :
```
https://yourdomain/simple-itop-ui/datacenter.html?id=NAME_OF_YOUR_LOCATION
```
![iTop location](screenshot/itoplocation.png)


Also existing a page for showing a single rack.
```
https://yourdomain/simple-itop-ui/rack.html?id=NAME_OF_YOUR_RACK
```

![iTop location](screenshot/itoprack.png)

## Debuging in real time
For an easy view of the Rest Response, configure <js/properties.js> to activate the JSON viewer (function getIsDebugJSONVisible).

## Authors
* **Christophe** - *Initial work* - [khrys63](https://github.com/khrys63)
* **Sylvain Desgrais** - [Artpej](https://github.com/Artpej)

## License
This project is licensed under Apache 2.0.

## Contributing
We welcome contributions from the community!