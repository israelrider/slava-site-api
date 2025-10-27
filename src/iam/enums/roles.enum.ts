// Warning:
// The order of roles in the enum matters for permission hierarchy.
// The RolesGuard uses the order to determine if a user has sufficient permissions.
// For example, if a user has the 'admin' role, they should also have permissions of the 'customer' role.
// const rolesArray: string[] = Object.values(Role);
// const userRoleIndex: number = rolesArray.indexOf(currentUserRole);
export enum Role {
  Customer = 'customer',
  // Manager = 'manager',
  Admin = 'admin',
}
