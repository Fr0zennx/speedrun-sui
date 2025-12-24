import { ChapterData } from '../types';

export const suiGarage: ChapterData = {
  id: '1',
  title: "Chapter 1: Building the Chassis (Modules & Move Basics)",
  description: `
    <h2>Chapter 1: Building the Chassis (Modules & Move Basics)</h2>
    <p>
      Welcome, Mechanic! You are about to embark on a journey to build the most advanced automotive empire on the Sui blockchain. In this garage, we don't just build cars; we create digital assets that you truly own.
    </p>

    <p>
      Before we add the engine or the nitro, we need a place to work. In the Move language, code is organized into <strong>Modules</strong>. Think of a module as your specialized workshop. It’s a container that holds your data structures (cars, parts) and the functions (tuning, painting) that interact with them.
    </p>

    <p>
      Unlike other blockchains, Sui is <strong>object-centric</strong>. This means everything you build here—from a rusty old sedan to a supersonic race car—is an "Object" that lives in a user's wallet, not just a line in a ledger.
    </p>

    <h3>Key Concepts for this Chapter:</h3>
    <ul>
      <li><strong>The Module:</strong> Defined using the <code>module</code> keyword followed by <code>address::name</code>.</li>
      <li><strong>The Package:</strong> A collection of modules. The module name must match your package name in your Move.toml file.</li>
      <li><strong>Imports (use):</strong> Just like bringing tools into your workshop, we use the <code>use</code> keyword to bring in standard libraries (like <code>string</code> for our car names).</li>
    </ul>

    <h3>Put it to the test:</h3>
    <p>Let’s set up our first workshop.</p>
    <ol>
      <li>Create a module named <code>car_factory</code> inside the address <code>sui_garage</code>.</li>
      <li>Inside the module, import the String library from the standard Move library so we can name our cars later. Use: <code>use std::string::{String};</code></li>
    </ol>
  `,
  technicalSkills: [],
  initialCode: `// Start your engine here!
module sui_garage::car_factory {
    
    // Your code here

}`,
  expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
}`,
  validate: (code: string) => {
    const lines = code.split('\n');
    const newErrors: Array<{ line: number, message: string }> = [];

    // Check if module declaration exists
    const hasModule = code.includes('module sui_garage::car_factory');
    if (!hasModule) {
      const moduleLine = lines.findIndex(l => l.trim().startsWith('module'));
      newErrors.push({
        line: moduleLine !== -1 ? moduleLine + 1 : 2,
        message: 'module name should be "sui_garage::car_factory"'
      });
    }

    // Check if use statement exists
    const hasUse = code.includes('use std::string::{String}');
    if (!hasUse) {
      const useLine = lines.findIndex(l => l.includes('use') || l.includes('// Your code here'));
      const lineNum = useLine !== -1 ? useLine + 1 : 4;
      newErrors.push({
        line: lineNum,
        message: 'missing import statement "use std::string::{String};"'
      });
    }

    // Normalize whitespace for comparison
    const normalizeCode = (str: string) =>
      str.replace(/\/\/.*$/gm, '') // Remove comments
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

    const userCode = normalizeCode(code);
    const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
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
