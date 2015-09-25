'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki')

/**
 * Directive pour ajouter des fonctions d'edition au champ de texte
 */
.directive('dcEditeur', ['$rootScope', function ($rootScope) {
    /**
     * Fonction de recherche de la ligne ou se trouve le curseur de l'utilisateur
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
     * Fonction de recherche de la position de debut de ligne
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
     * Fonction d'ajout des caractères de tete de chapitre
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
        var texteApres = htmlElement.value.substring(++positionTeteLigne, htmlElement.value.length);
        htmlElement.value = texteAvant + texteApres;
        // Repositionnement du curseur
        htmlElement.selectionStart = posCurseur + caracteres.length;
        htmlElement.selectionEnd = posCurseur + caracteres.length;
        return htmlElement.value;
    };
    /**
     * Fonction d'ajout des caractères de tete de chapitre
     */
    function ajouterLien(element) {
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
            htmlElement.value = texteAvant + "[lien]" + texteApres;
            // Repositionnement du curseur
            htmlElement.selectionStart = posDebSel + 1;
            htmlElement.selectionEnd = posDebSel + 5;
        } else {
            htmlElement.value = texteAvant + "[" + texteSelectionne + "]" + texteApres;
            // Repositionnement du curseur
            htmlElement.selectionStart = posFinSel + 2;
            htmlElement.selectionEnd = posFinSel + 2;
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
        }
    }
}]);
