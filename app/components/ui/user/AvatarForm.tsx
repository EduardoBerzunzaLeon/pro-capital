import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { useCallback } from "react";
import { useDropzone } from 'react-dropzone-esm';

interface Props {
  id: number
}
export const AvatarForm = ({ id }: Props) => {

  // TODO: improve upload files
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    console.log({acceptedFiles});
  }, [])

  const { Form, state } = useFetcher();

  const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
    onDrop, 
    // accept: { "image": ["png", "jpeg"] },
    accept: {
      'image/png': [],
      'image/jpeg': [],
    },
    maxSize: 5242880,
  })

  return (
    <Card className="max-w-[600px] min-w-[300px]">
      <Form 
        method='post'
        action={`/users/${id}/avatar`}
        encType="multipart/form-data"
      >
        <CardHeader>
            <h2>Actualizar foto</h2>
        </CardHeader>
        <CardBody>
          <div {...getRootProps()} 
            className='bg-gray-600 h-[150px] rounded-md border-dashed border-gray-300 border-2 flex items-center justify-center'
          >
            <input name='file' {...getInputProps()} />
            {
              isDragActive ?
                <p>Arrastra la imagen...</p> :
                <p>Arrastra la imagen, o darle click aqui</p>
            }
          </div>
          {
            acceptedFiles[0] && (
              <img src={URL.createObjectURL(acceptedFiles[0])} alt="preview" />
            )
          }
        </CardBody>
        <CardHeader>
          <Button 
              color="primary" 
              type='submit' 
              name='_action' 
              value='updateAvatar' 
              isLoading={state !== 'idle'}
              isDisabled={state !== 'idle'}
          >
              Actualizar
          </Button>
        </CardHeader>
      </Form>
  </Card>
  )
}
