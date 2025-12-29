import { useState } from 'react';
import SubmitChallenge from './SubmitChallenge';
import './CharacterCardView.css';

interface CharacterCardViewProps {
  onClose: () => void;
}

function CharacterCardView({ onClose }: CharacterCardViewProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const chapters = [
    {
      title: 'Introduction',
      content: `
        <h3>Welcome to the first step of your Sui development journey!</h3>
        <p>In the Ethereum world, the blockchain is often viewed as a ledger of accounts and balances. However, Sui introduces a paradigm shift: <strong>Everything is an Object.</strong> In this level, you will move away from thinking in terms of addresses and balances and start thinking in terms of Assets. You are going to build your first digital asset—a <strong>Character Card.</strong> This is not just a piece of data stored in a contract; it is a standalone object that exists in the Sui ecosystem, capable of being owned, transferred, and updated.</p>
        
        <h4>What you will achieve:</h4>
        <ul>
          <li><strong>The "Object" Mindset:</strong> Understand how Sui stores data as independent objects with unique IDs.</li>
          <li><strong>Identity on Chain:</strong> Create a personal profile card that stores your name and bio directly on the blockchain.</li>
          <li><strong>True Ownership:</strong> Learn how to send this card to your wallet, where you—and only you—have full control over it.</li>
          <li><strong>The Full Lifecycle:</strong> Go from writing your first line of Move code to deploying a live package on the Sui Testnet.</li>
        </ul>
        
        <p style="color: #4da6ff; font-style: italic; margin-top: 2rem;">Ready to start? Click on <strong>Chapter 1: Modules and Imports</strong> to begin setting up the foundation of your contract!</p>
      `
    },
    {
      title: 'Chapter 1: Modules and Imports',
      content: `
        <h3>Modules and Imports</h3>
        <p><strong>Concept:</strong> Every Sui Move contract starts with a module definition. To interact with the blockchain, we need to import standard tools.</p>
        <ul>
          <li><code>std::string</code>: To handle text.</li>
          <li><code>sui::object</code>: To create unique IDs.</li>
          <li><code>sui::tx_context</code>: To identify who is signing the transaction.</li>
          <li><code>sui::transfer</code>: To send objects to wallets.</li>
        </ul>
        <p><strong>Your Task:</strong> Ensure your contract includes the necessary imports to handle strings and object transfers.</p>
      `
    },
    {
      title: 'Chapter 2 & 3: Structs and Abilities',
      content: `
        <h3>Structs and Abilities</h3>
        <p><strong>Concept:</strong> A struct is the blueprint for your object. But a struct is just data until you give it Abilities:</p>
        <ul>
          <li><code>key</code>: Makes the struct a "Top-level Object" that can be stored in the global Sui storage.</li>
          <li><code>store</code>: Allows the object to be freely transferred between users or sold on a marketplace.</li>
        </ul>
        <p>Every Sui object must start with an <code>id: UID</code> field.</p>
        <p><strong>Your Task:</strong> Define the CharacterCard struct with key and store abilities. Add a name and bio field of type String.</p>
        <p><strong>Code to Write:</strong></p>
        <pre><code>public struct CharacterCard has key, store {
    id: UID,
    name: String,
    bio: String,
}</code></pre>
      `
    },
    {
      title: 'Chapter 4: The Birth of an Object (Minting)',
      content: `
        <h3>The Birth of an Object (Minting)</h3>
        <p><strong>Concept:</strong> Now we need a function to create (mint) an actual instance of your CharacterCard. Users will send data as raw bytes (vector&lt;u8&gt;). We must convert these bytes into a readable String using <code>string::utf8()</code>. We also generate a unique identity for the card using <code>object::new(ctx)</code>.</p>
        <p><strong>Your Task:</strong> Inside the create_character function, initialize the CharacterCard object by converting the input bytes and generating a new UID.</p>
        <p><strong>Code to Write:</strong></p>
        <pre><code>public entry fun create_character(
    name: vector&lt;u8&gt;, 
    bio: vector&lt;u8&gt;, 
    ctx: &mut TxContext
) {
    let character = CharacterCard {
        id: object::new(ctx),
        name: std::string::utf8(name),
        bio: std::string::utf8(bio),
    };
    // Next: Where does the object go?
}</code></pre>
      `
    },
    {
      title: 'Chapter 5: Shipping to the Wallet (Transfer)',
      content: `
        <h3>Shipping to the Wallet (Transfer)</h3>
        <p><strong>Concept:</strong> In Sui, if you create an object but don't "send" it anywhere, the transaction will fail. You must define an owner. The <code>transfer::public_transfer</code> function takes an object and a destination address. We use <code>tx_context::sender(ctx)</code> to get the address of the person who called the function.</p>
        <p><strong>Your Task:</strong> Send the newly created character object to the user's wallet.</p>
        <p><strong>Code to Write:</strong></p>
        <pre><code>transfer::public_transfer(character, tx_context::sender(ctx));</code></pre>
      `
    },
    {
      title: 'Chapter 6: Deploying to Sui Testnet',
      content: `
        <h3>Deploying to Sui Testnet</h3>
        <p><strong>The Goal:</strong> You have written the logic for your Character Card. Now, it's time to move it from your local editor to the global Sui Testnet. This will make your contract "live," allowing anyone to view it on the blockchain explorer and interact with it using a real wallet.</p>
        
        <h4>Step 1: Configure Your Environment</h4>
        <p>By default, your CLI might be pointing to a local network or Devnet. You need to switch it to Testnet to ensure your Character Card is visible to the wider community.</p>
        <ul>
          <li><strong>Check environment:</strong> <code>sui client active-env</code></li>
          <li><strong>Switch to Testnet:</strong> <code>sui client switch --env testnet</code></li>
        </ul>

        <h4>Step 2: Create Your Wallet</h4>
        <p>Before you can own anything or deploy code, you need a Sui address. If you don't have a wallet configured in your CLI yet, you need to create one.</p>
        <p><strong>Command:</strong> <code>sui client new-address ed25519</code></p>
        <p>This will generate your Sui Address and a Recovery Phrase. Keep your recovery phrase secret!</p>

        <h4>Step 3: Fund Your Wallet (The Faucet)</h4>
        <p>Every action on the blockchain requires "Gas" (transaction fees). You cannot publish your contract with an empty wallet. Since we are on Testnet, you can get SUI tokens for free.</p>
        <ul>
          <li><strong>CLI Command:</strong> <code>sui client faucet</code></li>
          <li><strong>Discord Option:</strong> Join the Sui Discord and paste your address in the #testnet-faucet channel.</li>
          <li><strong>Verify Balance:</strong> Run <code>sui client gas</code> to see your test tokens.</li>
        </ul>

        <h4>Step 4: Build Your Contract</h4>
        <p>Before publishing, you must ensure your code is error-free. This command compiles your Move code into "bytecode" that the Sui Virtual Machine can understand.</p>
        <p><strong>Command:</strong> <code>sui move build</code></p>

        <h4>Step 5: Publish to the Blockchain</h4>
        <p>This is the final "Push." You are sending your compiled package to the Sui validators to be permanently recorded on the ledger using the gas tokens you just received.</p>
        <p><strong>Command:</strong> <code>sui client publish --gas-budget 100000000</code></p>

        <h4>Verifying Your Success</h4>
        <p>Once the command finishes, look for the "PackageID" in the terminal output.</p>
        <ul>
          <li>Copy the PackageID.</li>
          <li>Go to <strong>suiscan.xyz</strong>.</li>
          <li>Paste your ID into the search bar.</li>
          <li>You will see your "Character Card" contract officially registered and live on the blockchain!</li>
        </ul>
      `
    },
    {
      title: 'Chapter 7: Submit Your Work',
      content: `
        <h3>Submit Your Character Card Challenge</h3>
        <p><strong>Congratulations!</strong> You've built and deployed your first Sui Move contract. Now it's time to submit your work for review.</p>
        
        <h4>What you need to submit:</h4>
        <ul>
          <li><strong>Deployed URL:</strong> If you created a frontend interface, deploy it on Vercel and submit the URL.</li>
          <li><strong>Testnet Contract URL:</strong> Your published contract's transaction or object URL from Suiscan, SuiVision, or SuiExplorer.</li>
        </ul>
        
        <h4>How to get your Suiscan URL:</h4>
        <ol>
          <li>After running <code>sui client publish</code>, copy the Package ID from the output.</li>
          <li>Go to <a href="https://suiscan.xyz/testnet" target="_blank" rel="noopener noreferrer">https://suiscan.xyz/testnet</a></li>
          <li>Paste your Package ID in the search bar.</li>
          <li>Copy the full URL from your browser's address bar.</li>
        </ol>
        
        <p style="color: #4da6ff; font-style: italic; margin-top: 2rem;">Ready to submit? Click the button below to open the submission form!</p>
        
        <div style="margin-top: 2rem; text-align: center;">
          <button 
            onclick="document.dispatchEvent(new CustomEvent('openSubmitModal'))"
            style="
              background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
              color: white;
              border: none;
              padding: 14px 32px;
              border-radius: 12px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            "
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0, 188, 212, 0.4)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0, 188, 212, 0.3)'"
          >
            📝 Open Submission Form
          </button>
        </div>
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
    <div className="character-card-fullscreen">
      <button className="character-card-close-btn" onClick={onClose}>
        ✕
      </button>

      <div className="character-card-header-section">
        <h1 className="character-card-title">Character Card </h1>
      </div>

      <div className="character-card-tabs">
        {chapters.map((chapter, index) => (
          <button
            key={index}
            className={`character-card-tab ${activeChapter === index ? 'active' : ''}`}
            onClick={() => {
              setActiveChapter(index);
              if (index === chapters.length - 1) {
                // If last chapter (Submit), open modal after a short delay
                setTimeout(() => setShowSubmitModal(true), 500);
              }
            }}
          >
            {chapter.title}
          </button>
        ))}
      </div>

      <div className="character-card-main-content">
        <div
          className="character-card-chapter-content"
          dangerouslySetInnerHTML={{ __html: chapters[activeChapter].content }}
        />
      </div>

      {showSubmitModal && (
        <SubmitChallenge
          chapterTitle="Level 2: Character Card"
          chapterId={2}
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default CharacterCardView;
