-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 23. Mai 2020 um 08:28
-- Server-Version: 10.4.11-MariaDB
-- PHP-Version: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `incident_management`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `aufgaben`
--

CREATE TABLE `aufgaben` (
  `aufgabenID` int(11) NOT NULL,
  `title` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `aufgaben`
--

INSERT INTO `aufgaben` (`aufgabenID`, `title`) VALUES
(1, 'User gesperrt'),
(2, 'User anlegen'),
(3, 'Softwarebug beheben'),
(4, 'Softwareupdate installieren'),
(5, 'Server updaten'),
(6, 'Server konfigurieren'),
(7, 'Fehlermeldung auf dem Server');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `fachlichefaehigkeiten`
--

CREATE TABLE `fachlichefaehigkeiten` (
  `level` int(11) NOT NULL,
  `bezeichnung` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `fachlichefaehigkeiten`
--

INSERT INTO `fachlichefaehigkeiten` (`level`, `bezeichnung`) VALUES
(1, 'Beginner'),
(2, 'Gelernter'),
(3, 'Profi'),
(4, 'Experte');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `faehigkeiten`
--

CREATE TABLE `faehigkeiten` (
  `faehigkeitenID` int(11) NOT NULL,
  `name` text NOT NULL,
  `typ` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `faehigkeiten`
--

INSERT INTO `faehigkeiten` (`faehigkeitenID`, `name`, `typ`) VALUES
(1, 'Benutzerverwaltung', 'fachliche'),
(2, 'Programmieren', 'fachliche'),
(3, 'Server', 'fachliche'),
(4, 'Projektierung', 'fachliche'),
(5, 'Ordentlich', 'persoenliche'),
(6, 'Teamfaehig', 'persoenliche'),
(7, 'Kreativ', 'persoenliche');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `incident`
--

CREATE TABLE `incident` (
  `incID` int(11) NOT NULL,
  `aufgabenID` int(11) NOT NULL,
  `fealligkeit` int(11) NOT NULL COMMENT 'Fälligkeit in Runden vom Erstellungsdatum aus.',
  `benoetigteFachlFaehigkeit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `incident`
--

INSERT INTO `incident` (`incID`, `aufgabenID`, `fealligkeit`, `benoetigteFachlFaehigkeit`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 4, 1, 3),
(4, 3, 3, 2),
(5, 7, 2, 3);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `interneaufgaben`
--

CREATE TABLE `interneaufgaben` (
  `aufgabe` int(11) NOT NULL,
  `bearbeitungsdauer` int(11) NOT NULL COMMENT 'Bearbeitungsdauer in stunden.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `interneaufgaben`
--

INSERT INTO `interneaufgaben` (`aufgabe`, `bearbeitungsdauer`) VALUES
(5, 1),
(6, 3);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kategorie`
--

CREATE TABLE `kategorie` (
  `kategorieID` int(11) NOT NULL,
  `name` text NOT NULL,
  `fachlicheFaehigkeit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `kategorie`
--

INSERT INTO `kategorie` (`kategorieID`, `name`, `fachlicheFaehigkeit`) VALUES
(1, 'Benutzerverwaltung', 1),
(2, 'Programmieren', 2),
(3, 'Serveradministration', 3);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitarbeiter`
--

CREATE TABLE `mitarbeiter` (
  `mitarbeiterID` int(11) NOT NULL,
  `name` text NOT NULL COMMENT 'Name des Mitarbeiters',
  `position` text NOT NULL COMMENT 'Position des Mitarbeiters'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `mitarbeiter`
--

INSERT INTO `mitarbeiter` (`mitarbeiterID`, `name`, `position`) VALUES
(1, 'Carl', 'IT-Leiter'),
(2, 'Maik', '1st-Level'),
(3, 'Andi', '2nd-Level'),
(4, 'Olaf', '2nd-Level'),
(5, 'Peter', '2nd-Level'),
(6, 'Uwe', '2nd-Level');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `nutzer`
--

CREATE TABLE `nutzer` (
  `nutzerID` int(11) NOT NULL,
  `name` text NOT NULL,
  `passwort` text NOT NULL,
  `rechte` text NOT NULL,
  `session` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `nutzer`
--

INSERT INTO `nutzer` (`nutzerID`, `name`, `passwort`, `rechte`, `session`) VALUES
(1, 'ben', 'test', 'nutzer', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `persoenlichefaehigkeiten`
--

CREATE TABLE `persoenlichefaehigkeiten` (
  `faehigkeit` int(11) NOT NULL,
  `auswirkung` int(11) NOT NULL COMMENT 'Zeitliche negative oder positive Auswirkung auf die Bearbeitung.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `persoenlichefaehigkeiten`
--

INSERT INTO `persoenlichefaehigkeiten` (`faehigkeit`, `auswirkung`) VALUES
(5, -1),
(7, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `spiel`
--

CREATE TABLE `spiel` (
  `spielID` int(11) NOT NULL,
  `spielphase` enum('Einleitung','Vorbereitung','Durchführung','Auswertung') NOT NULL COMMENT 'Enum der Spielphasen',
  `runde` int(11) DEFAULT NULL COMMENT 'Rundenanzahl',
  `anfang` datetime DEFAULT NULL COMMENT 'Zeit des Anfangs',
  `ende` datetime DEFAULT NULL COMMENT 'Zeit des Endes',
  `spieler` int(11) NOT NULL COMMENT 'ID des Spielers',
  `incInFaelligkeit` int(11) NOT NULL COMMENT 'Anzahl der Incidents die in Faelligkeit bearbeitet wurden.',
  `incAusFaelligkeit` int(11) NOT NULL COMMENT 'Anzahl der Incidents auserhalb der Falligkeit.',
  `durchKundenbewertung` int(11) NOT NULL COMMENT 'Durchschnittliche Kundenbewertung.',
  `zaehler` int(11) NOT NULL COMMENT 'Erreichter Zahelerstand.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Spieltabelle';

--
-- Daten für Tabelle `spiel`
--

INSERT INTO `spiel` (`spielID`, `spielphase`, `runde`, `anfang`, `ende`, `spieler`, `incInFaelligkeit`, `incAusFaelligkeit`, `durchKundenbewertung`, `zaehler`) VALUES
(1, 'Einleitung', NULL, NULL, NULL, 1, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `verbesserung`
--

CREATE TABLE `verbesserung` (
  `verbesserungID` int(11) NOT NULL,
  `bezeichnung` text NOT NULL,
  `vorraussetzung` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `verbesserung`
--

INSERT INTO `verbesserung` (`verbesserungID`, `bezeichnung`, `vorraussetzung`) VALUES
(1, 'Programmierung Level 2', 'Programmierung Level 1'),
(2, 'Programmierung Level 3', 'Programmierung Level 2');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `aufgaben`
--
ALTER TABLE `aufgaben`
  ADD PRIMARY KEY (`aufgabenID`);

--
-- Indizes für die Tabelle `fachlichefaehigkeiten`
--
ALTER TABLE `fachlichefaehigkeiten`
  ADD PRIMARY KEY (`level`);

--
-- Indizes für die Tabelle `faehigkeiten`
--
ALTER TABLE `faehigkeiten`
  ADD PRIMARY KEY (`faehigkeitenID`);

--
-- Indizes für die Tabelle `incident`
--
ALTER TABLE `incident`
  ADD PRIMARY KEY (`incID`),
  ADD KEY `aufgabenID` (`aufgabenID`),
  ADD KEY `benoetigteFachlFaehigkeit` (`benoetigteFachlFaehigkeit`);

--
-- Indizes für die Tabelle `interneaufgaben`
--
ALTER TABLE `interneaufgaben`
  ADD PRIMARY KEY (`aufgabe`);

--
-- Indizes für die Tabelle `kategorie`
--
ALTER TABLE `kategorie`
  ADD PRIMARY KEY (`kategorieID`),
  ADD KEY `fachlicheFaehigkeit` (`fachlicheFaehigkeit`);

--
-- Indizes für die Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  ADD PRIMARY KEY (`mitarbeiterID`);

--
-- Indizes für die Tabelle `nutzer`
--
ALTER TABLE `nutzer`
  ADD PRIMARY KEY (`nutzerID`);

--
-- Indizes für die Tabelle `persoenlichefaehigkeiten`
--
ALTER TABLE `persoenlichefaehigkeiten`
  ADD PRIMARY KEY (`faehigkeit`);

--
-- Indizes für die Tabelle `spiel`
--
ALTER TABLE `spiel`
  ADD PRIMARY KEY (`spielID`),
  ADD KEY `spieler` (`spieler`);

--
-- Indizes für die Tabelle `verbesserung`
--
ALTER TABLE `verbesserung`
  ADD PRIMARY KEY (`verbesserungID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `aufgaben`
--
ALTER TABLE `aufgaben`
  MODIFY `aufgabenID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `spiel`
--
ALTER TABLE `spiel`
  MODIFY `spielID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `incident`
--
ALTER TABLE `incident`
  ADD CONSTRAINT `incident_ibfk_1` FOREIGN KEY (`aufgabenID`) REFERENCES `aufgaben` (`aufgabenID`),
  ADD CONSTRAINT `incident_ibfk_2` FOREIGN KEY (`benoetigteFachlFaehigkeit`) REFERENCES `faehigkeiten` (`faehigkeitenID`);

--
-- Constraints der Tabelle `interneaufgaben`
--
ALTER TABLE `interneaufgaben`
  ADD CONSTRAINT `interneaufgaben_ibfk_1` FOREIGN KEY (`aufgabe`) REFERENCES `aufgaben` (`aufgabenID`);

--
-- Constraints der Tabelle `kategorie`
--
ALTER TABLE `kategorie`
  ADD CONSTRAINT `kategorie_ibfk_1` FOREIGN KEY (`fachlicheFaehigkeit`) REFERENCES `faehigkeiten` (`faehigkeitenID`);

--
-- Constraints der Tabelle `persoenlichefaehigkeiten`
--
ALTER TABLE `persoenlichefaehigkeiten`
  ADD CONSTRAINT `persoenlichefaehigkeiten_ibfk_1` FOREIGN KEY (`faehigkeit`) REFERENCES `faehigkeiten` (`faehigkeitenID`);

--
-- Constraints der Tabelle `spiel`
--
ALTER TABLE `spiel`
  ADD CONSTRAINT `spiel_ibfk_1` FOREIGN KEY (`spieler`) REFERENCES `nutzer` (`nutzerID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;