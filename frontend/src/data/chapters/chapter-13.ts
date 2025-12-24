import { ChapterData } from '../types';

export const events: ChapterData = {
  id: '13',
  title: "Chapter 13: Radio Signals (Events)",
  description: `
    <h2>Chapter 13: Radio Signals (Events)</h2>
    <p>
      When a transaction happens on the blockchain, your frontend (website) needs a way to know it was successful without constantly refreshing the page. In Move, we achieve this using <strong>Events</strong>.
    </p>

    <p>
      Events are lightweight notifications emitted during a transaction. They don't stay in the "active" storage of the blockchain (so they are very cheap), but they are indexed by full nodes so that apps can listen to them.
    </p>

    <p><strong>How to use Events:</strong></p>
    <ol>
      <li><strong>Define:</strong> Create a <code>struct</code> with the <code>copy</code> and <code>drop</code> abilities. (Events don't need IDs because they are not persistent objects).</li>
      <li><strong>Emit:</strong> Use the <code>sui::event::emit</code> function to broadcast the data.</li>
    </ol>

    <p>
      In this chapter, we will broadcast a signal every time a new car is created so the whole world can see our garage's progress!
    </p>

    <h3>Put it to the test:</h3>
    <p>Let's set up our garage's radio broadcast system.</p>
    <ol>
      <li>Import <code>sui::event</code>.</li>
      <li>Define a new <code>struct</code> named <code>CarCreated</code>. It should have <code>copy</code> and <code>drop</code> abilities.</li>
      <li>Add two fields to <code>CarCreated</code>:
        <ul>
          <li><code>car_id: ID</code></li>
          <li><code>owner: address</code></li>
        </ul>
      </li>
      <li>Update the <code>create_car</code> function:
        <ul>
          <li>At the end of the function, use <code>event::emit</code> to send a <code>CarCreated</code> signal containing the new car's ID and the sender's address.</li>
        </ul>
      </li>
    </ol>
  `,
  technicalSkills: [],
  initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    // 1. Import event here
    

    // 2 & 3. Define CarCreated event struct here
    

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
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
            total_cars: 0,
            registry: table::new<ID, String>(ctx)
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };

        let car_id = object::id(&new_car);
        let sender = tx_context::sender(ctx);

        table::add(&mut stats.registry, car_id, model_name);
        stats.total_cars = stats.total_cars + 1;

        // 4. Emit the CarCreated event here
        

        transfer::transfer(new_car, sender);
    }
}`,
  expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::event;

    struct CarCreated has copy, drop {
        car_id: ID,
        owner: address
    }

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
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
            total_cars: 0,
            registry: table::new<ID, String>(ctx)
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };

        let car_id = object::id(&new_car);
        let sender = tx_context::sender(ctx);

        table::add(&mut stats.registry, car_id, model_name);
        stats.total_cars = stats.total_cars + 1;

        event::emit(CarCreated {
            car_id,
            owner: sender,
        });

        transfer::transfer(new_car, sender);
    }
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check for event import
    const hasEventImport = code.includes('use sui::event');
    if (!hasEventImport) {
      const importLine = lines.findIndex(l => l.includes('// 1. Import event'));
      newErrors.push({
        line: importLine !== -1 ? importLine + 2 : 7,
        message: 'missing import "use sui::event;"'
      });
    }

    // Check for CarCreated struct
    const hasEventStruct = code.includes('struct CarCreated has copy, drop');
    if (!hasEventStruct) {
      const structLine = lines.findIndex(l => l.includes('// 2 & 3. Define CarCreated'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 2 : 10,
        message: 'missing struct "struct CarCreated has copy, drop"'
      });
    }

    // Check for event fields
    const hasFields = code.includes('car_id: ID') && code.includes('owner: address');
    if (!hasFields && hasEventStruct) {
      const structLine = lines.findIndex(l => l.includes('struct CarCreated'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 2 : 11,
        message: 'CarCreated must have "car_id: ID" and "owner: address"'
      });
    }

    // Check for event::emit
    const hasEmit = code.includes('event::emit(CarCreated');
    if (!hasEmit) {
      const funcLine = lines.findIndex(l => l.includes('fun create_car'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 15 : 55,
        message: 'must emit event using "event::emit(CarCreated { ... })"'
      });
    }

    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
  }
};
