module.exports =     function ($cookies) {
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
}
