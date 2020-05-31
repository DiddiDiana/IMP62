//-------- Daten aus der Datenbank holen ---------/
//globale Variablen definieren
var supportMitarbeiter;
var incidents;
var spiel;
var kategorien;
var prio;

//Support-Mitarbeiter Daten holen
var smXhr = new XMLHttpRequest();
// PHP Datei fuer alle Support-Mitarbeiter aus der Datenbank abrufen
smXhr.open("GET", "../php/db.php?data=support-mitarbeiter", true);
smXhr.send();
// Antwort des Servers abwarten
smXhr.onreadystatechange = function() {
// Kontroller, ob der Server geantwortet hat
    if (smXhr.readyState == 4 && smXhr.status == 200) {
    // Inhalte der JSON Datei in der supportMitarbeiter Variable speichern
    // Aufbau  supportMitarbeiter[Datensatz].mitarbeiterID, name , position, kategorieID, kategorie, faehigkeitID, faehigkeit ,level
    supportMitarbeiter = JSON.parse(smXhr.responseText);
    //console.log(supportMitarbeiter); //Test Ausgabe
    }
}

//Incident Daten holen
var incXhr = new XMLHttpRequest();
// PHP Datei fuer alle incidents aus der Datenbank abrufen
incXhr.open("GET", "../php/db.php?data=incidents", true);
incXhr.send();
// Antwort des Servers abwarten
incXhr.onreadystatechange = function() {
    // Kontroller, ob der Server geantwortet hat
    if (incXhr.readyState == 4 && incXhr.status == 200) {
        // Inhalte der JSON Datei in der Incidents Variable speichern
        // Aufbau  incident[Datensatz].incID, title , faelligkeit, fachlichefaehigkeit, erstellungsdatum, status, prioritaet ,
        // bearbeitungsstand, kundenzufriedenheit, bearbeitungsdauer, bearbeiter, kategorie 
        incidents = JSON.parse(incXhr.responseText);
    }
}
        
//Spiel Daten holen
var spielXhr = new XMLHttpRequest();
// PHP Datei fuer Spielinfromationen aus der Datenbank abrufen
spielXhr.open("GET", "../php/db.php?data=spiel", true);
spielXhr.send();
// Antwort des Servers abwarten
spielXhr.onreadystatechange = function() {
// Kontroller, ob der Server geantwortet hat
if (spielXhr.readyState == 4 && spielXhr.status == 200) {
    // Inhalte der JSON Datei in die Spiel Variable speichern
    // Aufbau  spiel[Datensatz].spielID, spielphase , runde, anfang, ende, inFaelligkeit, ausFaelligkeit, zaehler
    spiel = JSON.parse(spielXhr.responseText);
    }
}
//Kategorie Daten holen
var katXhr = new XMLHttpRequest();
// PHP Datei fuer Spielinfromationen aus der Datenbank abrufen
katXhr.open("GET", "../php/db.php?data=kategorie", true);
katXhr.send();
// Antwort des Servers abwarten
katXhr.onreadystatechange = function() {
// Kontroller, ob der Server geantwortet hat
if (katXhr.readyState == 4 && katXhr.status == 200) {
    // Inhalte der JSON Datei in die Kategorie Variable speichern
    // Aufbau  supportMitarbeiter[Datensatz].kategorieID, name
    kategorien = JSON.parse(katXhr.responseText);
    }
}

//Prioritäten holen
var prioXhr = new XMLHttpRequest();
// PHP Datei fuer Spielinfromationen aus der Datenbank abrufen
prioXhr.open("GET", "../php/db.php?data=prio", true);
prioXhr.send();
// Antwort des Servers abwarten
prioXhr.onreadystatechange = function() {
// Kontroller, ob der Server geantwortet hat
if (prioXhr.readyState == 4 && prioXhr.status == 200) {
    //--- Untere Angebe gibt den inhalt nur als string zurück
    //prio=this.responseText
    // Inhalte der JSON Datei in die Spiel Variable speichern
    prio = JSON.parse(prioXhr.responseText);
    }
}

//-----------Einleitung-----------//
function changeHTMLEinleitung() {
    //----------erstelle Elemente------------//	
    //erstelle Body, da der aktuelle ersetzt wird
    var newMain = document.createElement("div");
    logo = new Image; //erzeuge Image inkl. Größe
    var buttonGame = document.createElement("input");
    var footer = document.createElement("footer");
    var span = document.createElement("span");

    //------------Klassen--------------//
    logo.className = "mb-4";
    buttonGame.className = "btn btn-lg btn-block";
    footer.className = "footer text-center fixed-bottom p-3";

    //---------weitere Eigenschaften & Bezeichnungen------------//
    newMain.id = "newMain";
    logo.src = "/img/Logo_Planspiel.png";
    buttonGame.type = "button";
    buttonGame.value = "Planspiel starten";
    span.textContent = "Made by Diana Quaschni and Benjamin Lehnert © 2020";

    //----------Zuweisungen für Anzeige-----------// 
    newMain.appendChild(logo);
    newMain.appendChild(buttonGame);
    footer.appendChild(span);
    newMain.appendChild(footer);
    //lege Ausgabebereich fest und zeige neuen Main-Inhalt dafür an
	var Ausgabebereich = document.getElementById("main");
    Ausgabebereich.parentNode.replaceChild(newMain, Ausgabebereich);
    
    buttonGame.onclick = function () {
        changeHTMLGame();
    }
}//ENDE Einleitung

//wird DOM geladen, tausche das HTML aus
document.addEventListener('DOMContentLoaded', changeHTMLEinleitung);

//-----------Hauptspiel-----------//
function changeHTMLGame() {
    $.get('index.html', function (data) {
        $('body').html(data);
        //console.log(incidents); //Test Ausgabe 
        //-------------Methode um die Auswahlbox "Kategorie im Incidentbereich" ---------//
        // ------------mit den Werten aus der Datenbank zubefüllen. ----------------------//
        var incDetKat = document.getElementById("incDetKat");
        kategorien.forEach(element => {
            var katOpt = document.createElement("option");
            katOpt.text = element.name;
            katOpt.value = element.kategorieID;
            incDetKat.options[element.kategorieID] = katOpt;
        });

        //-------------Methode um die Auswahlbox "Prioritaet im Incidentbereich" ---------//
        // ------------mit den Werten aus der Datenbank zubefüllen. ----------------------//
        var incDetPrio = document.getElementById("incDetPrio");
        for(pc=0; pc<Object.keys(prio).length - 1;pc++){
        //prio.forEach(element => {
            var prioOpt = document.createElement("option");
            prioOpt.text = prio[pc];
            prioOpt.value = prio[pc];
            incDetPrio.options[pc] = prioOpt;
        }

        //-------------Mitarbeiter zur Auswahl im Arbeitsbereich-------------//
        var firstLevelMitarbeiter01 = document.getElementById("firstLevel01");
        var secondLevelMitarbeiter01 = document.getElementById("secondLevel01");
        var secondLevelMitarbeiter02 = document.getElementById("secondLevel02");
        var secondLevelMitarbeiter03 = document.getElementById("secondLevel03");

        //-------eine zentrale Methode wäre sinnvoll -> funktioniert nicht-------//
         function MAdatenAnzeigen(daten){
            document.getElementById("MAposition").textContent = daten.position + "-Support";
            document.getElementById("MAname").textContent = "Mitarbeiter: " + daten.name;
            
        } 
        firstLevelMitarbeiter01.onclick = function (){
           var mitarbeiter = supportMitarbeiter[0];
           MAdatenAnzeigen(mitarbeiter);
        } 
        secondLevelMitarbeiter01.onclick = function (){
            var mitarbeiter = supportMitarbeiter[1];
            MAdatenAnzeigen(mitarbeiter);
        } 
        secondLevelMitarbeiter02.onclick = function (){
            var mitarbeiter = supportMitarbeiter[2];
            MAdatenAnzeigen(mitarbeiter);
        }
        secondLevelMitarbeiter03.onclick = function (){
            var mitarbeiter = supportMitarbeiter[3];
            MAdatenAnzeigen(mitarbeiter);
        }

        //------------Neuankommende Incident ---------------------------//
        var inbox = document.getElementById("inBox");
        //---------------- Funktion um eine Zufallszahl zu generieren -------//
        function rand (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        //-------------Methode um Incidentdaten anzuzeigen ------------//
        function IncdatenAnzeigen(daten){
            document.getElementById("incDetTitel").innerText = "#" + daten.incID + " \n "+ daten.title;
            document.getElementById("incDetThema").innerText = daten.thema;
            document.getElementById("incDetFaell").innerText = "fällig in " + daten.faelligkeit + " Stunden ";
            document.getElementById("incDetPrio").value  = daten.prioritaet;
            document.getElementById("incDetKat").value  = daten.kategorie;
            document.getElementById("incDetBea").innerText = daten.bearbeiter;
        }

        //---------Methode für neu einzutreffende Incidents in die InBox --- //
        var incMax = rand(1,4); //-------- bis zu maximal 4 neue Incidents ----//
        var incInBox = false;
        if(inbox.childNodes.length <= 4){ //----- In der Inbox sollen höchstens 4 Incidents sin ---- /
            var incCount = inbox.childNodes.length;
            for(var x=0; x<Object.keys(incidents).length;x++){ //--- Schleife die alle Incidents kontrolliert --- //
                if(incidents[x].status == "neu"){   //--- Kontrolliert, ob der aktuelle Incident noch auf status neu steht---//
                    for(y=0; y < inbox.childNodes.length; y++){ //--- Geht alle vorhandenen Incidents in der Inbox durch ---- //
                        if(inbox.childNodes[y].value == incidents[x].incID){ /// Vergleich, ob der aktuelle Incidents bereits in der Inbox ist
                            incInBox = true;
                        }
                    }
                    if( incInBox == false){

                    //--------- ein Incident besteh aus einem Div und einem IMG ----/
                        var newIncident = document.createElement("div");
                        var incidentImg = document.createElement("img");
                        //--------- Eigenschaften hinzufügen----//
                        newIncident.id = x;
                        newIncident.value = incidents[x].incID;
                        newIncident.style.float = "left";
                        incidentImg.src = "img/icons8-dokument-64.png";
                        newIncident.appendChild(incidentImg);
                        //------Funktion zum inhalt der Incidents hinzufügen ---//
                        newIncident.onclick = function () {
                            var incident = incidents[this.id];
                            IncdatenAnzeigen(incidents[this.id]);
                        }
                        inbox.appendChild(newIncident);
                        incInBox = false;
                        incCount++;
                        if(incCount > incMax){
                            x=Object.keys(incidents).length;
                        }
                    }
                }
            }
        }

    })

}//ENDE Game

//-----------Auswertung-----------//
function changeHTMLAuswertung() {

}//ENDE Auswertung

