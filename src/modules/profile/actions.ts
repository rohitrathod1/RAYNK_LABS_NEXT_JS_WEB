"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { ok, fail } from "@/lib/action-response";
import { getErrorMessage } from "@/lib/errors";
import { profileUpdateSchema } from "./validations";
import { getProfileByEmail, updateProfile } from "./data/queries";

function revalidateProfile() {
  revalidatePath("/admin/dashboard/profile");
}

export async function updateProfileAction(raw: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return fail("Not authenticated");
    }

    const user = await getProfileByEmail(session.user.email);
    if (!user) {
      return fail("User not found");
    }

    const data = profileUpdateSchema.parse(raw);
    await updateProfile(user.id, data);
    revalidateProfile();
    return ok(null);
  } catch (err) {
    return fail(getErrorMessage(err));
  }
}
