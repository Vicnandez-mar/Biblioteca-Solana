use anchor_lang::prelude::*;

declare_id!("BnfyhYagCQeEiUmkoYvhAnwiGhT7rCHeTwRJnPLUQSYq");

#[program]
pub mod veterinary {
    use super::*;

    pub fn create_pet(
        ctx: Context<CreatePet>,
        name: String,
        breed: String,
        species: String,
        age: u8,
        vaccination: String,
        owner: String,
        diseases: String,
    ) -> Result<()> {
        if name.is_empty() || owner.is_empty() {
            return Err(ErrorCode::InvalidInput.into());
        }

        let pet_account = &mut ctx.accounts.pet_account;
        pet_account.name = name;
        pet_account.breed = breed;
        pet_account.species = species;
        pet_account.age = age;
        pet_account.vaccination = vaccination;
        pet_account.owner = owner;
        pet_account.diseases = diseases;
        pet_account.user = ctx.accounts.user.key();

        Ok(())
    }

    pub fn update_pet(
        ctx: Context<UpdatePet>,
        name: String,
        breed: String,
        species: String,
        age: u8,
        vaccination: String,
        owner: String,
        diseases: String,
    ) -> Result<()> {
        let pet_account = &mut ctx.accounts.pet_account;

        if pet_account.user != ctx.accounts.user.key() {
            return Err(ErrorCode::Unauthorized.into());
        }

        pet_account.name = name;
        pet_account.breed = breed;
        pet_account.species = species;
        pet_account.age = age;
        pet_account.vaccination = vaccination;
        pet_account.owner = owner;
        pet_account.diseases = diseases;

        Ok(())
    }

    pub fn get_pet(ctx: Context<GetPet>) -> Result<()> {
        let pet_account = &ctx.accounts.pet_account;
        msg!("Mascota: {}", pet_account.name);
        msg!("Raza: {}", pet_account.breed);
        msg!("Especie: {}", pet_account.species);
        msg!("Edad: {}", pet_account.age);
        msg!("Vacunación: {}", pet_account.vaccination);
        msg!("Dueño: {}", pet_account.owner);
        msg!("Enfermedades: {}", pet_account.diseases);
        Ok(())
    }

    pub fn delete_pet(ctx: Context<DeletePet>) -> Result<()> {
        let pet_account = &ctx.accounts.pet_account;
        if pet_account.user != ctx.accounts.user.key() {
            return Err(ErrorCode::Unauthorized.into());
        }
        Ok(())
    }
}

// Contextos con seeds
#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreatePet<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + PetAccount::MAX_SIZE,
        seeds = [b"pet", user.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub pet_account: Account<'info, PetAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePet<'info> {
    #[account(mut, seeds = [b"pet", user.key().as_ref(), pet_account.name.as_bytes()], bump)]
    pub pet_account: Account<'info, PetAccount>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetPet<'info> {
    #[account(seeds = [b"pet", pet_account.user.as_ref(), pet_account.name.as_bytes()], bump)]
    pub pet_account: Account<'info, PetAccount>,
}

#[derive(Accounts)]
pub struct DeletePet<'info> {
    #[account(mut, close = user, seeds = [b"pet", user.key().as_ref(), pet_account.name.as_bytes()], bump)]
    pub pet_account: Account<'info, PetAccount>,
    pub user: Signer<'info>,
}

// Datos de la mascota
#[account]
pub struct PetAccount {
    pub name: String,
    pub breed: String,
    pub species: String,
    pub age: u8,
    pub vaccination: String,
    pub owner: String,
    pub diseases: String,
    pub user: Pubkey,
}

impl PetAccount {
    pub const MAX_SIZE: usize =
        4 + 50 + // nombre
        4 + 50 + // raza
        4 + 50 + // especie
        1 +      // edad
        4 + 100 + // vacunacion
        4 + 50 + // dueño
        4 + 200 + // enfermedades
        32;      // user pubkey
}

// Errores personalizados
#[error_code]
pub enum ErrorCode {
    #[msg("Entrada inválida: faltan datos obligatorios.")]
    InvalidInput,
    #[msg("No tienes permisos para modificar o borrar este registro.")]
    Unauthorized,
}
