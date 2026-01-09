import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para estadísticas de un viaje
 * Incluye totales de gastos, monto y balance del usuario
 */
export class TripStatsResponseDto {
  @ApiProperty({
    description: 'Número total de gastos registrados en el viaje',
    example: 15,
  })
  totalExpenses!: number;

  @ApiProperty({
    description: 'Suma total de dinero gastado en el viaje',
    example: 1250000,
    type: Number,
  })
  totalAmount!: number;

  @ApiProperty({
    description: 'Número total de participantes activos en el viaje',
    example: 5,
  })
  totalParticipants!: number;

  @ApiProperty({
    description: 'Balance del usuario actual (positivo = a cobrar, negativo = a pagar)',
    example: 50000,
    type: Number,
  })
  userBalance!: number;
}
