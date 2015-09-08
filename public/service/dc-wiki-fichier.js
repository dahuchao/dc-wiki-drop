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
            var dossierDropbox = 'http://localhost/pages';
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
            }, function (ressource) { //Resource {nom: "homepage.txt", contenu: "+Page
                // Page
                var page = ressource.contenu;
                // Retour à la fonction
                traitementPage(page);
            }, function (reason) {
                traitementErreur(reason);
            });
        }

        function enregistrer(nomPage, page) {
            // Calcul du jeton de controle d'accès
            var token = IdentificationService.getToken();
            // URL du service REST de dropbox
            var dossierDropbox = 'http://localhost/pages';
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
    }]);
