import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

async function main() {
  // Configuración del provider (usa tu wallet local)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Carga del programa usando el IDL y el ID del programa desplegado
  const idl = await anchor.Program.fetchIdl("Vet111111111111111111111111111111111111111", provider);
  const program = new anchor.Program(idl!, new PublicKey("Vet111111111111111111111111111111111111111"), provider);

  // Genera una nueva cuenta para la mascota
  const petKeypair = anchor.web3.Keypair.generate();

  // Crear mascota
  await program.methods.createPet(
    "Firulais",       // nombre
    "Labrador",       // raza
    "Perro",          // especie
    5,                // edad
    "Rabia, Parvovirus", // vacunación
    "Victor",         // dueño
    "Ninguna"         // enfermedades
  ).accounts({
    petAccount: petKeypair.publicKey,
    user: provider.wallet.publicKey,
    systemProgram: SystemProgram.programId,
  }).signers([petKeypair]).rpc();

  console.log("Mascota creada:", petKeypair.publicKey.toBase58());

  // Consultar mascota
  const petAccount = await program.account.petAccount.fetch(petKeypair.publicKey);
  console.log("Consulta mascota:", petAccount);

  // Modificar mascota
  await program.methods.updatePet(
    "Firulais",
    "Labrador",
    "Perro",
    6, // nueva edad
    "Rabia, Parvovirus, Moquillo",
    "Victor",
    "Dermatitis"
  ).accounts({
    petAccount: petKeypair.publicKey,
    user: provider.wallet.publicKey,
  }).rpc();

  console.log("Mascota modificada");

  // Consultar de nuevo
  const updatedPet = await program.account.petAccount.fetch(petKeypair.publicKey);
  console.log("Mascota actualizada:", updatedPet);

  // Borrar mascota
  await program.methods.deletePet().accounts({
    petAccount: petKeypair.publicKey,
    user: provider.wallet.publicKey,
  }).rpc();

  console.log("Mascota eliminada");

  // Listar todas las mascotas creadas por el usuario
  const allPets = await program.account.petAccount.all([
    {
      memcmp: {
        offset: 8 + 4 + 50 + 4 + 50 + 4 + 50 + 1 + 4 + 100 + 4 + 50 + 4 + 200, // offset hasta el pubkey
        bytes: provider.wallet.publicKey.toBase58(),
      },
    },
  ]);

  console.log("Mascotas del usuario:", allPets.map(p => p.account.nombre));
}

main().catch(err => {
  console.error("Error en ejecución:", err);
});
