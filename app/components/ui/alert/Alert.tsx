import { Card, CardHeader, CardBody } from "@nextui-org/react";

interface Props {
    title: string,
    notes: string,
}

// TODO: Mejorar el diseño de las alertas
export const Alert = ({ title, notes }: Props) => {
  return (
    <Card className="border-warning-100 border-2 w-full">
        <CardHeader>
            <p className="text-md font-bold text-danger-300">{title}</p>
        </CardHeader>
        <CardBody>
          <p>{notes}</p>
        </CardBody>
  </Card>
  )
}
