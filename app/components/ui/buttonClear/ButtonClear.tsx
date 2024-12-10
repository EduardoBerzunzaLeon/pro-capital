import { Button, Tooltip } from "@nextui-org/react";
import { MdFilterAltOff } from "react-icons/md";

interface Props {
    onClear: () => void
}
export const ButtonClear = ({ onClear }: Props) => {

  return (
    <Tooltip
        content={
            <div className="text-tiny">Limpia los filtros de la tabla</div>
        }
    >
        <Button
            color="primary"
            variant="ghost"
            isIconOnly   
            onPress={onClear}
        >
            <MdFilterAltOff />
        </Button>
    </Tooltip>
  )
}