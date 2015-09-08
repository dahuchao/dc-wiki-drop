'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki', ['angularFileUpload', 'ngSanitize', 'ui.router', 'ngResource', 'ngCookies'])

/** 
 * Configuration des routes de l'application
 */
.config(function ($stateProvider, $urlRouterProvider) {
    //$urlRouterProvider.otherwise("/connexion");
    $urlRouterProvider.when("/", "/pages/homepage");
    $urlRouterProvider.when("/pages", "/pages/homepage");
    $stateProvider
        .state("connexion", {
            url: "/connexion",
            templateUrl: "connexion.html",
            controller: "dcWikiConnexion"
        })
        .state("wiki", {
            url: "/"
                /*,
                            templateUrl: "page.html",
                            controller: "dcPageController"*/
        })
        .state("televersement", {
            url: "/pages/{page}/televersement",
            templateUrl: "televersement.html",
            controller: "dcTeleversementController"
        })
        .state("pages", {
            url: "/pages/{page}",
            templateUrl: "page.html",
            controller: "dcPageController"
        })
        .state("docs", {
            url: "/docs/{doc}",
            templateUrl: "doc.html",
            controller: "dcDocController"
        });
    //$locationProvider.html5Mode(true);
})

/**
 * Configuration du controle de bonne connexion
 */
.run(function ($rootScope, $state, IdentificationService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        console.info("Vérification du jeton de sécurité de l'utilisateur.");
        // Si le changement d'état concerne le wiki et si l'utilisateur n'est pas loger
        if (toState.wiki && !IdentificationService.isLogin()) {
            // User isn’t authenticated
            $state.transitionTo("connexion");
            event.preventDefault();
        }
    });
})

/**
 * Service d'identificaion
 */
.service("IdentificationService", ['$cookies',
    function ($cookies) {
        var jeton = null;

        function isLogin() {
            var isLogin = false;
            if (jeton) {
                isLogin = true
            }
            return isLogin;
        }

        function login(token) {
            jeton = token;
            $cookies.put('cookieJeton', token);
        }

        function logout() {
            jeton = null;
            $cookies.remove('cookieJeton');
        }

        function getToken() {
            var cookieJeton = $cookies.get('cookieJeton');
            return cookieJeton;
        }
        return {
            isLogin: isLogin,
            login: login,
            logout: logout,
            getToken: getToken
        }
}])

/**
 * Service pilote du service dropbox
 */
.service("PagesService", ['$resource', 'IdentificationService',
    function ($resource, IdentificationService) {
        function telecharger(nomPage, traitementPage, traitementErreur) {
            // Calcul du jeton de controle d'accès
            var token = IdentificationService.getToken();
            // URL du service REST de dropbox
            var urlDropbox = 'https://api-content.dropbox.com/1/files/auto';
            // Chemin du dossier des pages dans dropbox
            var dossierDropbox = urlDropbox + '/PersonalWiki/WM_Wiki_Pages';
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
            var dossierDropbox = urlDropbox + '/PersonalWiki/WM_Wiki_Pages';
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
    }])

// Controleur des pages de wiki
.controller('dcDocController', ['DocumentsService', '$state', '$scope',
    function (DocumentsService, $state, $scope) {
        // Calcul du nom du document demandé
        var nomDoc = encodeURI($state.params.doc);
        // Si le nom du document est bien définie
        if (!nomDoc.match("undefined")) {
            // Journalisation
            console.log('* Lecture du document : ' + nomDoc);
            // Téléchargement de la page
            DocumentsService.resoudreLien(nomDoc, function (lien) {
                // Journalisation
                console.log('* Document : ' + lien.url);
                // Ouverture du document
                $scope.url = lien.url;
            }, function (reason) {
                if (reason.status === 404) {
                    // Journalisation
                    console.log('* Erreur : nom du document indéfinit.');
                }
                if (reason.status === 401) {
                    // Changement d'état pour ouvrir le wiki
                    $state.go('connexion');
                } else {
                    // Journalisation
                    console.log('* Erreur : nom du document indéfinit.');
                }
            });
        }
    }])

// Controleur des pages de wiki
.controller('dcTeleversementController', ['FileUploader', '$state', '$scope',
    function (FileUploader, $state, $scope) {
        $scope.uploader = new FileUploader();
    }])

// Controleur des pages de wiki
.controller('dcPageController', ['$state', '$scope', 'PagesService', 'dcWikiFormateur',
    function ($state, $scope, PagesService, dcWikiFormateur) {
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
            // Calcul du nom de la page demandée
            var nomPage = encodeURI($state.params.page);
            // Pour les tests redéfinition du nom de la page
            //var nomPage = '206.txt';
            // Si le nom de la page n'est pas définie
            if (nomPage.match("undefined")) {
                // Nom de la page par défaut
                nomPage = 'homepage';
            }
            var nomPageDropbox = nomPage + '.txt';
            // Journalisation
            console.log('* Lecture de la page de wiki : ' + nomPageDropbox);
            // Téléchargement de la page
            PagesService.telecharger(nomPageDropbox, function (page) {
                // Enregistrement du contenu de la page de wiki
                $scope.pagecontenu = page;
                // Calcul du code html de la page de wiki
                $scope.pagehtml = dcWikiFormateur($scope.pagecontenu);
                // Lecture de la date de mise à jour
                $scope.dateMaj = page.dateMaj;
            }, function (reason) {
                if (reason.status === 404) {
                    $scope.pagecontenu = "+ " + nomPage;
                    $scope.edition = true;
                }
                if (reason.status === 401) {
                    $scope.pagehtml = "erreur";
                    $scope.edition = false;
                    // Changement d'état pour ouvrir le wiki
                    $state.go('connexion');
                }
                // Une erreur s'est produite
                $scope.pagehtml = "erreur";
                console.error("Erreur : " + angular.fromJson(reason));
            });
        });
        // Mise à l'écoute de l'évènement d'enregistrement de la page de wiki
        $scope.$on('onEnregistrement', function () {
            // Calcul du nom de la page
            var nomPage = encodeURI($state.params.page);
            // Si le nom de la page n'est pas définie
            if (nomPage.match("undefined")) {
                // Nom de la page par défaut
                nomPage = 'homepage';
            }
            // Calcul du nom de page complet
            nomPage = nomPage + '.txt';
            // Si le nom de la page n'est pas définie
            if (!nomPage.match("undefined")) {
                console.log('* Enregistrement de la page de wiki : ' + nomPage);
                // Journalisation
                console.log('* Relecture de la page avant enregistrement.');
                // Modification du contenu de la page de wiki
                var page = $scope.pagecontenu;
                // Enregistrement des modifications
                PagesService.enregistrer(nomPage, page);
                // Calcul du code html de la page de wiki
                $scope.pagehtml = dcWikiFormateur($scope.pagecontenu);
                // Lecture de la date de mise à jour
                $scope.dateMaj = page.dateMaj;
            }
        });
}])

/**
 * Création du controleur du wiki
 */
.controller('dcWikiController', ['$state', '$rootScope', '$scope', '$location', '$resource', 'IdentificationService',
    function ($state, $rootScope, $scope, $location, $resource, IdentificationService) {
        // Calcul de l'URL
        var token = $location.url();
        // Expression régulière pour calculer le token
        var reg = new RegExp("/access_token=(.*)&.*&.*", "g");
        // Si l'URL porte un token de controle d'accès
        if (token.match(reg)) {
            // Calcul du token
            token = token.replace(reg, "Bearer $1");
            // Enregistrement du jeton de controle d'accès
            $rootScope.jeton = token;
            // Login
            IdentificationService.login(token);
            // Journalisation du jeton
            console.log("Jeton : " + $rootScope.jeton);
            // Changement d'état pour ouvrir le wiki
            $state.go('wiki');
        }
        $scope.onRetour = function () {
            // Changement d'état pour ouvrir le wiki
            $state.go('wiki');
        }
        $scope.onDeconnexion = function () {
            // Déconnexion du service
            IdentificationService.logout();
            // Changement d'état pour déconnexion
            $state.go('connexion');
        };
        $scope.edition = false;
        $scope.onAnnuler = function () {
            // Permutation du mode édition en mode lecture
            $scope.edition = false;
        };
        $scope.onEdition = function () {
            // Permutation du mode lecture en mode édition
            $scope.edition = true;
        };
        $scope.onEnregistrer = function () {
            // Si la page a été éditée
            if ($scope.edition === true) {
                // Diffusion de l'évènement aux scopes enfants
                $scope.$broadcast('onEnregistrement');
            }
            // Permutation du mode édition en mode lecture ou inversement
            $scope.edition = false;
        };
}]);
