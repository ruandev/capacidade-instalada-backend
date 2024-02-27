export enum Turno {
  MATUTINO = 'matutino',
  VESPERTINO = 'vespertino',
  NOTURNO = 'noturno',
  INTEGRAL = 'integral',
}

export function stringToTurno(value: string): Turno | undefined {
  if (!value) {
    return;
  }

  const enumKeys = Object.keys(Turno).filter((key) => isNaN(Number(key)));

  for (const key of enumKeys) {
    if (Turno[key] === value.toLowerCase()) {
      return Turno[key] as Turno;
    }
  }

  return undefined;
}
