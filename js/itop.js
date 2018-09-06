//Pour le templating des tables
var TemplateEngine = function (tpl, data) {
    var temp = tpl
    var re = /{([^}]+)?}/g, match;
    while (match = re.exec(tpl)) {
        temp = temp.replace(match[0], data[match[1]]);
    }
    return temp;
}
//Recup d'un param dans l'url
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}
//Surlignage et coloration syntaxique d'un flux JSON
function syntaxHighlight(json) {
    if (getIsDebugJSONVisible()){
        $('#result').html('');
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        $('#JSONResult').show();
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
}
//Chargement d'une salle avec url
function GetLocation(e) {
    $('#result').val('');
    var oJSON = {
        operation: 'core/get',
        'class': 'Location',
        key: "SELECT Location WHERE name = \"" + getUrlParameter('id') + "\""
    };
    CallWSLocation(oJSON);
    e.preventDefault();
    return false;
}
//Appel du WS Itop pour une salle
function CallWSLocation(oJSON) {
    $('#result').html('');
    $('#loading').show();
    $.ajax({
        type: "POST",
        url: getITopUrl(),
        dataType: "json",
        data: { auth_user: $('#auth_user').val(), auth_pwd: $('#auth_pwd').val(), json_data: JSON.stringify(oJSON) },
        crossDomain: 'true',
        success: successLocationWS,
        error: loadingHide
    });
    return false;
}
//Action lors retour success du WS des locations
function successLocationWS(data){
    try {
        if (data) { 
            switch (data.message){
                case 'Error: Invalid login':
                    console.log('Invalid Login');
                    $('#errorLogin').html("Login ou mot de passe incorrect").show();
                    break;
                case 'Found: 0':
                    console.log('Salle inexistante');
                    $('#errorLogin').html("Salle inexistante").show();
                    break;
                default:
                    $('#datacenter').show();
                    fillTableLocation(data);
                    $('#result').html(syntaxHighlight(data));   
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        loadingHide();
    }
}
//Order by location
function locationByName(a, b) {
    if (a.orderitem != undefined) {
        return a.orderitem.localeCompare(b.orderitem)
    }
}
//Ajout d'un 0 si le nom du rack termine par un seul numeric (need xxxx00 for ordering rack)
function sanitizeRack(a){
    var char = a.name.charAt(a.name.length-2);
    if (char>='0' && char <='9'){
        a.orderitem=a.name; 
    }else{
        a.orderitem=a.name.substring(0,a.name.length-1)+'0'+a.name.substring(a.name.length-1); //ajout 0x
    }
    return a;
}
//Remplissage de la table de la location avec tous les racks
function fillTableLocation(data) {
    if (data) {
        //on a pas l'id alors on passe par le 1er objet du JSON
        var location = Object.keys(data.objects).slice(0, 1).map(function(key){return data.objects[key];})[0];

        $('#name').html(location.fields.name);
        $('#tableLocation').not(':first').not(':last').remove();
        var tableHead = '<tr class="thead"><th>Rack</th></tr>';
        var theRacks = '';
        location.fields.physicaldevice_list.map(sanitizeRack).sort(locationByName).forEach(function (rack) {
            if (rack.finalclass == 'Rack') {
                theRacks += TemplateEngine($("#racks_line").html(), rack)
            }
        });
        $('#tableLocation tbody').html(tableHead + theRacks);
        $('#LoginFormLoc').hide();
    }
}
//Chargement d'un rack avec nom passé en param
function GetRackWithName(name) {
    $('#server').hide();
    $('#rack').hide();
    $('#result').val('');
    var oJSON = {
        operation: 'core/get',
        'class': 'Rack',
        key: "SELECT Rack WHERE name = \"" + name + "\""
    };
    CallWSRack(oJSON);
}
//Chargement d'un rack avec nom dans l'url
function GetRack(e) {
    GetRackWithName(getUrlParameter('id')) ;
    e.preventDefault();
}
//Appel du WS Itop pour un rack
function CallWSRack(oJSON) {
    $('#result').html('');
    $('#loading').show();
    $.ajax({
        type: "POST",
        url: getITopUrl(),
        dataType: "json",
        data: { auth_user: $('#auth_user').val(), auth_pwd: $('#auth_pwd').val(), json_data: JSON.stringify(oJSON) },
        crossDomain: 'true',
        success: successRackWS,
        error: loadingHide
    });
    return false;
}
//Action lors retour success du WS des racks
function successRackWS(data){
    try{
        switch (data.message){
            case 'Error: Invalid login':
                console.log('Invalid Login');
                $('#errorLogin').html("Login ou mot de passe incorrect").show();
                break;
            case 'Found: 0':
                console.log('Salle inexistante');
                $('#errorLogin').html("Salle inexistante").show();
                break;
            default:
                $('#rack').show();
                fillTableRack(data);
                $('#result').html(syntaxHighlight(data));
        }
    } catch (e) {
        console.log(e);
    } finally {
        loadingHide();
    }
}
//Order by rack
function rackByName(a, b) {
    if (a.description != undefined) {
        return -a.description.localeCompare(b.description)
    }
}
//Nettoyage des objets d'un rack +  typage métier
function SanitizeAndAddPersoType(type) {
    return function (a) {
        // ajout de l'enclosure_name aux objets qui ne l'ont pas
        if (a['enclosure_name'] == undefined) {
            a.enclosure_name = '';
        }
        //typage des objets : Device ou Chassis
        a.persoType = type;
        return a;
    }
}
//Remplissage du tableau avec les U
function fillTableRack(data) {
    if (data) {
        //on a pas l'id alors on passe par le 1er objet du JSON
        var rack = Object.keys(data.objects).slice(0, 1).map(function (key) { return data.objects[key] })[0];

        $('#namerack').html(rack.fields.name);
        var nbu = rack.fields.nb_u;
        $('#nbu').html(nbu);
        $('#tablerack').not(':first').not(':last').remove();
        var Us = 0;
        var tableHead = '<tr class="thead"><th>U</th><th>Type</th><th>Description</th><th>U occup&eacute;(s)</th><th>Marque</th><th>Modele</th><th>Status</th></tr>';
        var theDevices = '';
        devices = rack.fields.device_list.map(SanitizeAndAddPersoType('Device'));
        enclosures = rack.fields.enclosure_list.map(SanitizeAndAddPersoType('Chassis'));

        enclosures.concat(devices).sort(rackByName).forEach(function (device) {
            if (device.enclosure_name == '') {
                if (device.nb_u != 0) { 
                    // si FRONT ou REAR dans la description on divise par 2 la capacité du U
                    if (device.description.indexOf('REAR')>=0 || device.description.indexOf('FRONT')>=0){
                        Us += parseFloat(device.nb_u/2);
                    }else{
                        Us += parseFloat(device.nb_u);
                    }
                }
                theDevices += TemplateEngine($("#u_line").html(), device)
            }
        });

        $('#tablerack tbody').html(tableHead + theDevices);
        $('#uuse').html(Us);
        $('#upercent').html(parseFloat(Us / nbu * 100).toFixed(2));
        $('#LoginFormRack').hide();
    }
}
//Chargement d'un chassis avec nom passé en param
function GetEnclosureWithName(name,persoType) {
    if (persoType=='Chassis'){
        $('#result').val('');
        $('#chassisname').html(name);

        $('#tableserver').not(':first').not(':last').remove();
        var tableHead = '<tr class="thead"><th>Description</th><th>Marque</th></tr>';
        $('#tableserver tbody').html(tableHead);

        var oJSON = {
            operation: 'core/get',
            'class': 'Server',
            key: "SELECT Server WHERE enclosure_name = \"" + name + "\"",
            output_fields: "name,brand_name"
        };
        CallWSEnclosureServer(oJSON);

        var oJSON = {
            operation: 'core/get',
            'class': 'NetworkDevice',
            key: "SELECT NetworkDevice WHERE enclosure_name = \"" + name + "\"",
            output_fields: "name,brand_name"
        };
        CallWSEnclosureNetwork(oJSON);
    }else{
        $('#server').hide();
    }
}
//Appel du WS Itop pour un chassis
function CallWSEnclosureServer(oJSON) {
    $('#result').html('');
    $('#loading').show();
    $.ajax({
        type: "POST",
        url: getITopUrl(),
        dataType: "json",
        data: { auth_user: $('#auth_user').val(), auth_pwd: $('#auth_pwd').val(), json_data: JSON.stringify(oJSON) },
        crossDomain: 'true',
        success: successEnclosureWS('Serv'),
        error: loadingHide
    });
    return false;
}
//Appel du WS Itop pour un chassis
function CallWSEnclosureNetwork(oJSON) {
    $('#result').html('');
    $('#loading').show();
    $.ajax({
        type: "POST",
        url: getITopUrl(),
        dataType: "json",
        data: { auth_user: $('#auth_user').val(), auth_pwd: $('#auth_pwd').val(), json_data: JSON.stringify(oJSON) },
        crossDomain: 'true',
        success: successEnclosureWS('Netw'),
        error: loadingHide
    });
    return false;
}
//Action lors retour success du WS des Enclosures
function successEnclosureWS(startWith){
    return function (data){
        try {
            $('#enclosure').show();
            if (data) { 
                //on a pas l'id alors on passe par le nom
                var theServer=Object.keys(data.objects)
                    .filter(function(a){return a.startsWith(startWith)})
                    .map(function (key){return data.objects[key].fields})
                    .reduce(function(a,b){return a+TemplateEngine($("#server_line").html(), b);},"");
                
                $('#tableserver tbody').html($('#tableserver tbody').html() + theServer);
                $('#server').show();
                loadingHide();
                $('#result').html(syntaxHighlight(data));
            }
        } catch (e) {
            console.log(e);
        } finally {
            loadingHide();
        }
    }
}
//Fin de chargement
function loadingHide(){
    $('#loading').hide();  
}
$(document).ready(function () {
    $('#LoginFormLoc').on("submit",GetLocation);
    $('#LoginFormRack').on("submit",GetRack);
});