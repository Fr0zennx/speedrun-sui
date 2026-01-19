import { useState } from 'react';
import SubmitChallenge from './SubmitChallenge';
import './SuiCarView.css';

interface SuiGalleryViewProps {
  onClose: () => void;
}

function SuiGalleryView({ onClose }: SuiGalleryViewProps) {
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
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>git clone https://github.com/Fr0zennx/sui-gallery.git</code></pre>
        
        <h4>2. Navigate to the Project Folder</h4>
        <p>Move into the directory you just cloned:</p>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>cd sui-gallery</code></pre>
        
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
        
        <p style="color: #4da6ff; font-style: italic; margin-top: 2rem;">Ready to start? Click <strong>Chapter 1: Architecting the Asset (The Car Struct)</strong> to begin!</p>
      `
    },
    {
      title: 'Chapter 1: Architecting the Asset (The Car Struct)',
      content: `
        <p>In Sui Move, everything centers around Objects. Unlike other blockchains where data is stored in a giant central table (like an account balance), Sui stores data in independent pieces called objects. In this chapter, we will define the "DNA" of our Car NFT.</p>
        
        <h2>The Core Components of an Object</h2>
        <p>To transform a simple code structure (struct) into a Sui Object, it must have two things:</p>
        <ul>
          <li><strong>The key Ability:</strong> This allows the struct to be stored in the global storage and assigned a unique ID.</li>
          <li><strong>The id: UID Field:</strong> This is the "Social Security Number" of your object. No two objects can ever have the same ID.</li>
        </ul>
        
        <h2>Why use the store Ability?</h2>
        <p>In our Car struct, we add <code>has key, store</code>.</p>
        <ul>
          <li><code>key</code> makes it an object.</li>
          <li><code>store</code> allows the object to be nested inside other objects (like putting a Car inside a Marketplace Listing) and allows it to be transferred freely between users without a custom transfer function.</li>
        </ul>
        
        <h2>Field Definitions</h2>
        <ul>
          <li><strong>name:</strong> A String to give your car a personality (e.g., "Neon Interceptor").</li>
          <li><strong>image_url:</strong> A link to our verified assets.</li>
          <li><strong>speed:</strong> A u64 numerical value that determines the car's performance in our game logic.</li>
        </ul>
        
        <h2>Code Exercise: Completing the Struct</h2>
        <p>In your template, find TODO 1 and define the fields as follows:</p>
        
        <pre><code>// ========= STRUCTS =========

public struct Car has key, store {
    id: sui::object::UID,      // Unique identifier for the object
    name: String,              // The display name of the car
    image_url: String,         // The URL of the car's image
    speed: u64,                // The performance metric (0-100)
}</code></pre>
      `
    },
    {
      title: 'Chapter 2: The Birth Certificate (Metadata & System Clock)',
      content: `
        <h1>Chapter 2: The Birth Certificate (Metadata & System Clock)</h1>
        <p>In the world of NFTs, provenance—knowing exactly when and how an item was created—is vital for authenticity and value. While the Car object is the asset you drive or trade, the CarMetadata serves as its permanent "Birth Certificate."</p>
        
        <p>In this chapter, we focus on Object Linking and the Sui System Clock.</p>
        
        <h2>Object Linking: Connecting Metadata to the Asset</h2>
        <p>We don't want just a random timestamp; we want a record that points specifically to one car.</p>
        <ul>
          <li>We use <code>car_id: sui::object::ID</code> (not UID).</li>
          <li><strong>The Logic:</strong> UID is the actual unique identity of an object. ID is a "pointer" or a reference. By storing the car_id inside the metadata, we create a permanent, verifiable link between the car and its creation date.</li>
        </ul>
        
        <h2>The Clock Object: Real-Time on the Blockchain</h2>
        <p>Blockchains are usually isolated from "real-world" time. However, Sui provides a special system object called the Clock (located at the fixed address 0x6).</p>
        
        <p>By passing a reference to this clock (<code>&Clock</code>) into our functions, we can access the <code>timestamp_ms</code>, which tells us the exact millisecond the transaction was processed.</p>
        
        <h2>Why no store ability?</h2>
        <p>Notice CarMetadata only has the key ability.</p>
        
        <p>We don't want this metadata to be tradable or put into a marketplace. It is meant to be a record held by the owner or "frozen" (made read-only) on the network to prove the car's origin.</p>
        
        <h2>Code Exercise: Defining the Metadata</h2>
        <p>In your template, find TODO 2 and implement the fields to support the linking and timing logic:</p>
        
        <pre><code>/// Frozen data holding the creation record of the NFT
public struct CarMetadata has key {
    id: sui::object::UID,      // The metadata object's own unique ID
    car_id: sui::object::ID,   // Reference to the specific Car NFT's ID
    minted_at: u64,            // The Unix timestamp in milliseconds
}</code></pre>
        
        <h2>Pro-Tip: uid_to_inner</h2>
        <p>When we eventually write the logic to create these objects, we will take the UID of the Car and convert it to an ID using <code>sui::object::uid_to_inner(&car_uid)</code>. This allows us to store the "address" of the car inside the metadata without actually moving the car itself.</p>
      `
    },
    {
      title: 'Chapter 3: The Marketplace Display Case (ListCar)',
      content: `
        <h1>Chapter 3: The Marketplace Display Case (ListCar)</h1>
        <p>In traditional web development, if you want to sell something, you just list it in a database. In Sui Move, we use Object Wrapping. When you want to sell your car, you actually "put" the Car object inside a Listing object. This is a secure way to handle Escrow (holding an item until payment is made).</p>
        
        <h2>Object Wrapping (Nesting)</h2>
        <p>The ListCar struct doesn't just hold the ID of the car; it holds the entire Car object.</p>
        <ul>
          <li>While the car is inside the ListCar object, the original owner cannot "drive" it or send it to someone else.</li>
          <li>The car is "locked" in the display case until someone buys it or the owner cancels the listing.</li>
        </ul>
        
        <h2>The Anatomy of a Listing</h2>
        <p>To make a marketplace work, the listing needs four vital pieces of information:</p>
        <ul>
          <li><strong>id:</strong> Like every Sui object, it needs its own unique identity.</li>
          <li><strong>car:</strong> The Car NFT itself (the asset being sold).</li>
          <li><strong>price:</strong> The amount of SUI the buyer must pay.</li>
          <li><strong>seller:</strong> The wallet address of the person who will receive the money once the car is sold.</li>
        </ul>
        
        <h2>Why the key Ability only?</h2>
        <p>We give ListCar the key ability so it can be a Shared Object.</p>
        <ul>
          <li>In Sui, a "Shared Object" is special because anyone can interact with it (anyone can try to buy it).</li>
          <li>We do not give it store because we don't want people "wrapping" a listing inside another listing—that would make the marketplace too complex and hard to track.</li>
        </ul>
        
        <h2>Code Exercise: Creating the Listing Struct</h2>
        <p>In your template, find TODO 3 and implement the fields for the marketplace logic:</p>
        
        <pre><code>/// Represents a car for sale in the marketplace
public struct ListCar has key {
    id: sui::object::UID,      // Unique ID for the listing itself
    car: Car,                  // The actual Car NFT object (Wrapped)
    price: u64,                // The price in MIST (1 SUI = 10^9 MIST)
    seller: address,           // The address of the person selling the car
}</code></pre>
        
        <h2>Deep Dive: The Seller Field</h2>
        <p>Why do we store the seller address if the owner of the car is the one listing it? Once the car is "wrapped" inside the ListCar object and shared, the Listing Object technically becomes the owner of the car. We store the seller address as a variable so that when a purchase happens, the contract knows exactly where to send the SUI coins.</p>
      `
    },
    {
      title: 'Chapter 4: The Microphones (Events)',
      content: `
        <h1>Chapter 4: The Microphones (Events)</h1>
        <p>Blockchain transactions are silent by nature. If a user lists a car or buys one, the "state" changes on the blockchain, but your website (Frontend) wouldn't know about it unless it constantly scanned every single object.</p>
        
        <p>Events are the solution. Think of them as Microphones that shout: "Hey! This specific action just happened!"</p>
        
        <h2>Why use Events?</h2>
        <ul>
          <li><strong>Off-chain Tracking:</strong> Indexers and Frontends listen for these events to update the UI in real-time (e.g., showing a "Sold" badge).</li>
          <li><strong>Gas Efficiency:</strong> Storing data in an Event is much cheaper than storing it in an Object because Events are not stored in the "Global State"—they are part of the transaction effects.</li>
        </ul>
        
        <h2>The Required Abilities: copy and drop</h2>
        <p>Events are not "Assets." They are just messages.</p>
        <ul>
          <li><strong>copy:</strong> The system needs to be able to create a copy of the data to send it to listeners.</li>
          <li><strong>drop:</strong> Once the transaction is finished, the event data can be discarded from the execution memory.</li>
        </ul>
        
        <h2>Data Strategy</h2>
        <p>An event should contain just enough information for a frontend to understand the change.</p>
        <ul>
          <li><strong>listing_id:</strong> Which shop item are we talking about?</li>
          <li><strong>car_id:</strong> Which car was involved?</li>
          <li><strong>price:</strong> How much was it?</li>
          <li><strong>seller/buyer:</strong> Who were the participants?</li>
        </ul>
        
        <h2>Code Exercise: Defining the Events</h2>
        <p>In your template, find TODO 4 and TODO 5. We will define two events: one for when a car is listed and one for when it is successfully purchased.</p>
        
        <pre><code>// ========= EVENTS =========

/// Emitted when a user lists their car for sale
public struct CarListed has copy, drop {
    listing_id: sui::object::ID, // The ID of the ListCar object
    car_id: sui::object::ID,     // The ID of the Car being sold
    price: u64,                  // The requested price
    seller: address,             // Who is selling it
}

/// Emitted when a car is bought by a new owner
public struct CarBought has copy, drop {
    listing_id: sui::object::ID, // The ID of the listing that is now closed
    car_id: sui::object::ID,     // The ID of the car that moved
    buyer: address,              // Who bought the car
    price: u64,                  // The final sale price
}</code></pre>
        
        <h2>Pro-Tip: Event vs. Object ID</h2>
        <p>In CarBought, we include the listing_id even though that object is about to be deleted. Why? Because the Frontend might be showing a list of IDs, and it needs to know exactly which card to remove from the "Marketplace" screen.</p>
      `
    },
    {
      title: 'Chapter 5: The Factory Line (mint_car Function)',
      content: `
        <h1>Chapter 5: The Factory Line (mint_car Function)</h1>
        <p>Now that our data structures are ready, it is time to build the logic that actually creates (mints) the NFTs. The mint_car function is the "Factory Line" of your project. It takes raw input and turns it into a unique, verifiable digital asset.</p>
        
        <h2>Function Parameters</h2>
        <p>To mint a car, the function needs several inputs:</p>
        <ul>
          <li><strong>name:</strong> The user-defined string for the car.</li>
          <li><strong>speed:</strong> The performance stat.</li>
          <li><strong>image_id:</strong> The ID used to fetch our "Verified URL" (preventing fake images).</li>
          <li><strong>clock:</strong> A reference to the Sui System Clock (&Clock) to record the exact time.</li>
          <li><strong>ctx:</strong> The Transaction Context (&mut TxContext), which provides the sender's address and generates unique IDs.</li>
        </ul>
        
        <h2>Security: Assertions and Validation</h2>
        <p>We do not trust user input blindly. We use assert! to enforce rules:</p>
        <ul>
          <li><strong>Speed Limit:</strong> assert!(speed <= 100, ERR_SPEED_TOO_HIGH); ensures no "God-mode" cars are created.</li>
          <li><strong>Verified Visuals:</strong> By calling get_verified_url(image_id), we ensure the car only uses high-quality images approved by the contract.</li>
        </ul>
        
        <h2>Object Creation and Freezing</h2>
        <p>This function creates two objects:</p>
        <ul>
          <li><strong>The Car:</strong> The main NFT.</li>
          <li><strong>The Metadata:</strong> The creation record.</li>
        </ul>
        
        <p><strong>Crucial Step:</strong> We use transfer::freeze_object(metadata);. This makes the metadata immutable. No one (not even the admin) can ever change the birth date or the link between the metadata and the car.</p>
        
        <h2>Code Exercise: Implementing the Mint Logic</h2>
        <p>In your template, find TODO 6 and implement the function body. Pay close attention to how we handle the UID and the ID.</p>
        
        <pre><code>/// Mints a new Car NFT and its permanent Metadata
public entry fun mint_car(
    name: String, 
    speed: u64, 
    image_id: u64, 
    clock: &Clock, 
    ctx: &mut sui::tx_context::TxContext
) {
    // 1. Validation: Limit speed to prevent overpowered cars
    assert!(speed <= 100, ERR_SPEED_TOO_HIGH);
    
    // 2. Setup: Get approved URL and generate unique IDs
    let image_url = get_verified_url(image_id);
    let car_uid = sui::object::new(ctx);
    let car_id = sui::object::uid_to_inner(&car_uid); // Extract ID to link metadata

    // 3. Create the Car NFT
    let car = Car {
        id: car_uid,
        name,
        image_url,
        speed
    };

    // 4. Create the Birth Certificate (Metadata)
    let metadata = CarMetadata {
        id: sui::object::new(ctx),
        car_id,
        minted_at: clock::timestamp_ms(clock), // Get time from System Clock
    };

    // 5. Finalize: Freeze metadata forever and send car to user
    sui::transfer::freeze_object(metadata);
    sui::transfer::public_transfer(car, sui::tx_context::sender(ctx));
}</code></pre>
        
        <h2>Important: public entry vs public</h2>
        <p>We use public entry so that this function can be called directly from a wallet (like Sui Wallet) or the frontend. If it were just public, it could only be called by other Move functions.</p>
        
        <h2>Example: The Result of a Mint</h2>
        <p>When a user calls mint_car("Midnight Drifter", 92, 2, ...):</p>
        <ol>
          <li>The contract checks if 92 <= 100 (Passed).</li>
          <li>It looks up image_id: 2 and finds the "Midnight Drifter" IPFS URL.</li>
          <li>A new Car object appears in the user's wallet.</li>
          <li>A new CarMetadata object is created and frozen on the blockchain, proving that this car was born at exactly 18:31:27 on Dec 26, 2025.</li>
        </ol>
        
        <h2>Deep Dive: Why Freeze?</h2>
        <p>Freezing the metadata is the most important security feature of this function. Once an object is frozen, it becomes read-only and immutable for all time. This ensures that the creation timestamp and the car-to-metadata link are permanently verified and can never be tampered with—even by the contract owner.</p>
      `
    },
    {
      title: 'Chapter 6: Opening the Showroom (list_car Function)',
      content: `
        <h1>Chapter 6: Opening the Showroom (list_car Function)</h1>
        <p>In this chapter, we transition from creating assets to trading them. The list_car function is where a user takes their private Car NFT and makes it available for the entire world to see and buy. This process involves Object Ownership Transfer and Object Sharing.</p>
        
        <h2>Moving from Private to Public</h2>
        <p>When you own a Car, it sits in your address (Private Ownership). When you list it:</p>
        <ul>
          <li>The Car is wrapped inside a ListCar object.</li>
          <li>The ListCar object is shared.</li>
        </ul>
        
        <p>In Sui, a Shared Object is a special type of data that does not belong to any one person. Instead, it "lives" on the network, and the smart contract rules determine who can interact with it.</p>
        
        <h2>The Logic of the Listing</h2>
        <p>The function performs three main tasks:</p>
        <ul>
          <li><strong>Encapsulation:</strong> It takes the Car object as an input. Since the function signature takes car: Car (by value), the car is moved out of the user's wallet and into the function.</li>
          <li><strong>Initialization:</strong> It creates a new ListCar instance, recording the price and the seller's address so we know where to send the money later.</li>
          <li><strong>Announcement:</strong> It emits the CarListed event we defined in Chapter 4 so the frontend can display the new listing immediately.</li>
        </ul>
        
        <h2>Why share_object?</h2>
        <p>We use transfer::share_object(list_car). Unlike transfer::public_transfer (which sends an object to a specific person), share_object allows anyone on the Sui network to send a "buy" transaction to this specific listing.</p>
        
        <h2>Code Exercise: Implementing the Listing Logic</h2>
        <p>In your template, find TODO 7 and implement the logic to move the car into the marketplace.</p>
        
        <pre><code>/// Takes a car from the user and places it in a public listing
public entry fun list_car(car: Car, price: u64, ctx: &mut sui::tx_context::TxContext) {
    // 1. Generate unique IDs for the new listing
    let listing_uid = sui::object::new(ctx);
    let listing_id = sui::object::uid_to_inner(&listing_uid);
    let car_id = sui::object::id(&car);
    let seller = sui::tx_context::sender(ctx);

    // 2. Wrap the Car into the ListCar object
    let list_car = ListCar {
        id: listing_uid,
        car,      // The Car object is now "held" by this listing
        price,
        seller,
    };

    // 3. Emit the event for the Frontend
    event::emit(CarListed {
        listing_id,
        car_id,
        price,
        seller,
    });

    // 4. Share the listing so the public can see/buy it
    sui::transfer::share_object(list_car);
}</code></pre>
        
        <h2>Key Concept: The Escrow Security</h2>
        <p>Because the Car is inside the ListCar object, the seller cannot "double-sell" the car or take it back without a "withdraw" function (which we could add later). The contract acts as a neutral third party that holds the car securely.</p>
        
        <h2>Transaction Flow Visualization</h2>
        <p>Here is what happens step-by-step when list_car is called:</p>
        <ol>
          <li><strong>User's Wallet Before:</strong> Contains the Car object.</li>
          <li><strong>Function Execution:</strong> Car moves into the ListCar wrapper.</li>
          <li><strong>Sharing:</strong> ListCar becomes shared (accessible by anyone via contract rules).</li>
          <li><strong>User's Wallet After:</strong> No longer contains the Car (it is now locked in the ListCar).</li>
          <li><strong>Event Emitted:</strong> Frontend catches the CarListed event and displays the listing.</li>
          <li><strong>On-Chain Result:</strong> A shared ListCar object appears in the blockchain state, waiting for a buyer.</li>
        </ol>
        
        <h2>Deep Dive: Object Value vs Object Reference</h2>
        <p>Notice the function signature: car: Car (without & or &mut). This means the car is passed by value—it is moved into the function. This is different from a reference, where the caller would still own the car. By moving the car, Sui's type system guarantees that the car cannot exist in two places simultaneously.</p>
      `
    },
    {
      title: 'Chapter 7: The Grand Exchange (buy_car Function)',
      content: `
        <h1>Chapter 7: The Grand Exchange (buy_car Function)</h1>
        <p>This is the most critical part of the smart contract. The buy_car function handles the Atomic Swap—a process where the payment (SUI) and the asset (Car NFT) change owners at the exact same time. If any part of this process fails, the whole transaction reverts, ensuring no one gets cheated.</p>
        
        <h2>Deconstructing the Listing</h2>
        <p>To process the sale, we must "unpack" the ListCar object. In Move, when we use the syntax let ListCar { id, car, price, seller } = list_car;, we are destroying the container (the listing) to get the items inside.</p>
        <ul>
          <li>The Car is freed from its "display case."</li>
          <li>The Price and Seller variables are extracted so we can verify the payment.</li>
        </ul>
        
        <h2>Payment Verification (Safety First)</h2>
        <p>We use assert! to check the Coin&lt;SUI&gt; sent by the buyer.</p>
        <ul>
          <li>If the buyer sends too little, the transaction aborts.</li>
          <li>In this simple version, we check for an exact match. In more advanced versions, you could handle "change" if the user sends more than the price.</li>
        </ul>
        
        <h2>Execution: The Swap</h2>
        <p>The function performs three final steps:</p>
        <ul>
          <li><strong>Pay the Seller:</strong> Use public_transfer to send the SUI coins to the seller address.</li>
          <li><strong>Deliver the NFT:</strong> Use public_transfer to send the Car to the buyer (the person who called the function).</li>
          <li><strong>Cleanup:</strong> Use object::delete(id) to remove the UID of the listing from the blockchain. This cleans up the network state and rewards the caller with a small storage rebate.</li>
        </ul>
        
        <h2>Code Exercise: Implementing the Purchase Logic</h2>
        <p>In your template, find TODO 8 and implement the logic for the final exchange.</p>
        
        <pre><code>/// Handles the purchase of a listed car
public entry fun buy_car(list_car: ListCar, payment: Coin&lt;SUI&gt;, ctx: &mut sui::tx_context::TxContext) {
    // 1. Deconstruct the ListCar object (Destructures the listing)
    let ListCar { id, car, price, seller } = list_car;
    
    // 2. Security: Verify that the payment amount matches the price
    assert!(sui::coin::value(&payment) == price, ERR_INCORRECT_AMOUNT);

    // 3. Identify the buyer
    let buyer = sui::tx_context::sender(ctx);
    let car_id = sui::object::id(&car);

    // 4. Execution: Transfer SUI to seller and Car to buyer
    sui::transfer::public_transfer(payment, seller);
    sui::transfer::public_transfer(car, buyer);

    // 5. Announce the sale to the world
    event::emit(CarBought {
        listing_id: sui::object::uid_to_inner(&id),
        car_id,
        buyer,
        price,
    });

    // 6. Final Cleanup: Permanently delete the listing object
    sui::object::delete(id);
}</code></pre>
        
        <h2>Key Concept: Transaction Safety</h2>
        <p>Notice that the function takes list_car: ListCar as an input, not &mut ListCar. This means the listing is consumed. Once a car is bought, that specific listing ID can never be used again. This prevents "Replay Attacks" where someone might try to buy the same car twice for the price of one.</p>
        
        <h2>Atomic Swap Guarantee</h2>
        <p>The beauty of Move and Sui's type system is that the following are guaranteed:</p>
        <ul>
          <li>The payment either goes to the seller or the transaction fails entirely (no partial payments).</li>
          <li>The car either reaches the buyer or the transaction fails entirely (no lost cars).</li>
          <li>The listing either gets deleted or the transaction fails entirely (no duplicate purchases).</li>
        </ul>
        
        <p>This atomicity is enforced by the language itself—not by clever contract logic. It is one of the foundational safety features of the Move language.</p>
        
        <h2>Deep Dive: Why object::delete?</h2>
        <p>In Sui, when you explicitly delete an object's UID, you destroy the object from the network state. This is economically incentivized through "storage rebates"—the network gives back some of the SUI that was spent to create the listing. This encourages developers to clean up after themselves and keeps the blockchain lean.</p>
      `
    },
    {
      title: 'Chapter 8: Deployment and Verification (To the Blockchain!)',
      content: `
        <h1>Chapter 8: Deployment and Verification (To the Blockchain!)</h1>
        <p>Congratulations! You have written a fully functional decentralized marketplace. The final step is to take your code from your local computer and "Publish" it to the Sui Network. In this chapter, we will cover the build process, deployment, and how to verify your objects using the Sui Explorer.</p>
        
        <h2>The Build Process</h2>
        <p>Before publishing, the Move compiler needs to check your code for errors and package it into a binary format that the blockchain understands.</p>
        
        <h3>Command:</h3>
        <pre><code>sui move build</code></pre>
        
        <p><strong>What happens?</strong> The compiler checks for:</p>
        <ul>
          <li>Type mismatches (e.g., passing a String when a u64 is expected).</li>
          <li>Missing abilities (e.g., trying to store an object without the store ability).</li>
          <li>Unused variables (which could indicate logic errors).</li>
          <li>Invalid function signatures.</li>
        </ul>
        
        <p>If it succeeds, it generates a build/ folder containing compiled bytecode and metadata. If it fails, the compiler will print detailed error messages showing exactly where the problem is.</p>
        
        <h2>Publishing to Testnet</h2>
        <p>Publishing is a special transaction that creates a permanent Package Object on the blockchain. This Package Object stores the bytecode of your contract and serves as the permanent "source of truth" for your marketplace.</p>
        
        <h3>Command:</h3>
        <pre><code>sui client publish --gas-budget 100000000</code></pre>
        
        <p><strong>What you get back:</strong> You will receive a Package ID. This is the unique address of your smart contract. Every time your Frontend wants to call mint_car or buy_car, it references this Package ID.</p>
        
        <h3>Important Considerations:</h3>
        <ul>
          <li><strong>Gas Budget:</strong> The gas-budget must be sufficient to cover the compilation and storage costs. 100,000,000 MIST (0.1 SUI) is usually enough for simple contracts.</li>
          <li><strong>Active Environment:</strong> Make sure you are connected to Testnet (not Mainnet) for development.</li>
          <li><strong>Balance:</strong> Your wallet must have enough SUI to pay for gas.</li>
        </ul>
        
        <h2>Interacting with the Contract</h2>
        <p>Once published, your public entry functions are live and accessible to the world. You can call mint_car through multiple interfaces:</p>
        
        <h3>Via Sui CLI:</h3>
        <pre><code>sui client call --package PACKAGE_ID --module initializer --function mint_car \\
  --args "MyCarName" 85 1 0x6 \\
  --gas-budget 50000000</code></pre>
        
        <h3>Via Sui Explorer:</h3>
        <p>Visit https://testnet.suiscan.xyz/ (or the official Sui Explorer), search for your Package ID, and use the interactive UI to call functions directly.</p>
        
        <h3>Via Frontend (React):</h3>
        <p>Your React dApp will use the @mysten/dapp-kit to construct transactions pointing to your Package ID and submit them to the network.</p>
        
        <h2>Step-by-Step Exercise: Deploying Your Contract</h2>
        <p>Follow these terminal commands to get your marketplace live:</p>
        
        <pre><code># 1. Ensure you are on the correct network (Testnet)
sui client active-env

# 2. Navigate to your Move project directory
cd speedrun-sui

# 3. Build the project to check for errors
sui move build

# 4. If build is successful, publish the contract
# Make sure you have enough SUI for gas!
sui client publish --gas-budget 100000000

# 5. Wait for the transaction to be processed
# You will see output with your Package ID like:
# Package ID: 0x1234567890abcdef...</code></pre>
        
        <h2>After Publishing: What Happens?</h2>
        <p>Once your contract is published, the following become available on the blockchain:</p>
        <ul>
          <li><strong>Package Object:</strong> Stores the immutable bytecode of your contract.</li>
          <li><strong>Type Registry:</strong> The blockchain now knows about your Car, ListCar, and Event types.</li>
          <li><strong>Function Endpoints:</strong> Users can now call mint_car, list_car, and buy_car through any interface.</li>
          <li><strong>Event History:</strong> All CarListed and CarBought events are recorded and queryable.</li>
        </ul>
        
        <h2>Verifying Your Contract on the Blockchain</h2>
        <p>To view your deployed contract and its objects:</p>
        <ol>
          <li>Visit the Sui Explorer (testnet.suiscan.xyz or explorer.sui.io).</li>
          <li>Search for your Package ID.</li>
          <li>You will see the list of modules, functions, and their signatures.</li>
          <li>Click on any object (Car, ListCar, etc.) to see its fields and current state.</li>
        </ol>
        
        <h2>Important Concept: Immutability of Published Code</h2>
        <p>Once published, your contract code is immutable. You cannot edit or delete it. This is a feature, not a bug:</p>
        <ul>
          <li>Users can trust that the contract will behave exactly as published forever.</li>
          <li>If you discover a bug, you must publish a new version with a different Package ID.</li>
          <li>This immutability is the foundation of trust in decentralized systems.</li>
        </ul>
        
        <h2>Pro-Tip: The Init Function</h2>
        <p>While not in our template, most production Move contracts have an init(ctx: &mut TxContext) function. This special function runs exactly once the moment the contract is published. It is perfect for:</p>
        <ul>
          <li>Creating an Admin Capability that gives special powers to the contract creator.</li>
          <li>Setting up initial state (like global configuration objects).</li>
          <li>Registering your marketplace in a global registry.</li>
        </ul>
        
        <pre><code>/// Runs once when the contract is published
fun init(ctx: &mut TxContext) {
    let admin_cap = AdminCapability {
        id: sui::object::new(ctx),
    };
    
    // Transfer admin cap to the contract deployer
    sui::transfer::transfer(admin_cap, sui::tx_context::sender(ctx));
}</code></pre>
        
        <h2>What's Next?</h2>
        <p>Now that your contract is live on the blockchain:</p>
        <ul>
          <li>Connect your Frontend to the Package ID using @mysten/dapp-kit.</li>
          <li>Implement transaction signing and submission in your React components.</li>
          <li>Query events and objects using the Sui RPC API.</li>
          <li>Test the full user flow: Mint a car, list it, and buy it on Testnet.</li>
          <li>Consider moving to Mainnet once you are confident in your contract.</li>
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
    <div className="sui-car-fullscreen">
      <button className="sui-car-close-btn" onClick={onClose}>
        ✕
      </button>

      <div className="sui-car-header-section">
        <h1 className="sui-car-title">Sui Gallery</h1>
      </div>

      <div className="sui-car-tabs">
        {chapters.map((chapter, index) => (
          <button
            key={index}
            className={`sui-car-tab ${activeChapter === index ? 'active' : ''}`}
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

      <div className="sui-car-main-content">
        <div
          className="sui-car-chapter-content"
          dangerouslySetInnerHTML={{ __html: chapters[activeChapter].content }}
        />
      </div>

      {showSubmitModal && (
        <SubmitChallenge
          chapterTitle="Level 6: Sui Gallery"
          chapterId={6}
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default SuiGalleryView;
