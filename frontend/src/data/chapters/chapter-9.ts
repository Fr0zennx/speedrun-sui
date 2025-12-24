import { ChapterData } from '../types';

export const sharedObjects: ChapterData = {
  id: '9',
  title: "Chapter 9: The Global Dashboard (Shared Objects)",
  description: `
    <h2>Chapter 9: The Global Dashboard (Shared Objects)</h2>
    <p>
      Until now, every object we created (Cars, AdminCap) was an <strong>Owned Object</strong>. Only the owner could see or modify them. But what if we want a "Global Counter" that tracks how many cars have been built in total?
    </p>

    <p>
      In Sui, we can make an object accessible to everyone by making it a <strong>Shared Object</strong>.
    </p>

    <p><strong>Owned vs. Shared:</strong></p>
    <ul>
      <li><strong>Owned:</strong> Only the owner can use it in a transaction. (Your car in your wallet).</li>
      <li><strong>Shared:</strong> Anyone can use it in a transaction. (A public vending machine or a global counter).</li>
    </ul>

    <p>
      To share an object, we use <code>transfer::share_object(obj)</code>. Once an object is shared, it stays shared forever; it cannot be "un-shared" or moved into a private wallet.
    </p>

    <h3>Put it to the test:</h3>
    <p>Let's create a <code>GarageStats</code> object that counts every car produced.</p>
    <ol>
      <li>Create a new <code>struct</code> named <code>GarageStats</code>. It must have the <code>key</code> ability and contain <code>id: UID</code> and <code>total_cars: u64</code>.</li>
      <li>In the <code>init</code> function, create an instance of <code>GarageStats</code> with <code>total_cars</code> set to <code>0</code>.</li>
      <li>Use <code>transfer::share_object</code> to make this <code>GarageStats</code> object public to the entire network.</li>
      <li>Update the <code>create_car</code> function:
        <ul>
          <li>Add a new parameter: <code>stats: &mut GarageStats</code>.</li>
          <li>Inside the function, increment <code>stats.total_cars</code> by 1 (<code>stats.total_cars = stats.total_cars + 1</code>).</li>
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

    struct AdminCap has key {
        id: UID
    }

    // 1. Define GarageStats struct here
    

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        // 2 & 3. Initialize and share GarageStats here
        
    }

    // 4. Update create_car to accept GarageStats
    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
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

    struct GarageStats has key {
        id: UID,
        total_cars: u64
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        stats.total_cars = stats.total_cars + 1;
        
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

    // Check for GarageStats struct
    const hasGarageStats = code.includes('struct GarageStats has key');
    if (!hasGarageStats) {
      const structLine = lines.findIndex(l => l.includes('// 1. Define GarageStats'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 2 : 10,
        message: 'missing struct definition "struct GarageStats has key"'
      });
    }

    // Check for total_cars field
    const hasTotalCars = code.includes('total_cars: u64');
    if (!hasTotalCars && hasGarageStats) {
       const structLine = lines.findIndex(l => l.includes('struct GarageStats'));
       newErrors.push({
        line: structLine !== -1 ? structLine + 2 : 12,
        message: 'GarageStats must have "total_cars: u64"'
      });
    }

    // Check for share_object in init
    const hasShareObject = code.includes('transfer::share_object');
    if (!hasShareObject) {
      const initLine = lines.findIndex(l => l.includes('fun init'));
      newErrors.push({
        line: initLine !== -1 ? initLine + 4 : 25,
        message: 'must use "transfer::share_object" in init'
      });
    }

    // Check create_car signature
    const hasStatsParam = code.includes('stats: &mut GarageStats');
    if (!hasStatsParam) {
      const funcLine = lines.findIndex(l => l.includes('fun create_car'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 1 : 35,
        message: 'create_car must take "stats: &mut GarageStats"'
      });
    }

    // Check increment
    const hasIncrement = code.includes('stats.total_cars = stats.total_cars + 1') || code.includes('stats.total_cars += 1');
    if (!hasIncrement) {
      const funcLine = lines.findIndex(l => l.includes('fun create_car'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 2 : 36,
        message: 'must increment stats.total_cars'
      });
    }

    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
  }
};
