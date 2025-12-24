import { ChapterData } from '../types';

export const composability: ChapterData = {
  id: '15',
  title: "Chapter 15: The Grand Finale (Composability & PTB)",
  description: `
    <h2>Chapter 15: The Grand Finale (Composability & PTB)</h2>
    <p>
      Congratulations! You’ve built a complete garage system. But there is one final secret to Sui's power: <strong>Programmable Transaction Blocks (PTB)</strong>.
    </p>

    <p>
      In other blockchains, if you want to buy a car, tune it, and then send it to a friend, you might need 3 separate transactions. In Sui, you can do all of this in <strong>one single block</strong>. To make your module "PTB-friendly," your functions should be composable.
    </p>

    <p><strong>What is Composability?</strong><br>
    Instead of having a function that always transfers the object to the sender (using <code>transfer::transfer</code>), we create a function that <strong>returns</strong> the object. This allows another function in the same transaction block to take that car and do something else with it immediately.
    </p>

    <p>
      In this final lesson, we will create a "Professional Assembly" function. Instead of delivering the car to a wallet, it will return the <code>Car</code> object to the caller.
    </p>

    <h3>Put it to the test:</h3>
    <p>Let's make our car factory modular.</p>
    <ol>
      <li>Create a <code>public</code> function (not <code>entry</code>) named <code>build_car</code>.
        <ul>
          <li><em>Note:</em> <code>entry</code> functions cannot return values to other Move functions, but <code>public</code> functions can!</li>
        </ul>
      </li>
      <li>The function should take the same parameters as before: <code>stats: &mut GarageStats</code>, <code>model_name: String</code>, and <code>ctx: &mut TxContext</code>.</li>
      <li>Inside the function:
        <ul>
          <li>Increment the <code>stats.total_cars</code>.</li>
          <li>Create the <code>Car</code> object (don't forget the <code>trunk</code>).</li>
          <li><strong>Crucial Step:</strong> Do NOT use <code>transfer::transfer</code>. Instead, simply return the <code>new_car</code> at the end of the function.</li>
        </ul>
      </li>
      <li>Specify the return type in the function signature: <code>public fun build_car(...): Car</code>.</li>
    </ol>
  `,
  technicalSkills: [],
  initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::bag::{Self, Bag};

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64,
        trunk: Bag
    }

    fun init(ctx: &mut TxContext) {
        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0,
            registry: table::new<ID, String>(ctx)
        });
    }

    // 1. Create the composable build_car function
    public fun build_car(
        stats: &mut GarageStats, 
        model_name: String, 
        ctx: &mut TxContext
    ): Car { // Returns a Car object
        
        // 2. Logic here (increment stats, create car)
        
        // 3. Return the car
        
    }
}`,
  expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::bag::{Self, Bag};

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64,
        trunk: Bag
    }

    fun init(ctx: &mut TxContext) {
        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0,
            registry: table::new<ID, String>(ctx)
        });
    }

    public fun build_car(
        stats: &mut GarageStats, 
        model_name: String, 
        ctx: &mut TxContext
    ): Car {
        stats.total_cars = stats.total_cars + 1;

        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100,
            trunk: bag::new(ctx)
        };

        new_car
    }
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check for public fun build_car
    const hasFunction = code.includes('public fun build_car');
    if (!hasFunction) {
      const funcLine = lines.findIndex(l => l.includes('// 1. Create the composable'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 1 : 30,
        message: 'missing function "public fun build_car"'
      });
    }

    // Check return type
    const hasReturnType = /:\s*Car/.test(code);
    if (!hasReturnType) {
       const funcLine = lines.findIndex(l => l.includes('public fun build_car'));
       newErrors.push({
        line: funcLine !== -1 ? funcLine : 30,
        message: 'function must return a Car object (": Car")'
       });
    }

    // Check stats increment
    const hasIncrement = code.includes('stats.total_cars = stats.total_cars + 1');
    if (!hasIncrement) {
       const logicLine = lines.findIndex(l => l.includes('// 2. Logic here'));
       newErrors.push({
        line: logicLine !== -1 ? logicLine + 1 : 35,
        message: 'must increment stats.total_cars'
       });
    }

    // Check car creation with trunk
    const hasCarCreation = code.includes('Car {') && code.includes('trunk: bag::new(ctx)');
    if (!hasCarCreation) {
       const logicLine = lines.findIndex(l => l.includes('// 2. Logic here'));
       newErrors.push({
        line: logicLine !== -1 ? logicLine + 2 : 37,
        message: 'must create Car with trunk initialized'
       });
    }

    // Check that transfer is NOT used
    if (code.includes('transfer::transfer(new_car')) {
        const transferLine = lines.findIndex(l => l.includes('transfer::transfer(new_car'));
        newErrors.push({
            line: transferLine + 1,
            message: 'Do NOT transfer the car. Return it instead.'
        });
    }

    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
  }
};
