#[allow(duplicate_alias)]
module speedrun_sui::initializer {
    use sui::tx_context;

    // Anyone who calls this function has successfully sent a transaction
    // to the Sui network and proven that their wallet is connected and active.
    #[allow(unused_use)]
    entry fun init_speedrun(_ctx: &mut tx_context::TxContext) {
        // Currently, no special operation needs to be performed inside this function.
        // The main purpose is for the user to successfully sign this transaction.
        // In the future, user registration or reward mechanisms can be added here.
        // For example: sui::transfer::public_transfer(item_id, @sender)
    }
}

