import { useState } from 'react';
import './NFTVisualOwnershipView.css';

interface NFTVisualOwnershipViewProps {
  onClose: () => void;
}

function NFTVisualOwnershipView({ onClose }: NFTVisualOwnershipViewProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: 'Introduction',
      content: `
        <h3>NFT & Visual Ownership (The Entry Ticket)</h3>
        <p><strong>In Level 1, you created data. In Level 2, you create Art.</strong> On most blockchains, wallets have to guess how to display your NFT. On Sui, we use the Display Standard—a powerful template system that tells wallets and marketplaces (like BlueMove) exactly how to render your object using on-chain data.</p>
        
        <h4>What you will learn:</h4>
        <ul>
          <li><strong>Visual Data Structures:</strong> Add image URLs and metadata to your NFTs.</li>
          <li><strong>One-Time Witness (OTW):</strong> Prove ownership of your module.</li>
          <li><strong>Display Standard:</strong> Create templates that wallets understand.</li>
          <li><strong>Minting NFTs:</strong> Generate collectible tickets programmatically.</li>
          <li><strong>Testnet Deployment:</strong> Make your NFTs live on Sui's blockchain.</li>
        </ul>
        
        <p style="color: #4da6ff; font-style: italic; margin-top: 2rem;">Ready to create visual assets? Let's begin with <strong>Chapter 1: Struct Definition</strong>!</p>
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
    }
  ];

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
              onClick={() => setActiveTab(index)}
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
    </div>
  );
}

export default NFTVisualOwnershipView;
