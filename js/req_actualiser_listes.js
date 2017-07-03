// requette pour actualiser les listes de lobby sur accueil jeu

"use strict";

var fs = require("fs");
require('remedial');

var trait = function(req, res, query) {

  var marqueurs;
  var page;
  var listeLobby = [];
  var contenu_fichier;
  var i;
  var listeMembres;

  contenu_fichier = fs.readFileSync("./json/lobby.json", "UTF-8");
  listeLobby = JSON.parse(contenu_fichier);

  contenu_fichier = fs.readFileSync("./json/membres.json", 'utf-8');
  listeMembres = JSON.parse(contenu_fichier);

  var j = 0;

  while (listeMembres[j].pseudo !== query.pseudo) {
    j++;
  }

  page = fs.readFileSync('./html/mod_accueil_jeu.html', 'utf-8');

  marqueurs = {};
  marqueurs.erreur = "";
  marqueurs.pseudo = query.pseudo;
  marqueurs.avatar = listeMembres[j].avatar;
  marqueurs.lobby = "";
  marqueurs.modal = "";

  // ON LISTE LES LOBBY---------------------------------------------------------

  for (i = 0; i < listeLobby.length; i++) {

    if (listeLobby[i].etat === 0 && listeLobby[i].joueur.length < listeLobby[i].nbJoueur) {

      if (listeLobby[i].style == "private") {
        marqueurs.lobby += '<li><a class="btn btn-default" data-toggle="modal" data-target="#' + listeLobby[i].lobby + '" href="">' + listeLobby[i].lobby + ' [ ' + listeLobby[i].joueur + ' ]</a></li>';
        marqueurs.modal += '<div class="modal fade" id="' + listeLobby[i].lobby + '"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Mot de passe du lobby</h4></div><div class="modal-body"><div class="form-area2"><form action="/req_rejoindre_lobby" method="GET"><input type="hidden" name="pseudo" value="' + query.pseudo + '"><input type="hidden" name="lobby" value="' + listeLobby[i].lobby + '"><label for="inputPassword" class="sr-only">Mot de passe</label><input type="password" id="inputPassword" class="form-control" name="mdp" placeholder="Mot de passe" required><br><button type="submit" class="btn btn-primary pull-right">Rejoindre le lobby</button></form></div></div></div></div></div>';
      } else {
        marqueurs.lobby += '<li><a class="btn btn-default" href="/req_rejoindre_lobby?pseudo=' + query.pseudo + '&lobby=' + listeLobby[i].lobby + '">' + listeLobby[i].lobby + ' [ ' + listeLobby[i].joueur + ' ]</a></li>';
      }
    }
  }
  //-------------------------------------------------------------------------------

  page = page.supplant(marqueurs);

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.write(page);
  res.end();

};

//--------------------------------------------------------------------------

module.exports = trait;
