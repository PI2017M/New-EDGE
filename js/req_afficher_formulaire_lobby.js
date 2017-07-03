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
    var page;

    // AFFICHAGE DE LA modele_formulaire_lobby

    page = fs.readFileSync('./html/mod_formulaire_lobby.html', 'utf-8');

    marqueurs = {};

    var contenu_fichier = fs.readFileSync("./json/membres.json", 'utf-8');
    var listeMembres = JSON.parse(contenu_fichier);

    var idx_joueur = 0;

    while (listeMembres[idx_joueur].pseudo !== query.pseudo) {
      idx_joueur++;
    }

    marqueurs.avatar = listeMembres[idx_joueur].avatar;

    marqueurs.erreur = "";
    marqueurs.lobby = "";
    marqueurs.pseudo = query.pseudo;
    page = page.supplant(marqueurs);

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(page);
    res.end();
};

//--------------------------------------------------------------------------

module.exports = trait;
