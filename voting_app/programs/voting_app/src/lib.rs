use anchor_lang::prelude::*;

declare_id!("75GwYpCopgByConQ6dwwQtM8UYMnJsxWURLJwBp1L2hm");

#[program]
pub mod voting_app {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, num_options: u16) -> Result<()> {
        require!(num_options > 0 && num_options <= 1000, ErrorCode::InvalidNumberOfOptions);

        let voting_data = &mut ctx.accounts.voting_data;
        voting_data.vote_counts = vec![0; num_options as usize]; // Initialize with the given number of options
        voting_data.bump = ctx.bumps.voting_data; // Store bump seed in `VotingData` account
        msg!("Initialized with vote counts: {:?}", voting_data.vote_counts);
        msg!("VotingData bump: {}", voting_data.bump);
        Ok(())    
    }

    pub fn vote(ctx: Context<Vote>, candidate_index: u16) -> Result<()> {
        let voting_data = &mut ctx.accounts.voting_data;
        if (candidate_index as usize) < voting_data.vote_counts.len() {
            voting_data.vote_counts[candidate_index as usize] += 1;
            msg!("Voted for candidate {}: {:?}", candidate_index, voting_data.vote_counts);
            Ok(())
        } else {
            Err(ErrorCode::InvalidCandidate.into())
        }
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [b"voting_data"], // seed for PDA
        bump,
        payer = user,
        // Allocate space for the `VotingData` account:
        // - 8 bytes for the base account overhead (including metadata and alignment)
        // - 4 bytes for the vector metadata (length, though optional here as it's managed dynamically)
        // - 8 * 1000 bytes for the `Vec<u64>` data, which stores up to 1000 `u64` values, each 8 bytes
        // Extra 32 bytes for alignment/padding or additional fields
        // Total space: 8 (base) + 4 (metadata) + 8000 (data) + 32 = 8041 bytes
        space = 8 + 4 + 8 * 1000 + 32
    )]
    pub voting_data: Account<'info, VotingData>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct VotingData {
    pub vote_counts: Vec<u64>, // Store vote counts for up to 1000 candidates
    pub bump: u8 // 1 byte
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(
        mut,
        seeds = [b"voting_data"], // seed for PDA
        bump = voting_data.bump // bump seed for pda stored in `VotingData` account
    )]
    pub voting_data: Account<'info, VotingData>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid number of options (must be between 1 and 1000)")]
    InvalidNumberOfOptions,

    #[msg("Invalid candidate index")]
    InvalidCandidate,
}




