//-----globale Variablen definieren------//
var supportMitarbeiter;     //alle Daten aller Mitarbeiter
var incidents;              //alle Daten aller Incident
var spiel;                  
var kategorie;
var prio;

var IncFirstLevel;          //1st-Level zugewiesener Incident
var IncSecondLevel01;       //2nd-Level zugewiesener Incident
var IncSecondLevel02;       //...
var IncSecondLevel03;       //...

var Incaktuell; //speichert aktuell gewählten Incident des Incidentbereichs
var IncFirstBearbeitung = 0; //speichert Bearbeitung des First-Level (zu Beginn leer)
var IncSecBearbeitung01 = 0; //speichert Bearbeitung des Second-Level (zu Beginn leer)
var IncSecBearbeitung02 = 0; //speichert Bearbeitung des Second-Level (zu Beginn leer)
var IncSecBearbeitung03 = 0; //speichert Bearbeitung des Second-Level (zu Beginn leer)

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

//Kategorie Daten holen
var katXhr = new XMLHttpRequest();
// PHP Datei fuer Spielinfromationen aus der Datenbank abrufen
katXhr.open("GET", "../db.php?data=kategorie", true);
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
prioXhr.open("GET", "../db.php?data=prio", true);
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

        //-----------Ausgabe wechseln, wenn kein MA zB beim Start zur Anzeige gewählt ist-------------//
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
            document.getElementById("MAfaehigkeit01").textContent = MAdaten.faehigkeit1;
            //es fehlen weitere Fähigkeiten anzeigen
            document.getElementById("MAaufgabe").textContent = "#" + incident.incID + " " + incident.title;
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

        //-----------------Incident 1st-Level zuweisen und Daten im Arbeitsbereich anzeigen---------------------//
        var buttonBearbeiten = document.getElementById("btn-bearbeiten"); 
        buttonBearbeiten.onclick = function () {
            if (IncFirstBearbeitung == 0){
                //nimm aktive Incident-Daten entgegen
                IncFirstLevel = Incaktuell;
                document.getElementById("IncTitel").textContent = "#" + IncFirstLevel.incID + " " + IncFirstLevel.title;
                document.getElementById("Faelligkeit").textContent = "<in Bearbeitung> fällig in " + IncFirstLevel.faelligkeit + " Runden";
                document.getElementById("Bearbeitungsstand").textContent = "Bearbeitungsstand: X%";
                IncFirstBearbeitung = 1;
            }else{
                alert ("Der Mitarbeiter bearbeitet bereits einen Incident."); //Ablehnung, wenn der Mitarbeiter bereits einen Incident bearbeitet
            }
        }

        //-----------------Incident 2nd-Level zuweisen und Daten im Arbeitsbereich anzeigen---------------------//
        var buttonWeiterleiten = document.getElementById("btn-weiterleiten");
        buttonWeiterleiten.onclick = function () {
            //--------Vergleich IncidentKategorie mit MA-Kategorie als IDs----------//
            //-----------Weise Incident dem MA zu, wenn die Kategorien identisch sind und er noch keinen Incident bearbeitet-------------//
            if (incDetKat.value == supportMitarbeiter[1].kategorieID){
                if (IncSecBearbeitung01 == 0){
                    //nimm aktive Incident-Daten entgegen
                    IncSecondLevel01 = Incaktuell;
                    document.getElementById("Sec01IncTitel").textContent = "#" + IncSecondLevel01.incID + " " + IncSecondLevel01.title;
                    document.getElementById("Sec01Faelligkeit").textContent = "<in Bearbeitung> fällig in " + IncSecondLevel01.faelligkeit + " Runden";
                    document.getElementById("Sec01Bearbeitungsstand").textContent = "Bearbeitungsstand: X%";
                    IncSecBearbeitung01 =1;
                }else{
                    alert ("Der Mitarbeiter bearbeitet bereits einen Incident."); //Ablehnung, wenn der Mitarbeiter bereits einen Incident bearbeitet
                }
            }else if (incDetKat.value == supportMitarbeiter[2].kategorieID){
                if (IncSecBearbeitung02 == 0){
                    IncSecondLevel02 = Incaktuell; 
                    document.getElementById("Sec02IncTitel").textContent = "#" + IncSecondLevel02.incID + " " + IncSecondLevel02.title;
                    document.getElementById("Sec02Faelligkeit").textContent = "<in Bearbeitung> fällig in " + IncSecondLevel02.faelligkeit + " Runden";
                    document.getElementById("Sec02Bearbeitungsstand").textContent = "Bearbeitungsstand: X%";
                    IncSecBearbeitung02 =1;
                }else{
                    alert ("Der Mitarbeiter bearbeitet bereits einen Incident."); //Ablehnung, wenn der Mitarbeiter bereits einen Incident bearbeitet
                }
            }else if (incDetKat.value == supportMitarbeiter[3].kategorieID){
                if (IncSecBearbeitung03 == 0){
                    IncSecondLevel03 = Incaktuell; 
                    document.getElementById("Sec03IncTitel").textContent = "#" + IncSecondLevel03.incID + " " + IncSecondLevel03.title;
                    document.getElementById("Sec03Faelligkeit").textContent = "<in Bearbeitung> fällig in " + IncSecondLevel03.faelligkeit + " Runden";
                    document.getElementById("Sec03Bearbeitungsstand").textContent = "Bearbeitungsstand: X%";
                    IncSecBearbeitung03 =1;
                }else{
                    alert ("Der Mitarbeiter bearbeitet bereits einen Incident."); //Ablehnung, wenn der Mitarbeiter bereits einen Incident bearbeitet
                }
            }else{
                alert("Kategorie stimmt mit MA nicht überein.")
            }

            /* es fehlt noch 
            - entferne den Incident aus dem Eingang */
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
                             //var incident = incidents[this.id];
                             IncdatenAnzeigen(incidents[this.id]);
                             Incaktuell = incidents[this.id];
                             //console.log(incidents[this.id]);//aktueller Incident
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

