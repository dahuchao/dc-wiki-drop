module.exports = function($resource, IdentificationService) {
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
    }, function(lettres) {
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
    }, function(reason) {
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
    console.log('* Page enregistré.');
  }

  function televerserDocument(nomDocument, contenuDocument) {
    // Calcul du jeton de controle d'accès
    var token = IdentificationService.getToken();
    // URL du service REST de dropbox
    var urlDropbox = 'https://api-content.dropbox.com/1/files_put/auto';
    // Chemin du dossier des pages dans dropbox
    var dossierDropbox = urlDropbox + '/dc-wiki-doc';
    // Ressource des pages du wiki
    var PagesPut = $resource(dossierDropbox + '/:nomDocument', {
      nomDocument: '@nomDocument'
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
      nomDocument: nomDocument
    }, contenuDocument);
    console.log('* Document enregistré.');
  }

  return {
    televerserDocument: televerserDocument,
    telecharger: telecharger,
    enregistrer: enregistrer
  }
}
