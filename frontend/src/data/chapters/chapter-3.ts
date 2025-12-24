import { ChapterData } from '../types';

export const mintingAndOwnership: ChapterData = {
  id: '3',
  title: "Chapter 3: Starting the Assembly Line (Minting & Ownership)",
  description: `
    <h2>Chapter 3: Starting the Assembly Line (Minting & Ownership)</h2>
    <p>
      The blueprint is ready, but the garage is still empty. To bring a car to life, we need to "mint" it. In Move, minting simply means creating an instance of our <code>struct</code> and assigning it to an owner.
    </p>

    <p>
      In Sui, objects cannot just "exist" in a vacuum. Every object must have an owner. When we create a car, we usually want to send it to the person who triggered the transaction.
    </p>

    <p>To achieve this, we will use two new tools:</p>
    <ol>
      <li><strong><code>TxContext</code></strong>: This acts like the "ID card" of the current transaction. It tells us who is calling the function (<code>tx_context::sender</code>) and provides the ingredients to create a new unique ID.</li>
      <li><strong><code>sui::transfer</code></strong>: This is the delivery truck. Once the car is built, this module handles moving the object into the user's wallet.</li>
    </ol>

    <p>
      <strong>The <code>public entry</code> Keyword:</strong><br>
      For a function to be callable directly from a wallet (like clicking a "Build Car" button in a game), it must be marked as <code>public entry</code>.
    </p>

    <h3>Put it to the test:</h3>
    <p>Let's write a function to build and deliver our first car.</p>
    <ol>
      <li>Import <code>sui::transfer</code> and <code>sui::tx_context::{Self, TxContext}</code>.</li>
      <li>Create a <code>public entry</code> function named <code>create_car</code>.</li>
      <li>The function should take two parameters: <code>model_name</code> (String) and <code>ctx</code> (a mutable reference to <code>TxContext</code>).</li>
      <li>Inside the function:
        <ul>
          <li>Create a new <code>Car</code> object.</li>
          <li>Use <code>object::new(ctx)</code> to generate its <code>id</code>.</li>
          <li>Set <code>speed</code> to a default value of <code>100</code>.</li>
          <li>Use <code>transfer::transfer</code> to send the new car to the <code>tx_context::sender(ctx)</code>.</li>
        </ul>
      </li>
    </ol>
  `,
  technicalSkills: [],
  initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    // 1. Import transfer and tx_context here

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    // 2. Write your create_car function below
    
}`,
  expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };

        transfer::transfer(new_car, tx_context::sender(ctx));
    }
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check if transfer is imported
    const hasTransferImport = code.includes('use sui::transfer');
    if (!hasTransferImport) {
      const importLine = lines.findIndex(l => l.includes('// 1. Import transfer'));
      newErrors.push({
        line: importLine !== -1 ? importLine + 1 : 4,
        message: 'missing import statement "use sui::transfer;"'
      });
    }

    // Check if tx_context is imported
    const hasTxContextImport = code.includes('use sui::tx_context::{Self, TxContext}') ||
      code.includes('use sui::tx_context::{TxContext, Self}');
    if (!hasTxContextImport) {
      const importLine = lines.findIndex(l => l.includes('// 1. Import transfer'));
      newErrors.push({
        line: importLine !== -1 ? importLine + 1 : 5,
        message: 'missing import statement "use sui::tx_context::{Self, TxContext};"'
      });
    }

    // Check if create_car function exists
    const hasCreateCarFunction = code.includes('fun create_car');
    if (!hasCreateCarFunction) {
      const functionLine = lines.findIndex(l => l.includes('// 2. Write your create_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 12,
        message: 'missing function "create_car"'
      });
    }

    // Check if function is public entry
    const isPublicEntry = code.includes('public entry fun create_car');
    if (!isPublicEntry && hasCreateCarFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun create_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 12,
        message: 'function must be "public entry fun create_car"'
      });
    }

    // Check for object::new(ctx)
    const hasObjectNew = code.includes('object::new(ctx)');
    if (!hasObjectNew && hasCreateCarFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun create_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 3 : 14,
        message: 'must use "object::new(ctx)" to create id'
      });
    }

    // Check for transfer::transfer
    const hasTransferCall = code.includes('transfer::transfer');
    if (!hasTransferCall && hasCreateCarFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun create_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 7 : 19,
        message: 'must use "transfer::transfer" to send the car'
      });
    }

    // Check for tx_context::sender
    const hasSender = code.includes('tx_context::sender(ctx)');
    if (!hasSender && hasCreateCarFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun create_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 7 : 19,
        message: 'must send car to "tx_context::sender(ctx)"'
      });
    }

    // Normalize whitespace for final comparison
    const normalizeCode = (str: string) =>
      str.replace(/\/\/.*$/gm, '')
        .replace(/\s+/g, ' ')
        .trim();

    const userCode = normalizeCode(code);
    const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };

        transfer::transfer(new_car, tx_context::sender(ctx));
    }
}`);

    if (newErrors.length === 0 && userCode !== expected) {
      newErrors.push({
        line: 1,
        message: 'syntax error: check your code structure'
      });
    }

    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
  }
};
