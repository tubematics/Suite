# Mask applyai Vision-Plugin

<Div style = "float: left;">
<Img src = "./example_in.jpg" width = "300" alt = "Eingabebild">
<Img src = "./example_out.jpg" width = "300" alt = "Ausgangsbild">
</ Div>

## Beschreibung
Dieses applyai Plughin kalibriert die Kamera. Es werden eine bestimmte Anzahl an Bildern mit einem Schachbrett aufgenommen. Pro Aufnahme wird das Bild abgespeichert und die Ecken des Schachbretts auf dem Bild detektiert. Sobald alle Aufnahmen genommen wurden, findet die Kalibrierung statt.Gewonnene Kameraparameter werden in Numpy Dateien abgespeichert. 

## Variablen
- Anzahl aufgenommener Bilder
- Anzahl aufzunehmender Bilder
- Vektor, der für jedes Bild beschreibt, wie das Schachbrettmuster aussehen soll
- Vektor, der für jedes Bild beschreibt, wie das Schachbrett aussieht

## Ausgabe
- Aufgenommened Bild mit detektiertem Schachbrett
- Aufgenommenes Bild mit mittlerem absoluten Fehler 

## Weitere Informationen
- [Die applyai Vision Bildverarbeitungs-Software] (../ README.md)
- [Wie applyai Vision Plugins installieren] (../ plugin-installation.md)
- [Standard applyai Vision Plugin API-Beschreibung] (../ plugin-standard-api.md)
- [Autoren] (../ Authors.md)
- [Lizenz] (../ License.md)