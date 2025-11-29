export interface Corsi {
    _id: string;
    titolo: string;
    descrizione: string;
    durata: number;
    
    //sfruttamento dei timestamp

    creato: Date;
    aggiornato: Date;
    terminato: Date;
    
}