// requette qui envois un ouvrier travailler

"use strict";

var fs = require("fs");
require('remedial');

var trait = function(req, res, query) {
  var module = require('./module.js');
  var marqueurs;
  var tri;
  var page;
  var listeCartes;
  var listeLobby;
  var contenu_fichier;
  var partie;
  var qo;
  var idx;
  var paye_ecu;
  var paye_action;
  var pierre = 0;
  var bois = 0;
  var tuile = 0;
  var savoir = 0;
  var i;
  var j;
  var action;
  var ecu;
  var idx_chan_cour;
  var idx_o;
  var idx_carte_bat;
  var idx_ouv;
  var idx_carte_ouv;
  var pv;
  var tour;

  contenu_fichier = fs.readFileSync("./json/lobby.json", "utf-8");
  listeLobby = JSON.parse(contenu_fichier);

  contenu_fichier = fs.readFileSync("./json/cartes.json", "utf-8");
  listeCartes = JSON.parse(contenu_fichier);

  contenu_fichier = fs.readFileSync("./json/parties/" + query.lobby + ".json", "utf-8");
  partie = JSON.parse(contenu_fichier);

  tri = module(query.lobby, query.pseudo);
  console.log(tri);

  i = tri[1];
  j = tri[0];

  paye_ecu = 0;
  paye_action = 0;


  marqueurs = {};
  marqueurs.erreur = "";

  if (typeof query.ouvrier === "string") {
    query.ouvrier = [query.ouvrier];
  }

  // ON TESTE SI ON A ASSEZ D'ACTION ET D'ECU
  for (qo = 0; qo < query.ouvrier.length; qo++) {
    for (idx = 0; idx < listeCartes.ouvrier.length; idx++) {
      if (query.ouvrier[qo] == listeCartes.ouvrier[idx].id) {
        paye_ecu += listeCartes.ouvrier[idx].ecu;
      }
    }
    paye_action += 1;
  }

  if (paye_ecu > partie.joueur[i].ecu || paye_action > partie.joueur[i].action) {
    page = fs.readFileSync('./html/mod_plateau_actif.html', 'utf-8');
    marqueurs.erreur = "Vous n'avez pas assez d'écus ou d'actions";

  } else {
    action = partie.joueur[i].action;
    action -= paye_action;
    partie.joueur[i].action = action;

    ecu = partie.joueur[i].ecu;
    ecu -= paye_ecu;
    partie.joueur[i].ecu = ecu;

    // ON AJOUTE LES OUVRIERS DANS LA LISTE DU CHANTIER
    for (idx_chan_cour = 0; idx_chan_cour < partie.joueur[i].chantier_cours.length; idx_chan_cour++) {
      if (query.chantier == partie.joueur[i].chantier_cours[idx_chan_cour].id) {
        for (qo = 0; qo < query.ouvrier.length; qo++) {
          partie.joueur[i].chantier_cours[idx_chan_cour].ouvrier.push(Number(query.ouvrier[qo]));
          for (idx_o = 0; idx_o < partie.joueur[i].ouvrier.length; idx_o++) {
            if (query.ouvrier[qo] == partie.joueur[i].ouvrier[idx_o]) {
              partie.joueur[i].ouvrier.splice(idx_o, 1);
            }
          }
        }
      }
    }

    // ON TEST LES CONDITIONS SI LE CHANTIER EST FINI
    for (idx_chan_cour = 0; idx_chan_cour < partie.joueur[i].chantier_cours.length; idx_chan_cour++) {
      for (idx_carte_bat = 0; idx_carte_bat < listeCartes.batiment.length; idx_carte_bat++) {

        if (partie.joueur[i].chantier_cours[idx_chan_cour].id == listeCartes.batiment[idx_carte_bat].id) {

          for (idx_ouv = 0; idx_ouv < partie.joueur[i].chantier_cours[idx_chan_cour].ouvrier.length; idx_ouv++) {
            for (idx_carte_ouv = 0; idx_carte_ouv < listeCartes.ouvrier.length; idx_carte_ouv++) {

              if (partie.joueur[i].chantier_cours[idx_chan_cour].ouvrier[idx_ouv] == listeCartes.ouvrier[idx_carte_ouv].id) {

                pierre += Number(listeCartes.ouvrier[idx_carte_ouv].pierre);
                bois += Number(listeCartes.ouvrier[idx_carte_ouv].bois);
                savoir += Number(listeCartes.ouvrier[idx_carte_ouv].savoir);
                tuile += Number(listeCartes.ouvrier[idx_carte_ouv].tuile);

                if (pierre >= listeCartes.batiment[idx_carte_bat].pierre && bois >= listeCartes.batiment[idx_carte_bat].bois && savoir >= listeCartes.batiment[idx_carte_bat].savoir && tuile >= listeCartes.batiment[idx_carte_bat].tuile) {

                  pv = partie.joueur[i].pv;
                  pv += listeCartes.batiment[idx_carte_bat].pv;
                  partie.joueur[i].pv = pv;

                  ecu += listeCartes.batiment[idx_carte_bat].gain;
                  partie.joueur[i].ecu = ecu;

                  for (var push = 0; push < partie.joueur[i].chantier_cours[idx_chan_cour].ouvrier.length; push++) {
                    partie.joueur[i].ouvrier.push(partie.joueur[i].chantier_cours[idx_chan_cour].ouvrier[push]);
                  }

                  while (partie.joueur[i].chantier_cours[idx_chan_cour].ouvrier.length >= 1) {
                    partie.joueur[i].chantier_cours[idx_chan_cour].ouvrier.splice(0, 1);
                  }
                  partie.joueur[i].chantier_fini.push(partie.joueur[i].chantier_cours[idx_chan_cour].id);

                }
              }
            }
          }
        }
      }
    }

    for (idx_chan_cour = 0; idx_chan_cour < partie.joueur[i].chantier_cours.length; idx_chan_cour++) {
      for (var idx_chan_fini = 0; idx_chan_fini < partie.joueur[i].chantier_fini.length; idx_chan_fini++) {
        if (partie.joueur[i].chantier_cours[idx_chan_cour].id == partie.joueur[i].chantier_fini[idx_chan_fini]) {
          partie.joueur[i].chantier_cours.splice(idx_chan_cour, 1);
        }
      }
    }

    if (partie.joueur[i].pv >= 17) {
      page = fs.readFileSync("./html/mod_fin.html", "utf-8");

    } else if (partie.joueur[i].action <= 0) {

      tour = partie.tour;
      tour++;
      partie.tour = tour;

      if (partie.tour > partie.joueur.length - 1) {
        partie.tour = 0;
      }

      page = fs.readFileSync("./html/mod_plateau_passif.html", "utf-8");
    } else {
      page = fs.readFileSync("./html/mod_plateau_actif.html", "utf-8");
    }
  }

  contenu_fichier = JSON.stringify(partie);
  fs.writeFileSync("./json/parties/" + query.lobby + ".json", contenu_fichier, 'utf-8');

  // ON CREER LES MARQUEURS

  marqueurs.resultat1 = "Victoire";
  marqueurs.resultat2 = "Vous avez gagner avec " + partie.joueur[i].pv + " points de victoires";

  marqueurs.adv = "";
  for (var a = 0; a < listeLobby[j].joueur.length; a++) {
    if (listeLobby[j].joueur[a] !== query.pseudo) {
      marqueurs.adv += '<li><a data-toggle="modal" data-target="#' + listeLobby[j].joueur[a] + '" href="">' + listeLobby[j].joueur[a] + '</a></li>';
    }
  }

  marqueurs.pioche_ouvrier = "";
  for (var po = 0; po < 5; po++) {
    marqueurs.pioche_ouvrier += '<li><a href="/req_recruter_ouvrier?pseudo=' + query.pseudo + '&lobby=' + query.lobby + '&ouvrier=' + partie.ouvrier[po] + '"><img src="./ressources/img/ouvrier/' + partie.ouvrier[po] + '.png"></a></li>';
  }

  marqueurs.pioche_batiment = "";
  for (var pb = 0; pb < 5; pb++) {
    marqueurs.pioche_batiment += '<li><a href="/req_ouvrir_chantier?pseudo=' + query.pseudo + '&lobby=' + query.lobby + '&chantier=' + partie.batiment[pb] + '"><img src="./ressources/img/batiment/' + partie.batiment[pb] + '.png"></a></li>';
  }

  marqueurs.ouvrier = "";
  for (var o = 0; o < partie.joueur[i].ouvrier.length; o++) {
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
