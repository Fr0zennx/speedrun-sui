import { ChapterData } from '../types';

export const adminCapabilities: ChapterData = {
  id: '7',
  title: "Chapter 7: The Master Key (Admin Capabilities)",
  description: `
    <h2>Chapter 7: The Master Key (Admin Capabilities)</h2>
    <p>
      In your garage, you don't want just anyone to be able to access the high-end nitro boosts. You need a system to distinguish between a regular user and the <strong>Garage Owner</strong>.
    </p>

    <p>
      In Move, we use a pattern called the <strong>Capability Pattern</strong>. Instead of checking a list of "allowed addresses" (which is expensive and slow), we create a special, unique object—like a "Golden Key"—and give it to the admin.
    </p>

    <p><strong>How it works:</strong></p>
    <ol>
      <li>We define a struct called <code>AdminCap</code> (Admin Capability).</li>
      <li>We create this object only once, during the module's initialization.</li>
      <li>In functions that should be restricted, we add <code>&AdminCap</code> as a required parameter.</li>
    </ol>

    <p>
      Since only the admin has this "Golden Key" in their wallet, no one else can call those specific functions!
    </p>

    <h3>Put it to the test:</h3>
    <p>Let's restrict the <code>boost_speed</code> function so only the owner can use it.</p>
    <ol>
      <li>Define a new struct named <code>AdminCap</code>. It must have the <code>key</code> ability and contain an <code>id: UID</code>.</li>
      <li>Update the <code>boost_speed</code> function from Chapter 4. Add a new first parameter: <code>_cap: &AdminCap</code>. (We use the underscore <code>_</code> because we only need to prove the key exists; we don't need to read data from it).</li>
      <li>Now, to call <code>boost_speed</code>, the user MUST provide their <code>AdminCap</code> object along with the <code>Car</code>.</li>
    </ol>
  `,
  technicalSkills: [],
  initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // 1. Define AdminCap struct here
    

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

    // 2. Update this function to require AdminCap
    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`,
  expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct AdminCap has key {
        id: UID
    }

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

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check for AdminCap struct
    const hasAdminCap = code.includes('struct AdminCap has key');
    if (!hasAdminCap) {
      const structLine = lines.findIndex(l => l.includes('// 1. Define AdminCap'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 2 : 6,
        message: 'missing struct definition "struct AdminCap has key"'
      });
    }

    // Check boost_speed signature
    const hasCapParam = code.includes('_cap: &AdminCap') || code.includes('cap: &AdminCap');
    if (!hasCapParam) {
      const functionLine = lines.findIndex(l => l.includes('fun boost_speed'));
      newErrors.push({
        line: functionLine !== -1 ? functionLine + 1 : 16,
        message: 'boost_speed must take "_cap: &AdminCap" as first parameter'
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

    struct AdminCap has key {
        id: UID
    }

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

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
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
