

INSERT INTO taxonomie.bib_listes (id_liste, nom_liste, desc_liste, picto, regne, group2_inpn) 
VALUES (68, 'Flora occitania', 'Taxons cibles pour le projet flore occitane', 'images/pictos/plante.gif', 'Plantae', 'Angiospermes');

-- Selection des taxons ayant soit le statut patrimonial soit une fiche flore
INSERT INTO taxonomie.cor_nom_liste (id_liste, id_nom)
SELECT 68, n.id_nom
FROM taxonomie.cor_taxon_attribut  c
JOIN taxonomie.taxref t
ON t.cd_nom = c.cd_ref
JOIN taxonomie.bib_noms  n
ON t.cd_nom = n.cd_ref
WHERE id_attribut IN (1, 106)
AND regne = 'Plantae' AND n.cd_nom = n.cd_ref;

