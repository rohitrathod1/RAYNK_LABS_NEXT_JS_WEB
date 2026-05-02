export const PERMISSIONS = {
  EDIT_HOME: "EDIT_HOME",
  EDIT_ABOUT: "EDIT_ABOUT",
  MANAGE_SERVICES: "MANAGE_SERVICES",
  MANAGE_PORTFOLIO: "MANAGE_PORTFOLIO",
  MANAGE_BLOG: "MANAGE_BLOG",
  MANAGE_TEAM: "MANAGE_TEAM",
  MANAGE_CONTACT: "MANAGE_CONTACT",
  MANAGE_NAVBAR: "MANAGE_NAVBAR",
  MANAGE_FOOTER: "MANAGE_FOOTER",
  MANAGE_SEO: "MANAGE_SEO",
  MANAGE_USERS: "MANAGE_USERS",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_DESCRIPTIONS: Record<PermissionKey, string> = {
  EDIT_HOME: "Edit home page content",
  EDIT_ABOUT: "Edit about page content",
  MANAGE_SERVICES: "Manage services section",
  MANAGE_PORTFOLIO: "Manage portfolio/projects",
  MANAGE_BLOG: "Manage blog posts",
  MANAGE_TEAM: "Manage team members",
  MANAGE_CONTACT: "Manage contact forms",
  MANAGE_NAVBAR: "Manage navigation bar",
  MANAGE_FOOTER: "Manage footer content",
  MANAGE_SEO: "Manage SEO settings",
  MANAGE_USERS: "Manage admin users and permissions",
};
