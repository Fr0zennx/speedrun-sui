import { useState } from 'react';
import SubmitChallenge from './SubmitChallenge';
import './BalanceView.css';

interface BalanceViewProps {
  onClose: () => void;
}

function BalanceView({ onClose }: BalanceViewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const tabs = [
    {
      title: 'Introduction',
      content: `
        <h3>How to Clone and Setup the Project</h3>
        <p>To start working on the Character Card project, you need to pull the source code from GitHub to your local machine. Follow these steps:</p>
        
        <h4>1. Clone the Repository</h4>
        <p>Open your terminal (Command Prompt, PowerShell, or Terminal) and run the following command to download the project:</p>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>git clone https://github.com/Fr0zennx/battle-level-up.git</code></pre>
        
        <h4>2. Navigate to the Project Folder</h4>
        <p>Move into the directory you just cloned:</p>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>cd battle-level-up</code></pre>
        
        <h4>3. Install Dependencies</h4>
        <p>This project uses Node.js. Run the following command to install all necessary packages:</p>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>npm install
# or if you use yarn
yarn install</code></pre>
        
        <h4>4. Start the Development Server</h4>
        <p>Once the installation is complete, you can start the project locally to see it in your browser:</p>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>npm run dev
# or
yarn dev</code></pre>
        
        <h4>5. Ready to Move!</h4>
        <p>Open <strong>http://localhost:3000</strong> (or the port shown in your terminal) to view the application. You are now ready to start your Sui Move journey!</p>
        
        <p style="color: #4da6ff; font-style: italic; margin-top: 2rem;">Ready to start? Click <strong>Chapter 1: Data Structure Modeling</strong> to begin!</p>
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
    },
    {
      title: 'Chapter 6: Deployment to SUI Testnet',
      content: `
        <h3>Deployment to SUI Testnet</h3>
        
        <p>After modeling data, implementing logic, and verifying your code with unit tests, the final step is <strong>Deployment</strong>. In SUI, publishing a contract converts your Move code into an on-chain package that anyone (or authorized users) can interact with.</p>
        
        <h4>The Core Concepts</h4>
        <ul>
          <li><strong>The Package Object:</strong> When you publish, SUI creates a special object called a <code>Package</code>. This package contains the compiled bytecode of your game module. It serves as the "source of truth" for your contract on the blockchain.</li>
          <li><strong>SUI CLI:</strong> We use the Command Line Interface to communicate with the network. The <code>sui client publish</code> command handles the compilation, gas estimation, and submission all in one step.</li>
          <li><strong>Gas Budget:</strong> Every on-chain operation costs gas. You must ensure your SUI wallet has enough Testnet SUI to cover the storage and execution fees. This is specified using the <code>--gas-budget</code> flag.</li>
          <li><strong>The Move.toml:</strong> This file is critical as it defines your package name, version, and dependencies (like the SUI Framework). It must be present in your project root before publishing.</li>
          <li><strong>Network Selection:</strong> The SUI CLI remembers which network you're targeting. You can switch between Devnet, Testnet, and Mainnet using <code>sui client switch</code>.</li>
        </ul>
        
        <h4>Pre-Deployment Checklist</h4>
        <p>Before executing the publish command, verify the following:</p>
        <ul>
          <li><strong>Active Environment:</strong> Confirm you're connected to the correct network (usually Testnet for development).</li>
          <li><strong>Account Balance:</strong> Check that your account has sufficient Testnet SUI. You can request free funds from the SUI Faucet.</li>
          <li><strong>Move.toml Configuration:</strong> Ensure your package name and dependencies are correctly specified.</li>
          <li><strong>Code Compilation:</strong> Verify there are no syntax errors by running a local build first.</li>
        </ul>
        
        <h4>Your Task</h4>
        <p>Prepare your project for the real world by executing the following CLI steps:</p>
        
        <h5>Step 1: Verify Active Network</h5>
        <pre><code>sui client active-env</code></pre>
        <p>This command displays the currently active network (e.g., testnet). If it shows a different network, use <code>sui client switch --env testnet</code> to switch.</p>
        
        <h5>Step 2: Check Your Balance</h5>
        <pre><code>sui client balance</code></pre>
        <p>This displays your Testnet SUI balance. If you have insufficient funds (less than 1 SUI), visit the <a href="https://faucet.testnet.sui.io/" target="_blank">SUI Testnet Faucet</a> to request free tokens.</p>
        
        <h5>Step 3: Publish Your Contract</h5>
        <pre><code>sui client publish --gas-budget 100000000</code></pre>
        <p>The <code>--gas-budget</code> flag specifies the maximum SUI you're willing to spend (in MIST units; 1 SUI = 1,000,000,000 MIST). A budget of 100,000,000 (0.1 SUI) is typically sufficient for small packages.</p>
        
        <h4>After Deployment</h4>
        <ul>
          <li><strong>Package ID:</strong> The CLI will return a Package ID (a long hex string). Save this! You'll need it to interact with your contract on-chain.</li>
          <li><strong>Transaction Hash:</strong> You'll also receive a transaction digest. You can view the transaction on <a href="https://suiscan.xyz/" target="_blank">Suiscan</a> by pasting the digest into the search bar.</li>
          <li><strong>Verify on Suiscan:</strong> Search for your Package ID on Suiscan to inspect the published modules, their functions, and type definitions.</li>
        </ul>
      `
    },
    {
      title: 'Submit Your Work',
      content: `
        <h3>Submit Your Challenge</h3>
        <p><strong>Congratulations!</strong> You've completed this level. Now submit your work for review.</p>
        
        <h4>What you need:</h4>
        <ul>
          <li><strong>Deployed URL:</strong> Your Vercel deployment URL</li>
          <li><strong>Testnet Contract URL:</strong> Your Suiscan/SuiVision/SuiExplorer URL</li>
        </ul>
        
        <p style="color: #4da6ff; margin-top: 2rem;">Click on this tab to open the submission form!</p>
      `
    }
  ];

  const handleSubmit = (data: { vercelUrl: string; suiscanUrl: string }) => {
    console.log('Submission data:', data);
    // TODO: Send to backend/database
    alert('Submission successful! Your work has been submitted for review.');
    setShowSubmitModal(false);
  };

  // Listen for custom event from HTML button
  useState(() => {
    const handleOpenModal = () => setShowSubmitModal(true);
    document.addEventListener('openSubmitModal', handleOpenModal);
    return () => document.removeEventListener('openSubmitModal', handleOpenModal);
  });

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
              onClick={() => {
                setActiveTab(index);
                if (index === tabs.length - 1) {
                  // If last chapter (Submit), open modal after a short delay
                  setTimeout(() => setShowSubmitModal(true), 500);
                }
              }}
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

      {showSubmitModal && (
        <SubmitChallenge
          chapterTitle="Level 4: Battle & Level Up"
          chapterId={4}
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default BalanceView;
