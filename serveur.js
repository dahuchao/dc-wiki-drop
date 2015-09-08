'use strict';
// Chargement du module expressjs
var express = require('express');
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
console.log('Ouverture du répertoire des pages du site web : ');
console.log(repertoireSite);
if (!fs.existsSync(repertoireSite)) {
    console.error('Répertoire des pages indisponible');
}
// Répertoire racine
app.use('/', express.static('.'));
// Répertoire du wiki
app.use('/wiki', express.static(repertoireSite));


//**********************************************
// Répertoire de stockage des pages du wiki
var repertoireWiki = 'test-wiki\\PersonalWiki\\WM_Wiki_Pages\\';
var repertoireDocs = 'test-wiki\\PersonalWiki\\Wiki_documents\\';
//**********************************************
// Traitement de la requête http://localhost:3000/pages/test
app.get('/docs/:nom', function (req, res) {
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
// Traitement d'une requête POST d'enregistrement de la page
app.post('/pages/:nom', function (req, res) {
    // Calcul du nom de la page
    var pageNom = req.params.nom;
    console.log('*** Enregistrement de la page : %s ***', pageNom);
    // Calcul du contenu de la page
    var pageContenu = req.param('contenu');
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
        console.log('*** Création de la page : %s ***', pageNom);
        // Création du fichier contenant la page
        fs.writeFileSync(repertoireWiki + pageNom, "", 'utf8');
        // Document json portant la page de wiki
        res.jsonp({
            nom: pageNom,
            contenu: "",
            dateMaj: null
        });
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
