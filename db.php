<?php 
    $verbindung = new PDO('mysql:host=127.0.0.1;dbname=incident_management', 'root', '');

if(isset($_GET['data']) && $_GET['data']=='incidents' )
{
 // Incidentinfromationen laden
$incidents = $verbindung->prepare(" SELECT incID,aufgaben.title, fealligkeit,faehigkeiten.name as fachlichefaehigkeit, erstellungsdatum, status, prioritaet, bearbeitungsstand, kundenzufriedenheit, bearbeitungsdauer, bearbeiter 
                                    FROM (`incident` 
                                    INNER JOIN `faehigkeiten` 
                                    on incident.benoetigteFachlFaehigkeit=faehigkeiten.faehigkeitenID) 
                                    INNER JOIN `aufgaben` 
                                    on incident.aufgabenID=aufgaben.aufgabenID"); 
// Die vorbereitete Anweisung ausführen
$incidents->execute();
$incidentsfetch = $incidents->fetchAll(PDO::FETCH_OBJ);
$rowCount = sizeof($incidentsfetch);
$count = 1;
echo '[';
// Alle gefundenen Datensätze ausgeben
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
        echo '"bearbeiter" : "'. $incident->bearbeiter . '"';
        if ($count < $rowCount){
                echo '},';
                $count++;
        }else{
                echo '}';
        }
   }
   echo ']';
}
?>