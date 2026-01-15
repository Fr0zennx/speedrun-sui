import { useState } from 'react';
import SubmitChallenge from './SubmitChallenge';
import './SuiCarView.css';

interface SuiCarViewProps {
  onClose: () => void;
}

function SuiCarView({ onClose }: SuiCarViewProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const chapters = [
    {
      title: 'Introduction',
      content: `
        <h3>Project Setup and Development</h3>
        <p>To begin the Character Card challenge, you will be working on a car game project. <strong>Crucially, all coding steps and logic implementations will take place within the <code>sources/car_game.move</code> file.</strong></p>
        
        <h4>1. Clone the Repository</h4>
        <p>Open your terminal and run:</p>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>git clone https://github.com/Fr0zennx/sui-car.git</code></pre>
        
        <h4>2. Navigate to the UI Directory</h4>
        <p>The frontend of the project is located in the <code>ui</code> folder. Move into it to manage dependencies:</p>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>cd Character-Card/ui</code></pre>
        
        <h4>3. Install Dependencies</h4>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>npm install</code></pre>
        
        <h4>4. Start Development Server</h4>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>npm run dev</code></pre>
        
        <h4>5. Important Note on Challenges</h4>
        <p>Follow the chapter instructions carefully. <strong>Every step of your Move development must be completed inside the <code>sources/car_game.move</code> file.</strong> Once you finish the logic there and deploy your contract, use the submission modal to send your Suiscan and Vercel links.</p>
        
        <p style="color: #4da6ff; font-style: italic; margin-top: 2rem;">Ready to start? Click <strong>Chapter 1: Data Modeling and Schema Design</strong> to begin!</p>
      `
    },
    {
      title: 'Chapter 1: Data Modeling and Schema Design',
      content: `
        <p>The first step in building a dynamic system on Sui is defining the data structures. Unlike other blockchains where you might store data in a simple mapping, in Sui, you define Objects.</p>
        
        <p>In this chapter, you will define the "DNA" of our garage. You need to ensure that the Car can hold other objects, but also remains flexible enough to be empty.</p>
        
        <h2>Technical Requirements</h2>
        <p>To complete Chapter 1, you must implement the following logic within your skeleton contract:</p>
        
        <h3>The Car Object:</h3>
        <ul>
          <li>Add <code>id: UID</code> to establish its global identity.</li>
          <li>Add <code>model</code> and <code>color</code> as String types.</li>
          <li>Implement Slots: Use <code>Option&lt;Wheels&gt;</code> and <code>Option&lt;Bumper&gt;</code> to allow the car to optionally own these parts.</li>
        </ul>
        
        <h3>The Component Objects:</h3>
        <ul>
          <li>Define the <code>Bumper</code> struct. It must have <code>id: UID</code> and a <code>shape: String</code>.</li>
          <li>Ensure all structs have the correct Abilities (<code>key</code>, <code>store</code>) so they can be transferred and stored inside other objects.</li>
        </ul>
        
        <h3>The Event Schema:</h3>
        <ul>
          <li>Define <code>CarModifiedEvent</code>. It needs to store the <code>car_id: ID</code>, the <code>action: String</code> (e.g., "Repaint"), and the <code>new_value: String</code> to inform the frontend of what changed.</li>
        </ul>
        
        <h2>Chapter 1: Code Task</h2>
        <p>Fill in the missing fields in the code block below:</p>
        
        <pre><code>// === CHAPTER 1: DATA STRUCTURES ===

public struct Car has key, store {
    id: UID,
    model: String,
    color: String,
    // TODO: Add wheels (Option of Wheels)
    // TODO: Add bumper (Option of Bumper)
}

public struct Wheels has key, store {
    id: UID,
    style: String,
}

public struct Bumper has key, store {
    // TODO: Add id (UID)
    // TODO: Add shape (String)
}

public struct CarModifiedEvent has copy, drop {
    // TODO: Add car_id (ID)
    // TODO: Add action (String)
    // TODO: Add new_value (String)
}</code></pre>
      `
    },
    {
      title: 'Chapter 2: Lifecycle Implementation (Minting and Mutation)',
      content: `
        <p>Now that the blueprint is defined, you must implement the logic to instantiate these objects and modify their state. In Sui, creating an object is known as "minting," and changing its data is "mutation."</p>
        
        <p>In this chapter, you will learn how to handle String conversions and how to use Mutable References (<code>&mut</code>) to update an object that already exists on the blockchain.</p>
        
        <h2>Technical Requirements</h2>
        <p>To complete Chapter 2, you must implement the logic for the following functions:</p>
        
        <h3>Minting the Car (mint_car):</h3>
        <ul>
          <li>Initialize a new Car object using <code>object::new(ctx)</code>.</li>
          <li>Convert the input <code>vector&lt;u8&gt;</code> parameters into String using <code>string::utf8()</code>.</li>
          <li>Set the wheels and bumper slots to <code>option::none()</code> initially.</li>
          <li>Use <code>transfer::public_transfer</code> to send the new car to the transaction sender.</li>
        </ul>
        
        <h3>Modifying the State (repaint_car):</h3>
        <ul>
          <li>Use the mutable reference <code>&mut Car</code> to access the car's data.</li>
          <li>Update the <code>color</code> field with the new value.</li>
          <li><strong>Crucial:</strong> Create and emit a <code>CarModifiedEvent</code> using <code>event::emit</code> so the frontend knows the color has changed.</li>
        </ul>
        
        <h2>Chapter 2: Code Task</h2>
        <p>Complete the implementation inside the function bodies below:</p>
        
        <pre><code>// === CHAPTER 2: MINTING & MUTATION ===

public entry fun mint_car(
    model: vector&lt;u8&gt;, 
    color: vector&lt;u8&gt;, 
    ctx: &mut TxContext
) {
    let car = Car {
        id: object::new(ctx),
        model: string::utf8(model),
        color: string::utf8(color),
        // TODO: Initialize wheels as none
        // TODO: Initialize bumper as none
    };
    
    // TODO: Transfer the car to the sender using tx_context::sender(ctx)
}

public entry fun repaint_car(
    car: &mut Car, 
    new_color: vector&lt;u8&gt;
) {
    let color_str = string::utf8(new_color);
    
    // TODO: Update car.color with color_str
    
    // TODO: Emit CarModifiedEvent
    /* event::emit(CarModifiedEvent {
        car_id: object::id(car),
        action: string::utf8(b"REPAINT"),
        new_value: color_str,
    });
    */
}</code></pre>
      `
    },
    {
      title: 'Chapter 3: Modular Integration (Object Composition)',
      content: `
        <p>This is where the power of Sui's object model truly shines. In this chapter, you will implement Object Composition—the ability to place one independent object inside another.</p>
        
        <p>The most critical lesson here is <strong>Ownership Management</strong>. In Move, if you replace an object that is already inside a slot (<code>Option</code>), the old object doesn't just disappear. You must explicitly handle it by returning it to the user's wallet. We use <code>option::swap_or_fill</code> to handle this logic safely.</p>
        
        <h2>Technical Requirements</h2>
        <p>To complete Chapter 3, you must implement the install_wheels logic:</p>
        
        <h3>The Swap Logic:</h3>
        <ul>
          <li>Use <code>option::swap_or_fill(&mut car.wheels, new_wheels)</code> to place the new wheels into the car.</li>
          <li>This function returns an <code>Option&lt;Wheels&gt;</code> containing the old wheels (if any).</li>
        </ul>
        
        <h3>Handling the Orphaned Object:</h3>
        <ul>
          <li>Check if the returned option <code>is_some</code>.</li>
          <li>If it contains an object, use <code>option::extract</code> to take it out and <code>transfer::public_transfer</code> it back to the <code>tx_context::sender(ctx)</code>.</li>
        </ul>
        
        <h3>State Notification:</h3>
        <ul>
          <li>Emit a <code>CarModifiedEvent</code> with the action <strong>"WHEELS_INSTALLED"</strong>.</li>
        </ul>
        
        <h2>Chapter 3: Code Task</h2>
        <p>Complete the implementation of the assembly logic:</p>
        
        <pre><code>// === CHAPTER 3: OBJECT COMPOSITION ===

public entry fun install_wheels(
    car: &mut Car, 
    new_wheels: Wheels, 
    ctx: &mut TxContext
) {
    let style_str = new_wheels.style;

    // TODO: Use swap_or_fill to put new_wheels into car.wheels
    // let old_wheels_opt = ...

    // TODO: If old_wheels_opt is_some, extract and transfer it back to sender
    /*
    if (option::is_some(&old_wheels_opt)) {
        let old_wheels = option::extract(&mut old_wheels_opt);
        transfer::public_transfer(old_wheels, tx_context::sender(ctx));
    };
    */

    // TODO: Clean up the empty Option and emit event
    // option::destroy_none(old_wheels_opt);
}</code></pre>
      `
    },
    {
      title: 'Chapter 4: Security and State Validation (Asserts and Removal)',
      content: `
        <p>The final chapter focuses on system integrity and safe retrieval. In a decentralized garage, you must ensure that users cannot perform illegal actions—such as trying to remove a part that doesn't exist.</p>
        
        <p>You will learn how to use <code>assert!</code> for error handling and how to properly "unwrap" an <code>Option</code> to move an object from the car's storage back into the user's main wallet.</p>
        
        <h2>Technical Requirements</h2>
        <p>To complete Chapter 4, you must implement the remove_wheels logic:</p>
        
        <h3>Validation (The Guard):</h3>
        <ul>
          <li>Use <code>assert!</code> to verify that <code>option::is_some(&car.wheels)</code> is true.</li>
          <li>If the car has no wheels, abort the transaction with the error code <code>ERR_NO_WHEELS_TO_REMOVE</code>.</li>
        </ul>
        
        <h3>Extraction (The Retrieval):</h3>
        <ul>
          <li>Use <code>option::extract(&mut car.wheels)</code> to take the Wheels object out of the Car struct.</li>
          <li>This changes the car's state back to none for that slot.</li>
        </ul>
        
        <h3>Ownership Transfer:</h3>
        <ul>
          <li>Use <code>transfer::public_transfer</code> to return the extracted wheels to the caller.</li>
        </ul>
        
        <h2>Chapter 4: Code Task</h2>
        <p>Complete the safety and removal logic:</p>
        
        <pre><code>// === CHAPTER 4: SAFETY FIRST ===

public entry fun remove_wheels(
    car: &mut Car, 
    ctx: &mut TxContext
) {
    // TODO: Assert that wheels exist in the car
    // assert!(option::is_some(&car.wheels), ERR_NO_WHEELS_TO_REMOVE);

    // TODO: Extract the wheels from the Option slot
    // let wheels = ...

    // TODO: Transfer the wheels back to the sender
    
    // TODO: Emit CarModifiedEvent with action "WHEELS_REMOVED"
}</code></pre>
      `
    },
    {
      title: 'Chapter 5: Administrative Control and Market Access',
      content: `
        <p>In the final stage of our garage development, we transition from pure logic to System Governance. In a real-world application, you cannot allow every user to mint unlimited high-end parts for free. You need a way to restrict administrative functions and potentially charge for services.</p>
        
        <p>This chapter introduces the <strong>Capability Pattern</strong>—a fundamental Sui design pattern where authority is represented by a specific object (the <code>AdminCap</code>).</p>
        
        <h2>Technical Requirements</h2>
        <p>To complete Chapter 5, you must implement the following:</p>
        
        <h3>The Admin Capability:</h3>
        <ul>
          <li>Create a struct named <code>AdminCap</code> with <code>key</code> ability.</li>
          <li>Use the <code>init</code> function to create this object and send it to the contract deployer.</li>
        </ul>
        
        <h3>Protected Functions:</h3>
        <ul>
          <li>Refactor the <code>create_wheels</code> and <code>create_bumper</code> functions.</li>
          <li>Add an <code>_admin: &AdminCap</code> parameter to these functions. This ensures only the holder of the Admin Badge can "manufacture" new parts for the game ecosystem.</li>
        </ul>
        
        <h3>The Initialization Logic:</h3>
        <ul>
          <li>Implement the <code>fun init</code> to set up the garage's initial state upon deployment.</li>
        </ul>
        
        <h2>Chapter 5: Code Task</h2>
        <p>Implement the governance layer:</p>
        
        <pre><code>// === CHAPTER 5: GOVERNANCE & INITIALIZATION ===

/// This object represents the power to create parts.
public struct AdminCap has key { id: UID }

/// The init function runs only once, upon publishing the contract.
fun init(ctx: &mut TxContext) {
    // TODO: Create an AdminCap object
    // TODO: Transfer it to the transaction sender (the deployer)
}

/// Now, only the Admin can create wheels.
public entry fun create_wheels(
    _admin: &AdminCap, // TODO: Require the Admin Capability
    style: vector&lt;u8&gt;, 
    ctx: &mut TxContext
) {
    let wheels = Wheels {
        id: object::new(ctx),
        style: string::utf8(style),
    };
    transfer::public_transfer(wheels, tx_context::sender(ctx));
}</code></pre>
      `
    },
    {
      title: 'Chapter 6: Parts Manufacturing & PTB Design',
      content: `
        <p>In this chapter of the Sui Garage project, you will move beyond the Car itself and focus on creating the individual components: <strong>Wheels</strong> and <strong>Bumpers</strong>. This section introduces a critical architectural decision in Sui development: the difference between <strong>Entry Functions</strong> and <strong>Return-based Functions</strong>.</p>
        
        <h2>Objective</h2>
        <p>Your goal is to implement two different ways of creating car parts. One method will send the part directly to the user's wallet, while the other will return the part so it can be used immediately inside a <strong>Programmable Transaction Block (PTB)</strong>.</p>
        
        <h2>Logic Requirements</h2>
        
        <h3>1. Direct Minting (create_wheels)</h3>
        <ul>
          <li><strong>Requirement:</strong> This must be an <code>entry</code> function.</li>
          <li><strong>Logic:</strong> Initialize a new Wheels object with the provided style.</li>
          <li><strong>Action:</strong> Use <code>transfer::public_transfer</code> to deliver the wheels to the person who called the function (<code>tx_context::sender</code>).</li>
        </ul>
        
        <h3>2. The Return Pattern (new_bumper & new_wheels)</h3>
        <ul>
          <li><strong>Requirement:</strong> These should be <code>public</code> functions, <strong>not</strong> entry functions.</li>
          <li><strong>Return Type:</strong> They must return the object itself (<code>Wheels</code> or <code>Bumper</code>).</li>
          <li><strong>Why?</strong> This allows a developer to chain transactions. For example, a user could call <code>new_wheels</code> and then immediately pass that output into <code>install_wheels</code> all within a single transaction block.</li>
        </ul>
        
        <h2>Key Move Concepts</h2>
        <h3>Entry vs. Public Functions</h3>
        <ul>
          <li><code>entry</code> functions are the end of the line. They are called directly by wallets and <strong>cannot return values</strong> to other Move functions.</li>
          <li><code>public</code> functions that return objects are the building blocks of <strong>Programmable Transaction Blocks (PTBs)</strong>. They allow for complex, atomic operations where you create, modify, and store an object in one go.</li>
        </ul>
      `
    },
    {
      title: 'Chapter 7: Object Composability',
      content: `
        <p>In this chapter of the Sui Garage project, you will master one of Sui's most powerful features: <strong>Object Composability</strong>. Unlike other blockchains where state is often just a mapping of numbers, Sui allows objects to physically own other objects.</p>
        
        <h2>Objective</h2>
        <p>Your goal is to complete the logic that allows a user to equip or unequip parts (Wheels and Bumpers) from their Car.</p>
        
        <h2>Logic Requirements</h2>
        
        <h3>1. The Swap Mechanic (install_wheels & install_bumper)</h3>
        <p>When a user wants to install a new part, your code must handle three things:</p>
        <ul>
          <li><strong>Check Presence:</strong> Use <code>option::is_some</code> to see if the Car already has a part in that slot.</li>
          <li><strong>The Extract & Return:</strong> If a part exists, you must extract it from the Car and send it back to the user's wallet using <code>transfer::public_transfer</code>. We don't want to lose the old part.</li>
          <li><strong>The Fill:</strong> Use <code>option::fill</code> to put the new object into the now-empty slot.</li>
        </ul>
        
        <h3>2. The Removal Mechanic (remove_wheels & remove_bumper)</h3>
        <p>When a user wants to take a part off without replacing it:</p>
        <ul>
          <li><strong>Safety First:</strong> Use an <code>assert!</code> to ensure the slot isn't already empty. If the user tries to remove nothing, the transaction should fail with an error.</li>
          <li><strong>Extraction:</strong> Extract the object and send it to the sender.</li>
        </ul>
        
        <h3>3. On-chain Feedback</h3>
        <p>Every time a part is installed or removed, you must emit a <code>CarModifiedEvent</code>. This allows your React frontend to listen to the blockchain and update the Garage UI instantly without refreshing.</p>
        
        <h2>Key Move Concepts</h2>
        <ul>
          <li><strong>std::option:</strong> In Move, you cannot have a null field. If a Car might not have wheels, the field must be an <code>Option&lt;Wheels&gt;</code>. Use <code>extract()</code> to take the value out and <code>fill()</code> to put a value in.</li>
          <li><strong>Dynamic Ownership:</strong> When you install Wheels into a Car, the Wheels object's owner changes from the User to the Car. The wheels are now nested inside the car's UID.</li>
        </ul>
      `
    },
    {
      title: 'Chapter 8: Deployment to SUI Testnet',
      content: `
        <h1>Chapter 8: Deployment to SUI Testnet</h1>
        <p>After modeling data, implementing logic, and verifying your code with unit tests, the final step is <strong>Deployment</strong>. In SUI, publishing a contract converts your Move code into an on-chain package that anyone (or authorized users) can interact with.</p>
        
        <h2>The Core Concepts</h2>
        <ul>
          <li><strong>The Package Object:</strong> When you publish, SUI creates a special object called a Package. This package contains the compiled bytecode of your game module. It serves as the "source of truth" for your contract on the blockchain.</li>
          <li><strong>SUI CLI:</strong> We use the Command Line Interface to communicate with the network. The <code>sui client publish</code> command handles the compilation, gas estimation, and submission all in one step.</li>
          <li><strong>Gas Budget:</strong> Every on-chain operation costs gas. You must ensure your SUI wallet has enough Testnet SUI to cover the storage and execution fees. This is specified using the <code>--gas-budget</code> flag.</li>
          <li><strong>The Move.toml:</strong> This file is critical as it defines your package name, version, and dependencies (like the SUI Framework). It must be present in your project root before publishing.</li>
          <li><strong>Network Selection:</strong> The SUI CLI remembers which network you're targeting. You can switch between Devnet, Testnet, and Mainnet using <code>sui client switch</code>.</li>
        </ul>
        
        <h2>Pre-Deployment Checklist</h2>
        <p>Before executing the publish command, verify the following:</p>
        <ul>
          <li><strong>Active Environment:</strong> Confirm you're connected to the correct network (usually Testnet for development).</li>
          <li><strong>Account Balance:</strong> Check that your account has sufficient Testnet SUI. You can request free funds from the SUI Faucet.</li>
          <li><strong>Move.toml Configuration:</strong> Ensure your package name and dependencies are correctly specified.</li>
          <li><strong>Code Compilation:</strong> Verify there are no syntax errors by running a local build first.</li>
        </ul>
        
        <h2>Your Task: Deployment Steps</h2>
        <p>Prepare your project for the real world by executing the following CLI steps:</p>
        
        <h3>Step 1: Verify Active Network</h3>
        <pre><code>sui client active-env</code></pre>
        <p>This command displays the currently active network (e.g., <code>testnet</code>). If it shows a different network, use <code>sui client switch --env testnet</code> to switch.</p>
        
        <h3>Step 2: Check Your Balance</h3>
        <pre><code>sui client balance</code></pre>
        <p>This displays your Testnet SUI balance. If you have insufficient funds (less than 1 SUI), visit the <strong>SUI Testnet Faucet</strong> to request free tokens.</p>
        
        <h3>Step 3: Publish Your Contract</h3>
        <pre><code>sui client publish --gas-budget 100000000</code></pre>
        <p>The <code>--gas-budget</code> flag specifies the maximum SUI you're willing to spend (in MIST units; 1 SUI = 1,000,000,000 MIST). A budget of 100,000,000 (0.1 SUI) is typically sufficient for small packages.</p>
        
        <h2>After Deployment</h2>
        <ul>
          <li><strong>Package ID:</strong> The CLI will return a Package ID (a long hex string). <strong>Save this!</strong> You'll need it to interact with your contract on-chain.</li>
          <li><strong>Transaction Hash:</strong> You'll also receive a transaction digest. You can view the transaction on Suiscan by pasting the digest into the search bar.</li>
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
    <div className="sui-car-fullscreen">
      <button className="sui-car-close-btn" onClick={onClose}>
        ✕
      </button>

      <div className="sui-car-header-section">
        <h1 className="sui-car-title">Sui Car</h1>
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
          chapterTitle="Level 5: Sui Car"
          chapterId={5}
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default SuiCarView;
