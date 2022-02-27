use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

// fn check_authority(authority_info: &AccountInfo, expected_authority: &Pubkey) -> ProgramResult {
//     if expected_authority != authority_info.key {
//         msg!("Incorrect record authority provided");
//         return Err();
//     }
//     if !authority_info.is_signer {
//         msg!("Record authority signature missing");
//         return Err();
//     }
//     Ok(())
// }

#[program]
pub mod record_anchor {

    use super::*;
    /// Create a `RecordInstruction::Initialize` instruction
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("RecordInstruction::Initialize");

        let data_info = &mut ctx.accounts.record_account;
        let authority_info = *ctx.accounts.authority.key;

        let mut account_data = RecordData::try_from_slice(&data_info.data.bytes)?;
        if account_data.is_initialized() {
            msg!("Record account already initialized");
            return Err(ProgramError::AccountAlreadyInitialized.into());
        }

        account_data.authority = authority_info;
        account_data.version = 1;

        Ok(())
    }

    pub fn set_authority(ctx: Context<SetAuthority>) -> Result<()> {
        msg!("RecordInstruction::SetAuthority");
        let data_info = &mut ctx.accounts.record_account;
        let new_authority_info = ctx.accounts.new_authority.key();
        let mut account_data = RecordData::try_from_slice(&data_info.data.bytes)?;

        if !account_data.is_initialized() {
            msg!("Record account not initialized");
            return Err(ProgramError::UninitializedAccount.into());
        }
        account_data.authority = new_authority_info;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 8 + 8 + 8)]
    pub record_account: Account<'info, RecordData>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct SetAuthority<'info> {
    #[account(mut, has_one = authority)]
    pub record_account: Account<'info, RecordData>,
    #[account(mut)]
    pub authority: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub new_authority: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>
}

#[account]
pub struct RecordData {
    /// Struct version, allows for upgrades to the program
    pub version: u8,

    /// The account allowed to update the data
    pub authority: Pubkey,

    /// The data contained by the account, could be anything serializable
    pub data: Data,
}

#[account]
pub struct Data {
    /// The data contained by the account, could be anything or serializable
    pub bytes: [u8; 8],
}

// impl Data {
//     /// very small data for easy testing
//     // pub const DATA_SIZE: usize = 8;
// }

impl RecordData {
    /// Version to fill in on new created accounts
    // pub const CURRENT_VERSION: u8 = 1;

    /// Start of writable account data, after version and authority
    // pub const WRITABLE_START_INDEX: usize = 33;

    fn is_initialized(&self) -> bool {
        self.version == 1
    }
}

