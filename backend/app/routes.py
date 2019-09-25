# coding: utf8
from flask import jsonify, json, Blueprint, request, Response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select, or_

from .models import NomVern, ListTaxon

from .database import db
adresses = Blueprint('flora_occitania', __name__)


@adresses.route('/nomocc', methods=['GET'])
@adresses.route('/nomocc/<int:id>', methods=['GET'])
def get_nomocc_fortaxon(id=None):
    if id:
        data = db.session.query(NomVern).filter_by(cd_ref=id).all()
    else:
        data = db.session.query(NomVern).all()

    return {'items': [attribut.as_dict() for attribut in data]}


@adresses.route('/', methods=['GET'])
@adresses.route('/<int:id>', methods=['GET'])
def get_taxon_list(id=None):
    recursif = False
    if id:
        q = db.session.query(ListTaxon).filter_by(id_nom=id)
        data = q.all()
        recursif = True
    else:
        data = db.session.query(ListTaxon).all()

    return {'items': [attribut.as_dict(recursif=recursif) for attribut in data]}

@adresses.route('/<int:cd_ref>', methods=['POST'])
def post_taxon_nomVern(cd_ref):
    data = request.json

    coll = db.session.query(NomVern).filter_by(
        cd_ref=cd_ref
    ).all()

    # liste des identifiants existants
    ids_nom = [
        nom['id_nomvern']
        for nom in data['params']
        if 'id_nomvern' in nom
    ]
    print (ids_nom)

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

    for nom in data['params']:
        if 'id_nomvern' in nom:
            n = db.session.query(NomVern).filter_by(
                id_nomvern=nom['id_nomvern']
            ).first()
        else:
            n = NomVern()

        for key, value in nom.items():
            setattr(n, key, value)

        db.session.add(n)
    db.session.commit()
    return {'msg': "ok"}
