// Module de tri pour les indices des lobbys et des joueurs

"use strict";

var fs = require("fs");
var trouver_joueur = function (a, b) {
    var j;
    var i;
    var listeLobby;
    var lobby;
    var query;
    var contenu_fichier;
    var partie;
    var joueur;

    contenu_fichier = fs.readFileSync("./json/lobby.json", "utf-8");
    listeLobby = JSON.parse(contenu_fichier);

    contenu_fichier = fs.readFileSync("./json/parties/" + a + ".json", "utf-8");
    partie = JSON.parse(contenu_fichier);




    j = 0;
    while (a !== listeLobby[j].lobby) {
        j++;
    }

    i = 0;
    while (b !== listeLobby[j].joueur[i]) {
        i++;
    }
    return [j, i];
};

module.exports = trouver_joueur;
