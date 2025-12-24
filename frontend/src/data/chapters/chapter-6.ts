import { ChapterData } from '../types';

export const objectDeletion: ChapterData = {
  id: '6',
  title: "Chapter 6: Scrapping the Junk (Object Deletion)",
  description: `
    <h2>Chapter 6: Scrapping the Junk (Object Deletion)</h2>
    <p>
      Not every car stays on the road forever. Sometimes, a car is just too old or damaged. In Sui, you have the ability to destroy an object and remove it from the blockchain entirely. This process is called <strong>Unpacking</strong>.
    </p>
    <p>
      To destroy an object, you must follow these rules:
    </p>

    <ol>
      <li><strong>Ownership:</strong> You must own the object to destroy it.</li>
      <li><strong>Unpacking:</strong> In Move, you "deconstruct" the struct. You take all the fields out and handle them individually.</li>
      <li><strong>UID Deletion:</strong> Since every Sui object has a unique <code>id</code> of type <code>UID</code>, you must explicitly delete this ID using <code>object::delete</code>. If you don't delete the ID, the code won't compile—Move won't let you leave a "ghost" ID behind!</li>
    </ol>

    <h3>Put it to the test:</h3>
    <p>Let's add a "Scrapyard" (Hurdalık) function to our garage.</p>
    <ol>
      <li>Create a <code>public entry</code> function named <code>scrap_car</code>.</li>
      <li>The function should take one parameter: <code>car: Car</code>. (Remember: We pass it by <strong>value</strong> because we are going to destroy it).</li>
      <li>Inside the function:
        <ul>
          <li>Use "destructuring" to unpack the car: <code>let Car { id, model: _, speed: _ } = car;</code>. (The <code>_</code> means we don't care about the value of the model or speed).</li>
          <li>Use <code>object::delete(id)</code> to permanently remove the car's identity from the blockchain.</li>
        </ul>
      </li>
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

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    // Write your scrap_car function below
    
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

    public entry fun scrap_car(car: Car) {
        // 1. Destructure the car
        let Car { id, model: _, speed: _ } = car;

        // 2. Delete the UID
        object::delete(id);
    }
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check if scrap_car function exists
    const hasScrapFunction = code.includes('fun scrap_car');
    if (!hasScrapFunction) {
      const commentLine = lines.findIndex(l => l.includes('// Write your scrap_car'));
      newErrors.push({
        line: commentLine !== -1 ? commentLine + 1 : 30,
        message: 'missing function "scrap_car"'
      });
    }

    // Check if function is public entry
    const isPublicEntry = code.includes('public entry fun scrap_car');
    if (!isPublicEntry && hasScrapFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun scrap_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 30,
        message: 'function must be "public entry fun scrap_car"'
      });
    }

    // Check for car parameter (by value)
    const scrapFunctionRegex = /fun\s+scrap_car\s*\(([^)]*)\)/;
    const match = code.match(scrapFunctionRegex);
    const args = match ? match[1] : '';

    const hasCarParam = args.includes('car: Car');
    const hasRefCar = args.includes('car: &Car') || args.includes('car: &mut Car');

    if (hasRefCar && hasScrapFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun scrap_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 30,
        message: 'car must be passed by value ("car: Car"), not by reference'
      });
    } else if (!hasCarParam && hasScrapFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun scrap_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 30,
        message: 'missing parameter "car: Car"'
      });
    }

    // Check for destructuring
    const hasDestructuring = code.includes('let Car {') || code.includes('let Car{');
    if (!hasDestructuring && hasScrapFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun scrap_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 2 : 31,
        message: 'must unpack struct: "let Car { id, model: _, speed: _ } = car;"'
      });
    }

    // Check for object::delete
    const hasDelete = code.includes('object::delete(id)');
    if (!hasDelete && hasScrapFunction) {
      const functionLine = lines.findIndex(l => l.includes('fun scrap_car'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 3 : 32,
        message: 'must delete the UID with "object::delete(id)"'
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

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
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
