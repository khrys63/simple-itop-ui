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
//Chargement des racks d'une salle avec url
function GetLocation(e) {
    $('#result').val('');
    if (datacenterId != null){
        var oJSON = {
            operation: 'core/get',
            'class': 'Location',
            key: "SELECT Rack WHERE location_name = \"" + datacenterId + "\""
        };
        CallWSLocation(oJSON);
    } else {
        showErrorId();
    }
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
                    showErrorLogin();
                    break;
                case 'Error: This user is not authorized to use the web services. (The profile REST Services User is required to access the REST web services)':
                case 'Error: Portal user is not allowed':
                    showImpossibleLogin();
                    break;
                case 'Found: 0':
                    $('#errorLogin').html("Salle inexistante").show();
                    break;
                default:
                    $('#datacenter').show();
                    $('#graph').show();
                    $('#graphs').html('');
                    $('#graphLegend').hide();
                    $('#rack').hide();
                    fillTableLocation(data);
                    loadComboBoxdataCenter($('#name').html());
                    $('#result').html(syntaxHighlight(data));   
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        loadingHide();
    }
}
function loadComboBoxdataCenter(selectedValue){
    html = "";
    for(var key in datacenter) {
        html += "<option value=" + key;
        if (datacenter[key]==selectedValue) {html += " selected";} 
        html += ">" +datacenter[key] + "</option>";
    }
    document.getElementById("datas").innerHTML = html;
    document.getElementById("datas").onchange = DatacenterChange;
}

//Order by location
function sortRackByName(a, b) {
    if (a.sort != undefined) {
        return a.sort.localeCompare(b.sort)
    }
}
//Ajout d'un 0 si le nom du rack termine par un seul numeric (need xxxx00 for ordering rack)
function sanitizeRack(a){
    var char = a.name.charAt(a.name.length-2);
    if (char>='0' && char <='9'){
        a.sort = a.name        
    }else{
        a.sort = a.name.substring(0,a.name.length-1)+'0'+a.name.substring(a.name.length-1); //ajout 0x
    }
    return a;
}
//Remplissage de la table de la location avec tous les racks
function fillTableLocation(data) {
    if (data) {
        $('#name').html(datacenterId);
        $('#tableLocation').not(':first').not(':last').remove();
        var tableHead = '<tr class="thead"><th>'+applyTrad("tablerack")+'</th></tr>';
        // on a des objets avec noms variables. On les transforme en objet {name:name}. On ajoute un item de tri avec un 0. On tri. On accumule.
        var theRacks = Object.keys(data.objects).map(function(key){return {'name': data.objects[key].fields.friendlyname}}).map(sanitizeRack).sort(sortRackByName).reduce(function (accu, rack) {
                accu += TemplateEngine($("#racks_line").html(), rack);
                return accu;
        },'');
        $('#tableLocation tbody').html(tableHead+theRacks);
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
//Chargement des racks pour faire les graph
function GetGraphLocation(datacenterId) {
    $('#result').val('');
    if (datacenterId != null){
        var oJSON = {
            operation: 'core/get',
            'class': 'Location',
            key: "SELECT Rack WHERE location_name = \"" + datacenterId + "\""
        };
        CallWSLocationForGraph(oJSON);
    } else {
        showErrorId();
    }
    return false;
}
//Appel du WS Itop pour les graphs de la salle
function CallWSLocationForGraph(oJSON) {
    $('#result').html('');
    $('#loading').show();
    $.ajax({
        type: "POST",
        url: getITopUrl(),
        dataType: "json",
        data: { auth_user: $('#auth_user').val(), auth_pwd: $('#auth_pwd').val(), json_data: JSON.stringify(oJSON) },
        crossDomain: 'true',
        success: successGraphWS,
        error: loadingHide
    });
    return false;
}
//Action lors retour success du WS des graph de la salle
function successGraphWS(data){
    try {
        if (data) { 
            switch (data.message){
                case 'Error: Invalid login':
                    showErrorLogin();
                    break;
                case 'Error: This user is not authorized to use the web services. (The profile REST Services User is required to access the REST web services)':
                    showImpossibleLogin();
                    break;
                case 'Found: 0':
                    $('#errorLogin').html("Salle inexistante").show();
                    break;
                default:
                    $('#datacenter').show();
                    fillGraphLocation(data);
                    $('#result').html(syntaxHighlight(data));   
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        loadingHide();
    }
}
//Remplissage de la table de la location avec tous les racks
function fillGraphLocation(data) {
    if (data) {
        // on a des objets avec noms variables. On les transforme en objet {name:name}. On ajoute un item de tri avec un 0. On tri. On accumule.
        var theGraphRacks = Object.keys(data.objects).map(function(key){return {'name': data.objects[key].fields.friendlyname}}).map(sanitizeRack).sort(sortRackByName).reduce(function (accu, rack) {
            accu += '<div class="GraphContainer"><span>'+rack.name+'</span><br><canvas id="myChart'+rack.name+'" width="100" height="100"></canvas></div>';
            return accu;
        },'');
        $('#graphs').html(theGraphRacks);

        // on charge tous les canvas un par un
        Object.keys(data.objects).map(function(key){return {'name': data.objects[key].fields.friendlyname}}).map(sanitizeRack).sort(sortRackByName).forEach(function(rack){
            var oJSON = {
                operation: 'core/get',
                'class': 'Rack',
                key: "SELECT Rack WHERE name = \""+rack.name+"\""
            };

            $.ajax({
                type: "POST",
                url: getITopUrl(),
                dataType: "json",
                data: { auth_user: $('#auth_user').val(), auth_pwd: $('#auth_pwd').val(), json_data: JSON.stringify(oJSON) },
                crossDomain: 'true',
                success: generateGraphForRack,
            });
        });
        $('#graphLegend').show();
        $('#legNet').css("backgroundColor",getNetworkColor());
        $('#legServ').css("backgroundColor",getServerColor());
        $('#legStore').css("backgroundColor",getStorageColor());
        $('#legEncl').css("backgroundColor",getEnclosureColor());
        $('#legfree').css("backgroundColor",getFreeColor());
        
    }
}
//Remplissage du tableau avec les U
function generateGraphForRack(data) {
    if (data) {
        //on a pas l'id alors on passe par le 1er objet du JSON
        var rack = Object.keys(data.objects).slice(0, 1).map(function (key) { return data.objects[key] })[0];
        var nbu = rack.fields.nb_u;
        var networkUs = 0;
        var serverUs = 0;
        var enclosureUs = 0;
        var storageUs = 0;
        var us =0;
        devices = rack.fields.device_list.map(SanitizeAndAddPersoType('Device'));
        enclosures = rack.fields.enclosure_list.map(SanitizeAndAddPersoType('Chassis'));

        enclosures.concat(devices).forEach(function (device) {
            if (device.enclosure_name == '') {
                if (device.description.indexOf('REAR')>=0 || device.description.indexOf('FRONT')>=0){
                    us = parseFloat(device.nb_u?device.nb_u :"1")/2;
                }else{
                    us = parseFloat(device.nb_u?device.nb_u :"1");
                }
                switch (device.finalclass) {
                    case 'NetworkDevice':
                    case 'SANSwitch':
                        networkUs += us;
                        break;
                    case 'StorageSystem':
                        storageUs += us;
                        break;
                    case 'Enclosure':
                        if (device.device_list[0]){
                            switch (device.device_list[0].finalclass){
                                case 'NetworkDevice':
                                    networkUs += us;
                                    break;
                                case 'StorageSystem':
                                    storageUs += us;
                                    break;
                                default: // Server
                                    serverUs += us;
                            }
                        }else {
                            enclosureUs += us;
                        }
                        break;
                    default: // Server
                        serverUs += us;
                }
            }
        });

        var ctx = document.getElementById('myChart'+rack.fields.friendlyname).getContext('2d');
        var myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [applyTrad('legNet'),applyTrad('legServ'),applyTrad('legStore'),applyTrad('legEncl'),applyTrad('legfree')],
                datasets: [{
                    data: [networkUs, serverUs, enclosureUs,  storageUs, nbu-serverUs-networkUs-storageUs-enclosureUs],
                    backgroundColor:[getNetworkColor(), getServerColor(), getEnclosureColor(), getStorageColor(), getFreeColor()]
                }]
            },
            options:{
                legend:{
                    display:false,
                },
                tooltips:{
                    bodyFontSize:10
                }
            }
        });
    }
}
//Chargement d'un rack avec nom dans l'url
function GetRack(e) {
    rackId = getUrlParameter('id');
    if (rackId != null){
        GetRackWithName(rackId);
    } else {
        showErrorId();
    }
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
                showErrorLogin();
                break;
            case 'Error: This user is not authorized to use the web services. (The profile REST Services User is required to access the REST web services)':
            case 'Error: Portal user is not allowed':
                showImpossibleLogin();
                break;
            case 'Found: 0':
                $('#errorLogin').html("Rack inexistant").show();
                break;
            default:
                switchRackGraph('rack');
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
        var tableHead = '<tr class="thead"><th>'+applyTrad("tableu")+'</th><th>'+applyTrad("tableclasse")+'</th><th>'+applyTrad("tabledesc")+'</th><th>'+applyTrad("tableuocc")+'</th><th>'+applyTrad("tablemar")+'</th><th>'+applyTrad("tablemodel")+'</th><th>'+applyTrad("tableserial")+'</th><th>'+applyTrad("tableor")+'</th><th>'+applyTrad("tablestatus")+'</th></tr>';
        var theDevices = '';
        devices = rack.fields.device_list.map(SanitizeAndAddPersoType('Device'));
        enclosures = rack.fields.enclosure_list.map(SanitizeAndAddPersoType('Chassis'));

        enclosures.concat(devices).sort(rackByName).forEach(function (device) {
            if (device.enclosure_name == '') {
                // si FRONT ou REAR dans la description on divise par 2 la capacité du U
                if (device.description.indexOf('REAR')>=0 || device.description.indexOf('FRONT')>=0){
                    Us += parseFloat(device.nb_u?device.nb_u :"1")/2;
                }else{
                    Us += parseFloat(device.nb_u?device.nb_u :"1");
                }
                theDevices += TemplateEngine($("#u_line").html(), device)
            }
        });

        $('#tablerack tbody').html(tableHead + theDevices);
        $('#uuse').html(Us);
        $('#upercent').html(parseFloat(Us / nbu * 100).toFixed(2));
        $('#LoginFormRack').hide();

        var ctx = document.getElementById('myChart').getContext('2d');
        var myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [applyTrad('legoccup'),applyTrad('legfree')],
                datasets: [{
                    data: [Us, nbu-Us],
                    backgroundColor:[getOccupiedColor(), getFreeColor()]
                }]
            },
            options:{
                legend:{
                    display:false,
                },
                tooltips:{
                    bodyFontSize:10
                }
            }
        });
    }
}
//Chargement d'un chassis avec nom passé en param
function GetEnclosureWithName(name,persoType) {
    if (persoType=='Chassis'){
        $('#result').val('');
        $('#chassisname').html(name);

        $('#tableserver').not(':first').not(':last').remove();
        var tableHead = '<tr class="thead"><th>'+applyTrad("tabledesc")+'</th><th>'+applyTrad("tablemar")+'</th></tr>';
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
            if (data && data.message!='Found: 0') { 
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
//Afficher le DIV Rack ou Graph
function switchRackGraph(showId){
    if (showId=='rack'){
        $('#graph').hide();
        $('#rack').show();
    }else{
        $('#graph').show();
        $('#rack').hide();
    }
}
//Fin de chargement
function loadingHide(){
    $('#loading').hide();  
}
//Id Obligatoire
function showErrorId(){
    console.log('Id undefined');
    $('#errorLogin').html("Paramètre id obligatoire.").show();
}
//Login ou mot de passe invalide
function showErrorLogin(){
    console.log('Invalid Login');
    $('#errorLogin').html("Login ou mot de passe incorrect.").show();
}
//connection au WS interdite
function showImpossibleLogin(){
    console.log('This user is not authorized to use the web services. ');
    $('#errorLogin').html("Utilisateur non autorisé.").show();
}
$(document).ready(function () {
    datacenterId = getUrlParameter('id');
    $('#LoginFormLoc').on("submit",GetLocation);
    $('#LoginFormRack').on("submit",GetRack);
    trad();
});
function DatacenterChange(){
    datacenterId = document.getElementById('datas').value;
    GetLocation(Event);
}