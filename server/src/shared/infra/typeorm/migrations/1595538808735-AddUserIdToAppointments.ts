import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export default class AddUserIdToAppointments1595538808735 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'appointments',
            new TableColumn({
                name: 'user_id',
                type: 'uuid',
                isNullable: true, // aqui deixa nullable porque se o usuario sair, o histórico de serviços continua.
            }),
        );
        await queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
                name: 'AppointmentUser',
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL', // RESTRIC ou SET NULL ou CASCADE(apaga tudo)
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('appointments', 'AppointmentUser');

        await queryRunner.dropColumn('appointments', 'user_id');
    }
}
