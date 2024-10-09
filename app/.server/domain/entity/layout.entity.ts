import dayjs from 'dayjs';

interface CreditLayout {

    id: number,
    amount: number,
    currentDebt: number,
    paymentAmount: number,
    creditAt: Date,
    clientGuarantee: string,
    avalGuarantee: string,
    client: { fullname: string, address: string, phoneNumber: number },
    aval: { fullname: string, address: string, phoneNumber: number },
    folder: { name: string },
    group: { name: number }

}


export class Layout {

    public readonly columns: string[] = [
        'ID',
        'CLIENTE', 
        'AVAL', 
        'DEUDA TOTAL', 
        'DEUDA ACTUAL', 
        'PAGOS',
        'CARPETA',
        'GRUPO',
        'FECHA DE ALTA',
    ];

    static mapper(credits: CreditLayout[]) {

        if(credits.length === 0)  return [];

        const info = {
            group: credits[0].group.name,
            folder: credits[0].folder.name,
            creditAt: dayjs(credits[0].creditAt).format('YYYY-MM-DD'),
        }

        const data = credits.map(Layout.create);
        return {
            ...info,
            data
        }
    }

    static create(credit: CreditLayout) {

        const dates = Layout.addDates(credit.creditAt);
        return {
            'Cliente': `${credit.client.fullname},\n ${credit.client.address},\n ${credit.client.phoneNumber},\n ${credit.clientGuarantee}`, 
            'Aval': `${credit.aval.fullname},\n ${credit.aval.address},\n ${credit.aval.phoneNumber},\n ${credit.avalGuarantee}`, 
            'Prestamo': credit.amount, 
            'Pago': credit.paymentAmount,
            ...dates
        }

    }

    static addDates(creditAt: Date) {

        const firstPayment = dayjs(creditAt).add(7, 'day').format('YYYY-MM-DD');
        const secondPayment = dayjs(firstPayment).add(7, 'day').format('YYYY-MM-DD');
        const payment3 = dayjs(secondPayment).add(7, 'day').format('YYYY-MM-DD');
        const payment4 = dayjs(payment3).add(7, 'day').format('YYYY-MM-DD');
        const payment5 = dayjs(payment4).add(7, 'day').format('YYYY-MM-DD');
        const payment6 = dayjs(payment5).add(7, 'day').format('YYYY-MM-DD');
        const payment7 = dayjs(payment6).add(7, 'day').format('YYYY-MM-DD');
        const payment8 = dayjs(payment7).add(7, 'day').format('YYYY-MM-DD');
        const payment9 = dayjs(payment8).add(7, 'day').format('YYYY-MM-DD');
        const payment10 = dayjs(payment9).add(7, 'day').format('YYYY-MM-DD');
        const payment11 = dayjs(payment10).add(7, 'day').format('YYYY-MM-DD');
        const payment12 = dayjs(payment11).add(7, 'day').format('YYYY-MM-DD');
        const payment13 = dayjs(payment12).add(7, 'day').format('YYYY-MM-DD');
        const payment14 = dayjs(payment13).add(7, 'day').format('YYYY-MM-DD');
        const payment15 = dayjs(payment14).add(7, 'day').format('YYYY-MM-DD');

        return  {
            [firstPayment.toString()]: '',
            [secondPayment.toString()]: '',
            [payment3.toString()]: '',
            [payment4.toString()]: '',
            [payment5.toString()]: '',
            [payment6.toString()]: '',
            [payment7.toString()]: '',
            [payment8.toString()]: '',
            [payment9.toString()]: '',
            [payment10.toString()]: '',
            [payment11.toString()]: '',
            [payment12.toString()]: '',
            [payment13.toString()]: '',
            [payment14.toString()]: '',
            [payment15.toString()]: '',
        }

    }

}   