// Inhalte aus "Stevie · Trainingsplan" V5.2 (Oktober 2026)
window.PLAN = {
  baro: [
    { n: 0, name: 'RUHIG', short: 'weiter oder zufrieden aufhören',
      signs: ['kaut wieder oder frisst', 'Ohren seitlich und locker', 'Kopf auf normaler Höhe', 'steht gleichmäßig auf allen vier Beinen', 'weiche Körperlinie'],
      todo: 'Weitermachen. Oder, oft die beste Wahl: zufrieden aufhören.' },
    { n: 1, name: 'AUFMERKSAM', short: 'nicht steigern',
      signs: ['Kauen stoppt', 'Kopf etwas höher', 'Ohren nach vorn auf euch gerichtet', 'kurzes Anspannen', 'Blick zur Hand', 'kleine Gewichtsverlagerung'],
      todo: 'Nicht steigern. Den gleichen Schritt wiederholen oder 10 bis 20 Sekunden Pause.' },
    { n: 2, name: 'ACHTUNG', short: 'sofort leichter',
      signs: ['Summen', 'Kopf hoch und weggedreht, Hals steil', 'Ohren angelegt', 'Körper hart oder eingefroren', 'Fuß wird entlastet oder hochgezogen', 'Schwanzhaltung verändert sich deutlich', 'Blick oder Schritt Richtung Treppe'],
      todo: 'Sofort leichter: Hand höher, kürzer, mehr Abstand. Erst weiter, wenn Stevie wieder bei 0 oder 1 ist.' },
    { n: 3, name: 'STOPP', short: 'ruhig beenden',
      signs: ['Wegspringen', 'Kicken', 'Kushen (Hinlegen)', 'Spucken oder Spuckdrohung (Ohren flach, Kopf hoch, Unterlippe hängt)', 'Alarmruf', 'Flucht hinter die Treppe'],
      todo: 'Session ruhig beenden, Abstand herstellen. Nächstes Mal ein Level tiefer anfangen.' }
  ],
  signals: ['Summen', 'Kauen stoppt', 'Ohren angelegt', 'Einfrieren', 'Fuß hochgezogen', 'Anlehnen', 'Weggehen', 'Blick zur Treppe', 'Kushen', 'Kick / Kickdrohung', 'Spuckdrohung', 'Frisst nicht mehr'],
  xy: [
    ['Er summt.', 'Nicht steigern. Eine Stufe leichter, kurze Pause.'],
    ['Er hebt den Fuß schon bei Berührung.', 'Nicht greifen. Hand höher ansetzen, Kontakt kürzer. Bleibt der Fuß unten, geht die Hand weg: Das ist seine Belohnung.'],
    ['Er zieht einen angehobenen Fuß zurück.', 'Nicht dagegenhalten. Fuß zurückgeben, nächstes Mal kürzer anheben.'],
    ['Er lehnt sich an euch.', 'Fuß zurückgeben. Mit der Hüfte in kleinen, sanften Impulsen von euch wegschieben, bis er wieder selbst steht.'],
    ['Er friert ein.', 'Druck rausnehmen und auf eine weichere Haltung warten.'],
    ['Er geht weg.', 'Nicht folgen. Neu sortieren, leichter weitermachen oder beenden.'],
    ['Er kusht.', 'Nicht am Boden weitermachen. Beenden oder zu einer ganz leichten Aufgabe zurück.'],
    ['Er kickt oder droht zu kicken.', 'Abstand. Heute keine Beinarbeit mehr, nächstes Mal deutlich leichter. Passiert das wiederholt: erfahrene Hilfe dazuholen.'],
    ['Er hört auf zu fressen.', 'Ein Stresssignal, kein Ungehorsam. Intensität herunterfahren.']
  ],
  levels: [
    { n: 0, name: 'Nichts passiert', meta: 'Alltag · täglich, nebenbei · ab Tag 1, durchgehend',
      goal: 'Stevie lernt: Menschen im Stall bedeuten nicht automatisch, dass gleich etwas mit ihm passiert.',
      think: 'Ihr kommt rein und … nichts passiert? Verdächtig. Aber gut.',
      steps: ['Bewegt euch bei der Stallarbeit ruhig und vorhersehbar. Kein Anstarren, kein direktes Zugehen auf Stevie.', 'Kommt Stevie von sich aus näher, passiert: nichts. Genau dieses Nichts ist der Lernstoff.', 'Außerhalb von Sessions wird Stevie nicht angefasst. Auch nicht „nur kurz“, wenn er gerade günstig steht.', 'Die Treppe ist tabu: nicht hinterher, nicht hineingreifen, dort nichts verlangen.', 'Judiths Gute-Nachricht-Ritual läuft täglich.', 'Merkt euch Stevies Wohlfühlabstand: Ab welcher Entfernung hebt er den Kopf oder geht weg? Das ist eure Startlinie für Level 1.'],
      next: ['Stevie bleibt sichtbar und frisst weiter, während ihr im Stall arbeitet.', 'Er nutzt die Treppe seltener.', 'Er kommt zur Futterschale, während Judith noch im Stall ist.'],
      hakt: [['Er geht weg.', 'Nicht folgen.'], ['Er versteckt sich hinter der Treppe.', 'Abstand vergrößern, ihn in Ruhe lassen.'], ['Er kommt nah heran.', 'Nicht die Chance nutzen und anfassen.']],
      minis: ['Stevie bleibt sichtbar, obwohl jemand reinkommt.', 'Er frisst weiter, während ihr in der Nähe arbeitet.', 'Wir haben eine Annäherung von ihm bewusst ohne Griff enden lassen.'],
      box: ['Hinweis', 'Level 0 läuft die ganzen 12 Wochen mit. Es ist das Fundament, auf dem alles andere steht.'] },
    { n: 1, name: 'Kommen und Gehen', meta: 'Session · 2 bis 3 Minuten · Woche 1 bis 2',
      goal: 'Annäherung endet auch ohne Zugriff. Ihr geht, bevor Stevie gehen muss.',
      think: 'Er kommt. Er geht. Ich bleib einfach stehen. Klappt ja.',
      steps: ['Beginnt an eurer Startlinie aus Level 0, an Stevies Platz oder dort, wo er gerade entspannt steht. Nie an der Treppe.', 'Seitlich, auf Höhe der Schulter: einen kleinen Schritt näher. 1 bis 2 Sekunden stehen bleiben.', 'Dann geht ihr selbst einen Schritt zurück oder dreht den Oberkörper ab, bevor Stevie ausweicht.', '3 bis 5 solcher Runden pro Session. Den Abstand erst verkleinern, wenn Stevie beim bisherigen locker bleibt.', 'Ziel am Ende: Ihr steht seitlich auf Armlänge neben ihm, und er bleibt bei 0 oder 1.'],
      next: ['Ihr könnt bis auf Armlänge herankommen und wieder gehen, ohne dass Stevie ausweicht.', '2 gute Sessions in Folge.'],
      hakt: [['Kopf hoch, Körper hart.', 'Nicht näher. Zurücktreten.'], ['Er geht mehrere Schritte weg.', 'Nächstes Mal weiter außen beginnen.'], ['Er geht Richtung Treppe.', 'Session beendet. Nicht hinterher.']],
      minis: ['Erster Schritt näher ohne Ausweichen.', 'Stevie schaut und bleibt trotzdem stehen.', 'Wir sind gegangen, bevor er gehen musste.'],
      box: ['Coco, wenn es sich anbietet', 'Steht Coco gerade entspannt neben euch, sind ein, zwei Kreise mit dem Handrücken an seiner Schulter eine gute Übung. Kusht er, ist das völlig in Ordnung: Übung vorbei, nicht nachsetzen.'] },
    { n: 2, name: 'Hallo, Schulter', meta: 'Session · 2 bis 3 Minuten · Woche 2 bis 3',
      goal: 'Der erste Kontakt: kurz, leicht, ohne Festhalten.',
      think: 'Kurz. Weich. Schon vorbei. Okay.',
      steps: ['1 bis 2 bekannte Runden aus Level 1 zum Aufwärmen.', 'Neben Stevie stellen, Blickrichtung zu seinem Hinterteil. So steht ihr parallel zu ihm, nicht frontal.', 'Mit dem Handrücken einen kleinen Kreis oben an der Schulter (Zone 1), etwa 1 Sekunde. Dann Hand weg und einen halben Schritt zurück.', 'Ein einziger guter Kontakt kann die ganze Session sein.', 'Über mehrere Sessions: 2 bis 3 Kreise hintereinander, jeder 1 bis 2 Sekunden.'],
      next: ['3 ruhige Mini-Kontakte pro Session, danach entspannt sich Stevie schnell wieder.', '2 gute Sessions in Folge.'],
      hakt: [['Er weicht schon vor der Hand aus.', 'Zurück zu Level 1.'], ['Er springt bei der Berührung weg.', 'Nächstes Mal nur die Hand in die Nähe bringen, ohne Kontakt.'], ['Es klappt einmal richtig gut.', 'Nicht verlängern. Gutes Ende.']],
      minis: ['Erster Kontakt ohne sichtbares Anspannen.', 'Stevie senkt nach der Berührung wieder den Kopf.', 'Wir haben nach einem einzigen guten Kontakt aufgehört.'],
      box: ['Warum der Handrücken?', 'Mit dem Handrücken kann man nicht greifen. CAMELIDynamics beginnt bewusst so, weil es für das Tier weniger nach Zugriff aussieht. — Judith ist ab jetzt als Beobachterin dabei: Signale benennen, bei Bedarf „leichter“ sagen.'] },
    { n: 3, name: 'Kreise auf dem Rücken', meta: 'Session · 3 bis 4 Minuten · Woche 3 bis 4',
      goal: 'Hände am Körper werden zur bekannten, harmlosen Routine. Dazu kommt die Hand auf dem Rücken: die Vorbereitung für alles, was danach kommt.',
      think: 'Die Hand auf meinem Rücken? Fühlt sich … stabil an.',
      steps: ['Mit 1 bis 2 bekannten Kreisen an der Schulter beginnen.', 'Die Kreise wandern über Widerrist und Rücken (Zone 2). Jeder Kreis 1 bis 2 Sekunden, dazwischen 3 bis 5 Sekunden Pause.', 'Neu: Die Hand oder den Unterarm ruhig auf den Rücken legen (die „Topline“), 1 bis 2 Sekunden, wieder weg. Kein Druck, nur Auflegen.', 'Die Topline-Hand über mehrere Sessions auf 3 bis 5 Sekunden steigern.', 'Nach 4 bis 6 guten Kontakten ist Schluss.'],
      next: ['Kreise an Schulter und Rücken bleiben bei 0 oder 1.', 'Die Hand liegt 5 Sekunden ruhig auf der Topline.', '2 gute Sessions in Folge.'],
      hakt: [['Die Topline-Hand macht ihn nervös.', 'Nur kurz auflegen, nicht steigern.'], ['Er geht weg.', 'Nicht folgen. An einer leichteren Stelle neu beginnen.'], ['STOPP.', 'Session beenden.']],
      minis: ['Erster Kreis auf dem Rücken ohne Anspannen.', 'Die Hand lag 3 Sekunden auf der Topline.', 'Stevie hat während der Session wiedergekäut.'],
      box: ['Coco, wenn es sich anbietet', 'Die Hand kurz auf seinen Rücken legen und spüren, wie sich Gewicht unter der Hand anfühlt. Nur, wenn er von sich aus steht. Nichts erzwingen.'] },
    { n: 4, name: 'Abwärts', meta: 'Session · 3 bis 5 Minuten · Woche 4 bis 5 · pro Bein abhaken',
      goal: 'Die Berührung wandert über Brust und Flanke bis ans obere Bein. Alle Füße bleiben am Boden.',
      think: 'Bis zum Bein? Na gut. Mein Fuß bleibt aber unten.',
      steps: ['Bekannte Kreise an Schulter und Rücken.', 'Topline-Hand auflegen. Die andere Hand kreist von der Schulter abwärts (Zone 3): pro Wiederholung nur wenige Zentimeter Neuland, dann zurück in bekanntes Gebiet.', 'Oberes Vorderbein oberhalb des „Knies“ (Zone 4): kurz kreisen, zurück zur Schulter.', 'Hinterbein später und genauso: von der Hüfte zum Oberschenkel, oberhalb des Sprunggelenks.', 'Hebt Stevie einen Fuß: nicht nehmen. Hand höher, Kontakt kürzer.'],
      next: ['Schulter, Rumpf und der obere Teil aller vier Beine bleiben bei 0 oder 1.', '2 gute Sessions in Folge, pro Bein auf der Levelkarte abhaken.'],
      hakt: [['Ein Fuß geht hoch.', 'Hand eine Zone höher.'], ['Ein Hinterbein ist deutlich schwieriger.', 'Eigenes Tempo. Die Vorderbeine dürfen vorgehen.'], ['ACHTUNG.', 'Nicht tiefer gehen.']],
      minis: ['Erster ruhiger Kreis am oberen Vorderbein.', 'Erster ruhiger Kreis am Oberschenkel hinten.', 'Ein Fuß blieb unten, obwohl er früher hochgegangen wäre.'],
      box: ['Genau das ist der Plan, Stevie.', 'In diesem Level ist der Fuß am Boden die richtige Antwort, nicht das Anheben. — Judith übernimmt ab hier eigene Mini-Sessions in Level 2 bis 3. Exakt gleiche Technik, keine eigene Variante.'] },
    { n: 5, name: 'Füße bleiben unten', meta: 'Session, pro Bein · 3 bis 5 Minuten · Woche 5 bis 6',
      goal: 'Die Hand kann bis zur Fessel wandern, und Stevie lässt den Fuß belastet am Boden. Ihr lernt, Gewichtsverlagerungen zu spüren, bevor der Fuß hochgeht.',
      think: 'Hand am Fuß. Fuß bleibt unten. Wer hätte das gedacht.',
      steps: ['Bekannte Zonen kurz abfragen.', 'Topline-Hand auflegen. Kreise 5 bis 10 cm tiefer als zuletzt, dann sofort wieder hoch.', 'Fuß bleibt belastet: Hand weg. Das ist die Belohnung.', 'Über mehrere Sessions bis zur Fessel (Zone 5). Nicht in einer Einheit bis ganz unten.', 'Mit einer Stelle enden, die sicher klappt.'],
      next: ['Hand bis zur Fessel, der Fuß bleibt überwiegend unten.', 'Ihr spürt Gewichtsverlagerungen, bevor der Fuß hochgeht.', '2 gute Sessions in Folge, pro Bein.'],
      hakt: [['Der Fuß hebt ab.', 'Nicht nachfassen. Einen Abschnitt höher zurück.'], ['Das Gewicht wandert stark.', 'Kürzer und weniger tief.'], ['Ein Hinterbein droht oder kickt.', 'Beinarbeit für heute beenden. Dort zwei Stufen leichter weitermachen.']],
      minis: ['Erste ruhige Berührung an der Fessel vorn.', 'Wir haben eine Gewichtsverlagerung früh gespürt und aufgefangen.', 'Erste ruhige Berührung am unteren Hinterbein.'],
      box: ['Der Kern dieses Levels', 'Beim Berühren soll das Gewicht auf dem Bein bleiben, das ihr berührt. Dann kann Stevie den Fuß leicht am Boden lassen. Spürt ihr über die Topline-Hand, dass er das Gewicht von diesem Bein wegnimmt: Mit der Topline-Hand sanft zurück in die Balance bringen und die Beinhand gleichzeitig zurück in eine sichere, höhere Zone.'] },
    { n: 6, name: 'Kurz hoch, gleich zurück', meta: 'Session, pro Bein · höchstens 5 Minuten · Woche 6 bis 7',
      goal: 'Der Fuß hebt sich aus der Balance heraus, nicht durch Ziehen. Und er kommt sofort zurück.',
      think: 'Fuß hoch?! … Oh. Schon wieder unten. Na dann.',
      steps: ['Für das linke Vorderbein: links neben Stevie stehen, Blick nach hinten. Linke Hand auf der Topline. (Rechts spiegelbildlich.)', 'Rechte Hand hinter das Vorderbein, knapp oberhalb des „Knies“. Nicht unten am Fuß.', 'Mit der Topline-Hand das Gewicht sanft auf das andere Vorderbein verlagern.', 'Ratchet-Signal: 3 bis 4 kleine Impulse im Sekundentakt, jeder etwas deutlicher als der vorige, dazwischen ganz kurz minimal nachlassen. Richtung: Knie nach vorn, nicht nach oben.', 'Sobald der Fuß den Boden verlässt: sofort zurück auf den Boden. Lieber mehrere kurze Wiederholungen als eine lange (CAMELIDynamics nennt etwa zehn; bei Stevie lieber weniger, dafür alle gut).'],
      next: ['Der Fuß löst sich ohne Kampf nach einem leichten Signal.', 'Stevie bleibt danach ruhig.', '2 gute Sessions in Folge, pro Bein.'],
      hakt: [['Knie wird steif, Kraft gegen Kraft.', 'Nicht stärker ziehen. Balance neu, Signal kleiner, notfalls zurück zu Level 5.'], ['Er zieht hektisch zurück.', 'Sofort zurückgeben. Nächstes Mal nur bis zur Gewichtsverlagerung.'], ['Er geht immer wieder einen Schritt weg.', 'Bei Level 5 bleiben und das ruhige Stehen an der Wand festigen, bevor ihr wieder hebt.']],
      minis: ['Der erste Fuß hat sich ohne Ziehen gelöst.', 'Stevie hat den Fuß zurückbekommen, bevor er ihn einfordern musste.', 'Wir haben den Unterschied zwischen Balanceproblem und Widerstand gespürt.'],
      box: ['Erst trocken üben', 'Das Ratchet-Signal zuerst an Judiths Unterarm üben. Sie sagt, ob die Impulse klar, aber klein sind. So lernt ihr das Timing nicht an Stevie.'] },
    { n: 7, name: 'Drei Beine', meta: 'Session, pro Bein · höchstens 5 Minuten · Woche 7 bis 9',
      goal: 'Stevie trägt sein Gewicht selbst auf drei Beinen: erst 1, dann 3 bis 5 Sekunden.',
      think: 'Drei Beine. Ich. Freihändig. Schaut ihr zu?',
      steps: ['Den Fuß mit dem bekannten Signal lösen und zunächst sofort wieder absetzen.', 'Dann 1 Sekunde halten und zurückgeben. Später 2, dann 3 bis 5 Sekunden. Nur steigern, solange Stevie selbst in Balance bleibt.', 'Lehnt er sich an euch: Fuß zurück, mit der Hüfte in kleinen Impulsen sanft wegschieben, neu balancieren. Nicht tragen.', 'Steht er stabil, kann die Topline-Hand zum Röhrbein wechseln und den Fuß stützen. So wird eine Hand frei.', 'Hinterbein: Hand oberhalb und hinter dem Sprunggelenk. Gleiche Logik, mehr Zeit.'],
      next: ['Ein Vorderfuß bleibt 3 bis 5 Sekunden oben, ohne dass Stevie sich anlehnt.', '2 gute Sessions in Folge, pro Bein.'],
      hakt: [['Er schwankt oder lehnt sich an.', 'Sofort kürzer, Fuß zurück, Balance neu.'], ['Das Hinterbein ist deutlich schwieriger.', 'Dort bei Level 5 oder 6 bleiben.'], ['Kickdrohung.', 'Abstand. Heute kein Hinterbein mehr.']],
      minis: ['1 Sekunde auf drei Beinen.', '3 Sekunden, ohne Anlehnen.', 'Die Hand am Röhrbein war okay für Stevie.'],
      box: ['Sicherheit', 'Beim Hinterbein seitlich und nah am Körper arbeiten, nicht weit draußen im Kickbereich. Nie direkt hinter Stevie stehen.'] },
    { n: 8, name: 'Nur Probe', meta: 'Session, pro Bein · höchstens 5 Minuten · Woche 9 bis 10',
      goal: 'Die Schere wird Teil der Routine, ohne dass geschnitten wird.',
      think: 'Klick-klack. Keine Ahnung, was das ist. Tut aber nichts.',
      steps: ['Die Schere zuerst getrennt einführen: in der Hand halten, auf- und zuklappen, während ihr Kreise an der Schulter macht. Noch kein Fuß.', 'Die Schere so griffbereit ablegen, dass niemand mit gehobenem Fuß suchen muss (Jackentasche oder fester Platz).', 'Fuß aufnehmen, zurückgeben. In einer späteren Wiederholung die geschlossene Schere kurz an den Nagel halten.', 'Dann: Schere einmal öffnen und schließen, ohne zu schneiden.', 'Vor jedem Werkzeugkontakt sagt der Trainer laut: „Nur Probe.“ Diese Ansage gilt.'],
      next: ['Das Werkzeug verändert Stevies Stresslevel nicht deutlich.', 'Mehrere Probeschnitte bleiben ruhig.', '2 gute Sessions in Folge.'],
      hakt: [['Das Werkzeug löst ACHTUNG aus.', 'Wieder trennen: nur Werkzeug in der Nähe, ohne Fuß.'], ['Er kusht oder versteckt den Fuß.', 'Zurück zu Level 7. Nicht am Boden weitermachen.'], ['Die Balance wird schlechter, sobald ihr zur Schere greift.', 'Ablageort verbessern, Ablauf vereinfachen.']],
      minis: ['Schere in der Hand, Stevie bleibt ruhig.', 'Schere am Nagel, Stevie bleibt ruhig.', 'Erster kompletter Probeschnitt.'],
      box: null },
    { n: 9, name: 'Ein Schnitt', meta: 'Session, pro Bein · höchstens 5 Minuten · Woche 10 bis 12',
      goal: 'Ein einziger ruhiger Schnitt. Das ist eine komplette, erfolgreiche Session.',
      think: 'Das war’s? Dafür der ganze Aufwand?',
      steps: ['Werkzeug-Check: scharf, sauber, leichtgängig (siehe Technik).', 'Das sicherste Bein wählen und Stevie sauber balancieren.', 'Vor dem Schnitt laut sagen: „Ein Schnitt.“ Fuß aufnehmen und einen kleinen, vorsichtigen Schnitt setzen.', 'Fuß sofort zurückgeben. Braucht Stevie den Fuß zwischendurch, bekommt er ihn. Auch mitten im Nagel.', 'In den nächsten Sessions: zwei Schnitte, dann eine ganze Zehe, dann ein ganzer Fuß. Vier Füße in einer Session sind kein Ziel.'],
      next: ['Ein Fuß ist in einer ruhigen Session komplett geschnitten.', 'Danach kommt der nächste Fuß dran.'],
      hakt: [['Er erschrickt nach dem Schnitt.', 'Schluss für heute. Nächstes Mal wieder Level 8.'], ['Die Schere braucht viel Kraft.', 'Nicht drücken. Werkzeug prüfen.'], ['Stark überwachsene oder verformte Nägel.', 'In mehreren kleinen Terminen kürzen, im Zweifel fachlichen Rat holen.']],
      minis: ['Der erste echte Schnitt.', 'Die erste ganze Zehe.', 'Der erste ganze Fuß.'],
      box: ['Wichtig', 'Lieber zu wenig als zu viel schneiden. Ein zu tief geschnittener Nagel kann bluten und schmerzen, und das wäre ein großer Rückschritt fürs Training. — Und danach? Ab und zu eine kurze Bein-Session ohne Schnitt einbauen. So bleibt Fußpflege für Stevie etwas Normales.'] }
  ],
  letters: [
    { id: 'l1', unlock: 'Level 1 geschafft', title: 'Post von Stevie · Nr. 1', body: 'Hallo ihr zwei,\n\nich hab da mal eine Frage. Ihr kommt näher. Ihr bleibt stehen. Ihr geht wieder. Jeden Tag. Ist das ein Tanz? Soll ich mitmachen?\n\nIch hab mit Coco darüber gesprochen. Coco hat sich hingelegt. Typisch.\n\nEhrlich gesagt: Ich find’s gut. Ihr seid ziemlich berechenbar geworden. Berechenbar ist meine Lieblingseigenschaft bei Menschen. Gleich nach „hat Futter dabei“.\n\nApropos: Judith, die Schale gestern war ein bisschen knapp bemessen. Nur so als Hinweis.\n\nStevie\n\nP.S. Weitermachen. Aber langsam.' },
    { id: 'l2', unlock: 'Level 3 geschafft', title: 'Post von Stevie · Nr. 2', body: 'Liebe Menschen,\n\nkurzes Update aus dem Stall: Ihr habt mich angefasst. Mehrmals. Und ich bin nicht weggelaufen. Ich bin selbst ein bisschen überrascht.\n\nDiese Kreise mit dem Handrücken sind übrigens gar nicht so schlecht. Etwas weiter links wäre noch besser.\n\nFabi, du machst beim Konzentrieren so ein Gesicht. Das ist lustig. Mach ruhig weiter so.\n\nIch hab gehört, als Nächstes geht’s abwärts. Abwärts wohin genau? Meine Beine sind sehr persönlich. Wir reden noch.\n\nEuer Stevie\n(entspannt, aber wachsam)' },
    { id: 'l3', unlock: 'Level 5 geschafft', title: 'Post von Stevie · Nr. 3', body: 'Hallo Team,\n\nich muss was gestehen. Als eure Hand zum ersten Mal an meinem Fuß war, hab ich kurz überlegt, dramatisch zu werden. Dann hab ich’s gelassen. Zu anstrengend. Und die Hand war ja auch gleich wieder weg.\n\nIhr seid inzwischen ziemlich gut im Aufhören. Fast schon zu gut. Manchmal hätte ich noch gekonnt. Hab ich aber nicht gesagt. Taktik.\n\nWas ich nicht verstehe: warum Stupsi neuerdings immer so guckt, wenn ihr mit mir übt. Ich glaube, er ist neidisch. Sagt ihm nichts.\n\nDas nächste Level heißt „Kurz hoch, gleich zurück“. Ich nehme euch beim Wort. Gleich zurück. Wirklich gleich.\n\nStevie' },
    { id: 'l4', unlock: 'Level 7 geschafft', title: 'Post von Stevie · Nr. 4', body: 'Liebe Judith, lieber Fabi,\n\nEilmeldung aus dem Stall: Ich kann auf drei Beinen stehen. Freihändig. Ohne mich anzulehnen.\n\nCoco hat es gesehen und sich vor Schreck hingelegt. Okay, er legt sich immer hin. Aber diesmal war es Respekt.\n\nIch finde, das verdient eine Extraportion. Judith weiß, was ich meine.\n\nJetzt sagt ihr, es kommt eine Schere. Ich hab mir sagen lassen: „Nur Probe“ heißt nur Probe. Ich hab’s mir gemerkt. Ich merke mir alles. Das wisst ihr ja inzwischen.\n\nEuer Stevie\nGleichgewichtskünstler' },
    { id: 'l5', unlock: 'Level 9 geschafft – oder an einem Tag, an dem ihr ihn braucht', title: 'Ein letzter Brief von Stevie', body: 'Liebe Judith, lieber Fabi,\n\nich geb’s zu: Am Anfang war ich mir nicht sicher, was ihr vorhabt. Ihr kamt in den Stall, und ich dachte: Gleich wird’s eng. Also bin ich hinter die Treppe. War ja logisch.\n\nAber dann ist etwas Komisches passiert. Ihr kamt rein, und es passierte nichts. Ihr kamt näher und seid wieder gegangen. Eine Hand an meiner Schulter, und schon war sie wieder weg. Mein Fuß ging hoch und kam sofort zurück. Jedes Mal. Ohne Ausnahme.\n\nIhr habt aufgehört, wenn es gut war. Ihr habt gemerkt, wenn ich summe. Ihr habt mich nie hinter der Treppe gesucht. Und Judith hat mir jeden Tag etwas Gutes hingestellt, ohne etwas dafür zu wollen. Das hab ich mir gemerkt.\n\nDanke, dass ihr mir gezeigt habt, dass das alles gar nicht schlimm ist. Danke, dass ihr geduldig geblieben seid, auch an den Tagen, an denen ich es euch schwer gemacht habe. Und danke, dass ihr mich nicht gezwungen, sondern überzeugt habt.\n\nMeine Füße sind jetzt übrigens ziemlich schick. Coco und Stupsi gucken schon ein bisschen neidisch.\n\nEuer Stevie\n\nP.S. Die Treppe behalte ich trotzdem. Man weiß ja nie.' }
  ],
  roadmap: [
    { w: '1 bis 2', from: 1, to: 2, phase: 'Ankommen', lv: '0 und 1', side: 'Judiths Futterschale startet. Fabi übt das Ratchet-Timing trocken an Judiths Unterarm.', exp: [0, 1] },
    { w: '2 bis 4', from: 3, to: 4, phase: 'Erste Berührung', lv: '2 und 3', side: 'Judith beobachtet mit. Coco nur, wenn es sich gerade anbietet.', exp: [2, 3] },
    { w: '4 bis 6', from: 5, to: 6, phase: 'Abwärts', lv: '4 und 5', side: 'Vorderbeine zuerst. Judith übernimmt Level 2 bis 3.', exp: [4, 5] },
    { w: '6 bis 8', from: 7, to: 8, phase: 'Fuß hoch', lv: '6 und 7 (vorn)', side: 'Hinterbeine dürfen bei Level 4 bis 5 sein. Woche 8: Woche-8-Check.', exp: [6, 7] },
    { w: '9 bis 12', from: 9, to: 99, phase: 'Probe und Schnitt', lv: '8 und 9 (vorn)', side: 'Hinterbeine so weit wie möglich. Judith trainiert eigenständig.', exp: [8, 9] }
  ],
  precheck: ['Stevie wirkt fit und bewegt sich normal.', 'Wir sind ruhig und haben gerade keinen Zeitdruck.', 'Wir wissen, was heute das eine neue Ziel ist.', 'Coco und Stupsi sind in der Nähe.', 'Treppe und Weg nach vorn sind frei.', 'Werkzeug nur, wenn es heute Teil der Aufgabe ist.', 'Stop-Wort ist klar.'],
  postcheck: ['Wir haben aufgehört, als es gut war.', 'Wir wissen, womit die nächste Session beginnt.', 'Eine Zeile ins Protokoll.'],
  goodday: ['Stevie musste nicht kämpfen, um eine Pause zu bekommen.', 'Wir haben ein frühes Signal erkannt.', 'Wir haben nach einem ACHTUNG leichter gemacht.', 'Wir haben aufgehört, obwohl noch mehr gegangen wäre.'],
  phases: [
    { t: 0, name: 'Ankommen', hint: 'nichts fordern' },
    { t: 30, name: 'Aufwärmen', hint: 'Bekanntes' },
    { t: 90, name: 'Das Neue', hint: 'genau 1 Schritt – nur hier wird es ein kleines bisschen schwerer' },
    { t: 180, name: 'Leicht', hint: 'Bekanntes' },
    { t: 220, name: 'Gutes Ende', hint: 'Hand weg, gehen' },
    { t: 300, name: 'Fertig', hint: 'Aufhören, solange es gut ist' }
  ]
};

// Wissens-Kapitel (HTML)
window.WISSEN = [
  { id: 'wichtig', no: '1', title: 'Das Wichtigste auf einer Seite', sub: 'Wenn ihr nur eine Seite lest', html: `
    <ol class="rules">
      <li><b>Kurz und oft.</b> 3 bis 5 Minuten pro Session, 4 bis 5 Sessions pro Woche, höchstens eine am Tag. Aufhören, wenn es gut läuft, nicht erst, wenn es kippt.</li>
      <li><b>Eine neue Sache pro Session.</b> Näher oder länger oder tiefer am Bein. Nie zwei Schwierigkeiten auf einmal.</li>
      <li><b>Loslassen, bevor Stevie muss.</b> Die Hand geht weg, der Fuß kommt zurück, ihr tretet zurück: immer einen Moment, bevor Stevie es einfordert. Das ist der Kern des ganzen Plans.</li>
      <li><b>Kein Verfolgen, kein Einklemmen.</b> Stevie hat immer einen freien Weg. Die Treppe bleibt sein Rückzugsort. Dort passiert nie etwas.</li>
      <li><b>Im Zweifel die leichtere Variante.</b> Wenn einer von euch zögert, wird es leichter. Ohne Diskussion.</li>
    </ol>
    <div class="callout red"><b>Euer Stop-Wort: {{STOP}}</b><br>Wer es sagt, bei dem oder der gehen sofort die Hände weg. Keine Diskussion in der Situation, besprochen wird hinterher.</div>
    <h4>Wo wir in 12 Wochen hinwollen</h4>
    <ul class="checks"><li>Stevie bleibt entspannt im Stall, wenn ihr hereinkommt.</li><li>Er lässt sich an Schulter, Körper und Beinen berühren.</li><li>Er gibt einen Fuß kurz ab und hält dabei selbst die Balance.</li><li>Die Vorderfüße sind ruhig geschnitten, die Hinterfüße sind auf einem guten Weg.</li><li>Stevie vertraut euch beiden, nicht nur einer Person.</li><li>Training fühlt sich für alle Beteiligten wieder gut an. Auch für euch.</li></ul>
    <div class="golden">Wir hören so früh auf, dass Stevie nicht lernen muss, uns mit stärkerem Verhalten zum Aufhören zu bringen.</div>
    <div class="stevie-says"><b>P.S. von Stevie</b>Ich mag euch eigentlich. Ich mag nur nicht, wenn’s plötzlich eng wird. Wenn ihr das hinbekommt, bekomm ich den Rest auch hin.</div>` },
  { id: 'baro', no: '2', title: 'Stevie lesen: das Stress-Barometer', sub: 'Die wichtigste Fähigkeit im Plan', html: '{{BARO}}' },
  { id: 'platz', no: '3', title: 'Stevies Platz: Ort und Annäherung', sub: 'Ein fester Ort macht alles berechenbarer', html: `
    <p>Ihr trainiert im normalen Stall. Das hat früher funktioniert, und es funktioniert wieder, wenn der Ort für Stevie berechenbar ist. Deshalb bekommt er einen festen Trainingsplatz: Stevies Platz.</p>
    <h4>So findet ihr Stevies Platz</h4>
    <ul class="checks"><li>An einer geraden Stallwand oder einer stabilen Abtrennung: Eine Seite gibt Halt.</li><li>Nach vorn und zur Seite offen: Stevie kann jederzeit weggehen.</li><li>Trockener, rutschfester Boden und genug Licht.</li><li>Coco und Stupsi in Sicht- und Riechweite.</li><li>Gern in der Nähe des Futterplatzes. Nie an der Treppe, nicht in einer Ecke.</li></ul>
    <h4>So kommt ihr an</h4>
    <ul class="checks"><li>Seitlich, auf Höhe der Schulter. Ruhig und ohne Anstarren.</li><li>Nicht frontal auf Kopf und Brust zu.</li><li>Nicht von direkt hinten: Dort sieht Stevie euch schlecht und erschrickt leichter.</li></ul>
    <div class="callout red"><b>Eine Regel ohne Ausnahme</b><br>Stevie steht nie zwischen euch und einer Wand, ohne dass er nach vorn weg kann. Und ihr steht nie zwischen Stevie und seinem einzigen freien Weg.</div>
    <div class="callout"><b>Optional: ein Stab als verlängerter Arm</b><br>CAMELIDynamics arbeitet oft mit einem steifen Stab („Wand“). Für diesen Plan braucht ihr keinen. Wer ihn ausprobieren möchte: Ein glatter, steifer Stab von etwa 1 bis 1,2 m reicht (Bambus oder Rundholz, Enden abgeklebt). Er wird wie alles Neue eingeführt: erst nur in der Hand halten, dann damit kurz die Schulter berühren, später die Beine entlangstreichen, bevor die Hand dorthin kommt. Nie zum Klopfen oder Drohen.</div>` },
  { id: 'team', no: '4', title: 'Wer macht was', sub: 'Ein Team, klare Rollen', html: `
    <div class="roles">
      <div><b>Fabi</b><span>Trainer</span>Führt die Handling-Sessions: Timing, Berührung, Loslassen. Der Blick ist bei Stevie, nicht beim Werkzeug, nicht beim Gespräch.</div>
      <div><b>Judith</b><span>Gute-Nachricht-Person, später Co-Trainerin</span>Bringt von Tag 1 an das Gute in Stevies Alltag. Beobachtet, benennt Signale und übernimmt Schritt für Schritt eigene Sessions.</div>
      <div><b>Coco</b><span>Übungspartner bei Gelegenheit</span>Steht er gerade entspannt in der Nähe, könnt ihr an ihm Kreise mit dem Handrücken und die Hand auf dem Rücken ausprobieren. Mehr nicht. Coco kusht schnell, und das ist sein gutes Recht.</div>
      <div><b>Stupsi</b><span>Gesellschaft und Bonuskandidat</span>Gibt Stevie Sicherheit, einfach indem er da ist. Bekommt später sein eigenes Programm.</div>
      <div><b>Stevie</b><span>Hauptfigur</span>Darf jederzeit zeigen, dass etwas zu viel ist. Muss nichts „durchziehen“.</div>
    </div>
    <h4>Judiths Weg in vier Phasen</h4>
    <ol class="steps"><li><b>Ab Tag 1 – Gute-Nachricht-Person.</b> Bringt täglich die Futterschale. Fasst Stevie nicht an.</li><li><b>Ab Level 2 – Beobachterin.</b> Schaut bei Sessions zu, benennt Signale und darf jederzeit „leichter“ oder das Stop-Wort sagen.</li><li><b>Ab Level 4 – Co-Trainerin.</b> Übernimmt eigene Mini-Sessions in Levels, die Stevie bei Fabi schon sicher kann, immer eine Stufe darunter.</li><li><b>Ab etwa Woche 9 – Trainerin.</b> Eigene Sessions bis Level 6 oder 7. Ziel: zwei Vertrauenspersonen.</li></ol>
    <div class="callout green"><b>Judiths Gute-Nachricht-Ritual</b><br>Ein- bis zweimal am Tag stellt Judith eine kleine Portion von etwas, das Stevie gern mag, in einer flachen Schale an Stevies Platz. Dann ein paar Schritte zurück, ruhig dableiben oder gehen. Nicht anfassen. Und nicht mit Futter anlocken, um dann anzufassen. Damit es keinen Futterneid gibt: drei Schalen mit Abstand, auch für Coco und Stupsi. Die Menge in die normale Tagesration einrechnen.</div>
    <p>Das klingt unscheinbar, ist aber einer der wichtigsten Bausteine des Plans: Stevie lernt, dass Judiths Nähe Gutes bedeutet, lange bevor eine Hand ins Spiel kommt. Und Judith sammelt von Anfang an Erfolge, die garantiert gelingen.</p>` },
  { id: 'session', no: '5', title: 'So läuft eine Session', sub: 'Immer derselbe Ablauf', html: `
    <h4>Vorher: 30-Sekunden-Check</h4><ul class="checks">{{PRE}}</ul>
    <h4>Das 5-Minuten-Rezept</h4>
    <div class="recipe"><div><b>0:00</b>Ankommen<small>nichts fordern</small></div><div><b>0:30</b>Aufwärmen<small>Bekanntes</small></div><div class="hl"><b>1:30</b>Das Neue<small>genau 1 Schritt</small></div><div><b>3:00</b>Leicht<small>Bekanntes</small></div><div><b>3:40</b>Gutes Ende<small>Hand weg, gehen</small></div></div>
    <div class="callout green"><b>Die Weiter-Regel</b><ul><li>Ein Level ist geschafft nach 2 guten Sessions in Folge, in denen Stevie überwiegend bei 0 oder 1 bleibt.</li><li>Nach einem ACHTUNG wiederholt ihr das Level in der nächsten Session.</li><li>Nach einem STOPP beginnt die nächste Session ein Level tiefer.</li><li>Ab Level 5 gilt die Regel für jedes Bein einzeln.</li></ul><small>Die App wendet diese Regel automatisch an.</small></div>
    <h4>Der Wochenrhythmus</h4><ul class="checks"><li>4 bis 5 Sessions pro Woche, höchstens eine pro Tag, mindestens ein Ruhetag.</li><li>Level 0 (Alltag) und Judiths Futterschale laufen täglich nebenher. Sie zählen nicht als Session.</li><li>Ein schlechter Tag für euch oder für Stevie? Dann ist heute Ruhetag. Auch das ist Training.</li></ul>
    <h4>Nachher: 20-Sekunden-Check</h4><ul class="checks">{{POST}}</ul>
    <h4>Heute war ein guter Tag, wenn …</h4><ul class="checks">{{GOOD}}</ul>` },
  { id: 'fahrplan', no: '6', title: 'Der 12-Wochen-Fahrplan', sub: 'Die Richtung steht fest. Das Tempo bestimmt Stevie.', html: '{{ROADMAP}}' },
  { id: 'level', no: '7', title: 'Die 10 Level', sub: 'Von „Nichts passiert“ bis „Ein Schnitt“', html: '{{LEVELS}}' },
  { id: 'technik', no: '8', title: 'Technik im Detail', sub: 'Zum Nachschlagen und Üben', html: `
    <h4>Kreise mit dem Handrücken</h4><p>Neben dem Alpaka stehen, Blickrichtung nach hinten. Mit dem Handrücken kleine Kreise beschreiben, jeder etwa 1 bis 2 Sekunden. Oben an der Schulter beginnen und sich über viele Sessions nach unten vorarbeiten. Kreise sind besser als ruhiges Liegenlassen der Hand: Sie sind eindeutig, kurz und haben ein klares Ende. Stevie weiß, woran er ist.</p>
    <div class="zones"><span>1 Schulter</span><span>2 Widerrist und Rücken</span><span>3 Brust und Flanke</span><span>4 oberes Bein</span><span>5 unteres Bein bis Fessel</span></div>
    <h4>Gewicht und Balance</h4><div class="duo"><div><b>Berühren</b>Gewicht bleibt auf dem Bein, das ihr berührt: Fuß bleibt unten.</div><div><b>Anheben</b>Gewicht zuerst auf das andere Bein: dann wird der Fuß leicht.</div></div>
    <p>Das ist der wichtigste Gedanke von CAMELIDynamics bei der Fußpflege: Ein Alpaka hebt den Fuß, wenn das Gewicht nicht mehr darauf liegt. Beim Berühren sorgt ihr deshalb dafür, dass das Gewicht auf dem Bein bleibt. Beim Anheben verlagert ihr es zuerst auf die andere Seite. Dann wird der Fuß fast von allein leicht.</p>
    <h4>Das Ratchet-Signal</h4>{{RATCHET}}<p>„Ratchet“ heißt Ratsche: Der Druck steigt in kleinen Stufen statt als ein langer Zug. Jeder Impuls ist etwas deutlicher als der vorige, dazwischen lasst ihr ganz kurz minimal nach. Etwa eine Stufe pro Sekunde, meist reichen 3 bis 4. Sobald der Fuß abhebt, ist das Signal sofort vorbei und der Fuß geht zurück auf den Boden.</p>
    <h4>Handpositionen</h4><ol class="steps abc"><li><b>A · Topline-Hand:</b> liegt auf dem Rücken, liest und lenkt das Gewicht.</li><li><b>B · Vorderbein:</b> hinter dem Bein, knapp oberhalb des „Knies“. Bewegung nach vorn, nicht nach oben.</li><li><b>C · Hinterbein:</b> oberhalb und hinter dem Sprunggelenk. Nah am Körper bleiben.</li></ol>
    <div class="callout red"><b>Sicherheit</b><br>Nie direkt hinter Stevie stehen; Alpakas kicken vor allem nach hinten und zur Seite. Beim Vorderbein seitlich auf Schulterhöhe arbeiten, nicht vor ihm knien. Beim Hinterbein nah am Körper bleiben, nicht weit draußen im Kickbereich. Nie um ein Bein ringen: Sobald Kraft gegen Kraft entsteht, ist die Aufgabe zu schwer. Kopf und Hals nicht festhalten, um fehlende Balance auszugleichen.</div>
    <div class="callout"><b>Für später: der Balance-Helfer („Bracelet“)</b><br>CAMELIDynamics nutzt bei der Fußpflege oft eine zweite Person, die den Kopf ganz leicht unterstützt: eine Hand hinter und unter den Ohren, die andere locker hinter der Unterlippe. Das ist eine Balance-Hilfe, keine Fixierung, und funktioniert am besten, wenn das Tier parallel zu einer Wand steht. Diese Technik lernt man am besten anhand einer guten Demonstration, und erst, wenn Stevie Kopfkontakt entspannt findet. Bis dahin bleibt die zweite Person Beobachterin.</div>
    <h4>Werkzeug-Check vor jedem echten Schnitt</h4><ul class="checks"><li>Die Schere ist sauber, scharf und leichtgängig.</li><li>Wir wissen, welches kleine Stück heute dran ist.</li><li>Wir schneiden vorsichtig, nicht „auf einmal möglichst viel“.</li><li>Bei ungewöhnlich verformten oder sehr langen Nägeln holen wir fachlichen Rat.</li></ul>
    <h4>Üben, ohne dass Stevie das Versuchskaninchen ist</h4><p><b>Am Menschen:</b> Das Ratchet-Signal übt ihr trocken an Judiths Unterarm. Sie gibt Rückmeldung, ob die Impulse klar, aber klein sind und ob das Nachlassen zwischendurch spürbar ist. Ein paar Minuten reichen, und es macht erstaunlich viel Spaß.</p><p><b>An Coco, wenn es sich anbietet:</b> Steht er entspannt, dürft ihr Kreise mit dem Handrücken und die Hand auf dem Rücken ausprobieren. Beinarbeit nicht. Kusht er, ist die Übung vorbei, ohne Nachsetzen.</p>` },
  { id: 'hakt', no: '9', title: 'Wenn es hakt, und was sonst noch ansteht', sub: 'Rückschritte gehören dazu', html: `
    <h4>Rückschritte sind normal</h4><ul class="checks"><li>Ein schlechter Tag ist kein Urteil über eure Beziehung zu Stevie. Wetter, Tagesform und Stallgeschehen verändern Verhalten.</li><li>Ein Rückschritt heißt nicht, dass das Training nicht funktioniert. Er zeigt nur, dass die Anforderung gerade zu hoch war.</li><li>Zeigt Stevie bei einer Person früher ACHTUNG, braucht es dort keine „Konsequenz“, sondern eine leichtere gemeinsame Geschichte.</li><li>Das beste Zeichen von Vertrauen ist nicht maximale Nähe, sondern dass Stevie bei kleinen Anforderungen ruhig bleibt.</li></ul>
    <h4>Wenn ihr auf einem Level festhängt</h4><p>Hängt ihr länger als eine Woche auf einem Level, macht den nächsten Schritt kleiner: <b>halb so tief, halb so lang, halb so nah.</b> Ändert dabei sonst nichts. Fast jedes Level lässt sich noch einmal teilen.</p>
    <div class="golden">Wenn eine Person denkt „das geht noch“ und die andere „das wird zu viel“, gewinnt die leichtere Variante. Dann muss nicht Stevie eure Meinungsverschiedenheit entscheiden.</div>
    <h4>Wann ihr Hilfe dazuholen solltet</h4><ul class="checks warn"><li>Wiederholtes Kicken, Hinwerfen oder Aufbäumen, obwohl ihr die Aufgabe deutlich vereinfacht habt.</li><li>Die Berührung wird über zwei bis drei Wochen eher schlechter als besser.</li><li>Verdacht auf Schmerzen, Lahmheit oder eine körperliche Ursache.</li><li>Die Nägel müssen dringend gemacht werden, bevor das Training so weit ist.</li><li>Ihr merkt, dass ihr regelmäßig gegen Stevie halten müsst.</li></ul>
    <h4>Pflichttermine und Pflege mit Hilfe</h4><p>Manches lässt sich nicht aufschieben: Schur, Impfungen, Entwurmung und, falls die Zeit nicht reicht, die Nagelpflege. Diese Termine sollen das Training nicht beschädigen:</p>
    <ol class="steps"><li><b>Anderer Ort.</b> Möglichst nicht an Stevies Platz. Der bleibt der Ort, an dem nur Gutes und Kleines passiert.</li><li><b>Nicht der Trainer hält fest.</b> Wer gerade mit Stevie trainiert, ist nicht die Person, die fixiert. Ideal ist eine erfahrene externe Person oder der Tierarzt.</li><li><b>So kurz und so wenig Fixierung wie möglich.</b> Ob eine Sedierung sinnvoll ist, entscheidet der Tierarzt.</li><li><b>Danach zwei bis drei Tage nur Level 0 bis 2.</b> Dann dort weitermachen, wo ihr wart, im Zweifel eine Stufe tiefer.</li><li><b>Schur rechtzeitig besprechen.</b> Erklärt dem Scherer kurz, woran ihr arbeitet. Ruhiges Handling hilft allen.</li></ol>
    <div class="stevie-says"><b>Stevie meint</b>Ein doofer Tag macht nicht alles kaputt. Hauptsache, danach wird’s wieder normal.</div>` },
  { id: 'stupsi', no: '10', title: 'Bonus: Stupsis Runde', sub: 'Weil Stupsi Nagelpflege auch eher unschön findet', html: `
    <p>Wenn Stevie Level 6 erreicht hat, darf Stupsi mitmachen. Gleiche Level, gleiche Regeln, eigene Spalte auf der Levelkarte. In der App wählt ihr beim Eintragen einfach „Stupsi“ als Tier.</p>
    <ul class="checks"><li>Startpunkt: zwei Level unter dem, was Stupsi heute schon entspannt mitmacht. Lieber zu leicht beginnen.</li><li>Levels 5 bis 8 nicht überspringen, auch wenn er schneller vorankommt. Gerade die machen Nagelpflege angenehm.</li><li>Kein Wettbewerb. Wer schneller ist, ist egal. Jeder hat sein Tempo.</li><li>Stevies Sessions bleiben Stevies Sessions. Stupsi bekommt eigene Termine.</li></ul>
    <div class="callout"><b>Und Coco?</b><br>Coco bleibt der unangefochtene Meister der Disziplin „Ich leg mich jetzt mal hin“. Für ihn gilt deshalb: nur, was sicher klappt, und nur, wenn es sich anbietet. Sein Kushen ist sein STOPP, und das respektiert ihr genauso wie bei Stevie.</div>` },
  { id: 'stallkarte', no: '★', title: 'Stallkarte', sub: 'Alles für den Stall auf einen Blick', html: '{{STALLKARTE}}' },
  { id: 'quellen', no: 'D', title: 'Fachliche Grundlage und Quellen', sub: 'CAMELIDynamics nach Marty McGee Bennett', html: `
    <p>Dieser Plan folgt den Prinzipien von CAMELIDynamics nach Marty McGee Bennett: Kooperation über Beobachtung, Balance, Timing und klare Signale statt Kraft oder Festhalten. Er überträgt die Methode auf den normalen Stall ohne separaten Fangbereich: kein Verfolgen, kein Einklemmen, immer ein freier Weg, Artgenossen in der Nähe, sehr kurze Einheiten und Berührung erst nach ruhiger Annäherung.</p>
    <p>Ergänzt um zwei Bausteine, die nicht aus CAMELIDynamics stammen, aber gut dazu passen: Judiths Futterschale (positive Verknüpfung ohne Handling) und das Üben der Technik an einem ruhigen Herdenmitglied. Die 12-Wochen-Struktur ist eine Planungshilfe, keine Vorgabe der Methode.</p>
    <ol class="sources">
      <li><a href="https://camelidynamics.com/wp-content/uploads/2015/07/AM-SUM06_feet-1.pdf" target="_blank" rel="noopener">Marty McGee Bennett: Teaching Your Alpaca NOT to Pick Up His Feet! (Teil 1)</a><small>Berühren mit dem Handrücken, Gewicht auf dem bearbeiteten Bein, Topline-Hand, kurze Lektionen.</small></li>
      <li><a href="https://camelidynamics.com/wp-content/uploads/2015/07/AM-AUT06_feet-2.pdf" target="_blank" rel="noopener">Marty McGee Bennett: Teaching Your Alpaca NOT to Pick Up His Feet! (Teil 2)</a><small>Anheben über das obere Bein und Ratchet-Signal, sofortige Rückgabe, Hinterbein, Balance-Helfer.</small></li>
      <li><a href="https://camelidynamics.com/how-to-calmly-catch-an-alpaca-or-llama-the-midline-catch-and-bracelet/" target="_blank" rel="noopener">CAMELIDynamics: How to calmly catch an alpaca or llama, the midline catch and bracelet</a><small>Ruhige Annäherung, Balance statt Festhalten, Bracelet als Balance-Hilfe.</small></li>
      <li><a href="https://camelidynamics.com/what-is-camelidynamics/" target="_blank" rel="noopener">CAMELIDynamics: What is CAMELIDynamics?</a><small>Grundhaltung der Methode.</small></li>
      <li><a href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/llamas-and-alpacas/management-of-llamas-and-alpacas" target="_blank" rel="noopener">Merck Veterinary Manual: Management of Llamas and Alpacas</a><small>Ergänzend: Haltung, Fußpflege, Gesundheit.</small></li>
    </ol>
    <div class="golden">Nicht: „Wie bekommen wir heute den Fuß?“ Sondern: „Was muss heute passieren, damit Stevie morgen weniger Grund hat, vor uns wegzugehen?“</div>` }
];
