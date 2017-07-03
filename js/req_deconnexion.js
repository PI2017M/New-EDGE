//=========================================================================
// Traitement de "req_afficher_formulaire_lobby"
// Auteur :
// Version : 24/04/2017
//=========================================================================
"use strict";

var fs = require("fs");
require('remedial');

var trait = function (req, res, query) {

    var marqueurs;
    var contenu_fichier;
    var listeJoueur;
    var page;
    var i;

    // AFFICHAGE DE LA modele_formulaire_lobby

    page = fs.readFileSync('./html/mod_accueil.html', 'utf-8');
    marqueurs = {};
    marqueurs.erreur = "";
    page = page.supplant(marqueurs);

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(page);
    res.end();
};

//--------------------------------------------------------------------------

module.exports = trait;
