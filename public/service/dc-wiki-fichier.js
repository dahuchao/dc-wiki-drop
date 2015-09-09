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
                // URL du service REST de dropbox
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
                    // Calcul du code html de la page de wiki
                    $scope.pagehtml = dcWikiFormateur($scope.pagecontenu);
                    // Lecture de la date de mise à jour
                    $scope.dateMaj = page.dateMaj;
                });
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
    .service("DocumentsService", ['$resource', 'IdentificationService',
    function ($resource, IdentificationService) {
            function telecharger(nomDocument, traitementDocument, traitementErreur) { // Calcul du jeton de controle d'accès
                var token = IdentificationService.getToken();
                // URL du service REST de dropbox
                var urlDropbox = 'https://api-content.dropbox.com/1/files/auto';
                // Chemin du dossier des pages dans dropbox
                var dossierDropbox = urlDropbox + '/PersonalWiki/Wiki_Documents';
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
                var dossierDropbox = urlDropbox + '/PersonalWiki/Wiki_Documents';
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
