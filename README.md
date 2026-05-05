# P_Web-295-Passion-Lecture-Backend

## Routes

Récupérer tous les livres

```json
/books
```

---

Récupérer toutes les infos d'un livre

```json
/book/:id
```

---

Ajouter un livre  
Prends en entré au format JSON :

- titre: string de longeur de 1 à 255
- anneeEdition: number de minimum 1000 et maximum la date acctuel
- imageUrl: string de longeur maximum de 255 (optionel) //TODO : changer pour blob
- nombrePages: number de minimum 1
- extrait: string
- resume: string()
- idUtilisateur: number()
- idCategorie: number()
- idEditeur: number()
- idAuteur: number()

```json
/add-book
```

---

Remplacer l'intégralité du contenu d'un livre dans la base de données

```json
/put-book/:id
```

---

Replacer uniquement une partie du contenu d'un livre dans la base de données

```json
/patch-book/:id
```

---

Supprimer un livre

```json
/delete-book/:id
```
