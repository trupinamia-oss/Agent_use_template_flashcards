##1
Net Worth Tracker
Zweck: 
Eine kleine Website, die auf einen Blick zeigt, wie viel ich insgesamt besitze: Bargeld, Girokonto (Bankomatkarte), Gold, ETFs, minus Schulden wie einen Kredit. Ich trage Einnahmen und Ausgaben ein, und kriege daraus ein errechnet Gesamtvermögen, als auch die jeweilige Vermögensaufteilung (Grafik).

Nutzer: nur ich, vorerst am Laptop Browser
Problem heute: Mein Geld liegt an mehreren Orten. Ich weiß nie genau, wie viel ich gerade habe und wofür ich im Monat am meisten ausgebe.

Nutzen: Ein Gesamtbetrag, eine Verteilung nach Anlageform und eine Monatsübersicht der Ein- und Ausgaben.

1.	Konten (Startwerte), als Liste oder Tabelle
2.	Buchungen, über ein Formular eingegeben
Feld		
Datum		
Art		
Konto		
Zielkonto		
Kategorie		
Betrag in €		
Notiz		

Umbuchungen sollen auch möglich sein 
Alle Ausgaben werden von JavaScript aus den Daten erzeugt und nach jeder neuen Buchung sofort neu gezeichnet.
1.	Gesamtvermögen als große Zahl: Summe aller Konten minus Schulden. Mit den Startwerten oben sind das 150 + 2.300 + 1.800 + 4.500 − 3.000 = 5.750 €.
2.	Konten-Übersicht als Tabelle: eine Zeile pro Konto mit aktuellem Stand. Negative Beträge (Kredit) erscheinen rot.
3.	Verteilung als Kreisdiagramm (Chart.js): welcher Anteil des Vermögens in Bargeld, Girokonto, Gold und ETFs liegt.
4.	Monatsübersicht als Balkendiagramm: Einnahmen und Ausgaben pro Monat nebeneinander, als zwei Datasets wie in der Chart-Übung.
5.	Buchungsliste: die letzten Buchungen als Liste, neueste oben. Einnahmen grün, Ausgaben rot, jede mit Löschen-Button.
Benutzeroberfläche
Eine einzige Seite mit fünf Bereichen: oben das Gesamtvermögen, links Eingabeformular und Kontenstand, rechts zwei Diagramme, unten die Buchungsliste.

Außerdem soll es in schönen Pastelfarben gehalten werden

##2 
schönere farben und größere Farbunterschiede
es sollte die option geben in einem formular die werte auch einzutragen - den Kontostand eingeben und Einnahmen und ausgaben eintragen 

##3 
ros und lila Töne
die bestehende tabelle soll aktualisiert werden und nicht gedoppelt mit einem neuen Wert 

##4
die Kategorien sollen in einem eigenen getrennten formular zu welchem man nur abspringt vom user gestalten werden können und dann im tropdown menü ausgewählt werden - so kann man ausgaben zu gewissen kategorien tracken und sich als grafik ausgeben lassen (zb. Food, Clothes, etc.) und hat nicht immer eine neue kategorie,da man es als freitext einträgt - dazu hat man dann die notiz 

##5
Kategorien sollen auch symbole haben also nicht nur das wort sondern auch eine abbildung 

##6 es soll auch den absprung kontostand verwalten geben dieser soll getrennt werden vom Dropdown menü 

##7 
bei kontostand verwalten soll es auch die option geben neue konten, karten etc hinzuzufügen 