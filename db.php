<?php 
/// Verbindung zur Datenbank
$verbindung = new PDO('mysql:host=127.0.0.1;dbname=incident_management', 'root', '');

if(isset($_GET['data']) && $_GET['data']=='incidents' )
{
        // Abfrage in der Datenbank nach den vorhanden Incidents 
        $incidents = $verbindung->prepare(" SELECT incID,aufgaben.title, fealligkeit,faehigkeiten.name as fachlichefaehigkeit, erstellungsdatum, status, prioritaet, bearbeitungsstand, kundenzufriedenheit, bearbeitungsdauer, bearbeiter, kategorie 
                                        FROM (`incident` 
                                        INNER JOIN `faehigkeiten` 
                                        on incident.benoetigteFachlFaehigkeit=faehigkeiten.faehigkeitenID) 
                                        INNER JOIN `aufgaben` 
                                        on incident.aufgabenID=aufgaben.aufgabenID"); 
        // Die vorbereitete Anweisung ausführen
        $incidents->execute();
        // Übertragene Daten der ausgeführten Anweisungen
        $incidentsfetch = $incidents->fetchAll(PDO::FETCH_OBJ);
        // Anzahl der Übergebenen Datensätze
        $rowCount = sizeof($incidentsfetch);
        $count = 1;
        // Aufbau einer JSON Datei zur Übergabe an Javascript
        echo '[';
        // Alle gefundenen Datensätze ausgeben  und JSON Datei erstellen
        foreach ($incidentsfetch as $incident) {
                echo '{';
                echo '"incID" : "'. $incident->incID . '",';
                echo '"title" : "'. $incident->title . '",';
                echo '"fealligkeit" : "'. $incident->fealligkeit . '",';
                echo '"fachlichefaehigkeit" : "'. $incident->fachlichefaehigkeit. '",';
                echo '"erstellungsdatum" : "'. $incident->erstellungsdatum . '",';
                echo '"status" : "'. $incident->status . '",';
                echo '"prioritaet" : "'. $incident->prioritaet . '",';
                echo '"bearbeitungsstand" : "'. $incident->bearbeitungsstand . '",';
                echo '"kundenzufriedenheit" : "'. $incident->kundenzufriedenheit. '",';
                echo '"bearbeitungsdauer" : "'. $incident->bearbeitungsdauer . '",';
                echo '"bearbeiter" : "'. $incident->bearbeiter . '",';
                echo '"kategorie" : "'. $incident->kategorie . '"';
                if ($count < $rowCount){
                        echo '},';
                        $count++;
                }else{
                        // Letzte Klammer darf kein Komma haben, sonst funktioniert das Parsen der JSON-Datei nicht.
                        echo '}';
                }
        }
        echo ']';
}
if(isset($_GET['data']) && $_GET['data']=='support-mitarbeiter'){
        // Abfrage und zusammensetzung der Infromationen zu den Support-Mitarbeitern
        $supportMitarbeiter = $verbindung->prepare(" SELECT mitarbeiter.mitarbeiterID, mitarbeiter.name as name, `position`, `kategorie`, kategorie.name as KategorieBezeichnung, fachfaehigkeitzuordnen.fachlicheFaehigkeit as faehigkeitID, faehigkeiten.name as FaehigkeitBezeichnung, fachfaehigkeitzuordnen.level  
                                                        FROM `mitarbeiter` 
                                                        INNER JOIN `kategorie` on mitarbeiter.kategorie=kategorie.kategorieID
                                                        INNER JOIN `fachfaehigkeitzuordnen` on mitarbeiter.mitarbeiterID=fachfaehigkeitzuordnen.mitarbeiterID 
                                                        INNER JOIN `faehigkeiten` on fachfaehigkeitzuordnen.fachlicheFaehigkeit=faehigkeiten.faehigkeitenID
                                                        WHERE `position` ='1st-Level' or `position` ='2nd-Level' 
                                                        ORDER BY mitarbeiter.mitarbeiterID"); 
         // Die vorbereitete Anweisung ausführen
        $supportMitarbeiter->execute();
        // Übertragene Daten der ausgeführten Anweisungen
        $supportMitarbeiterfetch = $supportMitarbeiter->fetchAll(PDO::FETCH_OBJ);
        // Anzahl der Übergebenen Datensätze
        $rowCount = sizeof($supportMitarbeiterfetch);
        $count = 1;
        // Aufbau einer JSON Datei zur Übergabe an Javascript
        echo '[';
        // Alle gefundenen Datensätze ausgeben  und JSON Datei erstellen
        foreach ($supportMitarbeiterfetch as $smitarbeiter) {
                echo '{';
                echo '"mitarbeiterID" : "'. $smitarbeiter->mitarbeiterID . '",';
                echo '"name" : "'. $smitarbeiter->name . '",';
                echo '"position" : "'. $smitarbeiter->position . '",';
                echo '"kategorieID" : "'. $smitarbeiter->kategorie. '",'; 
                echo '"kategorie" : "'. $smitarbeiter->KategorieBezeichnung . '",';  
                echo '"faehigkeitID" : "'. $smitarbeiter->faehigkeitID . '",'; 
                echo '"faehigkeit" : "'. $smitarbeiter->FaehigkeitBezeichnung . '",'; 
                echo '"level" : "'. $smitarbeiter->level . '"'; 
                if ($count < $rowCount){
                        echo '},';
                        $count++;
                }else{
                        // Letzte Klammer darf kein Komma haben, sonst funktioniert das Parsen der JSON-Datei nicht.
                        echo '}';
                }
        }
        echo ']';
        
}
if(isset($_GET['data']) && $_GET['data']=='spiel'){
        // Abfrage über Spiel Informationen
        $request = $verbindung->prepare(" SELECT * FROM `spiel` "); 
         // Die vorbereitete Anweisung ausführen
        $request->execute();
        // Übertragene Daten der ausgeführten Anweisungen
        $fetch = $request->fetchAll(PDO::FETCH_OBJ);
        // Anzahl der Übergebenen Datensätze
        $rowCount = sizeof($fetch);
        $count = 1;
        // Aufbau einer JSON Datei zur Übergabe an Javascript
        echo '[';
        // Alle gefundenen Datensätze ausgeben  und JSON Datei erstellen
        foreach ($fetch as $spiel) {
                echo '{';
                echo '"spielID" : "'. $spiel->spielID . '",';
                echo '"spielphase" : "'. $spiel->spielphase . '",';
                echo '"runde" : "'. $spiel->runde . '",';
                echo '"anfang" : "'. $spiel->anfang. '",'; 
                echo '"ende" : "'. $spiel->ende . '",';  
                echo '"inFaelligkeit" : "'. $spiel->incInFaelligkeit . '",'; 
                echo '"ausFaelligkeit" : "'. $spiel->incAusFaelligkeit . '",'; 
                echo '"zaehler" : "'. $spiel->zaehler . '"'; 
                if ($count < $rowCount){
                        echo '},';
                        $count++;
                }else{
                        // Letzte Klammer darf kein Komma haben, sonst funktioniert das Parsen der JSON-Datei nicht.
                        echo '}';
                }
        }
        echo ']';
        
}

//Auslesen der Kategorien 
if(isset($_GET['data']) && $_GET['data']=='kategorien'){
        // Abfrage über Spiel Informationen
        $request = $verbindung->prepare(" SELECT * FROM `kategorie` "); 
         // Die vorbereitete Anweisung ausführen
        $request->execute();
        // Übertragene Daten der ausgeführten Anweisungen
        $fetch = $request->fetchAll(PDO::FETCH_OBJ);
        // Anzahl der Übergebenen Datensätze
        $rowCount = sizeof($fetch);
        $count = 1;
        // Aufbau einer JSON Datei zur Übergabe an Javascript
        echo '[';
        // Alle gefundenen Datensätze ausgeben  und JSON Datei erstellen
        foreach ($fetch as $kategorie) {
                echo '{';
                echo '"kategorieID" : "'. $kategorie->kategorieID . '",';
                echo '"name" : "'. $kategorie->name . '"';
                if ($count < $rowCount){
                        echo '},';
                        $count++;
                }else{
                        // Letzte Klammer darf kein Komma haben, sonst funktioniert das Parsen der JSON-Datei nicht.
                        echo '}';
                }
        }
        echo ']';
        
}
//Auslesen der Aufzählung der Prioritäten aus der Incident-Tabelle
if(isset($_GET['data']) && $_GET['data']=='prio'){
      
        $sth = $verbindung->prepare("SHOW COLUMNS FROM incident LIKE 'prioritaet'");
        $sth->execute(); 
        $data = array();
        while ($row = $sth->fetch(PDO::FETCH_NUM)) {   
            $data=explode("','",preg_replace("/(enum|set)\('(.+?)'\)/","\\2",$row[1]));
        }
        //echo "<pre>";
        //print_r ($data);
        echo json_encode($data);
        //print_r($data[0]);
}
?>