# 🐾 Biblioteca Veterinaria en Solana (Anchor)

Este proyecto implementa un programa en **Rust con Anchor** para la blockchain de **Solana**, que permite gestionar registros de mascotas en una biblioteca veterinaria.  
Cada registro incluye los siguientes campos:

- Nombre
- Raza
- Especie
- Edad
- Vacunación
- Nombre del dueño
- Enfermedades

## ✨ Funcionalidades

- **Crear** un registro de mascota
- **Modificar** datos existentes
- **Consultar** información de una mascota
- **Borrar** un registro
- **Listar** todas las mascotas de un usuario
- Uso de **PDA con seeds** para cuentas determinísticas


## ⚙️ Requisitos

- [Rust](https://www.rust-lang.org/) (versión estable)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://book.anchor-lang.com/)  
  ```bash
  
  cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locke

  - Node.js y Yarn/NPM para el cliente en TypeScript
🚀 Instalación y despliegue
1.  Clona el repositorio:

git clone https://github.com/tuusuario/veterinaria-anchor.git
cd veterinaria-anchor

2.  Compila el programa:

anchor build

3. 	Despliega en Solana (devnet recomendado):

anchor deploy

4. 	Guarda el IDL generado en target/idl/veterinaria.json.

📂 Estructura del proyect

veterinaria-anchor/
├── programs/
│   └── veterinaria/        # Código Rust del programa
├── client/                 # Cliente en TypeScript
│   └── client.ts
├── tests/                  # Pruebas automatizadas
│   └── anchor.test.ts
├── target/idl/             # IDL generado por Anchor
└── README.md

🧑‍💻 Uso del cliente
Ejemplo de ejecución con ts-node:

ts-node client/client.ts

El cliente permite:
- Crear una mascota (createPet)
- Consultar datos (fetch)
- Modificar (updatePet)
- Borrar (deletePet)
- Listar todas las mascotas de un usuario (all)

🧪 Pruebas automatizadas
Ejecuta las pruebas con:

anchor test

Las pruebas () validan:
• 	Creación de mascota en PDA
• 	Modificación de datos
• 	Consulta de mascota
• 	Eliminación de registro
• 	Manejo de errores (, )

⚠️ Manejo de errores
El programa define errores personalizados:
- InvalidInput: cuando faltan datos obligatorios.
- Unauthorized: cuando un usuario intenta modificar o borrar un registro que no le pertenece.
Estos errores se devuelven como mensajes claros en la ejecución.
📜 Licencia
Este proyecto es de código abierto bajo la licencia MIT.
Puedes usarlo, modificarlo y compartirlo libremente.

🐶🐱 ¡Con esta biblioteca puedes gestionar de forma segura y transparente la información veterinaria en la blockchain de Solana!
