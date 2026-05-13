CREATE TABLE Utilisateur(
   Id_Utilisateur INT AUTO_INCREMENT,
   pseudo VARCHAR(15) NOT NULL,
   date_entree DATE NOT NULL,
   isAdmin BOOLEAN,
   mot_de_passe VARCHAR(67) NOT NULL,
   PRIMARY KEY(Id_Utilisateur),
   UNIQUE(pseudo),
   UNIQUE(mot_de_passe)
);
 
CREATE TABLE auteur(
   Id_auteur INT AUTO_INCREMENT,
   nom VARCHAR(255),
   prenom VARCHAR(255),
   PRIMARY KEY(Id_auteur)
);
 
CREATE TABLE editeur(
   Id_editeur INT AUTO_INCREMENT,
   nom VARCHAR(255),
   PRIMARY KEY(Id_editeur)
);
 
CREATE TABLE categorie(
   Id_categorie INT AUTO_INCREMENT,
   nom VARCHAR(255),
   PRIMARY KEY(Id_categorie)
);
 
CREATE TABLE Ouvrage(
   Id_Ouvrage INT AUTO_INCREMENT,
   extrait VARCHAR(255) NOT NULL,
   resume VARCHAR(255) NOT NULL,
   annee_edition INT NOT NULL,
   image_url VARCHAR(255),
   nombre_pages BIGINT NOT NULL,
   titre VARCHAR(255) NOT NULL,
   Id_Utilisateur INT NOT NULL,
   Id_categorie INT NOT NULL,
   Id_editeur INT NOT NULL,
   Id_auteur INT NOT NULL,
   PRIMARY KEY(Id_Ouvrage),
   FOREIGN KEY(Id_Utilisateur) REFERENCES Utilisateur(Id_Utilisateur),
   FOREIGN KEY(Id_categorie) REFERENCES categorie(Id_categorie),
   FOREIGN KEY(Id_editeur) REFERENCES editeur(Id_editeur),
   FOREIGN KEY(Id_auteur) REFERENCES auteur(Id_auteur)
);
 
CREATE TABLE commenter(
   Id_Ouvrage INT,
   Id_Utilisateur INT,
   contenu VARCHAR(1000),
   PRIMARY KEY(Id_Ouvrage, Id_Utilisateur),
   FOREIGN KEY(Id_Ouvrage) REFERENCES Ouvrage(Id_Ouvrage),
   FOREIGN KEY(Id_Utilisateur) REFERENCES Utilisateur(Id_Utilisateur)
);
 
CREATE TABLE apprecier(
   Id_Ouvrage INT,
   Id_Utilisateur INT,
   note INT,
   PRIMARY KEY(Id_Ouvrage, Id_Utilisateur),
   FOREIGN KEY(Id_Ouvrage) REFERENCES Ouvrage(Id_Ouvrage),
   FOREIGN KEY(Id_Utilisateur) REFERENCES Utilisateur(Id_Utilisateur)
);