import { ChapterData } from '../types';

export const structsAndAbilities: ChapterData = {
  id: '2',
  title: "Chapter 2: The Blueprint of a Machine (Structs & Abilities)",
  description: `
    <h2>Chapter 2: The Blueprint of a Machine (Structs & Abilities)</h2>
    <p>
      Now that we have our workshop (module), we need a blueprint for our cars. In Move, we define data structures using the <code>struct</code> keyword.
    </p>

    <p>
      However, a car in the Sui ecosystem isn't just a piece of data; it's a <strong>Sui Object</strong>. For a struct to become a Sui Object, it must possess certain "powers" called <strong>Abilities</strong>.
    </p>

    <p>There are 4 types of abilities in Move:</p>
    <ul>
      <li><strong><code>key</code></strong>: Allows the struct to be an object with a unique ID and be stored in the global storage.</li>
      <li><strong><code>store</code></strong>: Allows the struct to be stored inside other objects (like an engine inside a car).</li>
      <li><strong><code>copy</code></strong>: Allows the struct to be duplicated. (We won't use this for cars; every car should be unique!)</li>
      <li><strong><code>drop</code></strong>: Allows the struct to be discarded or destroyed at the end of a transaction.</li>
    </ul>

    <p>
      To make our car a true Sui asset, it <strong>must</strong> have the <code>key</code> ability and its first field <strong>must</strong> be a unique identifier (<code>id</code>) of type <code>UID</code>.
    </p>

    <h3>Put it to the test:</h3>
    <p>Let's define our <code>Car</code> blueprint.</p>
    <ol>
      <li>First, we need the identity tool. Import <code>UID</code> from the <code>sui::object</code> library.</li>
      <li>Create a <code>struct</code> named <code>Car</code>.</li>
      <li>Give it the <code>key</code> and <code>store</code> abilities (using the <code>has</code> keyword).</li>
      <li>Add these three fields inside the struct:
        <ul>
          <li><code>id</code>: Should be of type <code>UID</code>.</li>
          <li><code>model</code>: Should be of type <code>String</code>.</li>
          <li><code>speed</code>: Should be of type <code>u64</code> (Move's standard 64-bit integer).</li>
        </ul>
      </li>
    </ol>
  `,
  technicalSkills: [],
  initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    // 1. Import UID here
    
    // 2. Define your Car struct below
    
}`,
  expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{UID};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check if UID is imported
    const hasUIDImport = code.includes('use sui::object::{UID}') || code.includes('use sui::object::UID');
    if (!hasUIDImport) {
      const importLine = lines.findIndex(l => l.includes('// 1. Import UID here') || l.includes('use std::string'));
      newErrors.push({
        line: importLine !== -1 ? importLine + 2 : 3,
        message: 'missing import statement "use sui::object::{UID};"'
      });
    }

    // Check if Car struct exists
    const hasCarStruct = code.includes('struct Car');
    if (!hasCarStruct) {
      const structLine = lines.findIndex(l => l.includes('// 2. Define your Car struct'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 2 : 5,
        message: 'missing struct definition "struct Car"'
      });
    }

    // Check if struct has key ability
    const hasKeyAbility = code.includes('has key');
    if (!hasKeyAbility && hasCarStruct) {
      const structLine = lines.findIndex(l => l.includes('struct Car'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 1 : 5,
        message: 'Car struct must have "key" ability'
      });
    }

    // Check if struct has store ability
    const hasStoreAbility = code.includes('has key, store') || code.includes('has store, key');
    if (!hasStoreAbility && hasCarStruct) {
      const structLine = lines.findIndex(l => l.includes('struct Car'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 1 : 5,
        message: 'Car struct must have "store" ability'
      });
    }

    // Check for id field
    const hasIdField = code.includes('id: UID');
    if (!hasIdField && hasCarStruct) {
      const structLine = lines.findIndex(l => l.includes('struct Car'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 2 : 6,
        message: 'Car struct must have field "id: UID"'
      });
    }

    // Check for model field
    const hasModelField = code.includes('model: String');
    if (!hasModelField && hasCarStruct) {
      const structLine = lines.findIndex(l => l.includes('struct Car'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 3 : 7,
        message: 'Car struct must have field "model: String"'
      });
    }

    // Check for speed field
    const hasSpeedField = code.includes('speed: u64');
    if (!hasSpeedField && hasCarStruct) {
      const structLine = lines.findIndex(l => l.includes('struct Car'));
      newErrors.push({
        line: structLine !== -1 ? structLine + 4 : 8,
        message: 'Car struct must have field "speed: u64"'
      });
    }

    // Normalize whitespace for final comparison
    const normalizeCode = (str: string) =>
      str.replace(/\/\/.*$/gm, '') // Remove comments
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

    const userCode = normalizeCode(code);
    const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{UID};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
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
