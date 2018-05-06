import {Injectable} from '@angular/core';

@Injectable()
export class PageService {

  constructor() {}
  
  // Formatting
  boldPattern = new RegExp("\\*(.*?)\\*", "g");
  boldReplacement = "<b>$1</b>";

  italicsPattern = new RegExp("=(.*?)=", "g");
  italicsReplacement = "<i>$1</i>";

  underlinePattern = new RegExp("_(.*?)_", "g");
  underlineReplacement = "<u>$1</u>";

  heading1Pattern = new RegExp("^\\+{1}\s?([^\\+]*)");
  heading1Replacement = "<h1>$1</h1>";

  heading2Pattern = new RegExp("^\\+{2}\s?([^\\+]*)");
  heading2Replacement = "<h2>$1</h2>";

  heading3Pattern = new RegExp("^\\+{3}\s?([^\\+]*)");
  heading3Replacement = "<h3>$1</h3>";

  heading4Pattern = new RegExp("^\\+{4}\s?([^\\+]*)");
  heading4Replacement = "<h4>$1</h4>";

  heading5Pattern = new RegExp("^\\+{5}\s?([^\\+]*)");
  heading5Replacement = "<h5>$1</h5>";

  heading6Pattern = new RegExp("^\\+{6}\s?([^\\+]*)");
  heading6Replacement = "<h6>$1</h6>";

  liste1Pattern = new RegExp("^-{1}\s?([^\\+]*)");
  liste1Replacement = "<h1>$1</h1>";

  /// Horizontal Rule
  hrPattern = /^-{4}$/;
  hrReplacement = "<hr />";

  // Anchors/Internal Links
  anchorPattern = /\[a:(.*?)\]/;
  anchorReplacement = "<a name=\"$1\"></a>";

  goToPattern = new RegExp("\\[([-_'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\\s\\w\\.]+)\\]", "g");
  goToReplacement = "<a href=\"pages/$1\">$1</a>";

  goToPatternLabel = new RegExp("\\[\\[([-_'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\\s\\w\\.]+)\\]" +
      "\\[([-_'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\\s\\w\\.]+)\\]\\]",
  "g");
  goToReplacementLabel = "<a href=\"pages/$1\">$2</a>";

  // External Links
  urlPattern = new RegExp("\\[(http[s]?://.*?)\\]");
  urlReplacement = "<a href=\"$1\">$1</a>";

  // External Links avec Label
  urlLabelPattern = new RegExp("\\[\\[(http[s]?):\\/\\/(.*?)\\]\\[(.*?)\\]\\]");
  urlLabelReplacement = "<a href=\"$1://$2\">$3</a>";

  // Images
  imagePattern = new RegExp("!\\(.*\\)");
  imageReplacement = "<img src=\"$1\">";

  // Lien vers des documents
  filePattern = new RegExp("doc:\\/\\/(.*)");
  fileReplacement = "<a href=\"#documents/$1\" target=\"_blank\" >$1</a>";
  //goToReplacement = "<a href=\"#docs/$1\">$1</a>";

  unorderedListDepth = 0;
  orderedListDepth = 0;
  profondeurHtml = 0;
  retourLigne = true;

  ParseWiki(inputData) {
    //console.log('Traitement de la ligne : ' + inputData);
    let output = "";
    let lines = inputData.split("\n");
    for (let i = 0; i < lines.length; i++) {
      this.retourLigne = true;
      lines[i] = this.Replace(lines[i], this.boldPattern, this.boldReplacement);
      lines[i] = this.Replace(lines[i], this.italicsPattern, this.italicsReplacement);
      lines[i] = this.Replace(lines[i], this.underlinePattern, this.underlineReplacement);
      lines[i] = this.ReplaceHeading(lines[i], this.heading6Pattern, this.heading6Replacement);
      lines[i] = this.ReplaceHeading(lines[i], this.heading5Pattern, this.heading5Replacement);
      lines[i] = this.ReplaceHeading(lines[i], this.heading4Pattern, this.heading4Replacement);
      lines[i] = this.ReplaceHeading(lines[i], this.heading3Pattern, this.heading3Replacement);
      lines[i] = this.ReplaceHeading(lines[i], this.heading2Pattern, this.heading2Replacement);
      lines[i] = this.ReplaceHeading(lines[i], this.heading1Pattern, this.heading1Replacement);
      lines[i] = this.Replace(lines[i], this.hrPattern, this.hrReplacement);
      lines[i] = this.ReplaceListe(lines[i]);
      lines[i] = this.ReplaceBlankLines(lines[i]);
      lines[i] = this.Replace(lines[i], this.anchorPattern, this.anchorReplacement);
      lines[i] = this.Replace(lines[i], this.urlLabelPattern, this.urlLabelReplacement);
      lines[i] = this.Replace(lines[i], this.urlPattern, this.urlReplacement);
      lines[i] = this.ReplaceGoTo(lines[i]);
      lines[i] = this.Replace(lines[i], this.filePattern, this.fileReplacement);
      lines[i] = this.AjoutRetourLigne(lines[i]);
      lines[i] = this.Replace(lines[i], this.imagePattern, this.imageReplacement);
      output += lines[i];
    }
    //    return $sce.trustAsHtml(output);
    return output;
  }

  Replace(ligne, motifWiki, motifHtml) {
    return ligne.replace(motifWiki, motifHtml);
  }

  ReplaceHeading(ligne, headingPattern, headingReplacement) {
    let res = ligne;
    if (ligne.match(headingPattern)) {
      res = ligne.replace(headingPattern, headingReplacement);
      // Le retour à la ligne a déjà été traité
      this.retourLigne = false;
    }
    return res;
  }

  ReplaceGoTo(data) {
    let res = data.replace(this.goToPatternLabel, this.goToReplacementLabel);
    res = res.replace(this.goToPattern, this.goToReplacement);
    return res;
  }

  ReplaceBlankLines(data) {
    if (data.length == 0) {
      data = "<br />";
      // Le retour à la ligne a déjà été traité
      this.retourLigne = false;
    }
    return data;
  }

  AjoutRetourLigne(data) {
    let res = data;
    // Si la ligne demande un retour
    if (this.retourLigne) {
      // Insertion d'un retour à la ligne
      res = res + "<br/>";
    }
    return res;
  }

  ReplaceListe(data) {
    let output = "";
    // On ne gère que 3 niveaux de liste
    let listePatron = new RegExp("^(-{1,3})\\s?(.*)");
    // Si la ligne traite d'une liste
    if (data.match(listePatron)) {
      // Calcul du préfix wiki marquant une liste "-"
      let marqueursNiveauWiki = data.replace(listePatron, "$1");
      // Calcul du niveau de la liste (ou du rang)
      let niveauWiki = marqueursNiveauWiki.length - 1;
      // Si la prof de la lst html est inf au niv de la lst wiki
      if (this.profondeurHtml < niveauWiki) {
        // Augmentation de la profondeur
        this.profondeurHtml += 1;
        // Définition de la balise html de liste
        let balLst = "<ul class=\"style\">";
        // Ajout de la balise html de début de liste <ul>
        output += balLst.replace("style", "styleLstNiv" + niveauWiki);
      }
      // Si la prof de la lst html est sup au niv de lst wiki
      while (this.profondeurHtml > niveauWiki) {
        // Diminution de la profondeur
        this.profondeurHtml -= 1;
        // Ajout de la balise html de fin de liste
        output += "</ul>";
      }
      // Si la prof de la lst html correspond au niv de la lst wiki
      if (this.profondeurHtml == niveauWiki) {
        // Insertion de la balise item de liste
        output += data.replace(listePatron, "<li>$2</li>");
        // Le retour à la ligne a déjà été traité
        this.retourLigne = false;
      }
    } else {
      // Le niveau de liste doit revenir à zéro
      let niveauWiki = 0;
      // Si la prof de la lst html est sup au niv de lst wiki
      while (this.profondeurHtml > niveauWiki) {
        // Diminution de la profondeur
        this.profondeurHtml -= 1;
        // Ajout de la balise html de fin de liste
        output += "</ul>";
        // Le retour à la ligne a déjà été traité
        this.retourLigne = false;
      }
      // Reprise de la donnée brute
      output += data;
    }
    return output;
  }

}
