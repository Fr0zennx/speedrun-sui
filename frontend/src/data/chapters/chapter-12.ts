import { ChapterData } from '../types';

export const tableStructure: ChapterData = {
  id: '12',
  title: "Chapter 12: The Fleet Manager (Table Structure)",
  description: `
    <h2>Chapter 12: The Fleet Manager (Table Structure)</h2>
    <p>
      As your garage expands, you need a way to organize your fleet. If you store 10,000 car IDs in a simple list (<code>vector</code>), every time you want to find a car, the network has to scan the whole list. This is slow and expensive!
    </p>

    <p>
      Sui provides the <code>sui::table</code> module for high-performance data storage. A <strong>Table</strong> works like a dictionary: you give it a unique Key (like a Car ID) and it quickly gives you the Value (like the Owner's address).
    </p>

    <p><strong>Key Features of Table:</strong></p>
    <ul>
      <li><strong>Fixed Cost:</strong> Accessing the 1st or the 1,000,000th item costs the same amount of gas.</li>
      <li><strong>Storage:</strong> The data is stored "outside" the main object, keeping your parent object "light."</li>
      <li><strong>Strict Typing:</strong> You must define what type the Key and the Value will be when you create the table.</li>
    </ul>

    <p>
      In this chapter, we will add a global "Fleet Registry" to our <code>GarageStats</code> to map every Car ID to its model name.
    </p>

    <h3>Put it to the test:</h3>
    <p>Let's integrate a high-performance registry into our garage.</p>
    <ol>
      <li>Import <code>sui::table::{Self, Table}</code>.</li>
      <li>Update the <code>GarageStats</code> struct:
        <ul>
          <li>Add a new field: <code>registry: Table&lt;ID, String&gt;</code>. (Note: You need to import <code>sui::object::ID</code>).</li>
        </ul>
      </li>
      <li>Update the <code>init</code> function:
        <ul>
          <li>When creating <code>GarageStats</code>, initialize the table using <code>table::new&lt;ID, String&gt;(ctx)</code>.</li>
        </ul>
      </li>
      <li>Update the <code>create_car</code> function:
        <ul>
          <li>After creating a new car, add it to the registry: <code>table::add(&mut stats.registry, object::id(&new_car), model_name)</code>.</li>
        </ul>
      </li>
    </ol>
  `,
  technicalSkills: [],
  initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID}; // Added ID
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    // 1. Import Table here
    

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        // 2. Add registry field here
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        // 3. Initialize the table inside GarageStats
        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0,
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };

        // 4. Add the car to the registry table here
        
        stats.total_cars = stats.total_cars + 1;
        transfer::transfer(new_car, tx_context::sender(ctx));
    }
}`,
  expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};

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

        table::add(&mut stats.registry, object::id(&new_car), model_name);
        
        stats.total_cars = stats.total_cars + 1;
        transfer::transfer(new_car, tx_context::sender(ctx));
    }
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check for Table import
    const hasTableImport = code.includes('use sui::table::{Self, Table}') || code.includes('use sui::table::{Table, Self}');
    if (!hasTableImport) {
      const importLine = lines.findIndex(l => l.includes('// 1. Import Table'));
      newErrors.push({
        line: importLine !== -1 ? importLine + 2 : 6,
        message: 'missing import "use sui::table::{Self, Table};"'
      });
    }

    // Check for registry field
    const hasRegistryField = code.includes('registry: Table<ID, String>');
    if (!hasRegistryField) {
      const structLine = lines.findIndex(l => l.includes('struct GarageStats'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 4 : 15,
        message: 'GarageStats must have "registry: Table<ID, String>"'
      });
    }

    // Check for table initialization
    const hasTableInit = code.includes('registry: table::new<ID, String>(ctx)');
    if (!hasTableInit) {
      const initLine = lines.findIndex(l => l.includes('fun init'));
      newErrors.push({
        line: initLine !== -1 ? initLine + 6 : 30,
        message: 'must initialize table with "table::new<ID, String>(ctx)"'
      });
    }

    // Check for table::add
    const hasTableAdd = code.includes('table::add(&mut stats.registry, object::id(&new_car), model_name)');
    if (!hasTableAdd) {
      const funcLine = lines.findIndex(l => l.includes('fun create_car'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 8 : 45,
        message: 'must add car to registry using "table::add"'
      });
    }

    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
  }
};
