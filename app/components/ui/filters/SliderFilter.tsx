import { Slider, Button } from "@nextui-org/react"
import { useSearchParams } from "@remix-run/react";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface Props {
    label: string,
    maxValue: number,
    param: string,
    value?: number | number[],
}


export const SliderFilter = ({label, maxValue, param, value}: Props) => {
    const [ , setSearchParams] = useSearchParams();
    const [debt, setDebt] = useState<number | number[]>([0, maxValue]);

    useEffect(() => {

        if(!value) {
          setDebt([0, maxValue]);
          return;
        }
        
        if(typeof value === 'number') {
          setDebt([0, value]);
          return;
        }
    
        const areNumbers = value.every((element) => !isNaN(element));
    
        if(!areNumbers) {
          setDebt([0, maxValue]);
          return;
        }
    
        if(value.length !== 2) {
          setDebt([0, maxValue]);
          return;
        }
    
        setDebt([value[0], value[1]]);
    
      }, [maxValue, value])

    const handleDebtChange = () => {
        const data = Array.isArray(debt) ? JSON.stringify(debt) : debt+'';
        setSearchParams(prev => {
          prev.set(param, data);
          return prev;
        })
      }

      
  return (
    <Slider 
        label={label}
        step={50} 
        minValue={0} 
        maxValue={maxValue} 
        defaultValue={[0, maxValue]} 
        value={debt} 
        onChange={setDebt}
        formatOptions={{style: "currency", currency: "MXN"}}
        className="w-full md:max-w-[30%] grow"
        endContent={
        <Button
            isIconOnly
            radius="full"
            variant="light"
            onPress={handleDebtChange}
        >
            <FaSearch />
        </Button>
        }
    />
  )
}