'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki')

/**
 * Service pilote du service dropbox
 */
.service("PagesLocalesService", ['$resource', 'IdentificationService',
    function ($resource, IdentificationService) {
    function telecharger(nomPage, traitementPage, traitementErreur) {
      // Calcul du jeton de controle d'accès
      var token = IdentificationService.getToken();
      // URL du service REST de dropbox
      var dossier = 'http://localhost/pages';
      // Ressource des pages du wiki
      var Pages = $resource(dossier + '/:page', {
        page: '@page'
      }, {
        get: {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Accept': 'text/plain'
          }
        }
      });
      // Journalisation
      console.log('* Lecture de la page de wiki : ' + nomPage);
      // Appel de la page
      Pages.get({
        page: nomPage
      }, function (ressource) { //Resource {nom: "homepage.txt", contenu: "+Page
        // Page
        var page = ressource.contenu;
        // Retour à la fonction
        traitementPage(page);
      }, function (reason) {
        traitementErreur(reason);
      });
    }

    function enregistrer(nomPage, pageAEnregistrer) {
      // URL du service REST du système de fichier local
      var dossier = 'http://localhost/pages';
      // Ressource des pages du wiki
      var Pages = $resource('/pages/:nom', {
        nom: '@nom'
      });

      var page = Pages.get({
        nom: nomPage
      }, function () {
        // Journalisation
        console.log('* Relecture de la page avant enregistrement.');
        // Modification du contenu de la page de wiki
        page.contenu = pageAEnregistrer;
        // Enregistrement des modifications
        page.$save();
        console.log('* Enregistré.');
      });
      console.log('* Enregistré.');
    }

    function televerserDocument(nomDocument, contenuDocument) {
      // Ressource des documents du wiki 'http://localhost/docs';
      var Docs = $resource('http://localhost/documents/:doc', {
        doc: '@doc'
      });
      console.log('* fichier import : <<%s>>', contenuDocument);
      //data:text/plain;base64, ...
      var regexp = new RegExp("data:.*;base64,(.*)");
      const contenu = contenuDocument.replace(regexp, "$1");
      console.log('* fichier export : <<%s>>', contenu);
      // Création d'un document
      var doc = new Docs({
        doc: nomDocument
      });
      // Modification du contenu de la page de wiki
      doc.contenu = contenu;
      // Enregistrement des modifications
      doc.$save();
    }

    return {
      televerserDocument: televerserDocument,
      telecharger: telecharger,
      enregistrer: enregistrer
    }
        }])

/**
 * Service pilote du service de fourniture de fichier sur la base du système local
 */
.service("DocumentsLocalService", ['$resource', 'IdentificationService',
    function ($resource, IdentificationService) {
    function telecharger(nomDocument, traitementDocument, traitementErreur) {
      // URL du service REST du système de fichier local
      var dossier = 'http://localhost/docs';
      // Ressource des pages du wiki
      var Documents = $resource(dossier + '/:document', {
        document: '@document'
      }, {
        get: {
          method: 'GET'
        }
      });
      // Journalisation
      console.log('* Lecture du document : ' + nomDocument);
      // Appel de la page
      Documents.get({
        document: nomDocument
      }, function (contenu) {
        traitementDocument(contenu);
      }, function (reason) {
        traitementErreur(reason);
      });
    }

    function resoudreLien(nomDocument, traitementDocument, traitementErreur) {
      // URL du service REST du système de fichier local
      var url = 'http://localhost/docs/' + nomDocument;
      var lien = new Object();
      lien.url = url;
      traitementDocument(lien);
    }
    return {
      resoudreLien: resoudreLien,
      telecharger: telecharger
    }
    }]);
