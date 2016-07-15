module.exports = function($resource, IdentificationService) {
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
    }, function(ressource) { //Resource {nom: "homepage.txt", contenu: "+Page
      // Page
      var page = ressource.contenu;
      // Retour à la fonction
      traitementPage(page);
    }, function(reason) {
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
    }, function() {
      // Journalisation
      console.log('* Relecture de la page avant enregistrement.');
      // Modification du contenu de la page de wiki
      page.contenu = pageAEnregistrer;
      // Enregistrement des modifications
      page.$save();
      console.log('* Enregistré.');
    }, function() {
      // Journalisation
      console.log('* Création de la page.');
      var nouvellePage = new Pages({
        nom: nomPage
      });
      nouvellePage.contenu = pageAEnregistrer;
      nouvellePage.$save();
      console.log('* Enregistré.');
    });
    console.log('* Enregistré.');
  }

  function televerserDocument(nomDocument, contenuDocument) {
    // Ressource des documents du wiki 'http://localhost/docs';
    var Docs = $resource('http://localhost/documents/:doc', {
      doc: '@doc'
    });
    console.log('* fichier import : <<%s>>', nomDocument);
    //data:text/plain;base64, ...
    var regexp = new RegExp("data:.*;base64,(.*)");
    const contenu = contenuDocument.replace(regexp, "$1");
    //console.log('* fichier export : <<%s>>', contenu);
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
}
