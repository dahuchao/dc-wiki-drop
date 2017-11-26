# dc-wiki-drop
Un wiki avec une base de fichier texte dans dropbox.

## Lancement par docker

Installer les sources de l'application

git clone https://github.com/dahuchao/dc-wiki-drop.git

Fabrication de l'image applicative

sudo docker build -t dahu.chao/dc-wiki-drop .

Démarrage d'un conteneur

sudo docker run --restart always -d -p 80:3001 dahu.chao/dc-wiki-drop

Voir la liste des conteneurs

sudo docker ps

Voir les logs d'un conteneur

sudo docker logs <PID>
