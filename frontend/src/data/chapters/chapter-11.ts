import { ChapterData } from '../types';

export const assertionsAndExistence: ChapterData = {
  id: '11',
  title: "Chapter 11: Checking the Specs (Assertions & Existence)",
  description: `
    <h2>Chapter 11: Checking the Specs (Assertions & Existence)</h2>
    <p>
      A professional mechanic always checks the car before starting a job. In Move, we use <strong>Assertions</strong> to ensure our logic stays safe and doesn't crash the transaction unexpectedly.
    </p>

    <p>
      In the previous chapter, we added a paint color. But what if the car is already painted? If you try to <code>df::add</code> a field that already exists with the same name, the transaction will fail. To prevent this, we need to check if the field exists first.
    </p>

    <p><strong>Key Tools:</strong></p>
    <ul>
      <li><strong><code>df::exists_</code></strong>: Returns <code>true</code> if a dynamic field with that name exists on the object.</li>
      <li><strong><code>assert!</code></strong>: A macro that checks a condition. If the condition is <code>false</code>, it stops the transaction and returns a specific <strong>Error Code</strong>.</li>
    </ul>

    <p>
      Error codes are usually defined as constants (e.g., <code>const EFieldAlreadyExists: u64 = 0;</code>).
    </p>

    <h3>Put it to the test:</h3>
    <p>Let's upgrade our <code>add_paint</code> function to be "smart."</p>
    <ol>
      <li>Define a constant named <code>EPaintAlreadyExists</code> with the value <code>1</code>.</li>
      <li>Update the <code>add_paint</code> function:
        <ul>
          <li>Before adding the paint, use <code>df::exists_(&car.id, b"paint_color")</code> to check if the car is already painted.</li>
          <li>Use <code>assert!</code> to ensure the field <strong>does NOT</strong> exist. If it does, throw the <code>EPaintAlreadyExists</code> error.</li>
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
    use sui::dynamic_field as df;

    // 1. Define your constant error code here
    

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

    public entry fun add_paint(car: &mut Car, color: String) {
        // 2. Add your existence check and assert! here
        
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
  expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;

    const EPaintAlreadyExists: u64 = 1;

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

    public entry fun add_paint(car: &mut Car, color: String) {
        let already_painted = df::exists_(&car.id, b"paint_color");
        assert!(!already_painted, EPaintAlreadyExists);
        
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check for constant definition
    const hasConst = code.includes('const EPaintAlreadyExists: u64 = 1');
    if (!hasConst) {
      const constLine = lines.findIndex(l => l.includes('// 1. Define your constant'));
      newErrors.push({
        line: constLine !== -1 ? constLine + 2 : 8,
        message: 'missing constant "const EPaintAlreadyExists: u64 = 1;"'
      });
    }

    // Check for df::exists_
    const hasExists = code.includes('df::exists_(&car.id, b"paint_color")');
    if (!hasExists) {
      const funcLine = lines.findIndex(l => l.includes('fun add_paint'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 2 : 25,
        message: 'must check existence with "df::exists_(&car.id, b\\"paint_color\\")"'
      });
    }

    // Check for assert!
    const hasAssert = code.includes('assert!') && code.includes('EPaintAlreadyExists');
    if (!hasAssert) {
      const funcLine = lines.findIndex(l => l.includes('fun add_paint'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 3 : 26,
        message: 'must use "assert!" with the error code'
      });
    }

    // Check logic (asserting NOT exists)
    const hasNotLogic = code.includes('!') || code.includes('== false');
    if (!hasNotLogic && hasAssert) {
      const funcLine = lines.findIndex(l => l.includes('fun add_paint'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 3 : 26,
        message: 'assert condition must check that field does NOT exist'
      });
    }

    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
  }
};
