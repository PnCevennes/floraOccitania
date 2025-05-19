"""
    Définition des models
"""
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY

from app.database import db
from app.utils import serializable


@serializable
class CorTaxonAttribut(db.Model):
    __tablename__ = "cor_taxon_attribut"
    __table_args__ = {"schema": "taxonomie", "extend_existing": True}
    id_attribut = db.Column(
        db.Integer,
        primary_key=True
    )
    cd_ref = db.Column(
        db.Integer,
        primary_key=True
    )
    valeur_attribut = db.Column(db.Text, nullable=False)


@serializable
class Sources(db.Model):
    __tablename__ = "t_sources"
    __table_args__ = {"schema": "flora_occitania"}
    id_source = db.Column(db.Integer, primary_key=True)
    citation = db.Column(db.Unicode)
    auteurs = db.Column(db.Unicode)
    titre = db.Column(db.Unicode)
    isbn = db.Column(db.Unicode)


@serializable
class NomVern(db.Model):
    __tablename__ = "t_nom_vernaculaires"
    __table_args__ = {"schema": "flora_occitania"}
    id_nomvern = db.Column(db.Integer, primary_key=True)
    cd_ref = db.Column(db.Integer)
    nom_vernaculaire = db.Column(db.Unicode)
    commentaire_nom = db.Column(db.Unicode)
    localisations = db.Column(ARRAY(db.Integer))
    usages = db.Column(ARRAY(db.Integer))
    parties_utilisees = db.Column(ARRAY(db.Integer))
    commentaire_usage = db.Column(db.Unicode)
    id_sources = db.Column(ARRAY(db.Integer))
    meta_create_date = db.Column(db.DateTime)
    meta_update_date = db.Column(db.DateTime)


@serializable
class ListTaxon(db.Model):
    __tablename__ = "v_list_summary_taxon_to_fill"
    __table_args__ = {"schema": "flora_occitania"}
    id_nom = db.Column(db.Integer, primary_key=True)
    nb_nom_occ = db.Column(db.Integer)
    cd_nom = db.Column(db.Integer)
    cd_ref = db.Column(db.Integer)
    agg_noms_occ = db.Column(db.Integer)
    nom_vern = db.Column(db.Unicode)
    nom_complet = db.Column(db.Unicode)
    famille = db.Column(db.Unicode)
    url = db.Column(db.Unicode)
    commentaire_general = db.Column(db.Unicode)

    noms_occitan = relationship(
        "NomVern",
        backref="group",
        primaryjoin="NomVern.cd_ref == ListTaxon.cd_ref",
        foreign_keys="NomVern.cd_ref"
    )
