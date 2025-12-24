import { ChapterData } from '../types';

export const referencesAndMutability: ChapterData = {
  id: '4',
  title: "Chapter 4: Tuning the Engine (References & Mutability)",
  description: `
    <h2>Chapter 4: Tuning the Engine (References & Mutability)</h2>
    <p>
      In the Move world, if you want to change an object's data (like upgrading a car's engine), you need to understand <strong>References</strong>.
    </p>

    <p>
      By default, Move is very strict about security. You cannot just change a value; you must prove to the network that you have the right to modify it. We do this using:
    </p>

    <ul>
      <li><strong>Read-only References (<code>&</code>)</strong>: Use this when you just want to "look" at the data (e.g., checking the car's current speed).</li>
      <li><strong>Mutable References (<code>&mut</code>)</strong>: Use this when you want to "change" the data (e.g., adding nitro to increase speed).</li>
    </ul>

    <p>
      In Sui, when a function takes a mutable reference to an object (like <code>car: &mut Car</code>), the network checks if the person calling the function is the actual owner of that car. If you don't own it, you can't tune it!
    </p>

    <h3>Put it to the test:</h3>
    <p>Let's add a "Tune Up" station to our garage.</p>
    <ol>
      <li>Create a <code>public entry</code> function named <code>boost_speed</code>.</li>
      <li>The function should take two parameters:
        <ul>
          <li><code>car</code>: A mutable reference to our <code>Car</code> struct (<code>&mut Car</code>).</li>
          <li><code>amount</code>: A <code>u64</code> value representing how much speed to add.</li>
        </ul>
      </li>
      <li>Inside the function, update the car's speed by adding the <code>amount</code> to the current <code>car.speed</code>.</li>
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

    // Write your boost_speed function below
    
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
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check if boost_speed function exists
    const hasBoostSpeedFunction = code.includes('fun boost_speed');
    if (!hasBoostSpeedFunction) {
      const commentLine = lines.findIndex(l => l.includes('// Write your boost_speed'));
      newErrors.push({
        line: commentLine !== -1 ? commentLine + 1 : 22,
        message: 'missing function "boost_speed"'
      });
    }

    // Check if function is public entry
    const isPublicEntry = code.includes('public entry fun boost_speed');
    if (!isPublicEntry && hasBoostSpeedFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun boost_speed'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 22,
        message: 'function must be "public entry fun boost_speed"'
      });
    }

    // Check for mutable reference parameter
    const hasMutRef = code.includes('car: &mut Car');
    if (!hasMutRef && hasBoostSpeedFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun boost_speed'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 22,
        message: 'first parameter must be "car: &mut Car"'
      });
    }

    // Check for amount parameter
    const hasAmountParam = code.includes('amount: u64');
    if (!hasAmountParam && hasBoostSpeedFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun boost_speed'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 22,
        message: 'second parameter must be "amount: u64"'
      });
    }

    // Check for speed update
    const hasSpeedUpdate = code.includes('car.speed = car.speed + amount') ||
      code.includes('car.speed = amount + car.speed') ||
      code.includes('car.speed += amount');
    if (!hasSpeedUpdate && hasBoostSpeedFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun boost_speed'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 2 : 23,
        message: 'must update car.speed by adding amount'
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
