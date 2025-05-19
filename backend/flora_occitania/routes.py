"""
    Routes correspondantes à l'API de flora occitania
    GET/POST
"""
from flask import Blueprint, request, current_app, g
from sqlalchemy.orm.exc import NoResultFound

from pypnusershub.routes import check_auth

from .models import (
    NomVern, ListTaxon, Sources, CorTaxonAttribut
)

from .database import db
adresses = Blueprint('flora_occitania', __name__)


@adresses.route('/nomocc', methods=['GET'])
@adresses.route('/nomocc/<int:id>', methods=['GET'])
def get_nomocc_fortaxon(cd_ref=None):
    """
        Retourne une liste de nom vernaculaire
        soit pour un taxon si cd_ref est défini
        soit l'ensemble des noms
    """
    if cd_ref:
        data = db.session.query(NomVern).filter_by(cd_ref=cd_ref).all()
    else:
        data = db.session.query(NomVern).all()

    return {'items': [attribut.as_dict() for attribut in data]}


@adresses.route('/sources', methods=['GET'])
def get_all_sources(id=None):
    """
        Retourne la liste des sources
    """
    data = db.session.query(Sources).all()

    return {'items': [attribut.as_dict() for attribut in data]}


@adresses.route('/', methods=['GET'])
@adresses.route('/<int:id>', methods=['GET'])
def get_taxon_list(id=None):
    """
        Retourne soit :
         - la liste des taxons définis dans le cadre du projet
         - le détail d'un taxon si id est spécifié
    """
    recursif = False
    if id:
        q = db.session.query(ListTaxon).filter_by(id_nom=id)
        data = q.all()
        recursif = True
    else:
        data = db.session.query(ListTaxon).all()

    return {
        'items': [
            attribut.as_dict(recursif=recursif) for attribut in data
        ]
    }


@adresses.route("/<int:cd_ref>", methods=["POST"])
@check_auth(1)
def post_taxon_nomVern(cd_ref):
    """
        Sauvegarde un nom vernaculaire
    """
    id_role = g.current_user.id_role
    data = request.json
    lst_nom_verns = data['params']['nomVerns']

    #  ##########################
    # Insertion du commentaire général dans taxhub

    if 'commentaire_general' in data['params']:

        cmt = data['params']['commentaire_general']
        if cmt:
            try:
                taxhub_attr = db.session.query(
                    CorTaxonAttribut
                ).filter_by(
                    cd_ref=cd_ref,
                    id_attribut=current_app.config['ID_ATTR_TAXHUB']
                ).one()
            except NoResultFound:
                taxhub_attr = CorTaxonAttribut(
                    cd_ref=cd_ref,
                    id_attribut=current_app.config['ID_ATTR_TAXHUB']
                )
            taxhub_attr.valeur_attribut = cmt

            db.session.add(taxhub_attr)
            db.session.commit()

    #  ##########################
    #  Insertion des noms vernaculaires
    #  ##########################

    coll = db.session.query(NomVern).filter_by(
        cd_ref=cd_ref
    ).all()
    # liste des identifiants existants
    ids_nom = [
        nom['id_nomvern']
        for nom in lst_nom_verns
        if 'id_nomvern' in nom
    ]

    # Noms supprimés
    ids_del = [
        n.id_nomvern
        for n in coll
        if n.id_nomvern not in ids_nom
    ]
    for id in ids_del:
        n = db.session.query(NomVern).filter_by(
            id_nomvern=id
        ).first()
        db.session.delete(n)

    # Ajout/modification des noms
    for nom in lst_nom_verns:
        if 'id_nomvern' in nom:
            n = db.session.query(NomVern).filter_by(
                id_nomvern=nom['id_nomvern']
            ).first()
        else:
            n = NomVern()

        for key, value in nom.items():
            if not value:
                value = None
            setattr(n, key, value)

        db.session.add(n)
    db.session.commit()
    return {'msg': "ok"}
