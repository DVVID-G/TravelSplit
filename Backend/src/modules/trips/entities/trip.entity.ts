import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TripParticipant } from './trip-participant.entity';
import { TripStatus } from '../enums/trip-status.enum';

/**
 * Entidad Trip que representa un viaje en el sistema.
 * Extiende BaseEntity para heredar id, timestamps y soft delete.
 *
 * Un viaje puede tener múltiples participantes y gastos asociados.
 * La moneda está fija en COP y no puede cambiarse.
 */
@Entity('trips')
export class Trip extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @Column({
    name: 'currency',
    type: 'varchar',
    length: 3,
    default: 'COP',
  })
  currency!: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: TripStatus.ACTIVE,
  })
  status!: TripStatus;

  @Column({ name: 'code', type: 'varchar', length: 20, unique: true })
  code!: string;

  /**
   * Relación uno a muchos con TripParticipant.
   * Un viaje puede tener múltiples participantes.
   */
  @OneToMany(() => TripParticipant, (participant) => participant.trip, {
    cascade: true,
  })
  participants!: TripParticipant[];
}
