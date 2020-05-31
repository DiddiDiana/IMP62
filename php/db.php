<?php 
/// Verbindung zur Datenbank
$verbindung = new PDO('mysql:host=127.0.0.1;dbname=incident_management', 'root', '');

if(isset($_GET['data']) && $_GET['data']=='incidents' )
{
        // Abfrage in der Datenbank nach den vorhanden Incidents 
        $incidents = $verbindung->prepare(" SELECT incID,aufgaben.title, faelligkeit,faehigkeiten.name as fachlichefaehigkeit, erstellungsdatum, status, prioritaet, bearbeitungsstand, kundenzufriedenheit, bearbeitungsdauer, bearbeiter, kategorie, thema 
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
                echo '"faelligkeit" : "'. $incident->faelligkeit . '",';
                echo '"fachlichefaehigkeit" : "'. $incident->fachlichefaehigkeit. '",';
                echo '"erstellungsdatum" : "'. $incident->erstellungsdatum . '",';
                echo '"status" : "'. $incident->status . '",';
                echo '"prioritaet" : "'. $incident->prioritaet . '",';
                echo '"bearbeitungsstand" : "'. $incident->bearbeitungsstand . '",';
                echo '"kundenzufriedenheit" : "'. $incident->kundenzufriedenheit. '",';
                echo '"bearbeitungsdauer" : "'. $incident->bearbeitungsdauer . '",';
                echo '"bearbeiter" : "'. $incident->bearbeiter . '",';
                echo '"kategorie" : "'. $incident->kategorie . '",';
                echo '"thema" : "'. $incident->thema . '"';
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
        $faehigkeitenCount=1;
        // Aufbau einer JSON Datei zur Übergabe an Javascript
        echo '[';
        // Alle gefundenen Datensätze ausgeben  und JSON Datei erstellen
        $lastMA = 0;
        foreach ($supportMitarbeiterfetch as $smitarbeiter) {
                //------Methode um das JSON File zu erstellen----/
                //------ Kontrolliert ob der Aktuelle Mitarbeiter die selbe Mitarbeiter ID hat wie der letzte. ----//
                if ($lastMA !=  $smitarbeiter->mitarbeiterID){
                        //-------------Wenn nicht, wird kontrolliert, ob es der erste Mitarbeiter ist ------//
                        if($lastMA == 0){
                                $lastMA = $smitarbeiter->mitarbeiterID;
                                echo '{';
                                echo '"mitarbeiterID" : "'. $smitarbeiter->mitarbeiterID . '",';
                                echo '"name" : "'. $smitarbeiter->name . '",';
                                echo '"position" : "'. $smitarbeiter->position . '",';
                                echo '"kategorieID" : "'. $smitarbeiter->kategorie. '",'; 
                                echo '"kategorie" : "'. $smitarbeiter->KategorieBezeichnung . '",';  
                                echo '"faehigkeitID'.$faehigkeitenCount.'" : "'. $smitarbeiter->faehigkeitID . '",'; 
                                echo '"faehigkeit'.$faehigkeitenCount.'" : "'. $smitarbeiter->FaehigkeitBezeichnung . '",'; 
                                echo '"level'.$faehigkeitenCount.'" : "'. $smitarbeiter->level . '"';
                        //----ist es nicht der erste Mitarbeiter, wird ein neuer Mitarbeiter in das JSONfilde hinzugefügt. ---//
                        } else {
                                $lastMA = $smitarbeiter->mitarbeiterID;
                                $faehigkeitenCount=1;
                                echo '},';
                                echo '{';
                                echo '"mitarbeiterID" : "'. $smitarbeiter->mitarbeiterID . '",';
                                echo '"name" : "'. $smitarbeiter->name . '",';
                                echo '"position" : "'. $smitarbeiter->position . '",';
                                echo '"kategorieID" : "'. $smitarbeiter->kategorie. '",'; 
                                echo '"kategorie" : "'. $smitarbeiter->KategorieBezeichnung . '",';  
                                echo '"faehigkeitID'.$faehigkeitenCount.'" : "'. $smitarbeiter->faehigkeitID . '",'; 
                                echo '"faehigkeit'.$faehigkeitenCount.'" : "'. $smitarbeiter->FaehigkeitBezeichnung . '",'; 
                                echo '"level'.$faehigkeitenCount.'" : "'. $smitarbeiter->level . '"';
                        }
                //-------Ist es der Selbe Mitarbeiter wie vorher, wird eine weitere Fahigkeit hinzugefügt. ----//
                } else {
                        $faehigkeitenCount++;
                        echo ',';
                        echo '"faehigkeitID'.$faehigkeitenCount.'" : "'. $smitarbeiter->faehigkeitID . '",'; 
                        echo '"faehigkeit'.$faehigkeitenCount.'" : "'. $smitarbeiter->FaehigkeitBezeichnung . '",'; 
                        echo '"level'.$faehigkeitenCount.'" : "'. $smitarbeiter->level . '"';
                }
        }
        echo '}';
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
if(isset($_GET['data']) && $_GET['data']=='kategorie' )
{
        // Abfrage in der Datenbank nach den vorhanden Kategorien 
        $kategorien = $verbindung->prepare(" SELECT kategorieID, name 
                                        FROM `kategorie`"); 
        // Die vorbereitete Anweisung ausführen
        $kategorien->execute();
        // Übertragene Daten der ausgeführten Anweisungen
        $kategorienfetch = $kategorien->fetchAll(PDO::FETCH_OBJ);
        // Anzahl der Übergebenen Datensätze
        $rowCount = sizeof($kategorienfetch);
        $count = 1;
        // Aufbau einer JSON Datei zur Übergabe an Javascript
        echo '[';
        // Alle gefundenen Datensätze ausgeben  und JSON Datei erstellen
        foreach ($kategorienfetch as $kategorie) {
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
		$c=0;
        while ($row = $sth->fetch(PDO::FETCH_NUM)) {
            $data=explode("','",preg_replace("/(enum|set)\('(.+?)'\)/","\\2",$row[1]));
        }
        //------ Das obere Array() muss noch in ein JSON gerecht umgebaut werden---//
        echo '{';
		foreach($data as $prio){
			if($c+2 <= sizeof($data)){
				echo '"'.$c.'" : "'.$prio.'",';
				$c++;
			}else{
				echo '"'.$c.'" : "'.$prio.'"';
			}
		}
                echo'}';
}
?>