import { db } from "@/lib/db";
import type {
  NavLinkSchemaInput,
  NavLinkUpdateSchemaInput,
  NavSubLinkSchemaInput,
  NavSubLinkUpdateSchemaInput,
} from "../validations";

export async function createNavLink(data: NavLinkSchemaInput) {
  return db.navLink.create({
    data: {
      title: data.title,
      href: data.href ?? "",
      isVisible: data.isVisible ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateNavLink(id: string, data: NavLinkUpdateSchemaInput) {
  return db.navLink.update({
    where: { id },
    data,
  });
}

export async function deleteNavLink(id: string) {
  return db.navLink.delete({ where: { id } });
}

export async function createNavSubLink(data: NavSubLinkSchemaInput) {
  return db.navSubLink.create({ data });
}

export async function updateNavSubLink(id: string, data: NavSubLinkUpdateSchemaInput) {
  return db.navSubLink.update({ where: { id }, data });
}

export async function deleteNavSubLink(id: string) {
  return db.navSubLink.delete({ where: { id } });
}
