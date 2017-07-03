//=========================================================================
// Traitement de "req_identifier"
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
    var membre;
    var contenu_fichier;
    var listeMembres;
    var i;
    var trouve;
    var listeLobby;

    // ON LIT LES COMPTES EXISTANTS

    contenu_fichier = fs.readFileSync("./json/membres.json", 'utf-8');
    listeMembres = JSON.parse(contenu_fichier);

    // ON VERIFIE QUE LE PSEUDO/PASSWORD EXISTE

    trouve = false;
    i = 0;
    while (i < listeMembres.length && trouve === false) {
        if (listeMembres[i].pseudo === query.pseudo) {
            if (listeMembres[i].mdp === query.mdp) {

                trouve = true;
            }

        }
        i++;
    }

    // ON RENVOIT UNE PAGE HTML

    if (trouve === false) {
        // SI IDENTIFICATION INCORRECTE, ON REAFFICHE PAGE ACCUEIL AVEC ERREUR

        page = fs.readFileSync('./html/mod_accueil.html', 'utf-8');

        marqueurs = {};
        marqueurs.erreur = "ERREUR : compte ou mot de passe incorrect ou joueur deja connecté";
        marqueurs.pseudo = query.pseudo;
        page = page.supplant(marqueurs);

    } else {
        // SI IDENTIFICATION OK, ON ENVOIE PAGE ACCUEIL MEMBRE

        page = fs.readFileSync('./html/mod_accueil_jeu.html', 'UTF-8');

        // ON LISTE LES LOBBY DEJA CRÉÉ
        contenu_fichier = fs.readFileSync("./json/lobby.json", 'utf-8');
        listeLobby = JSON.parse(contenu_fichier);

        marqueurs = {};
        marqueurs.lobby = "";
        marqueurs.modal = "";

        for (i = 0; i < listeLobby.length; i++) {

          if (listeLobby[i].etat === 0 && listeLobby[i].joueur.length < listeLobby[i].nbJoueur) {

            if (listeLobby[i].style == "private") {
              marqueurs.lobby += '<li><a class="btn btn-default" data-toggle="modal" data-target="#'+listeLobby[i].lobby+'" href="">' + listeLobby[i].lobby + ' [ ' + listeLobby[i].joueur + ' ]</a></li>';
              marqueurs.modal += '<div class="modal fade" id="'+listeLobby[i].lobby+'"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Mot de passe du lobby</h4></div><div class="modal-body"><div class="form-area2"><form action="/req_rejoindre_lobby" method="GET"><input type="hidden" name="pseudo" value="'+query.pseudo+'"><input type="hidden" name="lobby" value="'+ listeLobby[i].lobby +'"><label for="inputPassword" class="sr-only">Mot de passe</label><input type="password" id="inputPassword" class="form-control" name="mdp" placeholder="Mot de passe" required><br><button type="submit" class="btn btn-primary pull-right">Rejoindre le lobby</button></form></div></div></div></div></div>';
            } else {
              marqueurs.lobby += '<li><a class="btn btn-default" href="/req_rejoindre_lobby?pseudo=' + query.pseudo + '&lobby=' + listeLobby[i].lobby + '">' + listeLobby[i].lobby + ' [ ' + listeLobby[i].joueur + ' ]</a></li>';
            }
          }
        }

        marqueurs.pseudo = query.pseudo;

        var j = 0;

        while (listeMembres[j].pseudo !== query.pseudo) {
          j++;
        }

        marqueurs.avatar = listeMembres[j].avatar;
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
