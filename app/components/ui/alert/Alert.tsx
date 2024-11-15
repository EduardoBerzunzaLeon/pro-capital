import { Card, CardHeader, CardBody } from "@nextui-org/react";

interface Props {
    title: string,
    notes: string,
}

// TODO: Mejorar el diseño de las alertas
export const Alert = ({ title, notes }: Props) => {
  return (
    <Card className="w-full bg-yellow-600">
        <CardHeader className="flex gap-3">
        <div className="flex flex-col">
            <p className="text-md">{title}</p>
        </div>
        </CardHeader>
        <CardBody>
        <p>{notes}</p>
        </CardBody>
  </Card>
  )
}
