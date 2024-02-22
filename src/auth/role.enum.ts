export enum Role {
  ADMIN = 'admin',
  SECRETARIA = 'secretaria',
}

export function stringToRole(value: string): Role | undefined {
  const enumKeys = Object.keys(Role).filter((key) => isNaN(Number(key)));

  for (const key of enumKeys) {
    if (Role[key] === value.toLowerCase()) {
      return Role[key] as Role;
    }
  }

  return undefined;
}
