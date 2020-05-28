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
      //-------- Daten aus der Datenbank holen ---------/
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
                var incidents = JSON.parse(incXhr.responseText);
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
            var spiel = JSON.parse(spielXhr.responseText);
            }
        }  

        changeHTMLGame();
    }
}//ENDE Einleitung

//wird DOM geladen, tausche das HTML aus
document.addEventListener('DOMContentLoaded', changeHTMLEinleitung);

//-----------Hauptspiel-----------//
 function changeHTMLGame() {
    $.get('index.html', function (data) {
        $('body').html(data);
        
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
           var supportMitarbeiter = JSON.parse(smXhr.responseText);

           console.log(supportMitarbeiter[0]); //Test Ausgabe
           }
       }      

	}); 
}//ENDE Game

//-----------Auswertung-----------//
function changeHTMLAuswertung() {

}//ENDE Auswertung