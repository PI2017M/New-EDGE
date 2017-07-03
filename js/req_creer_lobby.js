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
    var lobby;
    //var mdp;
    var page;
    var nouveauLobby;
    var contenu_fichier;
    var listeLobby;
    var listeMembres;
    var i;
    var trouve;
    var j;
    var k = 0;
    var idx_joueur;

    // ON LIT LES LOBBY EXISTANTS

    contenu_fichier = fs.readFileSync("./json/lobby.json", 'utf-8');
    listeLobby = JSON.parse(contenu_fichier);

    // ON VERIFIE QUE LE LOBBY N'EXISTE PAS DEJA

    trouve = false;
    i = 0;
    while (i < listeLobby.length && trouve === false) {
        if (listeLobby[i].lobby === query.lobby) {
            trouve = true;
        }
        i++;
    }

    // SI PAS TROUVE, ON AJOUTE LE NOUVEAU LOBBY DANS LA LISTE DES LOBBY

    if (trouve === false) {
        nouveauLobby = {};
        nouveauLobby.lobby = query.lobby;
        nouveauLobby.nbJoueur = query.nbJoueur;
        nouveauLobby.style = query.style;
        nouveauLobby.etat = 0;
        nouveauLobby.mdp = query.mdp;
        nouveauLobby.joueur = [query.pseudo];
        listeLobby[listeLobby.length] = nouveauLobby;

        contenu_fichier = JSON.stringify(listeLobby);
        fs.writeFileSync("./json/lobby.json", contenu_fichier, 'utf-8');
    }


    // ON RENVOIT UNE PAGE HTML

    if (trouve === true) {
        // SI CREATION PAS OK, ON REAFFICHE PAGE FORMULAIRE AVEC ERREUR

        page = fs.readFileSync('./html/mod_formulaire_lobby.html', 'utf-8');

        marqueurs = {};
        marqueurs.erreur = "ERREUR : ce lobby existe déjà";
        marqueurs.pseudo = query.pseudo;

        contenu_fichier = fs.readFileSync("./json/membres.json", 'utf-8');
        listeMembres = JSON.parse(contenu_fichier);

        idx_joueur = 0;

        while (listeMembres[idx_joueur].pseudo !== query.pseudo) {
          idx_joueur++;
        }


        marqueurs.avatar = listeMembres[idx_joueur].avatar;
        page = page.supplant(marqueurs);

    } else {
        // SI CREATION OK, ON ENVOIE SUR LE LOBBY

        page = fs.readFileSync('./html/mod_lobby.html', 'UTF-8');

        marqueurs = {};
        marqueurs.joueur = "";
        marqueurs.bouton = "";

        for (j = 0; j < listeLobby[i].joueur.length; j++) {
            marqueurs.joueur += "<li>" + listeLobby[i].joueur[j] + "</li>";
        }
        marqueurs.lobby = query.lobby;
        marqueurs.pseudo = query.pseudo;

        contenu_fichier = fs.readFileSync("./json/membres.json", 'utf-8');
        listeMembres = JSON.parse(contenu_fichier);

        idx_joueur = 0;

        while (listeMembres[idx_joueur].pseudo !== query.pseudo) {
          idx_joueur++;
        }

        marqueurs.avatar = listeMembres[idx_joueur].avatar;
        //marqueurs.mdp = query.mdp;
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
