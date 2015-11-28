'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki')

/**
 * Service pilote du service dropbox
 */
.service("PagesDropboxService", ['$resource', 'IdentificationService',
    function ($resource, IdentificationService) {
    function telecharger(nomPage, traitementPage, traitementErreur) {
      // Calcul du jeton de controle d'accès
      var token = IdentificationService.getToken();
      // URL du service REST de dropbox
      var urlDropbox = 'https://api-content.dropbox.com/1/files/auto';
      // Chemin du dossier des pages dans dropbox
      //var dossierDropbox = urlDropbox + '/PersonalWiki/WM_Wiki_Pages';
      var dossierDropbox = urlDropbox + '/dc-wiki-page';
      // Ressource des pages du wiki
      var Pages = $resource(dossierDropbox + '/:page', {
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
      }, function (lettres) {
        // Page
        var page = "";
        // Initialisation d'un index
        var i = 0;
        // Tant qu'il y a des lettres dans le tableau
        while (lettres[i]) {
          // Ajout de la lette à la page
          page += lettres[i++];
        }
        traitementPage(page);
      }, function (reason) {
        traitementErreur(reason);
      });
    }

    function enregistrer(nomPage, page) {
      // Calcul du jeton de controle d'accès
      var token = IdentificationService.getToken();
      // URL du service REST de dropbox
      var urlDropbox = 'https://api-content.dropbox.com/1/files_put/auto';
      // Chemin du dossier des pages dans dropbox
      var dossierDropbox = urlDropbox + '/dc-wiki-page';
      // Ressource des pages du wiki
      var PagesPut = $resource(dossierDropbox + '/:nomPage', {
        nomPage: '@nomPpage'
      }, {
        update: {
          method: 'PUT',
          headers: {
            'Authorization': token
          }
        }
      });
      //page.$save();
      PagesPut.update({
        nomPage: nomPage
      }, page);
      console.log('* Enregistré.');
    }
    return {
      telecharger: telecharger,
      enregistrer: enregistrer
    }
}])

/**
 * Service pilote du service dropbox
 */
.service("DocumentsDropboxService", ['$resource', 'IdentificationService',
    function ($resource, IdentificationService) {
    function telecharger(nomDocument, traitementDocument, traitementErreur) { // Calcul du jeton de controle d'accès
      var token = IdentificationService.getToken();
      // URL du service REST de dropbox
      var urlDropbox = 'https://api-content.dropbox.com/1/files/auto';
      // Chemin du dossier des pages dans dropbox
      var dossierDropbox = urlDropbox + '/dc-wiki-doc';
      // Ressource des pages du wiki
      var Documents = $resource(dossierDropbox + '/:document', {
        document: '@document'
      }, {
        get: {
          method: 'GET',
          headers: {
            'Authorization': token
          }
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
      var token = IdentificationService.getToken();
      // URL du service REST de dropbox
      var urlDropbox = 'https://api.dropbox.com/1/shares/auto';
      // Chemin du dossier des pages dans dropbox
      var dossierDropbox = urlDropbox + '/dc-wiki-doc';
      // Ressource des pages du wiki
      var Documents = $resource(dossierDropbox + '/:document', {
        document: '@document'
      }, {
        post: {
          method: 'POST',
          headers: {
            'Authorization': token
          }
        }
      });
      // Journalisation
      console.log('* Lecture du document : ' + nomDocument);
      // Appel de la page
      Documents.post({
        document: nomDocument
      }, function (lien) {
        traitementDocument(lien);
      }, function (reason) {
        traitementErreur(reason);
      });
    }
    return {
      resoudreLien: resoudreLien,
      telecharger: telecharger
    }
    }]);
