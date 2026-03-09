import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

async function main() {
  // Provider configuration (local wallet)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Load program using IDL and deployed program ID
  const idl = await anchor.Program.fetchIdl("Vet111111111111111111111111111111111111111", provider);
  const program = new anchor.Program(idl!, new PublicKey("Vet111111111111111111111111111111111111111"), provider);

  // Pet name for PDA
  const petName = "Firulais";

  // Derive PDA with seeds: ["pet", user, name]
  const [petPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("pet"), provider.wallet.publicKey.toBuffer(), Buffer.from(petName)],
    program.programId
  );

  // Create pet
  await program.methods.createPet(
    petName,
    "Labrador",
    "Perro",
    5,
    "Rabia, Parvovirus",
    "Victor",
    "Ninguna"
  ).accounts({
    petAccount: petPda,
    user: provider.wallet.publicKey,
    systemProgram: SystemProgram.programId,
  }).rpc();

  console.log("✅ Mascota creada en PDA:", petPda.toBase58());

  // Fetch pet
  const petAccount = await program.account.petAccount.fetch(petPda);
  console.log("📋 Consulta mascota:", petAccount);

  // Update pet
  await program.methods.updatePet(
    petName,
    "Labrador",
    "Perro",
    6, // nueva edad
    "Rabia, Parvovirus, Moquillo",
    "Victor",
    "Dermatitis"
  ).accounts({
    petAccount: petPda,
    user: provider.wallet.publicKey,
  }).rpc();

  console.log("✏️ Mascota modificada");

  // Fetch again
  const updatedPet = await program.account.petAccount.fetch(petPda);
  console.log("📋 Mascota actualizada:", updatedPet);

  // Delete pet
  await program.methods.deletePet().accounts({
    petAccount: petPda,
    user: provider.wallet.publicKey,
  }).rpc();

  console.log("🗑️ Mascota eliminada");

  // List all pets created by the user
  const allPets = await program.account.petAccount.all([
    {
      memcmp: {
        offset: 8 + 4 + 50 + 4 + 50 + 4 + 50 + 1 + 4 + 100 + 4 + 50 + 4 + 200, // offset until pubkey
        bytes: provider.wallet.publicKey.toBase58(),
      },
    },
  ]);

  console.log("📋 Mascotas del usuario:", allPets.map(p => p.account.name));
}

main().catch(err => {
  console.error("❌ Error en ejecución:", err);
});
