var angular = require("angular");
var modules = [require("angular-material"),
  require("angular-aria"),
  require("angular-animate"),
  require("angular-ui-bootstrap"),
  require("angular-cookies"),
  require("angular-resource"),
  require("angular-sanitize"),
  require("angular-ui-router")//,
  //require("pdf"),
  //require("ng-file-model")
];

angular.module('dcWiki', modules)

/**
 * Configuration des routes de l'application
 */
.config(require("./dc-wiki/wiki-configuration"))

/**
 * Configuration du controle de bonne connexion
 */
.run(require("./dc-wiki/wiki-run"))

/**
 * Création du controleur du wiki
 */
.controller('dcWikiRedirect', ['$state', '$rootScope', '$scope', '$location', '$resource', 'IdentificationService',
    require("./dc-wiki/wiki-redirect-controleur")])

/**
 * Création du controleur du wiki
 */
.controller('dcWikiController', ['$state', '$rootScope', '$scope', '$location', '$resource',
  'IdentificationService', '$mdSidenav',
  require("./dc-wiki/wiki-controleur")])

  /**
   * controller
   */
.controller('dcWikiConfigController', ['$injector', '$rootScope', '$state', '$scope', 'dcWikiFormateur',
      require("./dc-configuration/configuration-service")])

/**
 * Service d'identificaion
 */
.service("IdentificationService", ['$cookies',
    require("./dc-connexion/connexion-service")])

/**
 * Création du controleur du wiki
 */
.controller('dcWikiConnexion', ["$rootScope",'$scope', '$location', '$state',
  require("./dc-connexion/connexion-controleur")])

/**
 * Controleur des pages de wiki
 */
.controller("dcDocController", ["$state", "$scope",
  require("./dc-document/document-controleur")])

/**
 * Controleur des pages de wiki
 */
.controller("dcPageController", ["$sce", "$injector", "$rootScope", "$state", "$scope",
  "dcWikiFormateur", "$mdBottomSheet",
    require("./dc-page/page-controleur")])

/**
 * Gestion des téléversement
 */
.controller("TeleversementController", ["$state", "$injector", "$rootScope", "$scope", "$mdBottomSheet",
  require("./dc-page/page-televersement-controleur.js")])

/**
 * Formateur des pages du wiki
 */
.factory('dcWikiFormateur', require("./service/dc-wiki-formateur"))

/**
 * Service pilote du service dropbox
 */
.service("PagesLocalesService", ['$resource', 'IdentificationService',
    require("./service/dc-wiki-local-page")])

/**
 * Service pilote du service de fourniture de fichier sur la base du système local
 */
.service("DocumentsLocalService", ['$resource', 'IdentificationService',
    require("./service/dc-wiki-local-document")])

/**
 * Service pilote du service dropbox
 */
.service("PagesDropboxService", ['$resource', 'IdentificationService',
    require("./service/dc-wiki-dropbox-page")])

/**
 * Service pilote du service dropbox
 */
.service("DocumentsDropboxService", ['$resource', 'IdentificationService',
    require("./service/dc-wiki-dropbox-document")])


/**
 * Directive pour ajouter des fonctions d'edition au champ de texte
 */
.directive('dcEditeur', ['$rootScope',
    require("./service/dc-wiki-editeur")])
