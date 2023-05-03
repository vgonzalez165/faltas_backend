# FUNCIONALIDADES QUE YA ESTÁN IMPLEMENTADAS

## Endpoint /api/auth

Están implementadas:
- **POST /api/auth/login**: solicitud de inicio de sesión
- **GET  /api/auth/token/:id**: renovación del JWT


## Endpoint /api/usuario

Llamadas implementadas:
- **POST   /api/usuario**: registra un conjunto de usuarios en la base de datos
- **GET    /api/usuario**: obtiene todos los usuarios de la base de datos. *Faltan opciones de los parámetros del query string*
- **GET    /api/usuario/:id**: obtiene la información de un usuario
- **DELETE /api/usuario/:id**: elimina un usuario de la base de datos
- **PUT    /api/usuario**: actualiza los datos (nombre, apellidos, pass o rol) de un usuario

Llamadas pendientes de implementar:


## Endpoint /api/aula

Llamadas implementadas:
- **POST   /api/aula**: registra un conjunto de aulas en la BD
- **GET    /api/aula**: obtiene el listado de aulas registradas en el sistema
- **GET    /api/aula/:id**: obtiene información de un aula cuyo id se indica en la URL
- **DELETE /api/aula/:id**: elimina un aula
- **PUT    /api/aula/:id**: actualiza los datos (nombre) de un aula
  
Pendientes de implementar:
Ninguna


## Endpoint /api/grupo

Llamadas implementadas:
- **POST   /api/grupo**: registra un conjunto de grupos en la BD
- **GET    /api/grupo**: obtiene el listado de grupos registrados
- **GET    /api/grupo/:id**: obtiene información del grupo cuyo id se indica
- **DELETE /api/grupo/:id**: elimina un grupo
- **PUT    /api/grupo**: actualiza los datos (nombre) de un grupo

Pendientes de implementar:

## Endpoint /api/horario

NOTA: cada entrada de horario hace referencia a una hora de un profesor, relacionando profesor con día de la semana y hora, así como tipo (guardia o lectiva) y aula y grupo en caso de ser lectiva.

Llamadas implementadas:
- **POST   /api/horario**: registra un conjunto de horarios.
- **GET    /api/horario/:id**: obtiene datos de la entrada de horario cuyo id se indique
- **GET    /api/horario/profesor/:id_user/fecha/:fecha**: devuelve todas las horas del horario del profesor en la fecha indicada
- **GET    /api/horario/profesor/:id_user/dia/:dia**: devuelve el horario del profesor en el día de la semana que se indique
- **GET    /api/horario/profesor/:id_user** devuelve el horario semanal del profesor
- **GET    /api/horario/guardia/dia/:dia**: devuelve el listado de profesores que tienen guardia en su horario en el día de la semana indicado.

Por implementar:
- GET    /api/horario/guardia/dia/:dia/hora/:hora: devuelve el listado de profesores que tienen guardia el día de la semana y la hora indicados.


Por determinar el resto de llamadas

## Endpoint /api/falta

Llamadas implementadas:
- **POST   /api/falta/profesor/:id_user/fecha/:fecha/hora/:hora**: registra una ausencia de un profesor en un día y hora indicado.
- **GET /api/falta/profesor/:usuario**: obtiene todas las faltas de un profesor
- **GET /api/falta/profesor/:usuario/fecha/:fecha**: obtiene todas las faltas de un profesor en un día determinado
- **GET /api/falta/fecha/:fecha**: obtiene todas las faltas registradas para la fecha indicada

Pendientes de implementar:
- POST     /api/falta/profesor/:id_user/fecha/:fecha: registra todas las faltas de un profesor un día