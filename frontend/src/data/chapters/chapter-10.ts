import { ChapterData } from '../types';

export const dynamicFields: ChapterData = {
  id: '10',
  title: "Chapter 10: The Custom Paint Job (Dynamic Fields)",
  description: `
    <h2>Chapter 10: The Custom Paint Job (Dynamic Fields)</h2>
    <p>
      In standard programming, once a <code>struct</code> is defined, you cannot add new fields to it. If our <code>Car</code> doesn't have a <code>color</code> field, it's stuck without one forever... unless we use <strong>Dynamic Fields</strong>.
    </p>

    <p>
      Dynamic Fields allow you to attach "sub-objects" or extra data to an existing object. Think of it like a sticker or a physical upgrade you bolt onto your car.
    </p>

    <p><strong>Why use Dynamic Fields?</strong></p>
    <ul>
      <li><strong>Flexibility:</strong> Add features to an object after it has been created.</li>
      <li><strong>Scalability:</strong> You can add an unlimited number of fields without making the main object "heavy" or expensive to load.</li>
    </ul>

    <p>
      In this chapter, we will add a "Paint" feature. We will use the <code>sui::dynamic_field</code> module to attach a color name to our car.
    </p>

    <h3>Put it to the test:</h3>
    <p>Let's allow our mechanics to give cars a custom paint job.</p>
    <ol>
      <li>Import <code>sui::dynamic_field</code> as <code>df</code>.</li>
      <li>Create a <code>public entry</code> function named <code>add_paint</code>.</li>
      <li>The function should take two parameters:
        <ul>
          <li><code>car</code>: A mutable reference to our <code>Car</code> (<code>&mut Car</code>).</li>
          <li><code>color</code>: A <code>String</code> representing the new color.</li>
        </ul>
      </li>
      <li>Inside the function, use <code>df::add</code> to attach the paint:
        <ul>
          <li>The first argument is the parent's ID: <code>&mut car.id</code>.</li>
          <li>The second argument is the field name (a key): use a string literal like <code>b"paint_color"</code>.</li>
          <li>The third argument is the value: the <code>color</code> string.</li>
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
    // 1. Import dynamic_field here
    

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

    // 2. Write your add_paint function below
    
}`,
  expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;

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
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check for dynamic_field import
    const hasImport = code.includes('use sui::dynamic_field as df');
    if (!hasImport) {
      const importLine = lines.findIndex(l => l.includes('// 1. Import dynamic_field'));
      newErrors.push({
        line: importLine !== -1 ? importLine + 2 : 6,
        message: 'missing import "use sui::dynamic_field as df;"'
      });
    }

    // Check add_paint function
    const hasFunction = code.includes('fun add_paint');
    if (!hasFunction) {
      const funcLine = lines.findIndex(l => l.includes('// 2. Write your add_paint'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 2 : 25,
        message: 'missing function "add_paint"'
      });
    }

    // Check parameters
    const hasParams = code.includes('car: &mut Car') && code.includes('color: String');
    if (!hasParams && hasFunction) {
      const funcLine = lines.findIndex(l => l.includes('fun add_paint'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 1 : 25,
        message: 'function must take "car: &mut Car" and "color: String"'
      });
    }

    // Check df::add usage
    const hasAdd = code.includes('df::add');
    if (!hasAdd && hasFunction) {
      const funcLine = lines.findIndex(l => l.includes('fun add_paint'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 2 : 26,
        message: 'must use "df::add" to attach the field'
      });
    }

    // Check arguments
    const hasArgs = code.includes('&mut car.id') && code.includes('b"paint_color"') && code.includes('color');
    if (!hasArgs && hasFunction) {
      const funcLine = lines.findIndex(l => l.includes('fun add_paint'));
      newErrors.push({
        line: funcLine !== -1 ? funcLine + 2 : 26,
        message: 'check arguments: &mut car.id, b"paint_color", color'
      });
    }

    return {
      isValid: newErrors.length === 0,
      errors: newErrors
    };
  }
};
