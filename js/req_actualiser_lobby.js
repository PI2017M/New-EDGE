// requette pour actualiser un lobby

"use strict";

var fs = require("fs");
require('remedial');

var trait = function (req, res, query) {

    var marqueurs;
    var page;
    var listeLobby;
    var contenu_fichier;
    var i;
    var j;
    var listeMembre;
    var k;

    contenu_fichier = fs.readFileSync("./json/lobby.json", "UTF-8");
    listeLobby = JSON.parse(contenu_fichier);

    // ON ACTUALISE LES JOUEUR DANS LE LOBBY
    marqueurs = {};
    marqueurs.joueur = "";
    marqueurs.bouton = "";
    for (i = 0; i < listeLobby.length; i++) {

        if (listeLobby[i].lobby == query.lobby) {

            for (j = 0; j < listeLobby[i].joueur.length; j++) {
                marqueurs.joueur += "<li>" + listeLobby[i].joueur[j] + "</li>";
            }

            // ON AJOUTE UN BOUTON POUR "L'ADMIN" DU LOBBY-----------------------------------------------------------
            if (listeLobby[i].nbJoueur == listeLobby[i].joueur.length && listeLobby[i].joueur[0] == query.pseudo) {
                marqueurs.bouton = '<br><a class="btn btn-primary" href="/req_lancer_partie?pseudo=' + query.pseudo + '&lobby=' + query.lobby + '">Lancer partie</a>';
            }
            //--------------------------------------------------------------------------------------------------

            if (listeLobby[i].etat === 1) {
                page = fs.readFileSync("./html/mod_plateau_passif.html", "utf-8");

                marqueurs.adv = "";

                for (j = 0; j < listeLobby[i].joueur.length; j++) {
                    if (listeLobby[i].joueur[j] !== query.pseudo) {
                        marqueurs.adv += '<li><a data-toggle="modal" data-target="#myModal" href="">' + listeLobby[i].joueur[j] + '</a></li>';
                    }
                }

                marqueurs.pseudo = query.pseudo;
                marqueurs.lobby = query.lobby;

                contenu_fichier = fs.readFileSync("./json/membres.json", 'utf-8');
                var listeMembres = JSON.parse(contenu_fichier);

                var idx_joueur = 0;

                while (listeMembres[idx_joueur].pseudo !== query.pseudo) {
                  idx_joueur++;
                }

                marqueurs.avatar = listeMembres[idx_joueur].avatar;

                page = page.supplant(marqueurs);

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(page);
                res.end();

            } else {
                marqueurs.pseudo = query.pseudo;
                marqueurs.lobby = query.lobby;

                contenu_fichier = fs.readFileSync("./json/membres.json", 'utf-8');
                var listeMembres = JSON.parse(contenu_fichier);

                var idx_joueur = 0;

                while (listeMembres[idx_joueur].pseudo !== query.pseudo) {
                  idx_joueur++;
                }

                marqueurs.avatar = listeMembres[idx_joueur].avatar;

                page = fs.readFileSync('./html/mod_lobby.html', 'utf-8');
                page = page.supplant(marqueurs);

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(page);
                res.end();
            }

        }

    }



};

//--------------------------------------------------------------------------

module.exports = trait;
