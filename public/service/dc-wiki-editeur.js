'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki')

/**
 * Directive pour ajouter des fonctions d'edition au champ de texte
 */
.directive('dcEditeur', ['$rootScope', function ($rootScope) {
  /**
   * Fonction de recherche du numéro de la ligne ou se trouve le curseur de l'utilisateur
   */
  function rechercheLigneCourante(lignes, rang) {
    console.info("Nb lignes : " + lignes.length);
    var numLigneCourante = 1;
    var rangCaractere = 0;
    for (var x = 0; x < lignes.length; x++) {
      // Calcul de la longueur de cette ligne
      var longueurLigne = lignes[x].length + 1;
      console.info("Nb caractères ligne : " + longueurLigne + " / " + x);
      rangCaractere += longueurLigne;
      console.info("Rang du dernier caractères de la ligne : " + rangCaractere);
      // Si le rang du dernier caractere est superieur au rang de la selection
      if (rangCaractere > rang) {
        // La selection se trouve dans cette ligne
        break;
      }
      // Incrémentation du numéro de ligne
      numLigneCourante++;
    }
    console.info("Numéro de la ligne courante : " + numLigneCourante);
    return numLigneCourante;
  };
  /**
   * Fonction de recherche de la position de debut de ligne dans le flux de caractères
   */
  function recherchePositionTeteLigne(lignes, numligne) {
    console.info("Nb lignes : " + lignes.length);
    var numLigneCourante = 1;
    var rangCaractere = 0;
    for (var x = 0; x < lignes.length; x++) {
      // Si la ligne est celle recherchée
      if (numLigneCourante >= numligne) {
        // On arrête la recherche
        break;
      }
      // Calcul de la longueur de cette ligne
      var longueurLigne = lignes[x].length + 1;
      console.info("Nb caractères ligne : " + longueurLigne + " / " + x);
      rangCaractere += longueurLigne;
      console.info("Position atteinte : " + rangCaractere);
      // Incrémentation du numéro de ligne
      numLigneCourante++;
    }
    console.info("Position du premier caractère de la ligne : " + rangCaractere);
    return rangCaractere;
  };
  /**
   * Fonction d'ajout des caractères de tete de chapitre
   *   avant : Texte
   *   après : +Texte
   */
  function ajouterTeteChapitre(element, caracteres) {
    var htmlElement = element[0];
    // Calcul de la position du curseur
    var posCurseur = htmlElement.selectionStart;
    console.info("Selection début : " + posCurseur);
    var lignes = htmlElement.value.split("\n");
    var rangCaractereSelectionne = posCurseur;
    var numLigneCourante = rechercheLigneCourante(lignes, rangCaractereSelectionne);
    console.info("Numéro de la ligne courante : " + numLigneCourante);
    var positionTeteLigne = recherchePositionTeteLigne(lignes, numLigneCourante);
    var texteAvant = htmlElement.value.substring(0, positionTeteLigne);
    var texteApres = htmlElement.value.substring(positionTeteLigne, htmlElement.value.length);
    htmlElement.value = texteAvant + caracteres + texteApres;
    // Repositionnement du curseur
    htmlElement.selectionStart = posCurseur + caracteres.length;
    htmlElement.selectionEnd = posCurseur + caracteres.length;
    return htmlElement.value;
  };
  /**
   * Fonction de suppression d'un caractères de tete de chapitre
   *   avant : +Texte
   *   après : Texte
   */
  function supprimerTeteChapitre(element, caracteres) {
    var htmlElement = element[0];
    // Calcul de la position du curseur
    var posCurseur = htmlElement.selectionStart;
    console.info("Selection début : " + posCurseur);
    var lignes = htmlElement.value.split("\n");
    var rangCaractereSelectionne = posCurseur;
    var numLigneCourante = rechercheLigneCourante(lignes, rangCaractereSelectionne);
    console.info("Numéro de la ligne courante : " + numLigneCourante);
    var positionTeteLigne = recherchePositionTeteLigne(lignes, numLigneCourante);
    var texteAvant = htmlElement.value.substring(0, positionTeteLigne);
    var texteApres = htmlElement.value.substring(positionTeteLigne, htmlElement.value.length);
    htmlElement.value = texteAvant;
    // Si le caractère est bien un caractère de tête de chapitre
    var heading1Pattern = new RegExp("^\\+\s?([^\\+]*)");
    if (texteApres.match(heading1Pattern)) {
      // Suppression du caractère de tete de chapitre
      texteApres = texteApres.substring(1, texteApres.length);
    }
    htmlElement.value += texteApres;
    // Repositionnement du curseur
    htmlElement.selectionStart = posCurseur + caracteres.length;
    htmlElement.selectionEnd = posCurseur + caracteres.length;
    return htmlElement.value;
  };
  /**
   * Fonction d'ajout d'un lien
   */
  function ajouterLien(element) {
    return ajouterEncadrement(element, "[", "]", "lien");
  };
  /**
   * Fonction d'ajout de graisse
   */
  function ajouterGras(element) {
    return ajouterEncadrement(element, "*", "*", "mot");
  };
  /**
   * Fonction d'ajout du motif de soulignement
   */
  function ajouterSouligne(element) {
    return ajouterEncadrement(element, "_", "_", "mot");
  };
  /**
   * Fonction d'ajout du motif d'italic
   */
  function ajouterItalic(element) {
    return ajouterEncadrement(element, "=", "=", "mot");
  };
  /**
   * Fonction d'ajout d'un lien
   */
  function ajouterEncadrement(element, carGauche, carDroit, motCle) {
    var htmlElement = element[0];
    // Calcul de la position du curseur
    var posDebSel = htmlElement.selectionStart;
    console.info("Selection début : " + posDebSel);
    var posFinSel = htmlElement.selectionEnd;
    console.info("Selection fin : " + posFinSel);
    var texteAvant = htmlElement.value.substring(0, posDebSel);
    var texteSelectionne = htmlElement.value.substring(posDebSel, posFinSel);
    var texteApres = htmlElement.value.substring(posFinSel, htmlElement.value.length);
    // Si le texte selectionné est vide
    if (texteSelectionne.length == 0) {
      htmlElement.value = texteAvant + carGauche + motCle + carDroit + texteApres;
      // Repositionnement du curseur
      htmlElement.selectionStart = posDebSel + 1;
      htmlElement.selectionEnd = posDebSel + motCle.length + 1;
    } else {
      texteSelectionne = texteSelectionne.trim();
      var texteAjoute = carGauche + texteSelectionne + carDroit;
      htmlElement.value = texteAvant + texteAjoute + texteApres;
      // Repositionnement du curseur
      htmlElement.selectionStart = posDebSel + texteSelectionne.length + 2;
      htmlElement.selectionEnd = htmlElement.selectionStart;
    }
    return htmlElement.value;
  };
  return {
    link: function (scope, element, attrs) {
      $rootScope.$on('hPlus', function (e, rang) {
        scope.pagecontenu = ajouterTeteChapitre(element, rang);
      });
      $rootScope.$on('hMoins', function (e, rang) {
        scope.pagecontenu = supprimerTeteChapitre(element, rang);
      });
      $rootScope.$on('ajouterLien', function (e, rang) {
        scope.pagecontenu = ajouterLien(element);
      });
      $rootScope.$on('ajouterGras', function (e, rang) {
        scope.pagecontenu = ajouterGras(element);
      });
      $rootScope.$on('ajouterSouligne', function (e, rang) {
        scope.pagecontenu = ajouterSouligne(element);
      });
      $rootScope.$on('ajouterItalic', function (e, rang) {
        scope.pagecontenu = ajouterItalic(element);
      });
    }
  };
}]);
