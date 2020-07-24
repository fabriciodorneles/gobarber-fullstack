import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

/** SQL Relations
 * Sempre do módulo atual para o módulo que busca
 * Um para Um @OneToOne
 * Um para Muitos @OneToMany
 * Muitos para Muitos @ManyToMany
 */

// KISS - Keep it simple and Stupid

@Entity('appointments') // indica que toda ver que esse model for salvo ele será salvo no bd tb
// dá pra fazer de outras forma, isso aqui é para manter o código mais limpo
class Appointment {
    // vai apontando aqui os objetos que vai passar pro bd
    // pode ter objetos que tenha no código que não passe pro BD
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column() // se não bota nada no parametro vai usar o VarChar mesmo
    provider_id: string; // _id porque é o relacional com os usuários prestadores

    @ManyToOne(() => User)
    @JoinColumn({ name: 'provider_id' })
    provider: User;

    @Column() // Relacionamento com usuario do appointment
    user_id: string; // o id de usuário se relaciona tanto com o campo de provider_id(prestador)

    // quanto de user_id (usuário que marca o agendamento)
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('timestamp with time zone') // se dá um CTRL + SPC dentro da ' ' ele já mostra todos os tipos
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Appointment;
