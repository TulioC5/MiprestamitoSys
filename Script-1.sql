create database quejas_tulio 

use quejas_tulio;

CREATE TABLE tbl_Roles (
  Id_Rol INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Descripcion VARCHAR(20),
  Estado INT
);
INSERT INTO tbl_Roles(Descripcion, Estado) VALUES ('ADMINISTRADOR', 1);
INSERT INTO tbl_Roles(Descripcion, Estado) VALUES ('CENTRALIZADOR', 1);
INSERT INTO tbl_Roles(Descripcion, Estado) VALUES ('RECEPTOR', 1);
INSERT INTO tbl_Roles(Descripcion, Estado) VALUES ('CUENTAHABIENTE', 1);
INSERT INTO tbl_Roles(Descripcion, Estado) VALUES ('CONSULTA', 1);

CREATE TABLE tbl_Cargos (
  Id_Cargo INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Descripcion VARCHAR(20),
  Estado INT
);

INSERT INTO tbl_Cargos(Descripcion, Estado) VALUES ('NOASIGNADO',1);
INSERT INTO tbl_Cargos(Descripcion, Estado) VALUES ('TITULAR',1);
INSERT INTO tbl_Cargos(Descripcion, Estado) VALUES ('SUPLENTE',1);
INSERT INTO tbl_Cargos(Descripcion, Estado) VALUES ('ENCARGADO',1);
INSERT INTO tbl_Cargos(Descripcion, Estado) VALUES ('JEFE INMEDIATO',1);
INSERT INTO tbl_Cargos(Descripcion, Estado) VALUES ('RECEP DE QUEJAS',1);
INSERT INTO tbl_Cargos(Descripcion, Estado) VALUES ('CENT DE QUEJAS',1);

CREATE TABLE tbl_Regiones (
  Id_Region INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Descripcion VARCHAR(15),
  Estado INT
);

INSERT INTO tbl_Regiones(Descripcion, Estado) VALUES ('CENTRAL', 1);
INSERT INTO tbl_Regiones(Descripcion, Estado) VALUES ('SUR', 1);
INSERT INTO tbl_Regiones(Descripcion, Estado) VALUES ('NORORIENTE', 1);
INSERT INTO tbl_Regiones(Descripcion, Estado) VALUES ('OCCIDENTE', 1);


CREATE TABLE tbl_Puntos_Atencion (
  Id_PuntoA INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Descripcion VARCHAR(15),
  Id_Region INT UNSIGNED,
  Estado INT,
  FOREIGN KEY (Id_Region) REFERENCES tbl_Regiones(Id_Region)
);

INSERT INTO tbl_Puntos_Atencion(Descripcion, Id_Region, Estado)
Values('NOASIGNADO', 1, 1)
INSERT INTO tbl_Puntos_Atencion(Descripcion, Id_Region, Estado)
Values('CENTRALIZADOR', 1, 1)


CREATE TABLE tbl_Tipo_Queja (
  Id_Tqueja INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Descripcion VARCHAR(20),
  Siglas VARCHAR(10),
  Estado INT,
  Correlativo INT
);

INSERT INTO tbl_Tipo_Queja(Siglas, Descripcion, CORRELATIVO, ESTADO)
VALUES ('QMS', 'Queja por mal servi', 0, 1)

CREATE TABLE tbl_Queja_Origen (
  Id_Origen INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Descripcion_Origen VARCHAR(20)
);


insert into tbl_Queja_Origen(Descripcion_Origen)
Values('Telefono'),
	('Correo'),
	('Chat'),
	('Presencial'),
	('Aplicación Móvil'),
	('Portal')


CREATE TABLE tbl_Estado (
  Id_Estado INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Descripcion VARCHAR(20),
  Estado INT
);

INSERT INTO tbl_Estado (Descripcion, ESTADO)
VALUES ('Presentada', 1),
('Análisis', 1),
('No aplica', 1),
('En análisis', 1),
('Procedente', 1),
('No procedente', 1),
('Seguimiento', 1),
('Reanálisis', 1),
('Finalizada', 1),
('No aplica', 1);

drop table tbl_usuarios 
CREATE TABLE tbl_Usuarios (
  Id_Usuario INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Usuario VARCHAR(15),
  Contraseña VARCHAR(20),
  Nombres VARCHAR(20),
  Apellidos VARCHAR(20),
  Correo_email VARCHAR(50),
  Fecha_Nacimiento DATETIME,
  Cui VARCHAR(15),
  Departamento VARCHAR(15),
  Id_Rol INT UNSIGNED,
  Id_Cargo INT UNSIGNED,
  Id_PuntoA INT UNSIGNED,
  NUMEROCUENTA VARCHAR(25),
  ESTADO INT,
  FOREIGN KEY (Id_Rol) REFERENCES tbl_Roles(Id_Rol),
  FOREIGN KEY (Id_Cargo) REFERENCES tbl_Cargos(Id_Cargo),
  FOREIGN KEY (Id_PuntoA) REFERENCES tbl_Puntos_Atencion(Id_PuntoA)
);
ALTER TABLE tbl_Usuarios
MODIFY COLUMN Contraseña VARCHAR(100);

INSERT INTO tbl_Usuarios (Usuario, Contraseña, Nombres, Apellidos, Correo_email, Fecha_Nacimiento, Cui, Departamento, Id_Rol, Id_Cargo, Id_PuntoA, NUMEROCUENTA, Estado)
VALUES ('JSOR', SHA2('Jonathansor200066', 256), 'Jonathan', 'Sor', 'Jonathansor2000sm@gmail.com', '2000-06-06', '3034719480109', 'Guatemala', 1, 1, 1, '123', 1);



CREATE TABLE tbl_Queja (
  Id_Queja INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Siglas Varchar(25),
  Nombres VARCHAR(25),
  Apellidos VARCHAR(25),
  Correo_email VARCHAR(50),
  Telefono VARCHAR(8),
  Id_Usuario varchar(100),
  Detalles VARCHAR(1000),
  Id_EstadoIni INT UNSIGNED,
  Id_EstadoFin INT UNSIGNED,
  Fecha_Queja DATETIME DEFAULT CURRENT_TIMESTAMP,
  Id_Tqueja INT UNSIGNED,
  Detalle_Ingreso_Queja VARCHAR(20),
  Id_Origen INT UNSIGNED,
  Documento_Archivo VARCHAR(1000),
  Justificacion VARCHAR(1000),
  Id_PuntoA INT UNSIGNED,
  Respuesta_Queja VARCHAR(100),
  FOREIGN KEY (Id_EstadoIni) REFERENCES tbl_Estado(Id_Estado),
  FOREIGN KEY (Id_EstadoFin) REFERENCES tbl_Estado(Id_Estado),
  FOREIGN KEY (Id_Tqueja) REFERENCES tbl_Tipo_Queja(Id_Tqueja),
  FOREIGN KEY (Id_Origen) REFERENCES tbl_Queja_Origen(Id_Origen),
  FOREIGN KEY (Id_PuntoA) REFERENCES tbl_Puntos_Atencion(Id_PuntoA)
);




CREATE TABLE tbl_Detalles_Queja (
  Id_Qdetalle INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Queja INT UNSIGNED,
  Observacion_Comentario VARCHAR(1000),
  Documento_Archivo VARCHAR(100),
  Fecha_Detalle DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Id_Queja) REFERENCES tbl_Queja(Id_Queja)
);

 
CREATE TABLE tbl_Bitacora_DB (
  Id_B INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Tbl_Nombre VARCHAR(100),
  Accion VARCHAR(15),
  Registro_Despues VARCHAR(1000),
  Usuario VARCHAR(15),
  Fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

select * from quejas_tulio.tbl_estado te 

--Querys
select * from quejas_tulio.tbl_queja 
select * from quejas_tulio.tbl_estado te 
select * from quejas_tulio.tbl_queja_origen

INSERT INTO quejas_tulio.tbl_queja(Nombres, Apellidos, Correo_email, Telefono, Detalles, Id_TQueja, Id_Origen, Archivo, Id_PuntoA, Id_EstadoIni, Id_EstadoFin) 
        VALUES ('Jonathan Elias','Sor Monroy', 'Jonathansor2000sm@gmail.com', '48259722', 'Prueba de queja', '1', '1', '', 1,1,1)

        
select * from quejas_tulio.tbl_usuarios usuarioPunto
select * from tbl_puntos_atencion tpa 

update quejas_tulio.tbl_usuarios set Id_PuntoA =

UPDATE quejas_tulio.tbl_usuarios set Id_Cargo = 2, Id_PuntoA = 3 WHERE Usuario = 'JSOR'

insert into quejas_tulio.tbl_bitacora_db({Tbl_Nombre}, Accion, Registro_Despues, Usuario, Fecha) VALUES ('quejas_tulio.tbl_usuarios', 'actualizar', 'Usuario: JSOR, Id_Cargo: 2, Id_PuntoA:4', 'JSOR', Current_Timestamp)