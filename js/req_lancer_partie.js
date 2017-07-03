// requette pour lancer une partie

"use strict"

function Shuffle(liste) {
    var carte, tmp;
    for (var i = 0; i < liste.length; i++) {
        var chiffre = Math.floor(Math.random() * liste.length);
        carte = liste[i];
        liste[i] = liste[chiffre];
        liste[chiffre] = carte;
    }
    return liste;
}

var fs = require("fs");
require("remedial");

var trait = function (req, res, query) {

    var contenu_fichier;
    var listeLobby;
    var listeCarte = [];
    var partie;
    var i = 0;
    var j;
    var po;
    var pb;
    var page;
    var marqueurs;

    contenu_fichier = fs.readFileSync("./json/lobby.json", "utf-8");
    listeLobby = JSON.parse(contenu_fichier);

    contenu_fichier = fs.readFileSync("./json/cartes.json", "utf-8");
    listeCarte = JSON.parse(contenu_fichier);

    while (query.pseudo !== listeLobby[i].joueur[0]) {
        i++;
    }


    // ON CREER LE JSON DE LA PARTIE EN FONCTION DES JOUEURS-------------------------------------
    partie = {};
    partie.tour = 0;
    partie.ouvrier = [];

    for (j = 0; j < listeCarte.ouvrier.length; j++) {
        partie.ouvrier[j] = listeCarte.ouvrier[j].id;
    }

    partie.batiment = [];

    for (j = 0; j < listeCarte.batiment.length; j++) {
        partie.batiment[j] = listeCarte.batiment[j].id;
    }

    // ON MALLENGE LES CARTES-------------------
    partie.ouvrier = Shuffle(partie.ouvrier);
    partie.batiment = Shuffle(partie.batiment);

    partie.joueur = [];

    for (j = 0; j < (listeLobby[i].joueur.length); j++) {
        partie.joueur[j] = {};
        partie.joueur[j].ecu = 10;
        partie.joueur[j].action = 3;
        partie.joueur[j].pv = 0;
        partie.joueur[j].ouvrier = [];
        partie.joueur[j].chantier_cours = [];
        partie.joueur[j].chantier_fini = [];


        // ON AFFECTE UN APPRENTI AUX JOUEURS-----------------------------
        var l = 0;

        while (listeCarte.ouvrier[partie.ouvrier[l]].type !== 0) {
            l++;
        }

        partie.joueur[j].ouvrier.push(partie.ouvrier[l]);
        partie.ouvrier.splice(l, 1);

    }

    contenu_fichier = JSON.stringify(partie);
    fs.writeFileSync("./json/parties/" + listeLobby[i].lobby + ".json", contenu_fichier, "utf-8");
    //--------------------------------------------------------------------------------------------

    // ON CHANGE L'ETAT DU LOBBY------------------------------------------
    listeLobby[i].etat = 1;

    contenu_fichier = JSON.stringify(listeLobby);
    fs.writeFileSync("./json/lobby.json", contenu_fichier, 'utf-8');
    //--------------------------------------------------------------------

    page = fs.readFileSync('./html/mod_plateau_actif.html', 'utf-8');

    marqueurs = {};

    marqueurs.adv = "";

    contenu_fichier = fs.readFileSync("./json/lobby.json", "utf-8");
    listeLobby = JSON.parse(contenu_fichier);

    j = 0;

    while (query.pseudo !== listeLobby[j].joueur[0]) {
        j++;
    }

    for (i = 0; i < listeLobby[j].joueur.length; i++) {
        if (listeLobby[j].joueur[i] !== query.pseudo) {
            marqueurs.adv += '<li><a data-toggle="modal" data-target="#' + listeLobby[j].joueur[i] + '" href="">' + listeLobby[j].joueur[i] + '</a></li>';
        }
    }

    marqueurs.modal = "";

    marqueurs.pioche_ouvrier = "";
    for (po = 0; po < 5; po++) {
        marqueurs.pioche_ouvrier += '<li><a href="/req_recruter_ouvrier?pseudo=' + query.pseudo + '&lobby=' + query.lobby + '&ouvrier=' + partie.ouvrier[po] + '"><img src="./ressources/img/ouvrier/' + partie.ouvrier[po] + '.png"></a></li>';
    }

    marqueurs.pioche_batiment = "";
    for (pb = 0; pb < 5; pb++) {
        marqueurs.pioche_batiment += '<li><a href="/req_ouvrir_chantier?pseudo=' + query.pseudo + '&lobby=' + query.lobby + '&chantier=' + partie.batiment[pb] + '"><img src="./ressources/img/batiment/' + partie.batiment[pb] + '.png"></a></li>';
    }

    marqueurs.ouvrier = "";
    for (var o = 0; o < partie.joueur[0].ouvrier.length; o++) {
        marqueurs.ouvrier += '<li><input type="checkbox" name="ouvrier" value="' + partie.joueur[0].ouvrier[o] + '"><img src="./ressources/img/ouvrier/' + partie.joueur[0].ouvrier[o] + '.png"></li>';
    }

    marqueurs.batiment = "";

    marqueurs.ecu = partie.joueur[0].ecu;
    marqueurs.action = partie.joueur[0].action;
    marqueurs.pv = partie.joueur[0].pv;

    contenu_fichier = fs.readFileSync("./json/membres.json", 'utf-8');
    var listeMembres = JSON.parse(contenu_fichier);

    var idx_joueur = 0;

    while (listeMembres[idx_joueur].pseudo !== query.pseudo) {
      idx_joueur++;
    }

    marqueurs.avatar = listeMembres[idx_joueur].avatar;

    marqueurs.pseudo = query.pseudo;
    marqueurs.lobby = query.lobby;
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
