
UPDATE ref_nomenclatures.t_nomenclatures n  SET mnemonique = a.cd_nomenclature, cd_nomenclature = rank
FROM (
SELECT rank() OVER(ORDER BY hierarchy), * FROM ref_nomenclatures.t_nomenclatures
WHERE id_type =
    ref_nomenclatures.get_id_nomenclature_type('FO_USAGE')
) a
WHERE a.id_nomenclature = n.id_nomenclature;


UPDATE flora_occitania.t_sources SET id_source = id_source +100;

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

UPDATE flora_occitania.t_nom_vernaculaires  SET id_sources = array_replace(id_sources, '1', '14');
UPDATE flora_occitania.t_nom_vernaculaires SET id_sources = array_replace(id_sources, '2', '11');
UPDATE flora_occitania.t_nom_vernaculaires SET id_sources = array_replace(id_sources, '3', '15');
UPDATE flora_occitania.t_nom_vernaculaires SET id_sources = array_replace(id_sources, '4', '13');
UPDATE flora_occitania.t_nom_vernaculaires SET id_sources = array_replace(id_sources, '5', '8');
UPDATE flora_occitania.t_nom_vernaculaires SET id_sources = array_replace(id_sources, '6', '10');

DELETE FROM flora_occitania.t_sources WHERE id_source > 100;