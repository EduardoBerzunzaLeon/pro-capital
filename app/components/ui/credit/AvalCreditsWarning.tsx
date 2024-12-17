import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react"

interface Credit {
    status: string,
    client: {
        fullname: string
    },
    folder: {
        name: string
    },
    group: {
        name: string,
    },
    currentDebt: number
}

interface Props {
    credits: Credit[]
}


export const AvalCreditsWarning = ({ credits }: Props) => {

    if(credits.length === 0) return (<></>);

  return (
    <Card className='border-warning-100 border-2'>
        <CardHeader>
            <h3 className='font-bold'>Créditos <span className='text-danger-300'>NO LIQUIDADOS</span> del Aval</h3> 
        </CardHeader>
        <CardBody>
            {
                credits.map((credit) => (
                    <div className='flex flex-row w-full items-center justify-between flex-wrap' key={credit.client.fullname}>
                        <h4>Cliente: {credit.client.fullname.toUpperCase()}</h4>
                        <span>Carpeta: {credit.folder.name }</span>
                        <span>Grupo: {credit.group.name }</span>
                        <span>Deuda: ${credit.currentDebt }</span>
                        <Chip color="warning" variant="bordered">{credit.status}</Chip>
                    </div>
                ))
            }
        </CardBody>
    </Card>
  )
}
