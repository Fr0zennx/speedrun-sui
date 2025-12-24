import { ChapterData } from '../types';

export const objectTransfer: ChapterData = {
  id: '5',
  title: "Chapter 5: The Used Car Market (Object Transfer)",
  description: `
    <h2>Chapter 5: The Used Car Market (Object Transfer)</h2>
    <p>
      In the Sui ecosystem, since you truly own your assets, you have the right to give or sell them to anyone you want. This process is called <strong>Transferring</strong>.
    </p>
    <p>
      Unlike other blockchains where you might just change a balance in a contract, in Sui, the entire object moves from your account to another person's account. Once a transfer is complete, you lose all access to that object, and the new owner gains full control.
    </p>

    <p>We use the <code>sui::transfer</code> module for this:</p>
    <ul>
      <li><strong><code>transfer::public_transfer</code></strong>: We use this version when the object has the <code>store</code> ability (like our <code>Car</code>). It allows the object to be sent to any address.</li>
    </ul>

    <h3>Put it to the test:</h3>
    <p>Let's create a function that allows a garage owner to gift a car to a friend.</p>
    <ol>
      <li>Create a <code>public entry</code> function named <code>transfer_car</code>.</li>
      <li>The function should take two parameters:
        <ul>
          <li><code>car</code>: The <code>Car</code> object itself. (Note: Since we are moving the object entirely, we pass it by <strong>value</strong>, not by reference. This means we don't use <code>&</code>).</li>
          <li><code>recipient</code>: The <code>address</code> of the person who will receive the car.</li>
        </ul>
      </li>
      <li>Inside the function, use <code>transfer::public_transfer(car, recipient)</code> to complete the delivery.</li>
    </ol>
  `,
  technicalSkills: [],
  initialCode: `module sui_garage::car_factory {
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

    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    // Write your transfer_car function below
    
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

    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check if transfer_car function exists
    const hasTransferFunction = code.includes('fun transfer_car');
    if (!hasTransferFunction) {
      const commentLine = lines.findIndex(l => l.includes('// Write your transfer_car'));
      newErrors.push({
        line: commentLine !== -1 ? commentLine + 1 : 26,
        message: 'missing function "transfer_car"'
      });
    }

    // Check if function is public entry
    const isPublicEntry = code.includes('public entry fun transfer_car');
    if (!isPublicEntry && hasTransferFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun transfer_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 26,
        message: 'function must be "public entry fun transfer_car"'
      });
    }

    // Check for car parameter (by value)
    const transferFunctionRegex = /fun\s+transfer_car\s*\(([^)]*)\)/;
    const match = code.match(transferFunctionRegex);
    const args = match ? match[1] : '';

    const hasCarParam = args.includes('car: Car');
    const hasRefCar = args.includes('car: &Car') || args.includes('car: &mut Car');

    if (hasRefCar && hasTransferFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun transfer_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 26,
        message: 'car must be passed by value ("car: Car"), not by reference'
      });
    } else if (!hasCarParam && hasTransferFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun transfer_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 26,
        message: 'missing parameter "car: Car"'
      });
    }

    // Check for recipient parameter
    const hasRecipientParam = code.includes('recipient: address');
    if (!hasRecipientParam && hasTransferFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun transfer_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 26,
        message: 'missing parameter "recipient: address"'
      });
    }

    // Check for public_transfer usage
    const hasPublicTransfer = code.includes('transfer::public_transfer(car, recipient)');
    if (!hasPublicTransfer && hasTransferFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun transfer_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 2 : 27,
        message: 'must use "transfer::public_transfer(car, recipient)"'
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

    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
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
