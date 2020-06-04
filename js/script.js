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
        /// Timer Funktion für die Spielrundenberechnung----/
        function timer() {
            // Aufbau  spiel[Datensatz].spielID, spielphase , runde, anfang, ende, inFaelligkeit, ausFaelligkeit, zaehler
            //var startTime = Date.now();
            var interval = setInterval(function() {
            if(rundNumb == 1 && spiel[0].runden[rundNumb].startTime == 0){
                spiel[0].runden[rundNumb].startTime = spiel[0].anfang;
            }
            spiel[0].runden[rundNumb].elapsedTime = Date.now() - spiel[0].runden[rundNumb].startTime;
            //var elapsedTime = Date.now() - startTime;
                if(spiel[0].runden[rundNumb].elapsedTime >= 240000){
                    rundNumb++;
                    spiel[0].runde = rundNumb;
                    spiel[0].runden[rundNumb].startTime = Date.now();
                    document.getElementById("runde").innerHTML = "Runde " + rundNumb;
                    document.getElementById('timer').innerHTML = "0 Std.";
                    newIncInbox();
                }else{
                    document.getElementById('timer').innerHTML = (spiel[0].runden[rundNumb].elapsedTime / 10000).toFixed(0) + " Std.";                
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
        function MAdatenAnzeigen(MAdaten){
            document.getElementById("MAposition").textContent = MAdaten.position + "-Support";
            document.getElementById("MAname").textContent = "Mitarbeiter: " + MAdaten.name;
            document.getElementById("MAkategorie").textContent = MAdaten.kategorie;
            //document.getElementById("MAfaehigkeit01").textContent = MAdaten.faehigkeit1;
            //es fehlen weitere Fähigkeiten anzeigen
            for(f=1; f<= Object.keys(MAdaten).length; f++){
                var controlFA = eval("MAdaten.faehigkeit"+f);
                if(controlFA != undefined){
                    document.getElementById("MAfaehigkeit0"+f).textContent = controlFA;
                }
            }
            if(typeof incident  !== "undefined"){
                document.getElementById("MAaufgabe").textContent = "#" + incident.incID + " " + incident.title;
            }
        } 

        //----Datenübergabe des angeklickten MAs------//
        firstLevelMitarbeiter01.onclick = function (){
            //Infobereich für Anzeige der MA-Daten laden und Daten anzeigen
            $.get('infobereich.html', function (data) {
                $('#newInfobereich').html(data);
                var mitarbeiter = supportMitarbeiter[0];
                MAdatenAnzeigen(mitarbeiter);
            })
        } 
        secondLevelMitarbeiter01.onclick = function (){
            $.get('infobereich.html', function (data) {
                $('#newInfobereich').html(data);
                var mitarbeiter = supportMitarbeiter[1];
                MAdatenAnzeigen(mitarbeiter);
            })
        } 
        secondLevelMitarbeiter02.onclick = function (){
            $.get('infobereich.html', function (data) {
                $('#newInfobereich').html(data);
                var mitarbeiter = supportMitarbeiter[2];
                MAdatenAnzeigen(mitarbeiter);
            })
        }
        secondLevelMitarbeiter03.onclick = function (){
            $.get('infobereich.html', function (data) {
                $('#newInfobereich').html(data);
                var mitarbeiter = supportMitarbeiter[3];
                MAdatenAnzeigen(mitarbeiter);
            })
        } 

        //---------------- Funktion um eine Zufallszahl zu generieren -------//
        function rand (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        //-------------Methode um Incidentdaten anzuzeigen ------------//
        function IncdatenAnzeigen(daten){
            if(document.getElementById("noInc").style.visibility=="visible"){
                document.getElementById("noInc").style.visibility="collapse";
                document.getElementById("incDetForm").style.visibility="visible";
                document.getElementById("btn-bearbeiten").style.visibility="visible";
                document.getElementById("btn-weiterleiten").style.visibility="visible";
            }
            document.getElementById("incDetTitel").innerText = "#" + daten.incID + " \n "+ daten.title;
            document.getElementById("incDetThema").innerText = daten.thema;
            if (daten.faelligkeit == 1){
                document.getElementById("incDetFaell").innerText = "fällig in " + daten.faelligkeit + " Stunde ";   
            }else{
                document.getElementById("incDetFaell").innerText = "fällig in " + daten.faelligkeit + " Stunden ";
            }
            document.getElementById("incDetPrio").value  = daten.prioritaet;
            document.getElementById("incDetKat").value  = daten.kategorie;
            document.getElementById("incDetBea").innerText = daten.bearbeiter;
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
            document.getElementById("inBox").removeChild(document.getElementById(incID));
            //---- Incident bereich wird ggf. wieder geleert ----/
            //if(document.getElementById("inBox").childElementCount == 0){
                document.getElementById("incDetTitel").innerHTML = "";
                document.getElementById("noInc").style.visibility="visible";
                document.getElementById("incDetForm").style.visibility="hidden";
                document.getElementById("btn-bearbeiten").style.visibility="hidden";
                document.getElementById("btn-weiterleiten").style.visibility="hidden";
            //}
        }

        
        //-----------------Incident 1st-Level zuweisen und Daten im Arbeitsbereich anzeigen---------------------//
        var buttonBearbeiten = document.getElementById("btn-bearbeiten"); 
        buttonBearbeiten.onclick = function () {
            if (IncFirstBearbeitung == 0){//wenn MA noch keinen Incident bearbeitet
                supportMitarbeiter[0].zugewiesenerIncident = Incaktuell; //speichere aktuellen Incident für diesen MA
                document.getElementById("IncTitel").textContent = "#" + supportMitarbeiter[0].zugewiesenerIncident.incID + " " + supportMitarbeiter[0].zugewiesenerIncident.title;
                document.getElementById("Faelligkeit").textContent = "<in Bearbeitung> fällig in " + supportMitarbeiter[0].zugewiesenerIncident.faelligkeit + " Runden";
                IncBearbeitung(0);
                document.getElementById("Bearbeitungsstand").textContent = "Bearbeitungsstand: 0%";
                IncFirstBearbeitung = 1;
                IncDatenAendern(Incaktuell.incID,null,"in Bearbeitung",document.getElementById("incDetPrio").value ,null,null,Incaktuell.bearbeitungsdauer,supportMitarbeiter[0].name,document.getElementById("incDetKat").value);
                IncRemoveInbox(Incaktuell.incID);
            }else{//wenn MA bereits einen Incident bearbeitet
                alert ("Der Mitarbeiter bearbeitet bereits einen Incident."); //Ablehnung, wenn der Mitarbeiter bereits einen Incident bearbeitet
            }
        }

        //-----------------Incident 2nd-Level zuweisen und Daten im Arbeitsbereich anzeigen---------------------//
        var buttonWeiterleiten = document.getElementById("btn-weiterleiten");
        buttonWeiterleiten.onclick = function () {
            //--------Vergleich IncidentKategorie mit MA-Kategorie als IDs----------//
            //-----------Weise Incident dem MA zu, wenn die Kategorien identisch sind und er noch keinen Incident bearbeitet-------------//
            if (incDetKat.value == supportMitarbeiter[1].kategorieID){
                if (IncSecBearbeitung01 == 0){//wenn MA noch keinen Incident bearbeitet
                    supportMitarbeiter[1].zugewiesenerIncident = Incaktuell;//speichere aktuellen Incident für diesen MA
                    document.getElementById("Sec01IncTitel").textContent = "#" + supportMitarbeiter[1].zugewiesenerIncident.incID + " " + supportMitarbeiter[1].zugewiesenerIncident.title;
                    document.getElementById("Sec01Faelligkeit").textContent = "<in Bearbeitung> fällig in " + supportMitarbeiter[1].zugewiesenerIncident.faelligkeit + " Runden";
                    IncBearbeitung(1);
                    document.getElementById("Sec01Bearbeitungsstand").textContent = "Bearbeitungsstand: 0%";
                    IncSecBearbeitung01 =1;
                    IncDatenAendern(Incaktuell.incID,null,"in Bearbeitung",document.getElementById("incDetPrio").value ,null,null,Incaktuell.bearbeitungsdauer,supportMitarbeiter[1].name,document.getElementById("incDetKat").value);
                    IncRemoveInbox(Incaktuell.incID);
                }else{//wenn MA bereits einen Incident bearbeitet
                    alert ("Der Mitarbeiter bearbeitet bereits einen Incident."); //Ablehnung, wenn der Mitarbeiter bereits einen Incident bearbeitet
                }
            }else if (incDetKat.value == supportMitarbeiter[2].kategorieID){
                if (IncSecBearbeitung02 == 0){
                    supportMitarbeiter[2].zugewiesenerIncident = Incaktuell;//speichere aktuellen Incident für diesen MA
                    document.getElementById("Sec02IncTitel").textContent = "#" + supportMitarbeiter[2].zugewiesenerIncident.incID + " " + supportMitarbeiter[2].zugewiesenerIncident.title;
                    document.getElementById("Sec02Faelligkeit").textContent = "<in Bearbeitung> fällig in " + supportMitarbeiter[2].zugewiesenerIncident.faelligkeit + " Runden";
                    IncBearbeitung(2);
                    document.getElementById("Sec02Bearbeitungsstand").textContent = "Bearbeitungsstand: 0%";
                    IncSecBearbeitung02 =1;
                    IncDatenAendern(Incaktuell.incID,null,"in Bearbeitung",document.getElementById("incDetPrio").value ,null,null,Incaktuell.bearbeitungsdauer,supportMitarbeiter[2].name,document.getElementById("incDetKat").value);
                    IncRemoveInbox(Incaktuell.incID);
                }else{
                    alert ("Der Mitarbeiter bearbeitet bereits einen Incident."); //Ablehnung, wenn der Mitarbeiter bereits einen Incident bearbeitet
                }
            }else if (incDetKat.value == supportMitarbeiter[3].kategorieID){
                if (IncSecBearbeitung03 == 0){
                    supportMitarbeiter[3].zugewiesenerIncident = Incaktuell; //speichere aktuellen Incident für diesen MA
                    document.getElementById("Sec03IncTitel").textContent = "#" + supportMitarbeiter[3].zugewiesenerIncident.incID + " " + supportMitarbeiter[3].zugewiesenerIncident.title;
                    document.getElementById("Sec03Faelligkeit").textContent = "<in Bearbeitung> fällig in " + supportMitarbeiter[3].zugewiesenerIncident.faelligkeit + " Runden";
                    IncBearbeitung(3);
                    document.getElementById("Sec03Bearbeitungsstand").textContent = "Bearbeitungsstand: 0%";
                    IncSecBearbeitung03 =1;
                    IncDatenAendern(Incaktuell.incID,null,"in Bearbeitung",document.getElementById("incDetPrio").value ,null,null,Incaktuell.bearbeitungsdauer,supportMitarbeiter[3].name,document.getElementById("incDetKat").value);
                    IncRemoveInbox(Incaktuell.incID);
                }else{
                    alert ("Der Mitarbeiter bearbeitet bereits einen Incident."); //Ablehnung, wenn der Mitarbeiter bereits einen Incident bearbeitet
                }
            }else{
                alert("Kategorie stimmt mit MA nicht überein.")
            }

        }//ENDE Weiterleiten

        //-------- Methode um die Faelligkeit zu checken und zu speichern.  ------------------------//

        function checkFaelligkeit(SMA){
            var endTime = Date.now();
            var faellig;
            var check = false;
            incidents.forEach(element => {
                if(element.incID == supportMitarbeiter[SMA].zugewiesenerIncident.incID){
                    faellig = Math.round((endTime - element.erstellungsdatum) - (element.faelligkeit * 10000));
                    if(faellig <= 0){
                        spiel[0].inFaelligkeit = spiel[0].inFaelligkeit + 1;
                        document.getElementById("good").textContent = spiel[0].inFaelligkeit;
                    }else{
                        spiel[0].ausFaelligkeit = spiel[0].ausFaelligkeit + 1;
                        document.getElementById("bad").textContent = spiel[0].ausFaelligkeit;
                    }
                    check = true;

                    if(SMA == 0){
                        document.getElementById("IncTitel").textContent = "";
                        document.getElementById("Faelligkeit").textContent = "";
                        document.getElementById("Bearbeitungsstand").textContent = "";
                        IncFirstBearbeitung = 0;
                    }else{
                        document.getElementById("Sec0"+SMA+"IncTitel").textContent = "";
                        document.getElementById("Sec0"+SMA+"Faelligkeit").textContent = "";
                        document.getElementById("Sec0"+SMA+"Bearbeitungsstand").textContent = "";
                        window["IncSecBearbeitung0"+SMA] = 0;
                    }
                    
                }
                IncDatenAendern(Incaktuell.incID,null,"erledigt",null ,null,null,null,null,null);
            });
            if(check == true){
                delete supportMitarbeiter[SMA].zugewiesenerIncident; //speichere aktuellen Incident für diesen MA
                check = false;  
            }
            
        }

        //-----Bearbeitung berechnen-----//
        function IncBearbeitung(mitarbeiter){
            var start = Date.now();      
            function BerechneBearbeitung() {           
                var diff = Date.now() - start;
                var IncBearbeitungsdauer = Incaktuell.bearbeitungsdauer * 10000; //in ms -> Speicherung in DB als InGame Stunden (1h = 10sek = 10000ms)
                if (mitarbeiter == 0){
                    var korrWert = BerechneFaehigkeit(supportMitarbeiter[0]); //korrigierter Wert
                    supportMitarbeiter[0].bearbeitungsstand = prozent_runden((diff/korrWert)*100);
                    document.getElementById("Bearbeitungsstand").textContent = "Bearbeitungsstand: " + supportMitarbeiter[0].bearbeitungsstand; //Ausgabe am First-Level
                }else if (mitarbeiter == 1){
                    var korrWert = BerechneFaehigkeit(supportMitarbeiter[1]); //korrigierter Wert
                    supportMitarbeiter[1].bearbeitungsstand = prozent_runden((diff/korrWert)*100);
                    document.getElementById("Sec01Bearbeitungsstand").textContent = "Bearbeitungsstand: " + supportMitarbeiter[1].bearbeitungsstand; //Ausgabe am Second-Level
                }else if (mitarbeiter == 2){
                    var korrWert = BerechneFaehigkeit(supportMitarbeiter[2]); //korrigierter Wert
                    supportMitarbeiter[2].bearbeitungsstand = prozent_runden((diff/korrWert)*100);
                    document.getElementById("Sec02Bearbeitungsstand").textContent = "Bearbeitungsstand: " + supportMitarbeiter[2].bearbeitungsstand; //Ausgabe am Second-Level
                }else if (mitarbeiter == 3){
                    var korrWert = BerechneFaehigkeit(supportMitarbeiter[3]); //korrigierter Wert
                    supportMitarbeiter[3].bearbeitungsstand = prozent_runden((diff/korrWert)*100);
                    document.getElementById("Sec03Bearbeitungsstand").textContent = "Bearbeitungsstand: " + supportMitarbeiter[3].bearbeitungsstand; //Ausgabe am Second-Level
                }
                if (diff >= korrWert){
                    checkFaelligkeit(mitarbeiter);
                    clearInterval(timerBearbeitung);
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

        function BerechneFaehigkeit(mitarbeiter){
            var IncBearbeitungsdauer = Incaktuell.bearbeitungsdauer * 10000; //in ms -> Speicherung in DB als InGame Stunden (1h = 10sek = 10000ms)
            if (Incaktuell.fachlichefaehigkeit == mitarbeiter.faehigkeit1){ //benötigte Fähigkeit = MA-Fähigkeit 01
                if(mitarbeiter.level1 == 1){
                    var wert = IncBearbeitungsdauer + (IncBearbeitungsdauer/4);
                    return wert; 
                }else if(mitarbeiter.level1 == 2){
                    var wert = IncBearbeitungsdauer + 0;
                    return wert; 
                }else if(mitarbeiter.level1 == 3){
                    var wert = IncBearbeitungsdauer - (IncBearbeitungsdauer/4);
                    return wert; 
                }else if(mitarbeiter.level1 == 4){
                    var wert = IncBearbeitungsdauer - (IncBearbeitungsdauer/2);
                    return wert;
                }
                //prüfe Level (1)Beginner +25%, (2)Gelernter +0, (3)Profi -25%, (4)Experte -50%
            }else if(Incaktuell.fachlichefaehigkeit == mitarbeiter.faehigkeit2){//benötigte Fähigkeit = MA-Fähigkeit 02
                if(mitarbeiter.level1 == 1){
                    var wert = IncBearbeitungsdauer + (IncBearbeitungsdauer/4);
                    return wert; 
                }else if(mitarbeiter.level1 == 2){
                    var wert = IncBearbeitungsdauer + 0;
                    return wert; 
                }else if(mitarbeiter.level1 == 3){
                    var wert = IncBearbeitungsdauer - (IncBearbeitungsdauer/4);
                    return wert; 
                }else if(mitarbeiter.level1 == 4){
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
            var incMax = rand(6,8); //-------- bis zu maximal 4 neue Incidents ----//
            if(inbox.childNodes.length <= 8){ //----- In der Inbox sollen höchstens 4 Incidents sin ---- /
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

}//ENDE Auswertung

