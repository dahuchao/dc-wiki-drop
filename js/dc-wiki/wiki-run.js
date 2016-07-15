/**
 * Configuration du controle de bonne connexion
 */
module.exports = function($rootScope, $state, IdentificationService) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    console.info("Vérification du jeton de sécurité de l'utilisateur.");
    // Si le changement d'état concerne le wiki et si l'utilisateur n'est pas loger
    if (toState.wiki && !IdentificationService.isLogin()) {
      // User isn’t authenticated
      $state.transitionTo("connexion");
      event.preventDefault();
    }
  });
}
