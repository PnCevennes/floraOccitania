-- Création des nomenclatures
WITH d AS (
    SELECT  'FO_LOCALISATION' as code, 'Localisation' as label, 'Localisation des dénomination en ethnobotanique' as definition, 'PNC' as source, 'Validé' as statut
    UNION SELECT 'FO_USAGE', 'Usage', 'Usage des plantes en ethnobotanique', 'PNC', 'Validé'
    UNION SELECT 'FO_PARTIE_PLANTE', 'Partie de la plante', 'Partie de la plante ayant des usages en ethnobotanique', 'PNC', 'Validé'
)
INSERT INTO ref_nomenclatures.bib_nomenclatures_types (mnemonique, label_default, definition_default,  label_fr, definition_fr, source, statut)
SELECT d.code, label, definition,  label, definition, d.source, d.statut
FROM d
LEFT OUTER JOIN ref_nomenclatures.bib_nomenclatures_types
ON code = mnemonique
WHERE mnemonique IS NULL;


WITH d AS (
    SELECT *
    FROM (
        VALUES
            ('FO_LOCALISATION', 'CG', 'CG', 'Causses gorges'),
            ('FO_LOCALISATION', 'ML', 'ML', 'Mont Lozère'),
            ('FO_LOCALISATION', 'AI', 'AI', 'Aigoual'),
            ('FO_LOCALISATION', 'CV', 'CV', 'Cévennes'),
            ('FO_LOCALISATION', 'PG', 'PG', 'Piémont garrigues'),
            ('FO_LOCALISATION', 'IND', 'IND', 'Indéterminé'),
            ('FO_USAGE', '1', 'ALIMENTAIRE', 'Alimentaire'),
            ('FO_USAGE', '2', 'MEDICINAL', 'Médicinal'),
            ('FO_USAGE', '3', 'VETERINAIRE', 'Vétérinaire'),
            ('FO_USAGE', '4', 'ALI_ANIMAL', 'Alimentation animale'),
            ('FO_USAGE', '5', 'LUDIQUE', 'Ludique'),
            ('FO_USAGE', '6', 'ARTISANAL', 'Artisanal et domestique'),
            ('FO_USAGE', '7', 'CROYANCES', 'Croyances et religions'),
            ('FO_USAGE', '8', 'TRADITION', 'Tradition orale'),
            ('FO_PARTIE_PLANTE', '1', 'PLANTE_ENTIERE', 'Plante entière'),
            ('FO_PARTIE_PLANTE', '2', 'TIGE', 'Tige'),
            ('FO_PARTIE_PLANTE', '3', 'RAMEAUX', 'Rameaux'),
            ('FO_PARTIE_PLANTE', '4', 'FEUILLES', 'Feuilles'),
            ('FO_PARTIE_PLANTE', '5', 'FLEURS', 'Fleurs'),
            ('FO_PARTIE_PLANTE', '6', 'BOURGEONS', 'Bourgeons'),
            ('FO_PARTIE_PLANTE', '7', 'FRUITS', 'Fruits'),
            ('FO_PARTIE_PLANTE', '8', 'RACINES', 'Racines'),
            ('FO_PARTIE_PLANTE', '9', 'BULBES', 'Bulbes'),
            ('FO_PARTIE_PLANTE', '10', 'RHIZOMES', 'Rhizomes'),
            ('FO_PARTIE_PLANTE', '11', 'SPORANGES', 'Sporanges'),
            ('FO_PARTIE_PLANTE', '12', 'NON_PRECISE', 'Non précisé')
    ) as t(type, code, mnemonique, label)
), a AS (
    SELECT b.id_type, d.code as cd_nomenclature, d.mnemonique as mnemonique, d.label as label_fr, d.label as label_default ,
    'PNC' AS source, 'Validé' as statut, 0 as id_broader,
    b.id_type || '.' || lpad((row_number() OVER(PARTITION BY id_type))::varchar, 3, '0') as hierarchy,
    true as active
    FROM d
    JOIN ref_nomenclatures.bib_nomenclatures_types b
    ON b.mnemonique = d.type
)
INSERT INTO ref_nomenclatures.t_nomenclatures (id_type, cd_nomenclature, mnemonique, label_fr, label_default, source, statut, id_broader, hierarchy, active)
SELECT a.*
FROM a
LEFT OUTER JOIN ref_nomenclatures.t_nomenclatures n
ON n.id_type = a.id_type AND n.cd_nomenclature = a.cd_nomenclature
WHERE  n.cd_nomenclature  IS NULL;



--- ##############################################################################################
--- ############ Ajout fonction check nomenclature type Array
--- ##############################################################################################
CREATE OR REPLACE FUNCTION ref_nomenclatures.check_nomenclature_array_type_by_id(
    ids integer[],
    myidtype integer
)
RETURNS boolean AS
$BODY$
--Function that checks if an array of id_nomenclature matches with wanted nomenclature type (use id_type)
DECLARE
    not_matching varchar;
BEGIN
    not_matching := (
        WITH a AS (
            SELECT unnest(ids) as id
        )
        SELECT string_agg(id::varchar, ', ')
        FROM a
        LEFT OUTER JOIN ref_nomenclatures.t_nomenclatures
        ON  id_type = myidtype AND id_nomenclature = id
        WHERE id_nomenclature IS NULL
    );

    IF (NOT not_matching IS NULL AND NOT not_matching = '' ) THEN
      RAISE EXCEPTION 'Error : id_nomenclature --> (%) and id_type --> (%) didn''t match. Use nomenclature with corresponding type (id_type). See ref_nomenclatures.t_nomenclatures.id_type and ref_nomenclatures.bib_nomenclatures_types.id_type.', not_matching, myidtype ;
    ELSE
      RETURN true;
    END IF;

    RETURN false;
END;
$BODY$
  LANGUAGE plpgsql IMMUTABLE
  COST 100;

CREATE OR REPLACE FUNCTION ref_nomenclatures.check_nomenclature_array_type_by_mnemonique(
    ids integer[],
    mytype character varying
)
RETURNS boolean AS
$BODY$
--Function that checks if an array of id_nomenclature matches with wanted nomenclature type (use id_type)
DECLARE
    not_matching varchar;
BEGIN
    not_matching := (
        WITH a AS (
            SELECT unnest(ids) as id
        )
        SELECT string_agg(id::varchar, ', ')
        FROM a
        LEFT OUTER JOIN ref_nomenclatures.t_nomenclatures
        ON  id_type = ref_nomenclatures.get_id_nomenclature_type(mytype) AND id_nomenclature = id
        WHERE id_nomenclature IS NULL
    );

    IF (NOT not_matching IS NULL AND NOT not_matching = '' ) THEN
      RAISE EXCEPTION 'Error : id_nomenclature --> (%) and id_type --> (%) didn''t match. Use nomenclature with corresponding type (id_type). See ref_nomenclatures.t_nomenclatures.id_type and ref_nomenclatures.bib_nomenclatures_types.id_type.', not_matching, myidtype ;
    ELSE
      RETURN true;
    END IF;

    RETURN false;
END;
$BODY$
  LANGUAGE plpgsql IMMUTABLE
  COST 100;

--- ##############################################################################################
--- ##############################################################################################
--              STRUCTURE flore occitan
--- ##############################################################################################
--- ##############################################################################################
DROP SCHEMA IF EXISTS flora_occitania CASCADE;
CREATE SCHEMA flora_occitania;

CREATE TABLE flora_occitania.t_sources (
    id_source SERIAL PRIMARY KEY,
    citation varchar(1000) NOT NULL,
    auteurs varchar(250),
    titre varchar(250),
    ISBN varchar(250)
);
-- DROP FUNCTION ref_nomenclatures.check_nomenclature_type_by_id(integer, integer);

CREATE TABLE flora_occitania.t_nom_vernaculaires (
    id_nomvern SERIAL PRIMARY KEY,
    cd_ref INTEGER,
    nom_vernaculaire VARCHAR,
    commentaire_nom VARCHAR,
    localisations int[],
    usages int[],
    parties_utilisees int[],
    commentaire_usage varchar,
    id_sources int[],
    meta_create_date timestamp without time zone DEFAULT now(),
    meta_update_date timestamp without time zone,
    CONSTRAINT fk_t_nom_vernaculaires_bib_noms FOREIGN KEY (cd_ref)
      REFERENCES taxonomie.bib_noms (cd_nom) MATCH FULL
      ON UPDATE CASCADE ON DELETE NO ACTION,
    CONSTRAINT check_cd_ref_is_ref CHECK (cd_ref = taxonomie.find_cdref(cd_ref))
);


CREATE TRIGGER tri_meta_dates_change_t_nom_vernaculaires
  BEFORE INSERT OR UPDATE
  ON flora_occitania.t_nom_vernaculaires
  FOR EACH ROW
  EXECUTE PROCEDURE public.fct_trg_meta_dates_change();

ALTER TABLE flora_occitania.t_nom_vernaculaires
  ADD CONSTRAINT check_t_nom_vernaculaires_localisations CHECK (ref_nomenclatures.check_nomenclature_array_type_by_mnemonique(localisations,'FO_LOCALISATION')) NOT VALID;

ALTER TABLE flora_occitania.t_nom_vernaculaires
  ADD CONSTRAINT check_t_nom_vernaculaires_usages CHECK (ref_nomenclatures.check_nomenclature_array_type_by_mnemonique(usages,'FO_USAGE')) NOT VALID;

ALTER TABLE flora_occitania.t_nom_vernaculaires
  ADD CONSTRAINT check_t_nom_vernaculaires_parties_utilisees CHECK (ref_nomenclatures.check_nomenclature_array_type_by_mnemonique(parties_utilisees,'FO_PARTIE_PLANTE')) NOT VALID;


-- Tableau de bord
-- Vue

CREATE OR REPLACE VIEW flora_occitania.v_list_summary_taxon_to_fill AS
 WITH nom_occ AS (
         SELECT t_nom_vernaculaires.cd_ref,
            count(*) AS count, string_agg(nom_vernaculaire, ', ') as agg_noms_occ
           FROM flora_occitania.t_nom_vernaculaires
          GROUP BY t_nom_vernaculaires.cd_ref
        )
 SELECT DISTINCT n.id_nom,
    COALESCE(o.count, 0::bigint) AS nb_nom_occ,
    agg_noms_occ,
    t.cd_nom,
    t.cd_ref,
    t.nom_vern,
    t.nom_complet,
    t.famille,
    t.url,
    cmt.valeur_attribut AS commentaire_general
   FROM taxonomie.cor_nom_liste l
     JOIN taxonomie.bib_noms n ON l.id_nom = n.id_nom
     JOIN taxonomie.taxref t ON t.cd_nom = n.cd_ref
     LEFT JOIN nom_occ o ON t.cd_nom = o.cd_ref
     LEFT JOIN taxonomie.cor_taxon_attribut cmt ON t.cd_nom = cmt.cd_ref AND id_attribut = 50018
  WHERE l.id_liste = 68
  ORDER BY t.famille, t.nom_complet;


--- ##############################################################################################
--- ##############################################################################################
--              Données flore occitan
--- ##############################################################################################
--- ##############################################################################################


INSERT INTO flora_occitania.t_sources(id_source,  auteurs, titre, citation)
VALUES
(1,'Alibert Louis', 'Dictionnaire occitan-français', 'Alibert Louis, Dictionnaire occitan-français, Toulouse, IEO,1966 – 1976.665 p.'),
(2,'Boissier de Sauvages Pierre-Augustin', 'Dictionnaire languedocien-français', 'Boissier de Sauvages Pierre-Augustin, Dictionnaire languedocien-français, Alais, 1820. T1, 389 p.'),
(3,'D''Hombres (Maximin) et Charvet (Gratien)', 'Dictionnaire languedocien-français', 'D''Hombres (Maximin) et Charvet (Gratien), Dictionnaire languedocien-français,Alais, 1870. T1, 313 p'),
(4,'Mistral Frédéric', 'Le Trésor du Félibrige', 'Mistral Frédéric, Le Trésor du Félibrige, Raphèle les Arles,1886. T1, 1196 p. T2, 1163.'),
(5,'Boucoiran (Louis)', 'Dictionnaire analogique et étymologique des idiomes méridionaux - Comprenant tous les termes vulgaires de la Flore et de la faune méridionale', 'Boucoiran (Louis), Dictionnaire analogique et étymologique des idiomes méridionaux - Comprenant tous les termes vulgaires de la Flore et de la faune méridionale,  T1, 432 p.'),
(6,'Brisebarre (Anne Marie)', '« les plantes en suspension dans les bergeries cévenoles : efficacité symbolique ou phytothérapeutique ? »', 'Brisebarre (Anne Marie), « les plantes en suspension dans les bergeries cévenoles : efficacité symbolique ou phytothérapeutique ? » in : Plantes, sociétés, savoirs, symboles. Actes du séminaire d''ethnobotanique de Salagon, vol.3, années 2003-2004. p 127- 136.'),
(7,'Durand-Tullou (Adrienne)', '« Rôle des végétaux dans le mode de vie traditionnel »', 'Durand-Tullou (Adrienne), « Rôle des végétaux dans le mode de vie traditionnel » in : L'' Encyclopédie des Cévennes, l''almanach Cévenol, n°8. '),
(8,'Ecologistes de l’Euzière', 'Les salades sauvages', 'Ecologistes de l’Euzière, Les salades sauvages, l''ensalada champanèla. Nîmes, Editions Ecologistes de l''Euzière, 2011. 176 p.'),
(9,'Laurence Pierre', 'Du paysage et des temps, la mémoire orale en Cévennes Vallée française et pays de Calberte. Parc national des Cévennes', 'Laurence Pierre, Du paysage et des temps, la mémoire orale en Cévennes Vallée française et pays de Calberte. Parc national des Cévennes, 2004. T1431 p , T2 860p.'),
(10,'Le Jardin des plantes', 'Revue du Parc national des Cévennes n°38-39', 'Le Jardin des plantes, Revue du Parc national des Cévennes n°38-39, 1988.'),
(11,'Renaux (Alain)', 'Le Savoir en herbe. Montpellier : Presse du Languedoc', 'Renaux (Alain), Le Savoir en herbe. Montpellier : Presse du Languedoc,1998. 426 p.'),
(12,'Seignolles Claude', 'Le folklore du Languedoc -Gard', 'Seignolles Claude, Le folklore du Languedoc -Gard, Hérault, Lozère- . Paris : Maisonneuve et Larose, 1977. 302 p.'),
(13,'Rodrigues Dos Santos (José)', 'Savoirs de la nature, nature des savoirs : les savoirs de la flore en Cévennes.', 'Rodrigues Dos Santos (José), Savoirs de la nature, nature des savoirs : les savoirs de la flore en Cévennes. Paris, ANRT,1995. 698 p.'),
(14,'Vaissiera (Claudi)', 'Botanica Occitana', 'Vaissiera (Claudi), Botanica Occitana. Béziers : Institut d’estudis occitans, 1989. T1,166 p, T2, 241 p.'),
(15,'Wienin Michel', 'petite flore occitane des Garrigues et des Cévennes', 'Wienin Michel, petite flore occitane des Garrigues et des Cévennes. (notice 18 p).')
;


