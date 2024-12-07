import { ActionFunctionArgs, unstable_parseMultipartFormData, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, NodeOnDiskFile } from "@remix-run/node";
import { handlerErrorWithToast, handlerSuccessWithToast } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { permissions } from "~/application";

export async function action({ request, params }: ActionFunctionArgs) {

    await Service.auth.requirePermission(request, permissions.users.permissions.update);
    
    const { userId } = params;

    try {
      
      const formData = await unstable_parseMultipartFormData(
        request,
        unstable_composeUploadHandlers(
          unstable_createFileUploadHandler({
            filter({ contentType }) {
              return contentType.includes("image");
            },
            directory: "./public/img",
            avoidFileConflicts: false,
            file({ filename }) {
              const extension = filename.split('.').slice(-1);
              const avatarname = `avatar_${userId}.${extension}`;
              return avatarname;
            },
            maxPartSize: 5 * 1024 * 1024,
          }),
          unstable_createMemoryUploadHandler(),
        ),
      );
    
      const files = formData.getAll("file") as NodeOnDiskFile[];
      
      await Service.user.updateAvatar(userId, files[0].name);
      return handlerSuccessWithToast('update', 'El avatar');


    } catch (error) {
      return handlerErrorWithToast(error, { userId });
    }

    // return json()
  }
  