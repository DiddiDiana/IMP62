//-----globale Variablen definieren------//
var supportMitarbeiter;
var incidents;
var spiel;
var kategorie;
var prio;
var IncFirstLevel;
var IncSecondLevel01;
var IncSecondLevel02;
var IncSecondLevel03;

//-------- Daten aus der Datenbank holen ---------//
//Support-Mitarbeiter Daten holen
var smXhr = new XMLHttpRequest();
// PHP Datei fuer alle Support-Mitarbeiter aus der Datenbank abrufen
smXhr.open("GET", "../db.php?data=support-mitarbeiter", true);
smXhr.send();
// Antwort des Servers abwarten
smXhr.onreadystatechange = function() {
// Kontroller, ob der Server geantwortet hat
    if (smXhr.readyState == 4 && smXhr.status == 200) {
    // Inhalte der JSON Datei in der supportMitarbeiter Variable speichern
    // Aufbau  supportMitarbeiter[Datensatz].mitarbeiterID, name , position, kategorieID, kategorie, faehigkeitID, faehigkeit ,level
    supportMitarbeiter = JSON.parse(smXhr.responseText);
    }
}

//Incident Daten holen
var incXhr = new XMLHttpRequest();
// PHP Datei fuer alle incidents aus der Datenbank abrufen
incXhr.open("GET", "../db.php?data=incidents", true);
incXhr.send();
// Antwort des Servers abwarten
incXhr.onreadystatechange = function() {
    // Kontroller, ob der Server geantwortet hat
    if (incXhr.readyState == 4 && incXhr.status == 200) {
        // Inhalte der JSON Datei in der Incidents Variable speichern
        // Aufbau  incident[Datensatz].incID, title , faelligkeit, fachlichefaehigkeit, erstellungsdatum, status, prioritaet ,
        // bearbeitungsstand, kundenzufriedenheit, bearbeitungsdauer, bearbeiter, kategorie 
        incidents = JSON.parse(incXhr.responseText);
        console.log(incidents);
    }
}
        
//Spiel Daten holen
var spielXhr = new XMLHttpRequest();
// PHP Datei fuer Spielinfromationen aus der Datenbank abrufen
spielXhr.open("GET", "../db.php?data=spiel", true);
spielXhr.send();
// Antwort des Servers abwarten
spielXhr.onreadystatechange = function() {
// Kontroller, ob der Server geantwortet hat
if (spielXhr.readyState == 4 && spielXhr.status == 200) {
    // Inhalte der JSON Datei in die Spiel Variable speichern
    // Aufbau  supportMitarbeiter[Datensatz].spielID, spielphase , runde, anfang, ende, inFaelligkeit, ausFaelligkeit, zaehler
    spiel = JSON.parse(spielXhr.responseText);
    }
}

//Kategorien holen
var kategorieXhr = new XMLHttpRequest();
// PHP Datei fuer Spielinfromationen aus der Datenbank abrufen
kategorieXhr.open("GET", "../db.php?data=kategorien", true);
kategorieXhr.send();
// Antwort des Servers abwarten
kategorieXhr.onreadystatechange = function() {
// Kontroller, ob der Server geantwortet hat
if (kategorieXhr.readyState == 4 && kategorieXhr.status == 200) {
    // Inhalte der JSON Datei in die Spiel Variable speichern
    kategorie = JSON.parse(kategorieXhr.responseText);
    }
}

//Prioritäten holen
var prioXhr = new XMLHttpRequest();
// PHP Datei fuer Spielinfromationen aus der Datenbank abrufen
prioXhr.open("GET", "../db.php?data=prio", true);
prioXhr.send();
// Antwort des Servers abwarten
prioXhr.onreadystatechange = function() {
// Kontroller, ob der Server geantwortet hat
if (prioXhr.readyState == 4 && prioXhr.status == 200) {
    // Inhalte der JSON Datei in die Spiel Variable speichern
    prio=this.responseText;  
    }
} 

//-----------Spiel-Einleitung-----------//
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
    //lade die index.html in den body
    $.get('index.html', function (data) {
        $('body').html(data);

        //-----------Ausgabe wechseln, wenn kein MA (=Start) gewählt ist-------------//
        var Infobereich = 0;
        if (Infobereich == 0) {
            //neuen Infobereich für den HTML-Austausch erstellen
            var newInfobereich = document.createElement("div");
            newInfobereich.id = "newInfobereich";
            newInfobereich.className ="card-body";
            
            //Hinweis, wenn keine MA-Daten angezeigt werden
            var p = document.createElement("p");
            var text = '<p>Klicken Sie auf einen Mitarbeiter im Arbeitsbereich, um dessen Daten anzuzeigen.</p>';
            p.innerHTML = text;
            //Text in neuen Infobereich
            newInfobereich.appendChild(p);
            //zu wechselndes Element festlegen & austauschen gegen neuen Infobereich
            var Ausgabebereich = document.getElementById("infobereich");
            Ausgabebereich.parentNode.replaceChild(newInfobereich, Ausgabebereich);
            Infobereich = 1; //damit die MA-Daten per Klick angezeigt werden können 
        }
        
        //--------Mitarbeiternamen anzeigen (Start)----------//
        document.getElementById("firstLevel01name").textContent = supportMitarbeiter[0].name;
        document.getElementById("secondLevel01name").textContent = supportMitarbeiter[1].name;
        document.getElementById("secondLevel02name").textContent = supportMitarbeiter[2].name;
        document.getElementById("secondLevel03name").textContent = supportMitarbeiter[3].name;

        //-------------Variablen definieren: Mitarbeiter zur Auswahl (onclick) im Arbeitsbereich-------------//
        var firstLevelMitarbeiter01 = document.getElementById("firstLevel01");
        var secondLevelMitarbeiter01 = document.getElementById("secondLevel01");
        var secondLevelMitarbeiter02 = document.getElementById("secondLevel02");
        var secondLevelMitarbeiter03 = document.getElementById("secondLevel03");

        //-------zentrale Methode zur Anzeige der MA-Daten im Infobereich-------//
        function MAdatenAnzeigen(MAdaten, incident){
            document.getElementById("MAposition").textContent = MAdaten.position + "-Support";
            document.getElementById("MAname").textContent = "Mitarbeiter: " + MAdaten.name;
            document.getElementById("MAkategorie").textContent = MAdaten.kategorie;
            document.getElementById("MAfaehigkeit01").textContent = MAdaten.faehigkeit;
            document.getElementById("MAaufgabe").textContent = incident.incID + incident.title; //fehlt noch
        } 

        //----Datenübergabe des angeklickten MAs------//
        firstLevelMitarbeiter01.onclick = function (){
            //Infobereich für Anzeige der MA-Daten laden und Daten anzeigen
            $.get('infobereich.html', function (data) {
                $('#newInfobereich').html(data);
                var mitarbeiter = supportMitarbeiter[0];
                var incident = IncFirstLevel;
                MAdatenAnzeigen(mitarbeiter, incident);
            })
        } 
        secondLevelMitarbeiter01.onclick = function (){
            $.get('infobereich.html', function (data) {
                $('#newInfobereich').html(data);
                var mitarbeiter = supportMitarbeiter[1];
                var incident = IncSecondLevel01;
                MAdatenAnzeigen(mitarbeiter, incident);
            })
        } 
        secondLevelMitarbeiter02.onclick = function (){
            $.get('infobereich.html', function (data) {
                $('#newInfobereich').html(data);
                var mitarbeiter = supportMitarbeiter[2];
                var incident = IncSecondLevel02;
                MAdatenAnzeigen(mitarbeiter, incident);
            })
        }
        secondLevelMitarbeiter03.onclick = function (){
            $.get('infobereich.html', function (data) {
                $('#newInfobereich').html(data);
                var mitarbeiter = supportMitarbeiter[3];
                var incident = IncSecondLevel03;
                MAdatenAnzeigen(mitarbeiter, incident);
            })
        } 

        //-----------------Incident 1st-Level zuweisen und Daten im Arbeitsbereich anzeigen---------------------//
        var buttonBearbeiten = document.getElementById("btn-bearbeiten");
        buttonBearbeiten.onclick = function () {
            //nimm aktive Incident-Daten entgegen
            IncFirstLevel = incidents[0]; //Test incident[0] = aktiver Incident
            document.getElementById("IncTitel").textContent = "#" + IncFirstLevel.incID + " " + IncFirstLevel.title;
            document.getElementById("Faelligkeit").textContent = "<in Bearbeitung> fällig in " + IncFirstLevel.fealligkeit + " Runden";
            document.getElementById("Bearbeitungsstand").textContent = "Bearbeitungsstand: X%";
            /* es fehlt noch
            - Berechnung Runden in Stunden
            - entferne den Incident aus dem Eingang */
        }

        //-----------------Incident 2nd-Level zuweisen und Daten im Arbeitsbereich anzeigen---------------------//
        var buttonWeiterleiten = document.getElementById("btn-weiterleiten");
        buttonWeiterleiten.onclick = function () {
            //nimm aktive Incident-Daten entgegen
            IncSecondLevel01 = incidents[1]; //Test incident[1] = aktiver Incident
            document.getElementById("Sec01IncTitel").textContent = "#" + IncSecondLevel01.incID + " " + IncSecondLevel01.title;
            document.getElementById("Sec01Faelligkeit").textContent = "<in Bearbeitung> fällig in " + IncSecondLevel01.fealligkeit + " Runden";
            document.getElementById("Sec01Bearbeitungsstand").textContent = "Bearbeitungsstand: X%";

            IncSecondLevel02 = incidents[2]; //Test incident[2] = aktiver Incident
            document.getElementById("Sec02IncTitel").textContent = "#" + IncSecondLevel02.incID + " " + IncSecondLevel01.title;
            document.getElementById("Sec02Faelligkeit").textContent = "<in Bearbeitung> fällig in " + IncSecondLevel02.fealligkeit + " Runden";
            document.getElementById("Sec02Bearbeitungsstand").textContent = "Bearbeitungsstand: X%";

            IncSecondLevel03 = incidents[3]; //Test incident[3] = aktiver Incident
            document.getElementById("Sec03IncTitel").textContent = "#" + IncSecondLevel03.incID + " " + IncSecondLevel01.title;
            document.getElementById("Sec03Faelligkeit").textContent = "<in Bearbeitung> fällig in " + IncSecondLevel03.fealligkeit + " Runden";
            document.getElementById("Sec03Bearbeitungsstand").textContent = "Bearbeitungsstand: X%";

            /* es fehlt noch
            - wenn Button geklickt, dann vergleiche Kategorie Inc mit MA-Kategori
            - weise Inc an den betroffenen MA zu (nimm IncSecondLevelXX (XX ist je nach MA 01, 02, 03)) 
            - entferne den Incident aus dem Eingang */
        }
    })
    
}//ENDE Game

//-----------Auswertung-----------//
function changeHTMLAuswertung() {

}//ENDE Auswertung

