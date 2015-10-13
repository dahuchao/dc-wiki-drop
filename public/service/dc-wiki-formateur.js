'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki')
  /**
   * Formateur des pages du wiki
   */
  .factory('dcWikiFormateur', ['$sce',
    function formateur($sce) {
      // Formatting
      var boldPattern = new RegExp("\\*(.*?)\\*", "g");
      var boldReplacement = "<b>$1</b>";

      var italicsPattern = new RegExp("=(.*?)=", "g");
      var italicsReplacement = "<i>$1</i>";

      var underlinePattern = new RegExp("_(.*?)_", "g");
      var underlineReplacement = "<u>$1</u>";

      var heading1Pattern = new RegExp("^\\+{1}\s?([^\\+]*)");
      var heading1Replacement = "<h1>$1</h1>";

      var heading2Pattern = new RegExp("^\\+{2}\s?([^\\+]*)");
      var heading2Replacement = "<h2>$1</h2>";

      var heading3Pattern = new RegExp("^\\+{3}\s?([^\\+]*)");
      var heading3Replacement = "<h3>$1</h3>";

      var heading4Pattern = new RegExp("^\\+{4}\s?([^\\+]*)");
      var heading4Replacement = "<h4>$1</h4>";

      var heading5Pattern = new RegExp("^\\+{5}\s?([^\\+]*)");
      var heading5Replacement = "<h5>$1</h5>";

      var heading6Pattern = new RegExp("^\\+{6}\s?([^\\+]*)");
      var heading6Replacement = "<h6>$1</h6>";

      var liste1Pattern = new RegExp("^-{1}\s?([^\\+]*)");
      var liste1Replacement = "<h1>$1</h1>";

      /// Horizontal Rule
      var hrPattern = /^-{4}$/;
      var hrReplacement = "<hr />";

      // Anchors/Internal Links
      var anchorPattern = /\[a:(.*?)\]/;
      var anchorReplacement = "<a name=\"$1\"></a>";

      var goToPattern = new RegExp("\\[([-_'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\\s\\w\\.]+)\\]", "g");
      var goToReplacement = "<a href=\"#pages/$1\">$1</a>";

      var goToPatternLabel = new RegExp("\\[\\[([-_'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\\s\\w\\.]+)\\]\\[([-_'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\\s\\w\\.]+)\\]\\]", "g");
      var goToReplacementLabel = "<a href=\"#pages/$1\">$2</a>";

      // External Links
      var urlPattern = new RegExp("\\[(http[s]?://.*?)\\]");
      var urlReplacement = "<a href=\"$1\">$1</a>";

      // External Links avec Label
      var urlLabelPattern = new RegExp("\\[\\[(http[s]?):\\/\\/(.*?)\\]\\[(.*?)\\]\\]");
      var urlLabelReplacement = "<a href=\"$1://$2\">$3</a>";

      // Images
      var imagePattern = new RegExp("!\\(.*\\)");
      var imageReplacement = "<img src=\"$1\">";

      // Lien vers des documents
      var filePattern = new RegExp("doc:\\/\\/(.*)");
      var fileReplacement = "<a href=\"#docs/$1\" target=\"_blank\" >$1</a>";
      //var goToReplacement = "<a href=\"#docs/$1\">$1</a>";

      var unorderedListDepth = 0;
      var orderedListDepth = 0;
      var profondeurHtml = 0;
      var retourLigne = true;

      function ParseWiki(inputData) {
        //console.log('Traitement de la ligne : ' + inputData);
        var output = "";
        var lines = inputData.split("\n");
        for (var i = 0; i < lines.length; i++) {
          retourLigne = true;
          lines[i] = Replace(lines[i], boldPattern, boldReplacement);
          lines[i] = Replace(lines[i], italicsPattern, italicsReplacement);
          lines[i] = Replace(lines[i], underlinePattern, underlineReplacement);
          lines[i] = ReplaceHeading(lines[i], heading6Pattern, heading6Replacement);
          lines[i] = ReplaceHeading(lines[i], heading5Pattern, heading5Replacement);
          lines[i] = ReplaceHeading(lines[i], heading4Pattern, heading4Replacement);
          lines[i] = ReplaceHeading(lines[i], heading3Pattern, heading3Replacement);
          lines[i] = ReplaceHeading(lines[i], heading2Pattern, heading2Replacement);
          lines[i] = ReplaceHeading(lines[i], heading1Pattern, heading1Replacement);
          lines[i] = Replace(lines[i], hrPattern, hrReplacement);
          lines[i] = ReplaceListe(lines[i]);
          lines[i] = ReplaceBlankLines(lines[i]);
          lines[i] = Replace(lines[i], anchorPattern, anchorReplacement);
          lines[i] = Replace(lines[i], urlLabelPattern, urlLabelReplacement);
          lines[i] = Replace(lines[i], urlPattern, urlReplacement);
          lines[i] = ReplaceGoTo(lines[i]);
          lines[i] = Replace(lines[i], filePattern, fileReplacement);
          lines[i] = AjoutRetourLigne(lines[i]);
          lines[i] = Replace(lines[i], imagePattern, imageReplacement);
          output += lines[i];
        }
        return $sce.trustAsHtml(output);
      }

      function Replace(ligne, motifWiki, motifHtml) {
        return ligne.replace(motifWiki, motifHtml);
      }

      function ReplaceHeading(ligne, headingPattern, headingReplacement) {
        var res = ligne;
        if (ligne.match(headingPattern)) {
          res = ligne.replace(headingPattern, headingReplacement);
          // Le retour à la ligne a déjà été traité
          retourLigne = false;
        }
        return res;
      }

      function ReplaceGoTo(data) {
        var res = data.replace(goToPatternLabel, goToReplacementLabel);
        res = res.replace(goToPattern, goToReplacement);
        return res;
      }

      function ReplaceBlankLines(data) {
        if (data.length == 0) {
          data = "<br />";
          // Le retour à la ligne a déjà été traité
          retourLigne = false;
        }
        return data;
      }

      function AjoutRetourLigne(data) {
        var res = data;
        // Si la ligne demande un retour
        if (retourLigne) {
          // Insertion d'un retour à la ligne
          res = res + "<br/>";
        }
        return res;
      }

      function ReplaceListe(data) {
        var output = "";
        // On ne gère que 3 niveaux de liste
        var listePatron = new RegExp("^(-{1,3})\\s?(.*)");
        // Si la ligne traite d'une liste
        if (data.match(listePatron)) {
          // Calcul du préfix wiki marquant une liste "-"
          var marqueursNiveauWiki = data.replace(listePatron, "$1");
          // Calcul du niveau de la liste (ou du rang)
          var niveauWiki = marqueursNiveauWiki.length - 1;
          // Si la prof de la lst html est inf au niv de la lst wiki
          if (profondeurHtml < niveauWiki) {
            // Augmentation de la profondeur
            profondeurHtml += 1;
            // Définition de la balise html de liste
            var balLst = "<ul class=\"style\">";
            // Ajout de la balise html de début de liste <ul>
            output += balLst.replace("style", "styleLstNiv" + niveauWiki);
          }
          // Si la prof de la lst html est sup au niv de lst wiki
          while (profondeurHtml > niveauWiki) {
            // Diminution de la profondeur
            profondeurHtml -= 1;
            // Ajout de la balise html de fin de liste
            output += "</ul>";
          }
          // Si la prof de la lst html correspond au niv de la lst wiki
          if (profondeurHtml == niveauWiki) {
            // Insertion de la balise item de liste
            output += data.replace(listePatron, "<li>$2</li>");
            // Le retour à la ligne a déjà été traité
            retourLigne = false;
          }
        } else {
          // Le niveau de liste doit revenir à zéro
          niveauWiki = 0;
          // Si la prof de la lst html est sup au niv de lst wiki
          while (profondeurHtml > niveauWiki) {
            // Diminution de la profondeur
            profondeurHtml -= 1;
            // Ajout de la balise html de fin de liste
            output += "</ul>";
            // Le retour à la ligne a déjà été traité
            retourLigne = false;
          }
          // Reprise de la donnée brute
          output += data;
        }
        return output;
      }
      var formateur = ParseWiki;
      return formateur;
    }
]);
