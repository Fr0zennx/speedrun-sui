import { ChapterData } from '../types';

export const bag: ChapterData = {
  id: '14',
  title: "Chapter 14: The Garage Bag (Heterogeneous Collections)",
  description: `
    <h2>Chapter 14: The Garage Bag (Heterogeneous Collections)</h2>
    <p>
      Imagine you want to store "Maintenance Equipment" for your cars. Some cars might have a <code>SpareTire</code> object, others a <code>ToolBox</code> object, and some might just have a simple <code>u64</code> representing a serial number.
    </p>

    <p>
      If you used a <code>Table</code>, you would be stuck with one type of value. But Sui offers the <code>sui::bag</code> module for these situations. A <strong>Bag</strong> is like a physical duffel bag: you can throw anything that has the <code>store</code> ability inside it, regardless of its type.
    </p>

    <p><strong>Bag vs. Table:</strong></p>
    <ul>
      <li><strong>Table:</strong> Homogeneous (All values must be the same type, e.g., all <code>u64</code>). Fast and efficient for large lists of the same thing.</li>
      <li><strong>Bag:</strong> Heterogeneous (Values can be different types, e.g., a <code>u64</code>, a <code>String</code>, and a <code>SparePart</code> struct can all live in the same Bag).</li>
    </ul>

    <p>
      In this chapter, we will add a "Trunk" (Bagaj) to our <code>Car</code> struct so owners can store various accessories inside their cars.
    </p>

    <h3>Put it to the test:</h3>
    <p>Let's give our cars a flexible storage space.</p>
    <ol>
      <li>Import <code>sui::bag::{Self, Bag}</code>.</li>
      <li>Update the <code>Car</code> struct:
        <ul>
          <li>Add a new field: <code>trunk: Bag</code>.</li>
        </ul>
      </li>
      <li>Update the <code>create_car</code> function:
        <ul>
          <li>When creating the <code>Car</code>, initialize the <code>trunk</code> using <code>bag::new(ctx)</code>.</li>
        </ul>
      </li>
      <li>Since <code>Bag</code> does not have the <code>drop</code> ability (it might contain important objects!), we need to update our <code>scrap_car</code> function from Chapter 6.
        <ul>
          <li>Before deleting the car's ID, you must destroy the bag using <code>bag::destroy_empty(trunk)</code>. (Note: For this lesson, we assume the trunk is empty before scrapping).</li>
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
    // 1. Import Bag here
    

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64,
        // 2. Add trunk field here
    }

    fun init(ctx: &mut TxContext) {
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
            speed: 100,
            // 3. Initialize trunk here
        };

        let car_id = object::id(&new_car);
        let sender = tx_context::sender(ctx);

        table::add(&mut stats.registry, car_id, model_name);
        stats.total_cars = stats.total_cars + 1;

        transfer::transfer(new_car, sender);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _, trunk } = car;
        
        // 4. Destroy the empty bag here before deleting ID
        
        object::delete(id);
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

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100,
            trunk: bag::new(ctx)
        };

        let car_id = object::id(&new_car);
        let sender = tx_context::sender(ctx);

        table::add(&mut stats.registry, car_id, model_name);
        stats.total_cars = stats.total_cars + 1;

        transfer::transfer(new_car, sender);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _, trunk } = car;
        
        bag::destroy_empty(trunk);
        object::delete(id);
    }
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check for bag import
    const hasBagImport = code.includes('use sui::bag');
    if (!hasBagImport) {
      const importLine = lines.findIndex(l => l.includes('// 1. Import Bag'));
      newErrors.push({
        line: importLine !== -1 ? importLine + 2 : 7,
        message: 'missing import "use sui::bag::{Self, Bag};"'
      });
    }

    // Check for trunk field
    const hasTrunkField = code.includes('trunk: Bag');
    if (!hasTrunkField) {
      const structLine = lines.findIndex(l => l.includes('// 2. Add trunk field'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 1 : 18,
        message: 'Car struct must have "trunk: Bag"'
      });
    }

    // Check for trunk initialization
    const hasTrunkInit = code.includes('trunk: bag::new(ctx)');
    if (!hasTrunkInit) {
      const initLine = lines.findIndex(l => l.includes('// 3. Initialize trunk'));
      newErrors.push({
        line: initLine !== -1 ? initLine + 1 : 33,
        message: 'must initialize trunk with "trunk: bag::new(ctx)"'
      });
    }

    // Check for bag destruction
    const hasBagDestroy = code.includes('bag::destroy_empty(trunk)');
    if (!hasBagDestroy) {
      const destroyLine = lines.findIndex(l => l.includes('// 4. Destroy the empty bag'));
      newErrors.push({
        line: destroyLine !== -1 ? destroyLine + 2 : 50,
        message: 'must destroy bag with "bag::destroy_empty(trunk)"'
      });
    }

    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
  }
};
