//=========================================================================
// Traitement de "req_inscrire"
// Auteur :
// Version : 24/04/2017
//=========================================================================

"use strict";

var fs = require("fs");
require('remedial');

var trait = function (req, res, query) {

    var marqueurs;
    var pseudo;
    var mdp;
    var page;
    var nouveauMembre;
    var contenu_fichier;
    var listeMembres;
    var i;
    var trouve;

    // ON LIT LES COMPTES EXISTANTS

    contenu_fichier = fs.readFileSync("./json/membres.json", 'utf-8');
    listeMembres = JSON.parse(contenu_fichier);

    // ON VERIFIE QUE LE COMPTE N'EXISTE PAS DEJA

    trouve = false;
    i = 0;
    while (i < listeMembres.length && trouve === false) {
        if (listeMembres[i].pseudo === query.pseudo) {
            trouve = true;
        }
        i++;
    }

    // SI PAS TROUVE, ON AJOUTE LE NOUVEAU COMPTE DANS LA LISTE DES COMPTES

    if (trouve === false) {
        nouveauMembre = {};
        nouveauMembre.pseudo = query.pseudo;
        nouveauMembre.mdp = query.mdp;
        nouveauMembre.avatar = "http://api.adorable.io/avatar/" + query.pseudo;
        listeMembres[listeMembres.length] = nouveauMembre;

        contenu_fichier = JSON.stringify(listeMembres);

        fs.writeFileSync("./json/membres.json", contenu_fichier, 'utf-8');
    }


    // ON RENVOIT UNE PAGE HTML

    if (trouve === true) {
        // SI CREATION PAS OK, ON REAFFICHE PAGE FORMULAIRE AVEC ERREUR

        page = fs.readFileSync('./html/mod_formulaire_inscription.html', 'utf-8');

        marqueurs = {};
        marqueurs.erreur = "ERREUR : ce compte existe déjà";
        marqueurs.pseudo = query.pseudo;
        page = page.supplant(marqueurs);

    } else {
        // SI CREATION OK, ON ENVOIE PAGE DE CONFIRMATION

        page = fs.readFileSync('./html/mod_confirmation_inscription.html', 'UTF-8');

        marqueurs = {};
        marqueurs.pseudo = query.pseudo;
        marqueurs.mdp = query.mdp;
        page = page.supplant(marqueurs);
    }

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(page);
    res.end();
};

//---------------------------------------------------------------------------

module.exports = trait;
