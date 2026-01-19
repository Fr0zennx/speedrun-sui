import { useState } from 'react';
import SubmitChallenge from './SubmitChallenge';
import './NFTVisualOwnershipView.css';

interface NFTVisualOwnershipViewProps {
  onClose: () => void;
}

function NFTVisualOwnershipView({ onClose }: NFTVisualOwnershipViewProps) {
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
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>git clone https://github.com/Fr0zennx/nft-visual-ownership.git</code></pre>
        
        <h4>2. Navigate to the Project Folder</h4>
        <p>Move into the directory you just cloned:</p>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>cd nft-visual-ownership</code></pre>
        
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
        
        <p style="color: #4da6ff; font-style: italic; margin-top: 2rem;">Ready to start? Click <strong>Chapter 1: Struct Definition</strong> to begin!</p>
      `
    },
    {
      title: 'Chapter 1: Struct Definition',
      content: `
        <h3>Struct Definition (Adding Visual Data)</h3>
        
        <h4>The Why</h4>
        <p>To make a visual NFT, your object needs to store the "path" to its image. We use the <code>String</code> type for names, descriptions, and URLs because they are flexible and human-readable.</p>
        
        <h4>Your Goal</h4>
        <p>Expand the <code>EntryTicket</code> struct to include the metadata fields required for a collectible ticket.</p>
        
        <h4>Code to Write:</h4>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>public struct EntryTicket has key, store {
    id: UID,
    name: String,
    description: String,
    url: String,
}</code></pre>
      `
    },
    {
      title: 'Chapter 2: The One-Time Witness',
      content: `
        <h3>The One-Time Witness (OTW)</h3>
        
        <h4>The Why</h4>
        <p>Security is paramount. Sui needs to ensure that only the original creator of a module can set its "Display" rules. A <strong>One-Time Witness (OTW)</strong> is a special struct that proves "I am the authorized creator of this module."</p>
        
        <h4>Key Requirements:</h4>
        <ul>
          <li>Must have the exact same name as the module (but in UPPERCASE).</li>
          <li>Must have the <code>drop</code> ability.</li>
          <li>Is automatically passed to the <code>init</code> function by the network.</li>
        </ul>
        
        <h4>Your Goal</h4>
        <p>Define the OTW struct for your nft module.</p>
        
        <h4>Code to Write:</h4>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>public struct NFT has drop {}</code></pre>
      `
    },
    {
      title: 'Chapter 3: Initialization & Display',
      content: `
        <h3>Initialization & Display (The Metadata Template)</h3>
        
        <h4>The Why</h4>
        <p>This is the most critical step. Instead of hardcoding metadata for every single NFT, we create a <strong>Template</strong>.</p>
        
        <h4>Key Concepts:</h4>
        <ul>
          <li><strong>package::claim:</strong> Uses your OTW to prove ownership and receive a Publisher object.</li>
          <li><strong>display::new_with_fields:</strong> Creates the mapping. Notice the <code>{name}</code> syntax? This tells Sui: "Look inside the EntryTicket object, find the 'name' field, and put its value here."</li>
          <li><strong>update_version:</strong> Activates the display rules.</li>
        </ul>
        
        <h4>Your Goal</h4>
        <p>Setup the init function to map your struct fields to the Sui Display standards.</p>
        
        <h4>Code to Write:</h4>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>fun init(otw: NFT, ctx: &mut TxContext) {
    let keys = vector[
        utf8(b"name"),
        utf8(b"image_url"),
        utf8(b"description"),
    ];

    let values = vector[
        utf8(b"{name}"),
        utf8(b"{url}"),
        utf8(b"{description}"),
    ];

    let publisher = package::claim(otw, ctx);
    let mut display = display::new_with_fields<EntryTicket>(
        &publisher, keys, values, ctx
    );

    display::update_version(&mut display);

    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
}</code></pre>
      `
    },
    {
      title: 'Chapter 4: The Minting Function',
      content: `
        <h3>The Minting Function</h3>
        
        <h4>The Why</h4>
        <p>Now that the rules are set, we need a way to create the actual tickets. We take <code>vector&lt;u8&gt;</code> (raw bytes) from the user and convert them to <code>String</code> so they match our struct definition. By transferring the ticket to the sender, it will immediately appear in their wallet with the image defined by the URL.</p>
        
        <h4>Your Goal</h4>
        <p>Complete the <code>mint_ticket</code> function to initialize the EntryTicket and deliver it to the user.</p>
        
        <h4>Code to Write:</h4>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>public entry fun mint_ticket(
    name: vector<u8>,
    description: vector<u8>,
    url: vector<u8>,
    ctx: &mut TxContext
) {
    let ticket = EntryTicket {
        id: object::new(ctx),
        name: string::utf8(name),
        description: string::utf8(description),
        url: string::utf8(url),
    };

    transfer::public_transfer(ticket, tx_context::sender(ctx));
}</code></pre>
      `
    },
    {
      title: 'Chapter 5: Deploying to Testnet',
      content: `
        <h3>Deploying to Sui Testnet</h3>
        
        <h4>The Goal</h4>
        <p>You have written the logic for your NFT. Now, it's time to move it from your local editor to the global Sui Testnet. This will make your contract "live," allowing anyone to view it on the blockchain explorer and interact with it using a real wallet.</p>
        
        <h4>Step 1: Configure Your Environment</h4>
        <p>By default, your CLI might be pointing to a local network or Devnet. You need to switch it to Testnet to ensure your NFT is visible to the wider community.</p>
        <ul>
          <li><strong>Check environment:</strong> <code>sui client active-env</code></li>
          <li><strong>Switch to Testnet:</strong> <code>sui client switch --env testnet</code></li>
        </ul>
        
        <h4>Step 2: Create Your Wallet</h4>
        <p>Before you can own anything or deploy code, you need a Sui address. If you don't have a wallet configured in your CLI yet, you need to create one.</p>
        <ul>
          <li><strong>Command:</strong> <code>sui client new-address ed25519</code></li>
          <li>This will generate your Sui Address and a Recovery Phrase. Keep your recovery phrase secret!</li>
        </ul>
        
        <h4>Step 3: Fund Your Wallet (The Faucet)</h4>
        <p>Every action on the blockchain requires "Gas" (transaction fees). You cannot publish your contract with an empty wallet. Since we are on Testnet, you can get SUI tokens for free.</p>
        <ul>
          <li><strong>CLI Command:</strong> <code>sui client faucet</code></li>
          <li><strong>Discord Option:</strong> Join the Sui Discord and paste your address in the #testnet-faucet channel.</li>
          <li><strong>Verify Balance:</strong> Run <code>sui client gas</code> to see your test tokens.</li>
        </ul>
        
        <h4>Step 4: Build Your Contract</h4>
        <p>Before publishing, you must ensure your code is error-free. This command compiles your Move code into "bytecode" that the Sui Virtual Machine can understand.</p>
        <ul>
          <li><strong>Command:</strong> <code>sui move build</code></li>
        </ul>
        
        <h4>Step 5: Publish to the Blockchain</h4>
        <p>This is the final "Push." You are sending your compiled package to the Sui validators to be permanently recorded on the ledger using the gas tokens you just received.</p>
        <ul>
          <li><strong>Command:</strong> <code>sui client publish --gas-budget 100000000</code></li>
        </ul>
        
        <h4>Verifying Your Success</h4>
        <p>Once the command finishes, look for the "PackageID" in the terminal output.</p>
        <ul>
          <li>Copy the PackageID.</li>
          <li>Go to <strong>suiscan.xyz</strong>.</li>
          <li>Paste your ID into the search bar.</li>
          <li>You will see your NFT contract officially registered and live on the blockchain!</li>
        </ul>
      `
    },
    {
      title: 'Chapter 6: Verifying on Suiscan',
      content: `
        <h3>Chapter 6: Verifying on Suiscan</h3>
        
        <h4>Step 1: Locate Your Package ID</h4>
        <p>When you execute the <code>sui client publish</code> command, the Sui CLI returns a detailed JSON response. To find your contract's address, you must look for the "Object Changes" section.</p>
        
        <p>Scroll through the output until you find an object where the "type" is labeled as <code>published</code>.</p>
        
        <p>The hexadecimal string (starting with <code>0x</code>) next to <code>packageId</code> is your contract's unique identifier.</p>
        
        <h4>Action:</h4>
        <p>Copy this ID. You will need it to view your contract on Suiscan and to interact with your <code>mint_ticket</code> function.</p>
        
        <h4>Terminal Output Example:</h4>
        <p>Below is a representation of what you should see in your terminal. The highlighted packageId is the value you need to copy.</p>
        
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>----- Transaction Effects -----
Status : Success

----- Object Changes -----
[
  {
    "type": "published",
    "packageId": "0x7b2a9e3f4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
    "version": "1",
    "modules": [
      "nft"
    ]
  },
  {
    "type": "created",
    "sender": "0xabc1234567890f1e2d3c4b5a69876543210fedcba",
    "owner": "Immutable",
    "objectId": "0x7b2a9e3f4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
    "itemType": "package"
  }
]</code></pre>
        
        <h4>Pro Tip:</h4>
        <p>In Sui, the <code>packageId</code> and the <code>objectId</code> of the "package" item type are identical during the initial publication. Always look for the <code>published</code> type to be certain!</p>
        
        <h4>Step 2: Search on Suiscan</h4>
        <p>Suiscan is the premier explorer for the Sui network, acting as a window into the blockchain. Now that you have your Package ID, it's time to look up your contract.</p>
        
        <h5>Open the Explorer:</h5>
        <p>Navigate to <strong>suiscan.xyz</strong>.</p>
        
        <h5>Network Check:</h5>
        <p>Before searching, look at the top right corner of the page (as shown below). Ensure the network is set to <strong>"Testnet"</strong>. If it says Mainnet or Devnet, your search will return no results.</p>
        
        <img src="/suiscan-search.png" alt="Suiscan Search Interface with Testnet Network Selection" style="max-width: 100%; border-radius: 8px; margin: 1.5rem 0; border: 1px solid rgba(29, 144, 255, 0.3);" />
        
        <h5>The Search:</h5>
        <p>Locate the central search bar with the placeholder <code>Search anything on Sui</code>.</p>
        
        <h5>Paste & Go:</h5>
        <p>Paste your Package ID (the <code>0x...</code> address you copied in Step 1) into this bar and press Enter.</p>
        
        <h5>What am I looking for?</h5>
        <p>Once you hit enter, Suiscan will take you to your <strong>Package Page</strong>. This page contains all the official details of your smart contract, including the bytecode, the modules you wrote, and every transaction that interacts with it.</p>
        
        <h4>Step 3: Explore and Interact</h4>
        <p>Now that you have reached your Package Page, you can see your code live on the blockchain. This is where your contract moves from being just a file on your computer to a public, permanent protocol.</p>
        
        <h5>Verify Your Code:</h5>
        <p>Click on the <strong>"Modules"</strong> tab. You will see your <code>nft</code> module listed there. You can inspect the bytecode and verify that your <code>EntryTicket</code> struct and all your functions were deployed correctly.</p>
        
        <h5>Connect Your Wallet:</h5>
        <p>Look for a <strong>"Connect Wallet"</strong> button (usually at the top of the page). By connecting your Sui Wallet, you can interact with the blockchain directly through the Suiscan interface.</p>
        
        <h5>Execute the Mint Function:</h5>
        <ul>
          <li>Find the <strong>"Execute"</strong> or <strong>"Write"</strong> tab.</li>
          <li>Locate your <code>mint_ticket</code> function.</li>
          <li>You will see input fields for <code>name</code>, <code>description</code>, and <code>url</code>.</li>
          <li><strong>Try it out:</strong> Enter a name for your ticket, a short description, and a link to an image (e.g., a hosted JPG or PNG link).</li>
        </ul>
        
        <h5>Transaction Success:</h5>
        <p>Click the <strong>"Execute"</strong> button. After you approve the transaction in your wallet, you will officially have minted your first visual NFT!</p>
        
        <h4>Step 4: Final Confirmation (The Wallet View)</h4>
        <p>The ultimate test of a successful Sui Display implementation is seeing your NFT come to life in your personal wallet. Since you successfully executed the <code>mint_ticket</code> function in the previous step, the asset has already been transferred to your address.</p>
        
        <h5>Open Your Wallet:</h5>
        <p>Open your Sui Wallet extension (or the wallet app you used to connect to Suiscan).</p>
        
        <h5>Navigate to Assets:</h5>
        <p>Click on the <strong>"Assets"</strong> or <strong>"NFTs"</strong> tab.</p>
        
        <h5>Behold Your Creation:</h5>
        <p>You should now see your Entry Ticket listed. Unlike the "Character Card" from Level 1, this asset will display the actual image you linked during the minting process.</p>
        
        <h5>Inspect Metadata:</h5>
        <p>Click on the NFT to view its details. You will see that the <code>name</code> and <code>description</code> fields are perfectly mapped exactly as you defined them in your Display template.</p>
        
        <h5>Why is this a big deal?</h5>
        <p>You didn't just upload an image to a website. You created a <strong>decentralized object</strong> that carries its own "display instructions." No matter which wallet or marketplace the owner uses, your NFT will always look exactly the way you intended it to.</p>
      `
    },
    {
      title: 'Chapter 7: Visual Interaction & Minting',
      content: `
        <h3>Visual Interaction & Minting via UI</h3>
        
        <h4>Welcome to the Most Exciting Part!</h4>
        <p><strong>Congratulations!</strong> You've written and deployed your contract. Now comes the most thrilling moment: <strong>creating your own visual NFT</strong>. The <code>mint_ticket</code> interface you see in blockchain explorers is the digital form of the function you wrote in Move.</p>
        
        <p>When you navigate to your contract on Sui Explorer or a dApp interface, you'll see input fields labeled <strong>Arg0</strong>, <strong>Arg1</strong>, and <strong>Arg2</strong>. These correspond to the <code>vector&lt;u8&gt;</code> parameters in your contract.</p>
        
        <h4>📝 How to Fill Out the Form (What to Write?)</h4>
        <p>When minting your ticket using the explorer interface, you need to provide the following information:</p>
        
        <div style="background: rgba(30, 144, 255, 0.1); padding: 1.5rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #1e90ff;">
          <p><strong>Arg0 (name):</strong> Enter the display name for your NFT.</p>
          <p style="margin-left: 1.5rem; color: #4da6ff;"><em>Example:</em> <code>VIP Galaxy Ticket</code> or <code>Visual_NFT_01</code></p>
          
          <p style="margin-top: 1rem;"><strong>Arg1 (description):</strong> Write a short text explaining what this NFT represents.</p>
          <p style="margin-left: 1.5rem; color: #4da6ff;"><em>Example:</em> <code>This ticket grants access to exclusive events.</code></p>
          
          <p style="margin-top: 1rem;"><strong>Arg2 (url):</strong> Paste the link to your NFT's image (IPFS or HTTPS).</p>
          <p style="margin-left: 1.5rem; color: #4da6ff;"><em>Example:</em> <code>https://ipfs.io/ipfs/QmExampleImageHash</code></p>
        </div>
        
        <h4>💡 Why Is This Important? (Technical Insight)</h4>
        
        <h5>Vector&lt;u8&gt; Flexibility:</h5>
        <p>In the explorer interface, you'll notice the input fields are labeled as <code>Vector&lt;U8&gt;</code>. This means the system supports any character set (including special characters and emojis). When you type your text and click <strong>Execute</strong>, the browser automatically converts your text into a byte array. Your contract's <code>string::utf8()</code> function then converts these bytes back into readable text.</p>
        
        <h5>Visual Ownership:</h5>
        <p>When the transaction completes successfully (marked as <strong>Transaction Applied</strong>), you'll see a <strong>Created</strong> section in the output. The ID listed there is your NFT's unique address. Thanks to the Display system you configured in the <code>init</code> function, when you click on this ID or view it in your wallet, you won't just see code—you'll see the actual image you linked in Arg2.</p>
        
        <h4>🎨 The Power of Sui Display</h4>
        <p>This is the moment where everything comes together:</p>
        <ul>
          <li>Your <strong>struct</strong> holds the data (name, description, URL)</li>
          <li>Your <strong>Display template</strong> tells wallets and explorers how to render it</li>
          <li>Your <strong>mint function</strong> creates the actual instance</li>
          <li>The result: A visual, tradeable, and fully decentralized NFT that appears beautifully in any Sui wallet</li>
        </ul>
        
        <h4>Try It Now!</h4>
        <p>Go to your contract on Suiscan, connect your wallet, and execute the <code>mint_ticket</code> function with your own creative data. Within seconds, you'll have minted your first visual NFT!</p>
        
        <p style="color: #4da6ff; font-style: italic; margin-top: 2rem;">Ready to show the world what you've built? Proceed to Chapter 8 to submit your work!</p>
      `
    },
    {
      title: 'Chapter 8: Submit Your Work',
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
    <div className="nft-ownership-overlay">
      <div className="nft-ownership-container">
        <button className="nft-ownership-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="nft-ownership-header">
          <h1>NFT & Visual Ownership</h1>
        </div>

        <div className="nft-ownership-tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`nft-ownership-tab ${activeTab === index ? 'active' : ''}`}
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

        <div className="nft-ownership-content">
          <div
            dangerouslySetInnerHTML={{
              __html: tabs[activeTab].content,
            }}
          />
        </div>
      </div>

      {showSubmitModal && (
        <SubmitChallenge
          chapterTitle="Level 3: NFT & Visual Ownership"
          chapterId={3}
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default NFTVisualOwnershipView;
