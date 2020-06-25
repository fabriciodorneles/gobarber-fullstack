import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointments') // indica que toda ver que esse model for salvo ele será salvo no bd tb
// dá pra fazer de outras forma, isso aqui é para manter o código mais limpo
class Appointment {
    // vai apontando aqui os objetos que vai passar pro bd
    // pode ter objetos que tenha no código que não passe pro BD
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column() // se não bota nada no parametro vai usar o VarChar mesmo
    provider: string;

    @Column('timestamp with time zone') // se dá um CTRL + SPC dentro da ' ' ele já mostra todos os tipos
    date: Date;
}

export default Appointment;
