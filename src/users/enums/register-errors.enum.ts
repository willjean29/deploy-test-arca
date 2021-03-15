export enum RegisterError {
  PASSWORD_LENGTH = 'La contraseña es menor a 6 carácteres',
  EMPTY_FIRST_NAME = 'Ingrese un nombre',
  FIRST_NAME = 'Ingrese un nombre correcto',
  EMPTY_LAST_NAME = 'Ingrese un apellido',
  LAST_NAME = 'Ingrese un apellido correcto',
  EMPTY_DNI = 'Ingrese un dni',
  DNI = 'El dni debe contener solo números',
  EMPTY_LEVELS = 'Seleccione niveles de educación',
  EMPTY_REGISTER_CODE = 'Ingrese código de registro',
  EMPTY_EMAIL = 'Ingrese un email',
  EMAIL = 'Ingrese un email válido',
  TYPE = 'Seleccione tipo correcto',
  EMPTY_PARENT_MAIL = 'Ingrese un email del padre o apoderado',
  PARENT_EMAIL = 'Ingrese un email del apoderado válido',
  SCHOOL = 'Seleccione un colegio',
  BIRTHDAY = 'Cumpleaños incorrecto',
}

export const passwordMinLength = 6;
export const dniMinLength = 7;
