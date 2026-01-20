import React from 'react';

export interface DashboardContentItem {
    title: string;
    description: React.ReactNode;
    badge: string;
    image?: string;
}

export const contentData: DashboardContentItem[] = [
    {
        title: "Level 1: Sui Garage Development",
        description: (
            <>
                <p>
                    Sui Speedrun is an interactive learning platform designed to help developers
                    master the Sui blockchain through hands-on projects. Each level introduces
                    new concepts and challenges that build upon your knowledge progressively.
                </p>
                <p>
                    Start your journey by connecting your wallet and completing the first
                    transaction. This will authenticate your account and unlock access to
                    all learning modules.
                </p>
                <p>
                    The platform covers everything from basic Move programming to advanced
                    topics like NFTs, object ownership, and decentralized applications on Sui.
                </p>
            </>
        ),
        badge: "Introduction",
        image:
            "/Sui-Garage-Development.webp",
    },
    {
        title: "Level 2: Character Card",
        description: (
            <>
                <p>
                    Welcome to the first step of your Sui development journey!
                    In the Ethereum world, the blockchain is often viewed as a ledger of accounts and balances. However, Sui introduces a paradigm shift: Everything is an Object. In this level, you will move away from thinking in terms of addresses and balances and start thinking in terms of Assets. You are going to build your first digital asset—a Character Card. This is not just a piece of data stored in a contract; it is a standalone object that exists in the Sui ecosystem, capable of being owned, transferred, and updated.
                </p>
                <p>
                    What you will achieve:
                    The "Object" Mindset: Understand how Sui stores data as independent objects with unique IDs.
                    Identity on Chain: Create a personal profile card that stores your name and bio directly on the blockchain.
                    True Ownership: Learn how to send this card to your wallet, where you—and only you—have full control over it.
                    The Full Lifecycle: Go from writing your first line of Move code to deploying a live package on the Sui Testnet.
                </p>
                <p>
                    Ready to start? Click on Chapter 1: Modules and Imports to begin setting up the foundation of your contract!
                </p>
            </>
        ),

        image:
            "/character-card-id.webp",
    },
    {
        title: "Level 3: NFT & Visual Ownership",
        description: (
            <>
                <p>
                    NFT & Visual Ownership (The Entry Ticket)
                </p>
                <p>
                    In Level 1, you created data. In Level 2, you create Art. On most blockchains, wallets have to guess how to display your NFT. On Sui, we use the Display Standard—a powerful template system that tells wallets and marketplaces (like BlueMove) exactly how to render your object using on-chain data.
                </p>
                <p>
                    What you will learn:
                    Visual Data Structures: Add image URLs and metadata to your NFTs.
                    One-Time Witness (OTW): Prove ownership of your module.
                    Display Standard: Create templates that wallets understand.
                    Minting NFTs: Generate collectible tickets programmatically.
                    Testnet Deployment: Make your NFTs live on Sui's blockchain.
                </p>
                <p>
                    Ready to create visual assets? Let's begin with Chapter 1: Struct Definition!
                </p>
            </>
        ),

        image:
            "/nft-phoenix.webp",
    },
    {
        title: "Level 4: Battle & Level Up",
        description: (
            <>
                <p>
                    Battle & Level Up - Project Overview
                </p>
                <p>
                    The objective is to develop the Hero-Core module. Unlike traditional blockchains, Sui treats assets as individual objects, making it an ideal environment for gaming logic. In this project, the smart contract will govern the lifecycle of a Hero, including creation, combat simulation, and attribute restoration.
                </p>
                <p>
                    Through this implementation, players will be able to:
                    Mint Unique Assets: Generate Hero objects with personalized metadata.
                    State Persistence: Perform on-chain combat that modifies the hero's experience (XP) and health (HP).
                    Automated Progression: Execute level-up logic once specific XP thresholds are met.
                    Asset Maintenance: Interact with healing functions to reset object attributes.
                </p>
                <p>
                    Technical Skills Acquired - Completing this tutorial will provide proficiency in the following Move development areas:
                    Sui Object Model: Defining assets using struct and understanding the significance of the UID field.
                    Ability System: Utilizing key and store abilities to define how objects behave within the ecosystem.
                    Ownership Management: Implementing sui::transfer for the secure delivery of assets to user addresses.
                    State Mutation: Managing mutable references (&mut) to update existing object data efficiently.
                    Conditional Logic & Assertions: Implementing safety checks using assert! to enforce game rules and prevent invalid state transitions.
                </p>
            </>
        ),

        image:
            "/battle-level-up.webp",
    },
    {
        title: "Level 5: Sui Car",
        description: (
            <>
                <p>
                    Welcome to the Sui Garage development challenge. This curriculum is designed to transition developers from basic smart contract concepts to mastering the Sui Move object model.
                </p>
                <p>
                    Unlike legacy account-based blockchains, Sui operates on an Object-Centric paradigm. In this system, every asset—whether a car, a wheel, or a performance part—is a standalone, programmable entity. These entities can possess other objects, exist independently, or be composed into intricate hierarchies. This challenge explores how to leverage these unique features to build a scalable and interactive gaming infrastructure.
                </p>
                <p>
                    Technical Learning Objectives - By completing this project, you will gain hands-on experience with the core pillars of Sui development:
                    Hierarchical Object Composition: Implement the Option type to create dynamic "slots" within parent objects, allowing a Car to own and manage sub-components like Wheels and Bumpers.
                    Reference Management and Permissions: Distinguish between mutable references (&mut Car) for state updates and owned objects (Car) for complete lifecycle control.
                    Deterministic Ownership Transfer: Master the "swap and return" pattern. Sui's ownership model ensures that assets are never implicitly deleted; you will learn to use swap_or_fill to return replaced components to the user's registry.
                    Asynchronous State Synchronization: Utilize Move Events to bridge the gap between on-chain logic and the user interface, enabling real-time feedback for modification actions.
                    Atomic Transaction Design: Structure your code to support Programmable Transaction Blocks (PTBs), allowing users to execute complex multi-step operations—such as purchasing and installing a part—in a single, atomic execution.
                </p>
            </>
        ),

        image:
            "/sui-car.webp",
    },
    {
        title: "Level 6: Sui Gallery",
        description: (
            <>
                <p>
                    Sui Gallery: NFT Collections and Visual Assets
                </p>
                <p>
                    Welcome to the Sui Gallery development guide. This comprehensive curriculum teaches you how to create, manage, and showcase NFT collections on the Sui blockchain.
                </p>
                <p>
                    Unlike traditional digital galleries, Sui Gallery leverages the power of Sui's object model to create dynamic, composable, and truly owned digital assets. Each NFT is not just a token reference—it's a full, independent object with its own state, metadata, and capabilities.
                </p>
                <p>
                    Learning Objectives - By completing this comprehensive guide, you will master:
                    NFT Standard Implementation: Learn the Sui NFT standard and how to create compliant, transferable digital assets.
                    Metadata Management: Store and manage rich metadata including images, descriptions, and custom attributes on-chain.
                    Collection Management: Group NFTs into collections with proper ownership and access control.
                    Dynamic Properties: Implement mutable NFT properties that can be updated while preserving ownership.
                    Market Integration: Prepare your NFTs for marketplace integration and secondary sales.
                </p>
            </>
        ),

        image:
            "/sui-gallery.webp",
    },
];
