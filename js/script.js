//-----globale Variablen definieren------//
var supportMitarbeiter;     //alle Daten aller Mitarbeiter
var incidents;              //alle Daten aller Incident
var spiel;                  
var kategorie;
var prio;
var runde = {startTime: 0, elapsedTime: 0};
var rundNumb = 1;
//var runden = [];

var Incaktuell; //speichert aktuell gewählten Incident des Incidentbereichs
var IncFirstBearbeitung00 = 0; //speichert Bearbeitung des First-Level (zu Beginn leer)
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
        // Aufbau  spiel[Datensatz].spielID, spielphase , runde, anfang, ende, inFaelligkeit, ausFaelligkeit, zaehler
        spiel = JSON.parse(spielXhr.responseText);
        spiel[0].anfang = Date.now();
        spiel[0].inFaelligkeit = 0;
        spiel[0].ausFaelligkeit = 0;
        ///----Spiel Objekt um seine Runden erweitern----//
        if(typeof spiel[0].runden === 'undefined'){
            spiel[0].runden = new Array();
            for (r=1; r<=11;r++){
                spiel[0].runden[r] = runde;
            }
        }
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
    // Aufbau  kategorie[Datensatz].kategorieID, name
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
        newIncInbox();
        timer();
        
        //----- F5 abpassen -----------------//
        document.addEventListener('keydown', function(event){
            if(event.keyCode == 116){
                logout();
            }
          });

        // ------ Beenden Button erweitern -----------//  
        document.getElementById("logout").onclick = function (){
            logout();
        }
          
        ///----------------- Spiel beenden --------------///
        function logout() {
            var check = confirm('Wollen Sie das Spiel beenden?'); 
            if (check == true) {
                changeHTMLAuswertung();
            }
          }
        /// Timer Funktion für die Spielrundenberechnung----/
        function timer() {
            // Aufbau  spiel[Datensatz].spielID, spielphase , runde, anfang, ende, inFaelligkeit, ausFaelligkeit, zaehler
            //var startTime = Date.now();
            var interval = setInterval(function() {
            if(rundNumb == 1 && spiel[0].runden[rundNumb].startTime == 0){
                spiel[0].runden[rundNumb].startTime = spiel[0].anfang;
            }

            if(document.getElementById("inBox").childNodes.length <= rand(1,2) && (spiel[0].runden[rundNumb].elapsedTime / 10000).toFixed(0) % 2 == 1 ){
                newIncInbox();
            }
            spiel[0].runden[rundNumb].elapsedTime = Date.now() - spiel[0].runden[rundNumb].startTime;
            //var elapsedTime = Date.now() - startTime;
                if(spiel[0].runden[rundNumb].elapsedTime >= 235000){
                    rundNumb++;
                    spiel[0].runde = rundNumb;
                    spiel[0].runden[rundNumb].startTime = Date.now();
                    document.getElementById("runde").innerHTML = "Runde " + rundNumb;
                    document.getElementById('timer').innerHTML = "<i class='far fa-clock' ></i> 0 Std.";
                    newIncInbox();
                }else{
                    document.getElementById('timer').innerHTML =  "<i class='far fa-clock' ></i> " + (spiel[0].runden[rundNumb].elapsedTime / 10000).toFixed(0) + " Std.";
                    updateFaelligkeit();                             
                }
            }, 10000);

        }
   

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

         //--------Mitarbeiternamen im Arbeitsbereich (Kachel) anzeigen (Start)----------//
         for (f=0; f<supportMitarbeiter.length; f++){
            var htmlElement = "Level0" + f + "name";
            document.getElementById(htmlElement).textContent = supportMitarbeiter[f].name;
        }

        //------Übergabe Mitarbeiter zur Datenanzeige der im Arbeitsbereich angeklickt wurde-----//
        for (f=0; f<supportMitarbeiter.length; f++) (function(f){
            var htmlElement = "Level0" + f;
            document.getElementById(htmlElement).onclick =function(){
                $.get('infobereich.html', function (data) {
                    $('#newInfobereich').html(data);
                    var mitarbeiter = supportMitarbeiter[f];;
                    MAdatenAnzeigen(mitarbeiter);
                })
            }
        })(f);

        //-------Methode zur Anzeige der MA-Daten im Infobereich-------//
        function MAdatenAnzeigen(MAdaten) {
            document.getElementById("MAposition").textContent = MAdaten.position + "-Support";
            document.getElementById("MAname").textContent = "Mitarbeiter: " + MAdaten.name;
            document.getElementById("MAkategorie").textContent = MAdaten.kategorie;
            //alle Fähigkeiten als Liste ausgeben
            for (f = 1; f <= Object.keys(MAdaten).length; f++) {
                var MAfaehigkeit = eval("MAdaten.faehigkeit" + f);
                var MAlevel = eval("MAdaten.level" + f);
                if (MAfaehigkeit != undefined) {
                    //erstelle <li> Element je nach Anzahl der Fähigkeiten
                    var listelement = document.createElement("li");
                    listelement.textContent = MAfaehigkeit + " (" + MAlevel + ")";
                    var Ausgabebereich = document.getElementById("MAfaehigkeitenList");
                    Ausgabebereich.appendChild(listelement);
                }
            }
            //zu Beginn ist keine Aufgabe zugewiesen
            document.getElementById("MAaufgabe").textContent = "Es ist keine Aufgabe zugewiesen."
            //zugeordnete Aufgabe anzeigen
            for (f = 1; f <= Object.keys(incidents).length; f++) {
                if (MAdaten.name == MAdaten.zugewiesenerIncident.bearbeiter) {
                    document.getElementById("MAaufgabe").textContent = "#" + MAdaten.zugewiesenerIncident.incID + " \n " + MAdaten.zugewiesenerIncident.title;
                }else{
                    document.getElementById("MAaufgabe").textContent = "Es ist keine Aufgabe zugewiesen."
                }
            }
        } 

        //---------------- Funktion um eine Zufallszahl zu generieren -------//
        function rand (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        //-------------Methode um Incidentdaten anzuzeigen ------------//
        function IncdatenAnzeigen(daten){
			if(document.getElementById("noInc") !== null){
                document.getElementById("incDetHead").removeChild(document.getElementById("noInc"));
                document.getElementById("incDetForm").style.visibility="visible";
                document.getElementById("btn-bearbeiten").style.visibility="visible";
                document.getElementById("btn-weiterleiten").style.visibility="visible";
            }
            document.getElementById("incDetTitel").innerText = "#" + daten.incID + " \n "+ daten.title;
            document.getElementById("incDetThema").innerText = daten.thema;
            document.getElementById("incDetFaell").innerText = "fällig in " + daten.faelligkeit + " Std. ";
            document.getElementById("incDetFaell").dataset.incID = daten.incID;   
            document.getElementById("incDetPrio").value  = daten.prioritaet;
            document.getElementById("incDetKat").value  = daten.kategorie;
            //document.getElementById("incDetBea").innerText = daten.bearbeiter;
        }

        ///-----------------------zentrale Function um Incidentdaten zu ändern -----//
        function IncDatenAendern(incID,erstellungsdatum,status, prioritaet,bearbeitungsstand,kundenzufriedenheit,bearbeitungsdauer, bearbeiter, kategorie){
            for(i=0;i<Object.keys(incidents).length;i++){
                if(incidents[i].incID == incID){
                    if(erstellungsdatum != null ){
                        incidents[i].erstellungsdatum = erstellungsdatum;
                    }
                    if(status != null ){

                        incidents[i].status = status;
                    }
                    if(prioritaet != null){
                        incidents[i].prioritaet = prioritaet;
                    }
                    if(bearbeitungsstand != null){
                        incidents[i].bearbeitungsstand = bearbeitungsstand;
                    }
                    if(kundenzufriedenheit != null){
                        incidents[i].kundenzufriedenheit = kundenzufriedenheit;
                    }
                    if(bearbeitungsdauer != null){
                        incidents[i].bearbeitungsdauer = bearbeitungsdauer;
                    }
                    if(bearbeiter != null){
                        incidents[i].bearbeiter = bearbeiter;
                    }
                    if(kategorie != null){

                        incidents[i].kategorie = kategorie;
                    }
                    i=Object.keys(incidents).length;
                }
            }
        }

        ///--------------------- Function um Incidents aus der InBox zu entfernen -----------//
        function IncRemoveInbox(incID){
                var noInc = document.createElement("p");
                document.getElementById("inBox").removeChild(document.getElementById(incID));
                document.getElementById("incDetFaell").dataset.incID = "";
                document.getElementById("incDetTitel").innerHTML = "";
                noInc.id = "noInc";
                noInc.innerHTML = "Aktuell ist kein Incident gewählt.";
                document.getElementById("incDetHead").appendChild(noInc);
                document.getElementById("noInc").style.visibility="visible";
                document.getElementById("incDetForm").style.visibility="hidden";
                document.getElementById("btn-bearbeiten").style.visibility="hidden";
                document.getElementById("btn-weiterleiten").style.visibility="hidden";
            //}
        }
        // //--------Logout (manuell)--------//
        // var ButtonLogout = document.getElementById("logout");
        // ButtonLogout.onclick = function () {
        //     //es fehlt eine Abfrage "Wollen Sie wirklich beenden?"
        //     changeHTMLAuswertung();
        // }

        //-----------------Incident 1st-Level zuweisen und Daten im Arbeitsbereich anzeigen---------------------//
        var buttonBearbeiten = document.getElementById("btn-bearbeiten"); 
        buttonBearbeiten.onclick = function () { //nur 1st-Level zuweisen
            for (f = 0; f <= supportMitarbeiter.length; f++) {
                if(supportMitarbeiter[f] !== undefined){
                    if (supportMitarbeiter[f].position == "1st-Level") {
                        //--------Vergleich IncidentKategorie mit MA-Kategorie als IDs----------//
                    //  if (incDetKat.value == supportMitarbeiter[f].kategorieID) {
                            var IncFirstBearbeitung = eval("IncFirstBearbeitung0" + f);
                            if (IncFirstBearbeitung == 0) {//wenn MA noch keinen Incident bearbeitet
                                //HTML-Elemente
                                var IncTitle = document.getElementById("First0" + f + "IncTitel");
                                var IncFaelligkeit = document.getElementById("First0" + f + "Faelligkeit");
                                var IncBearbeitungsstand = document.getElementById("First0" + f + "Bearbeitungsstand");
                                //html-Elemente zur Anzeige übergeben
                                supportMitarbeiter[f].zugewiesenerIncident = Incaktuell;//speichere aktuellen Incident für diesen MA
                                IncBearbeitungAnzeige(supportMitarbeiter[f].zugewiesenerIncident, IncTitle, IncFaelligkeit, IncBearbeitungsstand);
                                IncBearbeitungSetzen(f);
                                IncBearbeitung(f, supportMitarbeiter[f].zugewiesenerIncident);
                                IncDatenAendern(Incaktuell.incID, null, "in Bearbeitung", document.getElementById("incDetPrio").value, null, null, Incaktuell.bearbeitungsdauer, supportMitarbeiter[f].name, document.getElementById("incDetKat").value);
                                IncRemoveInbox(Incaktuell.incID);
                            } else {
                                alert("Der Mitarbeiter bearbeitet bereits einen Incident."); //Ablehnung, wenn der Mitarbeiter bereits einen Incident bearbeitet
                            }
                        //}
                    }
                }
            }
        }

        //-----------------Incident 2nd-Level zuweisen und Daten im Arbeitsbereich anzeigen---------------------//
        var buttonWeiterleiten = document.getElementById("btn-weiterleiten");
        buttonWeiterleiten.onclick = function () {
            for (f = 0; f <= supportMitarbeiter.length; f++) {
                if(supportMitarbeiter[f] !== undefined){
                    if (supportMitarbeiter[f].position == "2nd-Level") {
                        //--------Vergleich IncidentKategorie mit MA-Kategorie als IDs----------//
                        if (incDetKat.value == supportMitarbeiter[f].kategorieID) {
                            var IncSecBearbeitung = eval("IncSecBearbeitung0" + f);
                            if (IncSecBearbeitung == 0) {//wenn MA noch keinen Incident bearbeitet
                                //HTML-Elemente
                                var IncTitle = document.getElementById("Sec0" + f + "IncTitel");
                                var IncFaelligkeit = document.getElementById("Sec0" + f + "Faelligkeit");
                                var IncBearbeitungsstand = document.getElementById("Sec0" + f + "Bearbeitungsstand");
                                //html-Elemente zur Anzeige übergeben
                                supportMitarbeiter[f].zugewiesenerIncident = Incaktuell;//speichere aktuellen Incident für diesen MA
                                IncBearbeitungAnzeige(supportMitarbeiter[f].zugewiesenerIncident, IncTitle, IncFaelligkeit, IncBearbeitungsstand);
                                IncBearbeitungSetzen(f);
                                IncBearbeitung(f, supportMitarbeiter[f].zugewiesenerIncident);
                                IncDatenAendern(Incaktuell.incID, null, "in Bearbeitung", document.getElementById("incDetPrio").value, null, null, Incaktuell.bearbeitungsdauer, supportMitarbeiter[f].name, document.getElementById("incDetKat").value);
                                IncRemoveInbox(Incaktuell.incID);
                            } else {
                                alert("Der Mitarbeiter bearbeitet bereits einen Incident."); //Ablehnung, wenn der Mitarbeiter bereits einen Incident bearbeitet
                            }
                        }
                    }
                }
            }

        }//ENDE Weiterleiten
                    //Bearbeitung setzen, da ein Mitarbeiter nur einen Incident bearbeiten darf
                    function IncBearbeitungSetzen(f){
                        if(f==0){
                            IncFirstBearbeitung00 = 1;
                        }else if (f==1){
                            IncSecBearbeitung01 = 1;
                        }else if(f==2){
                            IncSecBearbeitung02 = 1;
                        }else if(f==3){
                            IncSecBearbeitung03 = 1;
                        }
                    }
        
                    //Anzeige Incident in Bearbeitung am Mitarbeiter
                    function IncBearbeitungAnzeige(Inc, IncTitle, IncFaelligkeit, IncBearbeitungsstand){
                    IncTitle.textContent = "#" + Inc.incID + " " + Inc.title;
                    IncFaelligkeit.textContent = "<in Bearbeitung> fällig in " + Inc.faelligkeit + " Std.";
                    IncBearbeitungsstand.textContent = "Bearbeitungsstand: 0%";
                    }
        
        // ------------------- Faelligkeit aktualisieren ----------//
        function updateFaelligkeit(){
            for(var x=0; x<Object.keys(incidents).length;x++){
                if(incidents[x].status == "neu"){   //--- Kontrolliert, ob der aktuelle Incident noch auf status neu steht---//
                    for(y=0; y < document.getElementById("inBox").childNodes.length; y++){ //--- Geht alle vorhandenen Incidents in der Inbox durch ---- //
                        if(document.getElementById("inBox").childNodes[y].id == incidents[x].incID){ /// Vergleich, ob der aktuelle Incidents bereits in der Inbox ist
                            incidents[x].faelligkeit = incidents[x].faelligkeit - 1;
                            if(incidents[x].incID == document.getElementById("incDetFaell").dataset.incID ){
                                document.getElementById("incDetFaell").innerText = "fällig in " + incidents[x].faelligkeit + " Std. ";   
                            }
                        }
                    }
                }else if(incidents[x].status == "in Bearbeitung"){
                    incidents[x].faelligkeit = incidents[x].faelligkeit - 1;
                    for(f = 0; f <= supportMitarbeiter.length; f++){
                        if(supportMitarbeiter[f] !== undefined && supportMitarbeiter[f].zugewiesenerIncident !== undefined){
                            if (supportMitarbeiter[f].position == "1st-Level"){
                                if(supportMitarbeiter[f].zugewiesenerIncident.incID == incidents[x].incID){
                                    document.getElementById("First0" + f + "Faelligkeit").textContent = "<in Bearbeitung> fällig in " + incidents[x].faelligkeit + " Std.";
                                }
                            }else{
                                if(supportMitarbeiter[f].zugewiesenerIncident.incID == incidents[x].incID){
                                    document.getElementById("Sec0" + f + "Faelligkeit").textContent = "<in Bearbeitung> fällig in " + incidents[x].faelligkeit + " Std.";;
                                }
                            }
                        }
                        
                    }
                }
            }
            
        } 

        //-------- Methode um die Faelligkeit zu checken und zu speichern.  ------------------------//
        function checkFaelligkeit(SMA,mitNumb){
            var endTime = Date.now();
            var faellig;
            var check = false;
            incidents.forEach(element => {
                if(element.incID == SMA.zugewiesenerIncident.incID){
                    if(element.faelligkeit >= 0){
                        spiel[0].inFaelligkeit = spiel[0].inFaelligkeit + 1;
                        document.getElementById("good").textContent = spiel[0].inFaelligkeit;
                    }else{
                        spiel[0].ausFaelligkeit = spiel[0].ausFaelligkeit + 1;
                        document.getElementById("bad").textContent = spiel[0].ausFaelligkeit;
                    }
                    check = true;

                    if(SMA.position == "1st-Level" ){
                        document.getElementById("First0"+mitNumb+"IncTitel").textContent = "";
                        document.getElementById("First0"+mitNumb+"Faelligkeit").textContent = "";
                        document.getElementById("First0"+mitNumb+"Bearbeitungsstand").textContent = "";
                        window["IncFirstBearbeitung0"+mitNumb] = 0;
                    }else{
                        document.getElementById("Sec0"+mitNumb+"IncTitel").textContent = "";
                        document.getElementById("Sec0"+mitNumb+"Faelligkeit").textContent = "";
                        document.getElementById("Sec0"+mitNumb+"Bearbeitungsstand").textContent = "";
                        window["IncSecBearbeitung0"+mitNumb] = 0;
                    }
                    
                }
                IncDatenAendern(Incaktuell.incID,null,"erledigt",null ,null,null,null,null,null);
            });
            if(check == true){
                    delete SMA.zugewiesenerIncident; 
                check = false;  
            }
            
        }

        //-----Bearbeitung berechnen-----//
        function IncBearbeitung(mitarbeiter, MAincident){
            var start = Date.now();      
            function BerechneBearbeitung() {           
                var diff = Date.now() - start;
                //var IncBearbeitungsdauer = Incaktuell.bearbeitungsdauer * 10000; //in ms -> Speicherung in DB als InGame Stunden (1h = 10sek = 10000ms)
                if (mitarbeiter == 0){
                    var korrWert = BerechneFaehigkeit(supportMitarbeiter[0], MAincident); //korrigierter Wert
                    supportMitarbeiter[0].bearbeitungsstand = prozent_runden((diff/korrWert)*100);
                    document.getElementById("First00Bearbeitungsstand").textContent = "Bearbeitungsstand: " + supportMitarbeiter[0].bearbeitungsstand; //Ausgabe am First-Level
                }else if (mitarbeiter == 1){
                    var korrWert = BerechneFaehigkeit(supportMitarbeiter[1],MAincident); //korrigierter Wert
                    supportMitarbeiter[1].bearbeitungsstand = prozent_runden((diff/korrWert)*100);
                    document.getElementById("Sec01Bearbeitungsstand").textContent = "Bearbeitungsstand: " + supportMitarbeiter[1].bearbeitungsstand; //Ausgabe am Second-Level
                }else if (mitarbeiter == 2){
                    var korrWert = BerechneFaehigkeit(supportMitarbeiter[2], MAincident); //korrigierter Wert
                    supportMitarbeiter[2].bearbeitungsstand = prozent_runden((diff/korrWert)*100);
                    document.getElementById("Sec02Bearbeitungsstand").textContent = "Bearbeitungsstand: " + supportMitarbeiter[2].bearbeitungsstand; //Ausgabe am Second-Level
                }else if (mitarbeiter == 3){
                    var korrWert = BerechneFaehigkeit(supportMitarbeiter[3], MAincident); //korrigierter Wert
                    supportMitarbeiter[3].bearbeitungsstand = prozent_runden((diff/korrWert)*100);
                    document.getElementById("Sec03Bearbeitungsstand").textContent = "Bearbeitungsstand: " + supportMitarbeiter[3].bearbeitungsstand; //Ausgabe am Second-Level
                }
                if (diff >= korrWert){
                    checkFaelligkeit(supportMitarbeiter[mitarbeiter], mitarbeiter);
                    clearInterval(timerBearbeitung);
                    document.getElementById("MAaufgabe").textContent = "Es ist keine Aufgabe zugewiesen."
                }
            }
            /// ----- Denn Aufruf würde ich über den Spielverlauf Timer machen, damit man eine Bezugsquelle hat. -------------//
            var timerBearbeitung = setInterval(BerechneBearbeitung, 1000);
        }

        function prozent_runden(quelle){
            var wert=Math.round(quelle*10);
            var wert2=wert/10;
            var wert3=wert2-Math.round(wert2);
            if(wert2>=100){
                wert2=100;
            }//nicht über 100% anzeigen
            if (wert3==0){
                return wert2 + "." + wert3 + "%";
            }else{
                return wert2 + "%";
             }
        } 

        function BerechneFaehigkeit(mitarbeiter, MAincident){
            var IncBearbeitungsdauer = MAincident.bearbeitungsdauer * 10000; //in ms -> Speicherung in DB als InGame Stunden (1h = 10sek = 10000ms)
            console.log(IncBearbeitungsdauer);
            if (MAincident.fachlichefaehigkeit == mitarbeiter.faehigkeit1){ //benötigte Fähigkeit = MA-Fähigkeit 01
                if(mitarbeiter.level1 == "Beginner"){
                    var wert = IncBearbeitungsdauer + (IncBearbeitungsdauer/4);
                    return wert; 
                }else if(mitarbeiter.level1 == "Gelernter"){
                    var wert = IncBearbeitungsdauer + 0;
                    return wert; 
                }else if(mitarbeiter.level1 == "Profi"){
                    var wert = IncBearbeitungsdauer - (IncBearbeitungsdauer/4);
                    return wert; 
                }else if(mitarbeiter.level1 == "Experte"){
                    var wert = IncBearbeitungsdauer - (IncBearbeitungsdauer/2);
                    return wert;
                }
                //prüfe Level (1)Beginner +25%, (2)Gelernter +0, (3)Profi -25%, (4)Experte -50%
            }else if(MAincident.fachlichefaehigkeit == mitarbeiter.faehigkeit2){//benötigte Fähigkeit = MA-Fähigkeit 02
                if(mitarbeiter.level1 == "Beginner"){
                    var wert = IncBearbeitungsdauer + (IncBearbeitungsdauer/4);
                    return wert; 
                }else if(mitarbeiter.level1 == "Gelernter"){
                    var wert = IncBearbeitungsdauer + 0;
                    return wert; 
                }else if(mitarbeiter.level1 == "Profi"){
                    var wert = IncBearbeitungsdauer - (IncBearbeitungsdauer/4);
                    return wert; 
                }else if(mitarbeiter.level1 == "Experte"){
                    var wert = IncBearbeitungsdauer - (IncBearbeitungsdauer/2);
                    return wert;
                }
                //prüfe Level (1)Beginner +25%, (2)Gelernter +0, (3)Profi -25%, (4)Experte -50%
            }else{//keine fachliche Fähigkeit
                var wert = (IncBearbeitungsdauer/2) + IncBearbeitungsdauer;
                return wert; 
                //Bearbeitung +50%
            }
        }
         //---------Methode für neu einzutreffende Incidents in die InBox --- //
        function newIncInbox(){
            var inbox = document.getElementById("inBox");
            var incMax = rand(1,4); //-------- bis zu maximal 4 neue Incidents ----//
            if(inbox.childNodes.length <= 4){ //----- In der Inbox sollen höchstens 4 Incidents sin ---- /
                var incCount = inbox.childNodes.length;
                for(var x=0; x<Object.keys(incidents).length;x++){ //--- Schleife die alle Incidents kontrolliert --- //
                    if(incidents[x].status == "neu"){   //--- Kontrolliert, ob der aktuelle Incident noch auf status neu steht---//
                        var incInBox = false;
                        for(y=0; y < inbox.childNodes.length; y++){ //--- Geht alle vorhandenen Incidents in der Inbox durch ---- //
                            if(inbox.childNodes[y].id == incidents[x].incID){ /// Vergleich, ob der aktuelle Incidents bereits in der Inbox ist
                                incInBox = true;
                                y = inbox.childNodes.length;
                            }
                        }
                        if( incInBox == false){
 
                     //--------- ein Incident besteh aus einem Div und einem IMG ----/
                            var newIncident = document.createElement("div");
                            var incidentImg = document.createElement("img");
                            newIncident.id = incidents[x].incID;
                            newIncident.value = x;
                            newIncident.style.float = "left";
                            newIncident.dataset.erstellungsdatum = Date.now();
                            incidentImg.src = "img/icons8-dokument-64.png";
                            newIncident.appendChild(incidentImg);
                            //------Funktion zum inhalt der Incidents hinzufügen ---//
                            newIncident.onclick = function () {
                                incidents[this.value].erstellungsdatum = this.dataset.erstellungsdatum;
                                IncdatenAnzeigen(incidents[this.value]);
                                Incaktuell = incidents[this.value];
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
        }
    })
    
}//ENDE Game

//-----------Auswertung-----------//
function changeHTMLAuswertung() {
//----------erstelle Elemente------------//	
    //erstelle Body, da der aktuelle ersetzt wird
    var newMain = document.createElement("div");
    logo = new Image; //erzeuge Image inkl. Größe
    var einleitungAuswertung = '<h2>Sie haben das Spiel beendet!</h2><p>Sie sehen eine Übersicht Ihrer Spieldaten.</p>';
    var pTag = document.createElement("p");
    
    var tabelle = document.createElement("ul"); 
    var zeileIncident01 = document.createElement("li");
    var Label01 = document.createElement("h6");
    var AusgabeLabel01 = document.createElement("span");

    var zeileIncident02 = document.createElement("li");
    var Label02 = document.createElement("h6");
    var AusgabeLabel02 = document.createElement("span");

    var zeileIncident03 = document.createElement("li");
    var Label03 = document.createElement("h6");
    var AusgabeLabel03 = document.createElement("span");  

    var footer = document.createElement("footer");
    var span = document.createElement("span");

    //------------Klassen--------------//
    logo.className = "mb-4";
    footer.className = "footer text-center fixed-bottom p-3";
    tabelle.className = "card-body col-md-6";
    zeileIncident01.className = "list-group-item d-flex justify-content-between";
    zeileIncident02.className = "list-group-item d-flex justify-content-between";
    zeileIncident03.className = "list-group-item d-flex justify-content-between";
    AusgabeLabel01.className = ""; 

    //---------weitere Eigenschaften & Bezeichnungen------------//
    newMain.id = "newMain";
    logo.src = "/img/Logo_Planspiel.png";
    span.textContent = "Made by Diana Quaschni and Benjamin Lehnert © 2020";
    Label01.textContent = "Behobene Incidents gesamt";
    Label02.textContent = "rechtzeitig behobene Incidents";
    Label03.textContent = "zu spät gehobene Incidents";

    var Incgesamt = spiel[0].inFaelligkeit + spiel[0].ausFaelligkeit; 
    AusgabeLabel01.textContent = Incgesamt + "\t Incidents";
    AusgabeLabel02.textContent = spiel[0].inFaelligkeit + "\t Incidents";
    AusgabeLabel03.textContent = spiel[0].ausFaelligkeit + "\t Incidents";

    //----------Zuweisungen für Anzeige-----------// 
    newMain.appendChild(logo);
    newMain.appendChild(pTag);
    pTag.innerHTML = einleitungAuswertung;

    zeileIncident01.appendChild(Label01);
    zeileIncident01.appendChild(AusgabeLabel01);
    tabelle.appendChild(zeileIncident01);

    zeileIncident02.appendChild(Label02);
    zeileIncident02.appendChild(AusgabeLabel02);
    tabelle.appendChild(zeileIncident02);

    zeileIncident03.appendChild(Label03);
    zeileIncident03.appendChild(AusgabeLabel03); 
    tabelle.appendChild(zeileIncident03);

    newMain.appendChild(tabelle);

    footer.appendChild(span);
    newMain.appendChild(footer);
    
    //lege Ausgabebereich fest und zeige neuen Main-Inhalt dafür an
    var Ausgabebereich = document.getElementById("main");
    Ausgabebereich.parentNode.replaceChild(newMain, Ausgabebereich);

}//ENDE Auswertung

