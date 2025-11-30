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
    studente_id = ObjectIdField(
        required=False
    )  # Può essere None se lo studente non esiste più nel DB, ma vogliamo mantenere il riferimento. Prima era TRUE ma in fase di test ho deciso di cambiarlo non renderlo obbligatorio
    nome = StringField(required=True)


class Modulo(Document):
    codice = StringField(required=True, unique=True)
    nome = StringField(required=True)
    ore = IntField()
    descrizione = StringField()
    studentiIscritti = ListField(EmbeddedDocumentField("StudenteSubset"))
