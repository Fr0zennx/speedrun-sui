import { ChapterData } from '../types';

export const initFunction: ChapterData = {
  id: '8',
  title: "Chapter 8: The Big Bang (Init Function)",
  description: `
    <h2>Chapter 8: The Big Bang (Init Function)</h2>
    <p>
      We defined the <code>AdminCap</code>, but we haven't actually created one yet! If we don't create it, no one can ever call <code>boost_speed</code>.
    </p>

    <p>
      Every Move module can have a special function called <code>init</code>. This function runs <strong>exactly once</strong> when the package is first published to the network. It's the perfect place to set up the initial state of your application.
    </p>

    <h3>The Rules of Init:</h3>
    <ul>
      <li>The function name must be <code>init</code>.</li>
      <li>It must be <code>private</code> (not public).</li>
      <li>Its last parameter must be <code>ctx: &mut TxContext</code>.</li>
    </ul>

    <h3>Your Mission:</h3>
    <ol>
      <li>Create a private <code>init</code> function.</li>
      <li>Inside it, create a new <code>AdminCap</code> object.</li>
      <li>Send this <code>AdminCap</code> to the transaction sender (you, the publisher).</li>
    </ol>
  `,
  technicalSkills: [],
  initialCode: `module sui_garage::car_factory {
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

    // 1. Create the init function here
    

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

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
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

    // Check for init function
    const hasInit = code.includes('fun init(ctx: &mut TxContext)');
    if (!hasInit) {
      const initLine = lines.findIndex(l => l.includes('// 1. Create the init'));
      newErrors.push({
        line: initLine !== -1 ? initLine + 2 : 15,
        message: 'missing "fun init(ctx: &mut TxContext)"'
      });
    }

    // Check for AdminCap creation
    const createsCap = code.includes('AdminCap {') && code.includes('id: object::new(ctx)');
    if (!createsCap) {
      const initLine = lines.findIndex(l => l.includes('fun init'));
      newErrors.push({
        line: initLine !== -1 ? initLine + 1 : 16,
        message: 'must create AdminCap inside init'
      });
    }

    // Check for transfer
    const transfersCap = code.includes('transfer::transfer(admin_cap, tx_context::sender(ctx))');
    if (!transfersCap) {
      const initLine = lines.findIndex(l => l.includes('fun init'));
      newErrors.push({
        line: initLine !== -1 ? initLine + 4 : 19,
        message: 'must transfer the AdminCap to the sender'
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

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
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
