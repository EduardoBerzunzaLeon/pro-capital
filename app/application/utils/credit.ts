import { Types } from "~/.server/interfaces";

export const calculateAmount = ( amount: number) => {
    return amount / 10;
}


export const calculateDeductions = ( currentDebt: number, paymentAmount: number, isForgivent: boolean) => {

  if(!isForgivent) {
    return currentDebt;
  }

  if(currentDebt < paymentAmount ) {
    return 0;
  }

  return currentDebt - paymentAmount
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



  