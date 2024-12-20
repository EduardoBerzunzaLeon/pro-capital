import { Image } from "@nextui-org/react"

// import dog_error from '../../../img/dog_error.png';
// import Astronaut_error from '../../../img/Astronaut_error.png';
import clock_error from '../../../img/clock_error.png';

interface Props {
    error?: string | unknown,
    description?: string,
    title?: string
}

export const ErrorCard = ({ error, description, title }: Props) => {
  return (
    <div className='flex items-center flex-col gap-2 w-full h-full'>
        <Image
            alt="http error"
            className="object-cover"
            height={250}
            src={clock_error}
            width={250}
        />
        <h2 className='text-red-800 font-bold text-xl'>{ title  ?? '!Chispas! Ocurrio un error' }</h2>
        {(typeof error === 'string') ? (<p>{error}</p>) : (<p>Problema en el servidor, favor de intentarlo mas tarde</p>)}
        {/* <Divider orientation="horizontal" /> */}
        <p className='text-sm'>
            { description || (`Refresque la página o en su defecto la tabla.
            Si el error persiste consulte con su administrador`)}
        </p>
    </div>
  )
}
