/*English text*/
en = i18n.create({
    values:{
        "btnspace":"Loading room's space",
        "btnmask":"Mask rack",
        "legNet":"Network",
        "legServ":"Server",
        "legStore":"Storage",
        "legEncl":"Enclosure",
        "legfree":"Free space",
        "legoccup":"Occupied",
        "formserver":"Server parameters",
        "formlogin":"Login",
        "formpassword":"Password",
        "formconnect":"Connect",
        "sprackdetail":"Rack detail",
        "sprackname":"Name",
        "spnbu":"Unit number",
        "spnbuocc":"Occupied unit(s)",
        "spenclodetail":"Enclosure detail",
        "tablerack":"Rack",
        "tableu":"Unit",
        "tableclasse":"Classe",
        "tabledesc":"Description",
        "tableuocc":"Height",
        "tablemar":"Brand",
        "tablemodel":"Model",
        "tableserial":"Serial n°",
        "tableor":"Organisation",
        "tablestatus":"Status",
        "msguser":"Unauthorized user.",
        "msgfailcon":"Invalid Login or Password.",
        "msgparam":"Required Id parameter."
    }
})
/*French text*/
fr = i18n.create({
    values:{
        "btnspace":"Charger les taux d'occupation",
        "btnmask":"Masquer le rack",
        "legNet":"Network",
        "legServ":"Serveur",
        "legStore":"Storage",
        "legEncl":"Chassis",
        "legfree":"Libre",
        "legoccup":"Occupé",
        "formserver":"Parametres de connection",
        "formlogin":"Compte",
        "formpassword":"Mot de passe",
        "formconnect":"Connection",
        "sprackdetail":"Détail du rack",
        "sprackname":"Nom",
        "spnbu":"Nombre U",
        "spnbuocc":"Nombre U occupé(s)",
        "spenclodetail":"Détail du chassis",
        "tablerack":"Rack",
        "tableu":"U",
        "tableclasse":"Classe",
        "tabledesc":"Description",
        "tableuocc":"Hauteur",
        "tablemar":"Marque",
        "tablemodel":"Modèle",
        "tableserial":"N° Série",
        "tableor":"Organisation",
        "tablestatus":"Status",
        "msguser":"Utilisateur non autorisé.",
        "msgfailcon":"Login ou mot de passe incorrect.",
        "msgparam":"Paramètre id obligatoire."
    }
})
/*function to trad all span*/
function trad(){
    $("#btnspace").html(applyTrad("btnspace"));
    $("#btnmask").html(applyTrad("btnmask"));
    $("#legNet").html(applyTrad("legNet"));
    $("#legServ").html(applyTrad("legServ"));
    $("#legStore").html(applyTrad("legStore"));
    $("#legEncl").html(applyTrad("legEncl"));
    $("#legfree").html(applyTrad("legfree"));
    $("#legoccup").html(applyTrad("legoccup"));
    $("#formserver").html(applyTrad("formserver"));
    $("#formlogin").html(applyTrad("formlogin"));
    $("#formpassword").html(applyTrad("formpassword"));
    $("#formconnect").html(applyTrad("formconnect"));
    $("#sprackdetail").html(applyTrad("sprackdetail"));
    $("#sprackname").html(applyTrad("sprackname"));
    $("#spnbu").html(applyTrad("spnbu"));
    $("#spnbuocc").html(applyTrad("spnbuocc"));
    $("#spenclodetail").html(applyTrad("spenclodetail"));
  }
/*trad with config choice*/
function applyTrad(text){
    switch (getLanguage()){
        case "fr":
            return fr(text);
            break;
        case "en":
            return en(text);
            break;
    }
}