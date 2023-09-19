# upload-chunk API

## Introduction

API Backend Node + Express récupérant les chunks du fichier envoyés par le client vers le serveur afin de reconstruire le fichier de base.

## Installation

Installation des paquets node_modules
    npm install

Créer le fichier .env
    # Access cors allow origin
    CORS=*

    # Express settings
    EXPRESS_PORT=3000
    EXPRESS_BIND_ADDR=0.0.0.0

    # Formidable Settings
    UPLOAD_DIR=/uploads
    UPLOAD_MAX_FILES=1
    UPLOAD_ALLOW_EMPTY_FILE=true
    UPLOAD_MAX_FILE_SIZE=5000000

Lancer le serveur
    npm start
