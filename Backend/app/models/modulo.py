from mongoengine import (
    Document,
    EmbeddedDocument,
    StringField,
    IntField,
    ListField,
    EmbeddedDocumentField,
    ObjectIdField,
)


class ModuloSnapshot(EmbeddedDocument):
    codice = StringField(required=True)
    nome = StringField(required=True)
    ore = IntField()
    descrizione = StringField()


class StudenteSubset(EmbeddedDocument):
    studente_id = ObjectIdField(required=True)
    nome = StringField(required=True)


class Modulo(Document):
    codice = StringField(required=True, unique=True)
    nome = StringField(required=True)
    ore = IntField()
    descrizione = StringField()
    studentiIscritti = ListField(EmbeddedDocumentField("StudenteSubset"))
