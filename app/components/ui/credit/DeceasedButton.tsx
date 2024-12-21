import { Switch } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import { FaSkull, FaUserCheck } from "react-icons/fa";


interface Props {
    id: number,
    urlAction: string,
    isDeceased: boolean
    isEditable: boolean,
}
export function DeceasedButton({ id, isDeceased, isEditable, urlAction }: Props) {

  const [isSelected, setIsSelected] = useState(isDeceased);

  const { submit } = useFetcher({ key: `updatePerson_${id}`});

  const handleClick = () => {
    submit({
        isDeceased: !isSelected,
        _action: 'deceased'
    }, {
        method: 'POST',
        action: `/${urlAction}/edit/${id}`
    });
    setIsSelected(!isSelected);
}

  return (
    <Switch
        defaultSelected
        color="success"
        endContent={<FaSkull />}
        isSelected={!isSelected}
        onChange={handleClick}
        isReadOnly={!isEditable}
        startContent={<FaUserCheck  />}
    >
        {isSelected ? 'Fallecido' : 'Vivo'}
    </Switch>
  )
}