// requette pour vendre des actions

"use strict";

var fs = require("fs");
require('remedial');

var trait = function (req, res, query) {

    var tri_indice = require("./module.js")
    var contenu_fichier;
    var listeLobby;
    var partie;
    var page;
    var marqueurs;
    var i;
    var j;
    var o;
    var a;
    var po;
    var pb;
    var action;
    var ecu;
    var tour;
    var tri;

    contenu_fichier = fs.readFileSync("./json/lobby.json", "utf-8");
    listeLobby = JSON.parse(contenu_fichier);

    contenu_fichier = fs.readFileSync("./json/parties/" + query.lobby + ".json", "utf-8");
    partie = JSON.parse(contenu_fichier);

    marqueurs = {};
    marqueurs.erreur = "";

    tri = tri_indice(query.lobby, query.pseudo);
    console.log(tri);

    i = tri[1];
    j = tri[0];


    action = partie.joueur[i].action;
    ecu = partie.joueur[i].ecu;

    if (query.nbAction > partie.joueur[i].action) {
        marqueurs.erreur = "Vous n'avez pas assez d'actions";
        page = fs.readFileSync('./html/mod_plateau_actif.html', 'utf-8');

    } else if (query.nbAction == 1) {
        action--;
        partie.joueur[i].action = action;
        ecu++;
        partie.joueur[i].ecu = ecu;
    } else if (query.nbAction == 2) {
        action -= 2;
        partie.joueur[i].action = action;
        ecu += 3;
        partie.joueur[i].ecu = ecu;

    } else if (query.nbAction == 3) {
        action -= 3;
        partie.joueur[i].action = action;
        ecu += 6;
        partie.joueur[i].ecu = ecu;

    }

    page = fs.readFileSync('./html/mod_plateau_actif.html', 'utf-8');

    if (partie.joueur[i].action <= 0) {
        tour = partie.tour;
        tour++;
        partie.tour = tour;

        if (partie.tour > partie.joueur.length - 1) {
            partie.tour = 0;
        }
        page = fs.readFileSync("./html/mod_plateau_passif.html", "utf-8");
    }

    contenu_fichier = JSON.stringify(partie);
    fs.writeFileSync("./json/parties/" + query.lobby + ".json", contenu_fichier, 'utf-8');

    marqueurs.adv = "";
    for (a = 0; a < listeLobby[j].joueur.length; a++) {
        if (listeLobby[j].joueur[a] !== query.pseudo) {
            marqueurs.adv += '<li><a data-toggle="modal" data-target="#' + listeLobby[j].joueur[a] + '" href="">' + listeLobby[j].joueur[a] + '</a></li>';
        }
    }

    marqueurs.pioche_ouvrier = "";
    for (po = 0; po < 5; po++) {
        marqueurs.pioche_ouvrier += '<li><a href="/req_recruter_ouvrier?pseudo=' + query.pseudo + '&lobby=' + query.lobby + '&ouvrier=' + partie.ouvrier[po] + '"><img src="./ressources/img/ouvrier/' + partie.ouvrier[po] + '.png"></a></li>';
    }

    marqueurs.pioche_batiment = "";
    for (pb = 0; pb < 5; pb++) {
        marqueurs.pioche_batiment += '<li><a href="/req_ouvrir_chantier?pseudo=' + query.pseudo + '&lobby=' + query.lobby + '&chantier=' + partie.batiment[pb] + '"><img src="./ressources/img/batiment/' + partie.batiment[pb] + '.png"></a></li>';
    }

    marqueurs.ouvrier = "";
    for (o = 0; o < partie.joueur[i].ouvrier.length; o++) {
        marqueurs.ouvrier += '<li><input type="checkbox" name="ouvrier" value="' + partie.joueur[i].ouvrier[o] + '"><img src="./ressources/img/ouvrier/' + partie.joueur[i].ouvrier[o] + '.png"></li>';
    }

    marqueurs.batiment = "";
    for (var c = 0; c < partie.joueur[i].chantier_cours.length; c++) {
      marqueurs.batiment += '<li><input class="bouton" type="image" src="./ressources/img/batiment/' + partie.joueur[i].chantier_cours[c].id + '.png" name="chantier" value="' + partie.joueur[i].chantier_cours[c].id + '">';
      for (var idx_ouv_chant = 0; idx_ouv_chant < partie.joueur[i].chantier_cours[c].ouvrier.length; idx_ouv_chant++) {
        marqueurs.batiment += '<img src="./ressources/img/ouvrier/' + partie.joueur[i].chantier_cours[c].ouvrier[idx_ouv_chant] + '.png">';
      }
      marqueurs.batiment += "</li>";
    }

    marqueurs.pioche_ouvrier_passif = "";
    for (po = 0; po < 5; po++) {
        marqueurs.pioche_ouvrier_passif += '<li><img src="./ressources/img/ouvrier/' + partie.ouvrier[po] + '.png"></li>';
    }

    marqueurs.pioche_batiment_passif = "";
    for (pb = 0; pb < 5; pb++) {
        marqueurs.pioche_batiment_passif += '<li><img src="./ressources/img/batiment/' + partie.batiment[pb] + '.png"></li>';
    }

    marqueurs.liste_ouvrier = "";
    for (o = 0; o < partie.joueur[i].ouvrier.length; o++) {
        marqueurs.liste_ouvrier += '<li><img src="./ressources/img/ouvrier/' + partie.joueur[i].ouvrier[o] + '.png"></li>';
    }

    marqueurs.liste_batiment = "";
    for (var c = 0; c < partie.joueur[i].chantier_cours.length; c++) {
      marqueurs.liste_batiment += '<li><img src="./ressources/img/batiment/' + partie.joueur[i].chantier_cours[c].id + '.png">';
      for (var c_ouv = 0; c_ouv < partie.joueur[i].chantier_cours[c].ouvrier.length; c_ouv++) {
        marqueurs.liste_batiment += '<img src="./ressources/img/ouvrier/' + partie.joueur[i].chantier_cours[c].ouvrier[c_ouv] + '.png">';
      }
      marqueurs.liste_batiment += '</li>';
    }

    marqueurs.ecu = partie.joueur[i].ecu;
    marqueurs.action = partie.joueur[i].action;
    marqueurs.pv = partie.joueur[i].pv;

    contenu_fichier = fs.readFileSync("./json/membres.json", 'utf-8');
    var listeMembres = JSON.parse(contenu_fichier);

    var idx_joueur = 0;

    while (listeMembres[idx_joueur].pseudo !== query.pseudo) {
      idx_joueur++;
    }

    marqueurs.avatar = listeMembres[idx_joueur].avatar;

    marqueurs.pseudo = query.pseudo;
    marqueurs.lobby = query.lobby;
    page = page.supplant(marqueurs);

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(page);
    res.end();



};

//--------------------------------------------------------------------------

module.exports = trait;
