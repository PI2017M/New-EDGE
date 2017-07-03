//=========================================================================
// SERVEUR
// Auteur :
// Version : 24/04/2017
//=========================================================================

"use strict";

var http = require("http");
var url = require("url");
var querystring = require("querystring");

//-------------------------------------------------------------------------
// DECLARATION DES DIFFERENTS MODULES CORRESPONDANT A CHAQUE ACTION
//-------------------------------------------------------------------------

var req_commencer = require("./js/req_commencer.js");

var req_static = require("./js/req_static.js");
var req_erreur = require("./js/req_erreur.js");
var req_identifier = require("./js/req_identifier.js");
var req_afficher_formulaire_inscription = require("./js/req_afficher_formulaire_inscription.js");
var req_inscrire = require("./js/req_inscrire.js");
var req_afficher_formulaire_lobby = require("./js/req_afficher_formulaire_lobby.js");
var req_creer_lobby = require("./js/req_creer_lobby.js");
var req_rejoindre_lobby = require("./js/req_rejoindre_lobby.js");
var req_actualiser_listes = require("./js/req_actualiser_listes.js");
var req_retour_accueil = require("./js/req_retour_accueil.js");
var req_actualiser_lobby = require("./js/req_actualiser_lobby.js");
var req_lancer_partie = require("./js/req_lancer_partie.js");
var req_deconnexion = require("./js/req_deconnexion.js");
var req_vendre_action = require("./js/req_vendre_action.js");
var req_actualiser_jeu = require("./js/req_actualiser_jeu.js");
var req_acheter_action = require("./js/req_acheter_action.js");
var req_recruter_ouvrier = require("./js/req_recruter_ouvrier.js");
var req_ouvrir_chantier = require("./js/req_ouvrir_chantier.js");
var req_envoyer_travailler = require("./js/req_envoyer_travailler.js");

//-------------------------------------------------------------------------
// FONCTION DE CALLBACK APPELLEE POUR CHAQUE REQUETE
//-------------------------------------------------------------------------

var traite_requete = function (req, res) {

    var ressource;
    var requete;
    var pathname;
    var query;

    console.log("URL reçue : " + req.url);
    requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;

    // ROUTEUR

    try {
        switch (pathname) {
            case '/':
            case '/req_commencer':
                req_commencer(req, res, query);
                break;
            case '/req_identifier':
                req_identifier(req, res, query);
                break;
            case '/req_afficher_formulaire_inscription':
                req_afficher_formulaire_inscription(req, res, query);
                break;
            case '/req_inscrire':
                req_inscrire(req, res, query);
                break;
            case '/req_afficher_formulaire_lobby':
                req_afficher_formulaire_lobby(req, res, query);
                break;
            case '/req_creer_lobby':
                req_creer_lobby(req, res, query);
                break;
            case '/req_rejoindre_lobby':
                req_rejoindre_lobby(req, res, query);
                break;
            case '/req_actualiser_listes':
                req_actualiser_listes(req, res, query);
                break;
            case '/req_retour_accueil':
                req_retour_accueil(req, res, query);
                break;
            case '/req_actualiser_lobby':
                req_actualiser_lobby(req, res, query);
                break;
            case '/req_lancer_partie':
                req_lancer_partie(req, res, query);
                break;
            case '/req_deconnexion':
                req_deconnexion(req, res, query);
                break;
            case '/req_vendre_action':
                req_vendre_action(req, res, query);
                break;
            case '/req_actualiser_jeu':
                req_actualiser_jeu(req, res, query);
                break;
            case '/req_acheter_action':
                req_acheter_action(req, res, query);
                break;
            case '/req_recruter_ouvrier':
                req_recruter_ouvrier(req, res, query);
                break;
            case '/req_ouvrir_chantier':
                req_ouvrir_chantier(req, res, query);
                break;
            case '/req_envoyer_travailler':
                req_envoyer_travailler(req, res, query);
                break;
            default:
                req_static(req, res, pathname);
                break;
        }
    } catch (e) {
        console.log('Erreur : ' + e.stack);
        console.log('Erreur : ' + e.message);
        //console.trace();
        req_erreur(req, res, query);
    }
};

//-------------------------------------------------------------------------
// CREATION ET LANCEMENT DU SERVEUR
//-------------------------------------------------------------------------

var mon_serveur = http.createServer(traite_requete);
var port = 5000;
console.log("Serveur en ecoute sur port " + port);
mon_serveur.listen(port);
