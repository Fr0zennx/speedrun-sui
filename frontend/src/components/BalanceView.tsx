import { useState } from 'react';
import './BalanceView.css';

interface BalanceViewProps {
  onClose: () => void;
}

function BalanceView({ onClose }: BalanceViewProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: 'Introduction',
      content: `
        <h3>Battle & Level Up</h3>
        
        <h4>Project Overview</h4>
        <p>The objective is to develop the <strong>Hero-Core</strong> module. Unlike traditional blockchains, Sui treats assets as individual objects, making it an ideal environment for gaming logic. In this project, the smart contract will govern the lifecycle of a Hero, including creation, combat simulation, and attribute restoration.</p>
        
        <p>Through this implementation, players will be able to:</p>
        <ul>
          <li><strong>Mint Unique Assets:</strong> Generate Hero objects with personalized metadata.</li>
          <li><strong>State Persistence:</strong> Perform on-chain combat that modifies the hero's experience (XP) and health (HP).</li>
          <li><strong>Automated Progression:</strong> Execute level-up logic once specific XP thresholds are met.</li>
          <li><strong>Asset Maintenance:</strong> Interact with healing functions to reset object attributes.</li>
        </ul>
        
        <h4>Technical Skills Acquired</h4>
        <p>Completing this tutorial will provide proficiency in the following Move development areas:</p>
        <ul>
          <li><strong>Sui Object Model:</strong> Defining assets using <code>struct</code> and understanding the significance of the <code>UID</code> field.</li>
          <li><strong>Ability System:</strong> Utilizing <code>key</code> and <code>store</code> abilities to define how objects behave within the ecosystem.</li>
          <li><strong>Ownership Management:</strong> Implementing <code>sui::transfer</code> for the secure delivery of assets to user addresses.</li>
          <li><strong>State Mutation:</strong> Managing mutable references (<code>&mut</code>) to update existing object data efficiently.</li>
          <li><strong>Conditional Logic & Assertions:</strong> Implementing safety checks using <code>assert!</code> to enforce game rules and prevent invalid state transitions.</li>
        </ul>
        
        <h4>Application Architecture</h4>
        <p>The application is divided into four distinct phases:</p>
        <ol>
          <li><strong>Data Modeling:</strong> Establishing the fundamental structure of the Hero asset.</li>
          <li><strong>Asset Forging:</strong> Developing the constructor functions and ownership transfer logic.</li>
          <li><strong>Combat Engine:</strong> Creating the logic for state changes, resource depletion, and experience gains.</li>
          <li><strong>State Restoration:</strong> Implementing recovery functions to reset specific object fields.</li>
        </ol>
      `
    },
    {
      title: 'Chapter 1: Data Structure Modeling',
      content: `
        <h3>Data Structure Modeling</h3>
        
        <p>In SUI Move, everything revolves around <strong>Objects</strong>. Unlike account-based blockchains where data is stored in a giant ledger, SUI stores data in independent objects. To create a Hero, we first need to define its blueprint using a struct.</p>
        
        <h4>The Core Concepts</h4>
        <ul>
          <li><strong>The <code>key</code> Ability:</strong> For a struct to be an independent SUI Object, it must have the <code>key</code> ability. This allows the object to be stored in the global storage and assigned a unique ID.</li>
          <li><strong>The <code>store</code> Ability:</strong> This allows the object to be transferred freely between addresses or wrapped within other objects.</li>
          <li><strong>The <code>UID</code> Field:</strong> Every SUI object must have an <code>id: UID</code> as its first field. This serves as the object's unique "fingerprint" on the blockchain.</li>
          <li><strong>Primitive Types:</strong> We use <code>u64</code> (64-bit unsigned integer) for stats like health and experience to ensure precision and prevent negative values.</li>
        </ul>
        
        <h4>Your Task</h4>
        <p>You need to complete the Hero struct by adding the following attributes:</p>
        <ul>
          <li><strong>hp:</strong> Represents Health Points (Maximum 100).</li>
          <li><strong>xp:</strong> Represents Experience Points (Progress toward next level).</li>
          <li><strong>level:</strong> Represents the current power rank of the hero.</li>
        </ul>
      `
    },
    {
      title: 'Chapter 2: The Forge (Minting & Ownership)',
      content: `
        <h3>The Forge (Minting & Ownership)</h3>
        
        <p>Now that we have defined the structure of our Hero, we need to create a mechanism to "mint" them. In SUI Move, minting involves instantiating a struct, assigning it a unique ID, and determining who owns that object.</p>
        
        <h4>The Core Concepts</h4>
        <ul>
          <li><strong>Object Creation:</strong> We use <code>sui::object::new(ctx)</code> to generate a globally unique <code>UID</code>. This requires passing a mutable reference to the <code>TxContext</code>.</li>
          <li><strong>Transaction Context (TxContext):</strong> This is a special parameter automatically passed by the SUI network. It contains essential metadata, such as the sender (the person calling the function) and the unique identifier generation for new objects.</li>
          <li><strong>Ownership & Transfer:</strong> By default, an object created inside a function is destroyed at the end of the scope unless it is transferred. We use <code>transfer::public_transfer</code> to send the Hero to the player's address.</li>
          <li><strong>String Conversion:</strong> Since the function takes a <code>vector&lt;u8&gt;</code> (a raw byte array) for the name, we use <code>utf8(name)</code> from the <code>std::string</code> module to convert it into a readable <code>String</code>.</li>
        </ul>
        
        <h4>Your Task</h4>
        <p>Implement the <code>create_hero</code> function:</p>
        <ul>
          <li>Initialize the Hero struct with 100 HP, 0 XP, and Level 1.</li>
          <li>Use <code>tx_context::sender(ctx)</code> to identify the player.</li>
          <li>Use <code>transfer::public_transfer</code> to deliver the hero to that player.</li>
        </ul>
      `
    },
    {
      title: 'Chapter 3: The Arena (Battle Logic)',
      content: `
        <h3>The Arena (Battle Logic & Mutations)</h3>
        
        <p>In this chapter, we transition from creating objects to modifying them. This is where the core gameplay happens. In SUI Move, to change the data inside an object, we must pass it as a mutable reference (<code>&mut</code>).</p>
        
        <h4>The Core Concepts</h4>
        <ul>
          <li><strong>Mutable References (&mut):</strong> When a function takes <code>hero: &mut Hero</code>, it doesn't take ownership of the hero. Instead, it "borrows" the hero with the permission to change its internal values (HP, XP, etc.).</li>
          <li><strong>Assertions (assert!):</strong> Safety is paramount. We use <code>assert!</code> to check if a condition is met before proceeding. If the condition is false, the transaction fails, and no gas is wasted on invalid logic (e.g., a dead hero trying to fight).</li>
          <li><strong>State Logic:</strong> This is the "math" of your game. You will define how much XP is gained and how much HP is lost.</li>
          <li><strong>Level Up Mechanic:</strong> We implement a conditional check. If the XP reaches a threshold (e.g., 100), we modify multiple fields at once: increment the level, reset the XP, and fully restore HP.</li>
        </ul>
        
        <h4>Your Task</h4>
        <p>Complete the <code>battle</code> function with the following logic:</p>
        <ul>
          <li><strong>Check Health:</strong> Ensure the hero has at least 20 HP to start a fight.</li>
          <li><strong>Apply Stats:</strong> Increase XP by 20 and decrease HP by 20.</li>
          <li><strong>Check Level Up:</strong> If XP is 100 or more:
            <ul>
              <li>Set <code>level = level + 1</code></li>
              <li>Set <code>xp = 0</code></li>
              <li>Set <code>hp = 100</code></li>
            </ul>
          </li>
        </ul>
      `
    },
    {
      title: 'Chapter 4: The Clinic (Healing)',
      content: `
        <h3>The Clinic (Healing & Restoration)</h3>
        
        <p>The final stage of our core logic focuses on <strong>State Restoration</strong>. In any RPG, characters need a way to recover after intense battles. This chapter reinforces your understanding of field mutation and provides a simple entry point for administrative or utility functions.</p>
        
        <h4>The Core Concepts</h4>
        <ul>
          <li><strong>Direct Mutation:</strong> Unlike the <code>battle</code> function, which involved complex conditional logic (Level Up checks), the <code>heal</code> function is a direct state update. We simply target a specific field within the struct and assign it a new value.</li>
          <li><strong>Resource Management:</strong> In a live application, you might later expand this function to require a payment in SUI tokens or the consumption of a "Potion" object. For now, we focus on the basic mechanic of resetting the <code>hp</code> field.</li>
          <li><strong>Mutable Borrowing:</strong> Just like in Chapter 3, we use <code>&mut Hero</code>. This allows the player (or a specialized 'Healer' module) to modify the hero's current state without needing to recreate the entire object.</li>
        </ul>
        
        <h4>Your Task</h4>
        <p>Implement the <code>heal</code> function:</p>
        <ul>
          <li>Access the <code>hp</code> field of the passed Hero reference.</li>
          <li>Set the value to 100 (the maximum health).</li>
        </ul>
      `
    },
    {
      title: 'Chapter 5: Verification & Unit Testing',
      content: `
        <h3>Verification & Unit Testing</h3>
        
        <p>In smart contract development, testing is the most critical phase. Since code on the blockchain is often immutable and handles real assets, you must ensure your logic works as expected before deployment. In SUI Move, we use the <code>#[test]</code> attribute to write unit tests.</p>
        
        <h4>The Core Concepts</h4>
        <ul>
          <li><strong>Test Environment:</strong> We use <code>sui::test_scenario</code> to simulate a blockchain environment. It allows us to "act" as different users, send transactions, and inspect objects.</li>
          <li><strong>Scenario Management:</strong> A test scenario starts with <code>test_scenario::begin(admin)</code>. We then execute "transactions" using <code>next_tx</code>.</li>
          <li><strong>Assertions in Tests:</strong> We use <code>assert!</code> within our tests to verify that the hero's stats changed correctly. If an assertion fails, the test fails, indicating a bug in your code.</li>
          <li><strong>Cleaning Up:</strong> Since SUI objects must be handled properly, we must "return" or "delete" objects used in tests to satisfy Move's safety rules.</li>
        </ul>
        
        <h4>Your Task</h4>
        <p>Write a test function that:</p>
        <ul>
          <li>Creates a hero for a player.</li>
          <li>Triggers the <code>battle</code> function.</li>
          <li>Verifies that the hero's XP increased to 20 and HP decreased to 80.</li>
        </ul>
      `
    }
  ];

  return (
    <div className="balance-view-overlay">
      <div className="balance-view-container">
        <button className="balance-view-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="balance-view-header">
          <h1>Battle & Level Up</h1>
        </div>

        <div className="balance-view-tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`balance-view-tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="balance-view-content">
          <div
            dangerouslySetInnerHTML={{
              __html: tabs[activeTab].content,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BalanceView;
