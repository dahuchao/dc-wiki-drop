'use strict';
// Chargement du module expressjs
var express = require('express');
// Plugin busboy de expressjs pour les téléversement de fichier
var multer = require('multer');
// Codec base 64
var base64 = require('base-64')
// Chargement du module de gestion du système de fichier
var fs = require('fs');
// Création de l'application express
var app = express();
// Définition du port d'écoute
app.set('port', (process.env.PORT || 80));
// Configuration de l'application express
app.use(express.urlencoded());
app.use(express.json());
// Répertoire des pages du site web
var repertoireSite = 'public';
console.log('Ouverture du répertoire des pages du site web : %s', repertoireSite);
if (!fs.existsSync(repertoireSite)) {
  console.error('Répertoire des pages indisponible');
}
// Répertoire racine
app.use('/', express.static('.'));
// Répertoire du wiki
app.use('/wiki', express.static(repertoireSite));

//**********************************************
// Répertoire de stockage des pages du wiki
//var repertoireWiki = 'test-wiki\\PersonalWiki\\WM_Wiki_Pages\\';
var repertoireWiki = "wiki-pages-demo\\dc-wiki\\dc-wiki-page\\";
//var repertoireDocs = 'test-wiki\\PersonalWiki\\Wiki_documents\\';
var repertoireDocs = "wiki-pages-demo\\dc-wiki\\dc-wiki-doc\\";
//**********************************************

// Configuration de muter
var stockage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, repertoireDocs)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var televersement = multer({
  storage: stockage
});

//**********************************************
// Traitement de la requête GET http://localhost/documents/nom-doc.pdf
app.get('/documents/:nom', function (req, res) {
  // Calcul du nom de la page recherchée
  var pageNom = req.params.nom;
  console.log('*** Lecture du document : %s ***', pageNom);
  var nomFichier = repertoireDocs + pageNom;
  // Si le fichier existe
  if (fs.existsSync(nomFichier)) {
    console.log('*** Récupération du fichier : %s ***', nomFichier);
    res.download(nomFichier);
  } else {
    console.log('*** Fichier inconnu : %s ***', nomFichier);
    res.status(404);
  }
});

//**********************************************
// Traitement de la requête POST http://localhost/documents/nom-doc.pdf
app.post('/documents/:nom', function (req, res) {
  // Calcul du nom de la page
  var pageNom = req.params.nom;
  // Journalisation du traitement
  console.log('*** Enregistrement du document : %s ***', pageNom);
  // Calcul du contenu du document
  var pageContenu = req.param('contenu');
  // Journalisation du traitement
  //console.log('*** Contenu encode : <<%s>> ***', pageContenu);
  var pageContenuDecode = base64.decode(pageContenu);
  //console.log('*** Contenu decode : <<%s>> ***', pageContenuDecode);
  // Enregistrement du contenu de la page
  fs.writeFileSync(repertoireDocs + pageNom, pageContenuDecode, 'utf8');
});

//**********************************************
// Traitement d'une requête POST d'enregistrement de la page
app.post('/pages/:nom', function (req, res) {
  // Calcul du nom de la page
  var pageNom = req.params.nom;
  // Si le fichier n'existe pas
  if (!fs.existsSync(repertoireWiki + pageNom)) {
    console.log('*** Création de la page : %s ***', pageNom);
  } else {
    // Journalisation du traitement
    console.log('*** Enregistrement de la page : %s ***', pageNom);
  }
  // Calcul du contenu de la page
  var pageContenu = req.param('contenu');
  // Journalisation du traitement
  console.log('*** Contenu : %s ***', pageContenu);
  // Enregistrement du contenu de la page
  fs.writeFileSync(repertoireWiki + pageNom, pageContenu, 'utf8');
});
//**********************************************
// Traitement de la requête http://localhost:3000/pages/test
app.get('/pages/:nom', function (req, res) {
  // Calcul du nom de la page recherchée
  var pageNom = req.params.nom;
  // Si le fichier n'existe pas
  if (!fs.existsSync(repertoireWiki + pageNom)) {
    //console.log('*** Création de la page : %s ***', pageNom);
    console.log("*** La page %s n'existe pas ***", pageNom);
    // Retour erreur
    res.statusCode = 404;
    // Message d'erreur
    res.send("La page n'existe pas");
  } else {
    console.log('*** Lecture de la page %s ***', pageNom);
    // Lecture du fichier contenant la page de wiki
    var pageContenu = fs.readFileSync(repertoireWiki + pageNom, 'utf8');
    console.log('*** Contenu de la page %s ***', pageContenu);
    var stat = fs.statSync(repertoireWiki + pageNom);
    // Document json portant la page de wiki
    res.jsonp({
      nom: pageNom,
      contenu: pageContenu,
      dateMaj: stat.mtime
    });
  }
});

//**********************************************
// Démarrage du serveur
var serveur = app.listen(app.get('port'), function () {
  console.log('Ecoute sur le port %d', serveur.address().port);
});
