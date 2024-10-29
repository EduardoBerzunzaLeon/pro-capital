import { useCallback, useEffect, useState } from "react";

type Types = 'NORMAL' | 'EMPLEADO' | 'LIDER';


  

export const useCalculateDebt = (amount?: string, type?: string) => {
    
    const [payment, setPayment] = useState<number>();
    const [total, setTotal] = useState<number>();

    const convertDebt = (amount: number, type: Types = 'NORMAL') => {
        const debt = { 
          paymentAmount: amount / 10, 
          totalAmount: 0 
        }
      
        const types = {
          'NORMAL': 15,
          'EMPLEADO': 12,
          'LIDER': 10,
        }
      
        const weeks = type in types ? types[type] : 15;
        debt.totalAmount = debt.paymentAmount * weeks;
      
        return debt;
    }
      
    const handleChange = useCallback((amount: string, type: string) => {
    
        const amountParsed =  Number(amount);
        if(isNaN(amountParsed)) {
            return { paymentAmount: 0, totalAmount: 0 }; 
        }
        
        const data =  {
            amount: amountParsed,
            type
        }
        
        return convertDebt(data.amount, (data.type as Types));
    }, [])

    useEffect(() => {

        const { paymentAmount, totalAmount } = handleChange(amount ?? '', type ?? '');
    
        setPayment(paymentAmount);
        setTotal(totalAmount)
    
    }, [amount, handleChange, type]);


    return {
        payment, 
        total, 
        handleChange,
        convertDebt
    }

}