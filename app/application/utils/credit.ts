import { Types } from "~/.server/interfaces";

export const calculateAmount = ( amount: number, isForgivent: boolean, currentDebt: number) => {
    const payment = amount / 10;
    const forgiventAmount = currentDebt < payment ? currentDebt : payment;
    const currentAmount = (currentDebt ===  0 || !isForgivent) 
        ?  amount
        : amount - forgiventAmount;
    
    return (currentAmount + currentDebt) /  10;
}

export const convertDebt = (currentAmount: number, type: Types = 'NORMAL') => {
  
    const debt = { 
      paymentAmount: currentAmount, 
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

  