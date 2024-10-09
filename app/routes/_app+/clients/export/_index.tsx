import { ActionFunction } from "@remix-run/node";
import { Service } from "~/.server/services";


export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    // const data = Object.fromEntries(formData);

    try {
        const  test =  await Service.credit.exportLayout(formData);
        return test;
    } catch (error) {
        return ''
    }
}