from mongoengine import (
    Document,
    StringField,
    EmailField,
    IntField,
    ListField,
    EmbeddedDocumentField,
    DateField,
    EmbeddedDocument,
)


class EsameEmbedded(EmbeddedDocument):
    data = DateField()
    voto = IntField()
    note = StringField()
    modulo = EmbeddedDocumentField("ModuloSnapshot")


class Studente(Document):
    nome = StringField(required=True)
    cognome = StringField(required=True)
    email = EmailField()
    moduliIscritti = ListField(StringField())
    esami = ListField(EmbeddedDocumentField("EsameEmbedded"))
