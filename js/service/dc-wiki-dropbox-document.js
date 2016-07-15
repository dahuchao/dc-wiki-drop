module.exports = function($resource, IdentificationService) {
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
    }, function(contenu) {
      traitementDocument(contenu);
    }, function(reason) {
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
    }, function(lien) {
      traitementDocument(lien);
    }, function(reason) {
      traitementErreur(reason);
    });
  }
  return {
    resoudreLien: resoudreLien,
    telecharger: telecharger
  }
}
