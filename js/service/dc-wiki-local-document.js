module.exports = function($resource, IdentificationService) {
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
    }, function(contenu) {
      traitementDocument(contenu);
    }, function(reason) {
      traitementErreur(reason);
    });
  }

  function resoudreLien(nomDocument, traitementDocument, traitementErreur) {
    // URL du service REST du système de fichier local
    var url = 'http://localhost/documents/' + nomDocument;
    var lien = new Object();
    lien.url = url;
    traitementDocument(lien);
  }
  return {
    resoudreLien: resoudreLien,
    telecharger: telecharger
  }
}
