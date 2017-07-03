//=========================================================================
// Traitement de "req_afficher_formulaire_inscription"
// Auteur : 
// Version : 24/04/2017
//=========================================================================
"use strict";

var fs = require("fs");
require('remedial');

var trait = function (req, res, query) {

    var marqueurs;
    var page;

    // AFFICHAGE DE LA modele_formulaire_inscription

    page = fs.readFileSync('./html/mod_formulaire_inscription.html', 'utf-8');

    marqueurs = {};
    marqueurs.erreur = "";
    marqueurs.pseudo = "";
    page = page.supplant(marqueurs);

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(page);
    res.end();
};

//--------------------------------------------------------------------------

module.exports = trait;
