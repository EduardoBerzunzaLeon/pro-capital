import { Avatar,  Button,  Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react"
import { ChipStatus } from "../common"
import { FaUser } from "react-icons/fa"
import { useNavigate, useNavigation } from "@remix-run/react"

interface Props {
    user: {
        avatar: string,
        fullName: string,
        role: { role: string },
        email: string,
        username: string,
        address: string,
        sex: string
        isActive: boolean
    },
    url: string
}

export const Profile = ({ user, url }: Props) => {

    const navigate = useNavigate();
    const navigation = useNavigation();

    const handlePress = () => {
        navigate(url)
    }
    
  return (
    <div>
        <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center gap-2">
                <Avatar 
                    isBordered 
                    className="w-20 h-20" 
                    color="secondary"
                    src={`/img/${user.avatar}`} 
                    showFallback
                    fallback={
                        <FaUser size={40}/>
                    }
                />
                <h4 className="font-bold text-large capitalize">{ user.fullName }</h4>
                <small className="text-default-500"> { user.role.role  } </small>
            </CardHeader>
            <CardBody className="overflow-visible py-2 flex-col items-start gap-2">
                <p>Correo Electronico: <span className='font-bold'>{ user.email }</span></p>
                <p>Usuario: <span className='font-bold'>{ user.username }</span></p>
                <p>Sexo: <span className='font-bold capitalize'>{ user.sex }</span></p>
                <p>Dirección: <span className='font-bold capitalize'>{ user.address }</span></p>
                <ChipStatus isActive={ user.isActive }/>
            </CardBody>
            <CardFooter>
                <Button 
                    variant='ghost' 
                    color='primary' 
                    className='w-full' 
                    onPress={handlePress}
                    isLoading={navigation.state === 'loading'}
                    isDisabled={navigation.state === 'loading'}
                > Actualizar información</Button>
            </CardFooter>
        </Card>
    </div>
  )
}