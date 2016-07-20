module.exports = function ($state, $rootScope, $scope, $location, $resource, IdentificationService, $mdSidenav) {
    $scope.basculeMenu = function (menuId) {
      $mdSidenav(menuId).toggle();
    };
    // Fermeture du menu
    $scope.menuPrincipalFerme = true;
    // Calcul de l'URL
    var token = $location.url();
    // Expression régulière pour calculer le token
    // token = "/access_token=IhePVG47Wzc7WESf61N&token_type=bearer&uid=33449300&account_id=dbid:AADHdnLK-n5mi_deQb-PgRNDa1a5c_I0QbU", $location = LocationHashbangUrl {$$protocol: "http", $$host: "localhost", $$port: 80, $$path: "/access_token=IhePVG47WzcAAAAAAAB22u0yQEQFUAGHPoQa…count_id=dbid:AADHdnLK-n5mi_deQb-PgRNDa1a5c_I0QbU", $$search: Object…}
    var reg = new RegExp("/access_token=(.*)&token_type.*", "g");
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
      // Utilisation des services pilote de dropbox
      $rootScope.PagesService = "PagesDropboxService";
      $rootScope.DocumentsService = "DocumentsDropboxService";
      // Changement d'état pour ouvrir le wiki
    }
      $state.go('wiki');
    $scope.onAccueil = function () {
      // Changement d'état pour ouvrir le wiki
      $mdSidenav("gauche").close();
      $state.go('wiki');
    }
    $scope.onOuvertureMenu = function () {
      // Ouverture du menu
      $scope.menuPrincipalFerme = !$scope.menuPrincipalFerme;
    };
    $scope.onDebutRecherche = function () {
      $scope.recherche = true;
    };
    $scope.onFinRecherche = function () {
      $scope.recherche = false;
    };
    $scope.onInitRecherche = function () {
      $scope.termeRecherche = "";
    };
    $scope.onConfiguration = function () {
      // Changement d'état pour déconnexion
      $state.go('configuration');
      // Fermeture du menu
      $mdSidenav("gauche").close();
    };
    $scope.onDeconnexion = function () {
      // Déconnexion du service
      IdentificationService.logout();
      // Changement d'état pour déconnexion
      $state.go('connexion');
      // Fermeture du menu
      $scope.menuPrincipalFerme = true;
      $mdSidenav("gauche").close();
    };
}
