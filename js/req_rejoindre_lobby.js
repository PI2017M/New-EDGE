// requette pour rejoindre un lobby

"use strict";

var fs = require("fs");
require('remedial');

var trait = function(req, res, query) {

  var marqueurs;
  var page;
  var listeLobby;
  var listeMembres;
  var contenu_fichier;
  var i;
  var j;
  var k = 0;

  contenu_fichier = fs.readFileSync("./json/lobby.json", "UTF-8");
  listeLobby = JSON.parse(contenu_fichier);

  marqueurs = {};

  i = 0;

  while (listeLobby[i].lobby != query.lobby) {
    i++;
  }

  if (listeLobby[i].mdp == undefined) {
    page = fs.readFileSync('./html/mod_lobby.html', 'UTF-8');

    marqueurs.lobby = query.lobby;
    listeLobby[i].joueur.push(query.pseudo);
  } else {
    if (query.mdp == listeLobby[i].mdp) {
      page = fs.readFileSync('./html/mod_lobby.html', 'utf-8');

      marqueurs.lobby = query.lobby;
      listeLobby[i].joueur.push(query.pseudo);
    } else {
      marqueurs.erreur = "Mauvais mot de passe";
      marqueurs.lobby = "";
      marqueurs.modal = "";

      for (var idx_lobby = 0; idx_lobby < listeLobby.length; idx_lobby++) {

        if (listeLobby[idx_lobby].etat === 0 && listeLobby[idx_lobby].joueur.length < listeLobby[idx_lobby].nbJoueur) {

          if (listeLobby[idx_lobby].style == "private") {
            marqueurs.lobby += '<li><a class="btn btn-default" data-toggle="modal" data-target="#'+listeLobby[idx_lobby].lobby+'" href="">' + listeLobby[idx_lobby].lobby + ' [ ' + listeLobby[idx_lobby].joueur + ' ]</a></li>';
            marqueurs.modal += '<div class="modal fade" id="'+listeLobby[idx_lobby].lobby+'"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Mot de passe du lobby</h4></div><div class="modal-body"><div class="form-area2"><form action="/req_rejoindre_lobby" method="GET"><input type="hidden" name="pseudo" value="'+query.pseudo+'"><input type="hidden" name="lobby" value="'+ listeLobby[idx_lobby].lobby +'"><label for="inputPassword" class="sr-only">Mot de passe</label><input type="password" id="inputPassword" class="form-control" name="mdp" placeholder="Mot de passe" required><br><button type="submit" class="btn btn-primary pull-right">Rejoindre le lobby</button></form></div></div></div></div></div>';
          } else {
            marqueurs.lobby += '<li><a class="btn btn-default" href="/req_rejoindre_lobby?pseudo=' + query.pseudo + '&lobby=' + listeLobby[idx_lobby].lobby + '">' + listeLobby[idx_lobby].lobby + ' [ ' + listeLobby[idx_lobby].joueur + ' ]</a></li>';
          }
        }
      }

      page = fs.readFileSync('./html/mod_accueil_jeu.html', 'utf-8');
    }
  }

  marqueurs.joueur = "";
  marqueurs.bouton = "";

  // ON LISTE LES JOUEURS PRESENTS DANS LE LOBBY----------------------
  for (j = 0; j < listeLobby[i].joueur.length; j++) {
    marqueurs.joueur += "<li>" + listeLobby[i].joueur[j] + "</li>";
  }

  contenu_fichier = fs.readFileSync("./json/membres.json", 'utf-8');
  listeMembres = JSON.parse(contenu_fichier);

  var idx_joueur = 0;

  while (listeMembres[idx_joueur].pseudo !== query.pseudo) {
    idx_joueur++;
  }
  marqueurs.avatar = listeMembres[idx_joueur].avatar;

  marqueurs.pseudo = query.pseudo;

  contenu_fichier = JSON.stringify(listeLobby);
  fs.writeFileSync("./json/lobby.json", contenu_fichier, 'utf-8');

  page = page.supplant(marqueurs);

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.write(page);
  res.end();

};

//--------------------------------------------------------------------------

module.exports = trait;
