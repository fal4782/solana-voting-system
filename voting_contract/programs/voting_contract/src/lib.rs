use anchor_lang::prelude::*;

declare_id!("9zqibQV12PiGUAqQae8tmmyJvkjKEs6awPXKVhjJmSCc");

#[program]
pub mod voting_contract {
    use super::*;

    pub fn create_poll(
        ctx: Context<CreatePoll>,
        poll_title: String,
        options: Vec<String>,
        expiration: i64,
    ) -> Result<()> {
        let poll_data = &mut ctx.accounts.poll_data;
        poll_data.poll_creator = ctx.accounts.user.key();
        poll_data.poll_title = poll_title;
        poll_data.options = options.clone();
        poll_data.vote_counts = vec![0; options.len()];
        poll_data.expiration = expiration;
        poll_data.is_active = true;
        poll_data.created_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, poll_title: String, candidate_index: u16) -> Result<()> {
        let poll_data = &mut ctx.accounts.poll_data;

        require!(
            poll_data.poll_creator != ctx.accounts.user.key(),
            ErrorCode::CannotVoteOnOwnPoll
        );
        require!(
            poll_data.is_active && Clock::get()?.unix_timestamp < poll_data.expiration,
            ErrorCode::PollNotActive
        );
        require!(
            (candidate_index as usize) < poll_data.options.len(),
            ErrorCode::InvalidCandidate
        );

        poll_data.vote_counts[candidate_index as usize] += 1;

        Ok(())
    }

    pub fn end_poll(ctx: Context<EndPoll>, poll_title: String) -> Result<()> {
        let poll_data = &mut ctx.accounts.poll_data;

        require!(
            poll_data.poll_creator == ctx.accounts.user.key(),
            ErrorCode::NotPollCreator
        );
        require!(poll_data.is_active, ErrorCode::PollAlreadyEnded);

        poll_data.is_active = false;

        Ok(())
    }

    pub fn get_results(ctx: Context<GetResults>, poll_title: String) -> Result<()> {
        let poll_data = &ctx.accounts.poll_data;

        require!(!poll_data.is_active, ErrorCode::PollNotEnded);

        msg!("Poll Results for '{}':", poll_data.poll_title);
        for (i, count) in poll_data.vote_counts.iter().enumerate() {
            msg!("Option '{}': {} votes", poll_data.options[i], count);
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_title: String)]
pub struct CreatePoll<'info> {
    #[account(
        init,
        seeds = [poll_title.as_bytes()],
        bump,
        payer = user,
        space = 8 + 32 + (4 + 200) * 10 + 8 * 10 + 8 + 1 + 8 + 8
    )]
    pub poll_data: Account<'info, PollData>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_title: String)]
pub struct Vote<'info> {
    #[account(
        mut,
        seeds = [poll_title.as_bytes()],
        bump
    )]
    pub poll_data: Account<'info, PollData>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(poll_title: String)]
pub struct EndPoll<'info> {
    #[account(
        mut,
        seeds = [poll_title.as_bytes()],
        bump
    )]
    pub poll_data: Account<'info, PollData>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(poll_title: String)]
pub struct GetResults<'info> {
    #[account(
        seeds = [poll_title.as_bytes()],
        bump
    )]
    pub poll_data: Account<'info, PollData>,
}

#[account]
pub struct PollData {
    pub poll_creator: Pubkey,
    pub poll_title: String,
    pub options: Vec<String>,
    pub vote_counts: Vec<u64>,
    pub expiration: i64,
    pub is_active: bool,
    pub created_at: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Cannot vote on your own poll")]
    CannotVoteOnOwnPoll,
    #[msg("Poll is not active or has expired")]
    PollNotActive,
    #[msg("Invalid candidate index")]
    InvalidCandidate,
    #[msg("Only the poll creator can end the poll")]
    NotPollCreator,
    #[msg("Poll has already ended")]
    PollAlreadyEnded,
    #[msg("Poll is still active")]
    PollNotEnded,
}
