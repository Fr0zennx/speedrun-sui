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
        <h3>How to Clone and Setup the Project</h3>
        <p>To start working on the Character Card project, you need to pull the source code from GitHub to your local machine. Follow these steps:</p>
        
        <h4>1. Clone the Repository</h4>
        <p>Open your terminal (Command Prompt, PowerShell, or Terminal) and run the following command to download the project:</p>
        <pre><code>git clone https://github.com/Fr0zennx/character-card.git</code></pre>
        
        <h4>2. Navigate to the Project Folder</h4>
        <p>Move into the directory you just cloned:</p>
        <pre><code>cd character-card</code></pre>
        
        <h4>3. Install Dependencies</h4>
        <p>This project uses Node.js. Run the following command to install all necessary packages:</p>
        <pre><code>npm install
# or if you use yarn
yarn install</code></pre>
        
        <h4>4. Start the Development Server</h4>
        <p>Once the installation is complete, you can start the project locally to see it in your browser:</p>
        <pre><code>npm run dev
# or
yarn dev</code></pre>
        
        <h4>5. Ready to Move!</h4>
        <p>Open <strong>http://localhost:3000</strong> (or the port shown in your terminal) to view the application. You are now ready to start your Sui Move journey!</p>
        
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
      title: 'Chapter 7: The UI Interface (Arg0 & Arg1)',
      content: `
        <h3>The UI Interface (Arg0 & Arg1)</h3>
        <p><strong>Understanding Function Arguments in the UI:</strong> When you interact with your deployed contract through a blockchain explorer or dApp, you'll see input fields labeled <strong>Arg0</strong>, <strong>Arg1</strong>, etc. These are the arguments your Move function expects.</p>
        
        <h4>What You Must Write in the UI:</h4>
        <ul>
          <li><strong>Arg0 (name_bytes/model):</strong> Enter the name of your character or car.
            <br/><em>Example:</em> <code>Sui Warrior</code> or <code>CyberTruck</code>
          </li>
          <li><strong>Arg1 (bio_bytes/color):</strong> Enter a short description or the color.
            <br/><em>Example:</em> <code>A fast and agile legendary hero.</code> or <code>Neon Green</code>
          </li>
        </ul>
        
        <h4>How It Works Behind the Scenes:</h4>
        <p>When you type text into these input fields on the blockchain explorer or dApp interface:</p>
        <ol>
          <li>Your browser automatically converts the text into bytes (<code>vector&lt;u8&gt;</code>).</li>
          <li>These bytes are sent to your Move contract as function arguments.</li>
          <li>In your Move code, you convert them back to readable strings using <code>std::string::utf8(arg)</code>.</li>
        </ol>
        
        <h4>Technical Note:</h4>
        <p style="background: rgba(77, 166, 255, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #4da6ff;">
          <strong>Data Type:</strong> These inputs are <code>vector&lt;u8&gt;</code> (a sequence of bytes).<br/>
          <strong>Why?</strong> This format is universal and allows the blockchain to handle any text encoding.<br/>
          <strong>Conversion:</strong> Your Move function receives raw bytes and uses <code>std::string::utf8()</code> to convert them into a readable String type.
        </p>
        
        <h4>Example Interaction:</h4>
        <p>When you call <code>create_character</code> on Suiscan or another explorer:</p>
        <pre><code>// UI Input:
Arg0: "Satoshi Nakamoto"
Arg1: "The creator of blockchain technology"

// What your Move function receives:
name: [83, 97, 116, 111, 115, 104, 105, ...] (bytes)
bio: [84, 104, 101, 32, 99, 114, 101, 97, ...] (bytes)

// What your code does:
name: std::string::utf8(name) → "Satoshi Nakamoto"
bio: std::string::utf8(bio) → "The creator of blockchain technology"</code></pre>
        
        <p style="color: #4da6ff; font-style: italic; margin-top: 2rem;">Now you understand how to interact with your contract through any UI! Ready to submit your work? Move to Chapter 8!</p>
      `
    },
    {
      title: 'Chapter 8: Submit Your Work',
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
