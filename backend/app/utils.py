"""
Fonctions utilitaires
"""
import json
from functools import wraps

from dateutil import parser
from flask import Response
from werkzeug.datastructures import Headers

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import MetaData


def testDataType(value, sqlType, paramName):
    """
        Test the type of a filter
        #TODO: antipatern: should raise something which can be exect by the function which use it
        # and not return the error
    """
    if sqlType == DB.Integer or isinstance(sqlType, (DB.Integer)):
        try:
            int(value)
        except Exception as e:
            return "{0} must be an integer".format(paramName)
    if sqlType == DB.Numeric or isinstance(sqlType, (DB.Numeric)):
        try:
            float(value)
        except Exception as e:
            return "{0} must be an float (decimal separator .)".format(paramName)
    elif sqlType == DB.DateTime or isinstance(sqlType, (DB.Date, DB.DateTime)):
        try:
            dt = parser.parse(value)
        except Exception as e:
            return "{0} must be an date (yyyy-mm-dd)".format(paramName)
    return None


def test_type_and_generate_query(param_name, value, model, q):
    """
        Generate a query with the filter given, checking the params is the good type of the columns, and formmatting it
        Params:
            - param_name (str): the name of the column
            - value (any): the value of the filter
            - model (SQLA model)
            - q (SQLA Query)
    """
    # check the attribut exist in the model
    try:
        col = getattr(model, param_name)
    except AttributeError as error:
        raise GeonatureApiError(str(error))
    sql_type = col.type
    if sql_type == DB.Integer or isinstance(sql_type, (DB.Integer)):
        try:
            return q.filter(col == int(value))
        except Exception as e:
            raise GeonatureApiError("{0} must be an integer".format(param_name))
    if sql_type == DB.Numeric or isinstance(sql_type, (DB.Numeric)):
        try:
            return q.filter(col == float(value))
        except Exception as e:
            raise GeonatureApiError(
                "{0} must be an float (decimal separator .)".format(param_name)
            )
    if sql_type == DB.DateTime or isinstance(sql_type, (DB.Date, DB.DateTime)):
        try:
            return q.filter(col == parser.parse(value))
        except Exception as e:
            raise GeonatureApiError(
                "{0} must be an date (yyyy-mm-dd)".format(param_name)
            )

    if sql_type == DB.Boolean or isinstance(sql_type, DB.Boolean):
        try:
            return q.filter(col.is_(bool(value)))
        except Exception:
            raise GeonatureApiError("{0} must be a boolean".format(param_name))


"""
    Liste des types de données sql qui
    nécessite une sérialisation particulière en
    @TODO MANQUE FLOAT
"""
SERIALIZERS = {
    "date": lambda x: str(x) if x else None,
    "datetime": lambda x: str(x) if x else None,
    "time": lambda x: str(x) if x else None,
    "timestamp": lambda x: str(x) if x else None,
    "uuid": lambda x: str(x) if x else None,
    "numeric": lambda x: str(x) if x else None,
}


def serializable(cls):
    """
        Décorateur de classe pour les DB.Models
        Permet de rajouter la fonction as_dict
        qui est basée sur le mapping SQLAlchemy
    """

    """
        Liste des propriétés sérialisables de la classe
        associées à leur sérializer en fonction de leur type
    """
    cls_db_columns = [
        (
            db_col.key,
            SERIALIZERS.get(db_col.type.__class__.__name__.lower(), lambda x: x),
        )
        for db_col in cls.__mapper__.c
        if not db_col.type.__class__.__name__ == "Geometry"
    ]

    """
        Liste des propriétés de type relationship
        uselist permet de savoir si c'est une collection de sous objet
        sa valeur est déduite du type de relation
        (OneToMany, ManyToOne ou ManyToMany)
    """
    cls_db_relationships = [
        (db_rel.key, db_rel.uselist) for db_rel in cls.__mapper__.relationships
    ]

    def serializefn(self, recursif=False, columns=()):
        """
        Méthode qui renvoie les données de l'objet sous la forme d'un dict

        Parameters
        ----------
            recursif: boolean
                Spécifie si on veut que les sous objet (relationship)
                soit également sérialisé
            columns: liste
                liste des colonnes qui doivent être prises en compte
        """
        if columns:
            fprops = list(filter(lambda d: d[0] in columns, cls_db_columns))
        else:
            fprops = cls_db_columns

        out = {item: _serializer(getattr(self, item)) for item, _serializer in fprops}
        if recursif is False:
            return out

        for (rel, uselist) in cls_db_relationships:
            if getattr(self, rel):
                if uselist is True:
                    out[rel] = [x.as_dict(recursif) for x in getattr(self, rel)]
                else:
                    out[rel] = getattr(self, rel).as_dict(recursif)

        return out

    cls.as_dict = serializefn
    return cls


def json_resp(fn):
    """
    Décorateur transformant le résultat renvoyé par une vue
    en objet JSON
    """

    @wraps(fn)
    def _json_resp(*args, **kwargs):
        res = fn(*args, **kwargs)
        if isinstance(res, tuple):
            return to_json_resp(*res)
        else:
            return to_json_resp(res)

    return _json_resp


def to_json_resp(
    res, status=200, filename=None, as_file=False, indent=None, extension="json"
):
    if not res:
        status = 404
        res = {"message": "not found"}

    headers = None
    if as_file:
        headers = Headers()
        headers.add("Content-Type", "application/json")
        headers.add(
            "Content-Disposition",
            "attachment",
            filename="export_{}.{}".format(filename, extension),
        )
    return Response(
        json.dumps(res, ensure_ascii=False, indent=indent),
        status=status,
        mimetype="application/json",
        headers=headers,
    )


def csv_resp(fn):
    """
    Décorateur transformant le résultat renvoyé en un fichier csv
    """

    @wraps(fn)
    def _csv_resp(*args, **kwargs):
        res = fn(*args, **kwargs)
        filename, data, columns, separator = res
        return to_csv_resp(filename, data, columns, separator)

    return _csv_resp


def to_csv_resp(filename, data, columns, separator=";"):

    headers = Headers()
    headers.add("Content-Type", "text/plain")
    headers.add(
        "Content-Disposition", "attachment", filename="export_%s.csv" % filename
    )
    out = generate_csv_content(columns, data, separator)
    return Response(out, headers=headers)


def generate_csv_content(columns, data, separator):
    outdata = [separator.join(columns)]
    for o in data:
        outdata.append(
            separator.join('"%s"' % (o.get(i), "")[o.get(i) is None] for i in columns)
        )
    out = "\r\n".join(outdata)
    return out
