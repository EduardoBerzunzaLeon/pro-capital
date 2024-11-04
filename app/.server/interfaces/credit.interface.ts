export interface PaymentI {
    id: number,
    status: PaymentStatus,
    paymentAmount: number,
    paymentDate: Date,
    folio: number
}

export type PaymentStatus = 
      'PAGO'
    | 'PAGO_INCOMPLETO'
    | 'NO_PAGO'
    | 'ADELANTO'
    | 'GARANTIA';