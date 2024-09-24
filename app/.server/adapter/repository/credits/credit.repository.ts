import { db } from "../../db"


export function ClientRepository() {

    const findMany = async () => {

        db.credit.findMany({
            select: {
                id: true,
                aval: {
                    select: {
                        fullname: true,
                        reference: true,
                        address: true,
                        curp: true,
                    }
                },
                client: {
                    select: {
                        curp: true,
                        fullname: true,
                        address: true,
                    }
                },
                folder: {
                    select: {
                        name: true,
                        town: {
                            select: {
                                name: true,
                                municipality: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        route: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                group: {
                    select: {
                        name: true,
                    }
                },
                creditAt: true,
                captureAt: true,
                canRenovate: true,
                nextPayment: true,
                currentDebt: true,
                status: true,
                paymentDetails: {
                    folio: true
                }
            }
        })

    }


}