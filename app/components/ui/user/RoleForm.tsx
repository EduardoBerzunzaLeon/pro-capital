import { getFormProps, getSelectProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { UpdateRoleSchema } from "~/schemas/userSchema";
import { SelectRoles } from "../role/SelectRoles";

interface Props {
    id: number,
    role: string,
}
export const RoleForm = ({ id, role }: Props) => {

  const { Form, state } = useFetcher();

  const [form, fields] = useForm({
      onValidate({ formData }) {
        return parseWithZod(formData, { schema: UpdateRoleSchema });
      },
      shouldValidate: 'onSubmit',
      shouldRevalidate: 'onBlur',
  }); 

  return (
    <Card className="md:max-w-[100%] 2xl:max-w-[800px] min-w-[270px] grow">
        <Form 
          method='post'
          { ...getFormProps(form) }
          action={`/users/${id}/update`}
        >
          <CardHeader>
              <h2>Actualizar Role</h2>
          </CardHeader>
          <CardBody>
            <SelectRoles 
                defaultSelectedKeys={[role.toString()]}
                {...getSelectProps(fields.role)}
                isInvalid={!!fields.role.errors}
                color={fields.role.errors ? "danger" : "default"}
                errorMessage={fields.role.errors}
            />
          </CardBody>
          <CardHeader>
            <Button 
                color="primary" 
                type='submit' 
                name='_action' 
                value='updateRole' 
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