export function removeExampleShowcase(source: string): string {
  let result = source;

  // 1. Remove sourceFiles property (including multiline arrays and objects)
  result = removeClassProperty(result, 'sourceFiles');

  // 2. Remove ExampleShowcaseComponent and ExampleSourceFile from imports
  result = result.replace(
    /import\s*\{([\s\S]*?)\}\s*from\s*(['"])([^'"]+)\2\s*;?/g,
    (statement, imports: string, quote: string, path: string) => {
      const remaining = imports
        .split(',')
        .map((item: string) => item.trim())
        .filter(
          (item: string) =>
            item &&
            !/^ExampleShowcaseComponent(?:\s+as\s+\w+)?$/.test(item) &&
            !/^ExampleSourceFile(?:\s+as\s+\w+)?$/.test(item),
        );

      // Remove the entire import if it only contained showcase symbols
      if (remaining.length === 0) {
        return '';
      }

      return `import {\n  ${remaining.join(',\n  ')}\n} from ${quote}${path}${quote};`;
    },
  );

  // 3. Remove standalone imports
  result = result.replace(
    /import\s+(?:ExampleShowcaseComponent|ExampleSourceFile)\s+from\s*(['"])[^'"]+\1\s*;?/g,
    '',
  );

  // 4. Remove empty lines left by cleanup
  result = result.replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, '\n\n');

  return result.trim() + '\n';
}

function removeClassProperty(source: string, propertyName: string): string {
  const pattern = new RegExp(
    `^[\\t ]*(?:(?:public|private|protected|readonly|static|declare)\\s+)*${propertyName}\\s*(?:\\??|!)?\\s*(?::[^=;\\n]+)?\\s*=\\s*`,
    'gm',
  );

  let match: RegExpExecArray | null;
  let result = source;

  while ((match = pattern.exec(result)) !== null) {
    const start = match.index;
    let position = match.index + match[0].length;

    // Find the end of the property while respecting nested brackets,
    // strings, template literals and comments.
    const stack: string[] = [];
    let quote = '';
    let escaped = false;
    let lineComment = false;
    let blockComment = false;

    for (; position < result.length; position++) {
      const char = result[position];
      const next = result[position + 1];

      if (lineComment) {
        if (char === '\n') lineComment = false;
        continue;
      }

      if (blockComment) {
        if (char === '*' && next === '/') {
          blockComment = false;
          position++;
        }
        continue;
      }

      if (quote) {
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === quote) {
          quote = '';
        }
        continue;
      }

      if (char === '/' && next === '/') {
        lineComment = true;
        position++;
        continue;
      }

      if (char === '/' && next === '*') {
        blockComment = true;
        position++;
        continue;
      }

      if (char === '"' || char === "'" || char === '`') {
        quote = char;
        continue;
      }

      if (char === '[' || char === '{' || char === '(') {
        stack.push(char);
        continue;
      }

      if (char === ']' || char === '}' || char === ')') {
        if (stack.length) {
          stack.pop();

          if (stack.length === 0) {
            position++;
            break;
          }
        }
        continue;
      }

      if (char === ';' && stack.length === 0) {
        position++;
        break;
      }

      if (char === '\n' && stack.length === 0) {
        break;
      }
    }

    // Include trailing semicolon and whitespace
    while (position < result.length && /[ \t;]/.test(result[position])) {
      position++;
    }

    if (result[position] === '\r') position++;
    if (result[position] === '\n') position++;

    result = result.slice(0, start) + result.slice(position);

    pattern.lastIndex = start;
  }

  return result;
}



/*--------------------------------------------------*/
/*----------------------HTML------------------------*/
/*--------------------------------------------------*/

export function unwrapExampleShowcaseTag(source: string): string {
  const tagName = 'app-example-showcase';

  const tagPattern = new RegExp(
    `<\\/?${tagName}\\b[^>]*>`,
    'gi',
  );

  let result = source;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(result)) !== null) {
    // Closing tag: remove only the tag itself
    if (match[0].startsWith('</')) {
      result =
        result.slice(0, match.index) +
        result.slice(match.index + match[0].length);

      tagPattern.lastIndex = match.index;
      continue;
    }

    // Opening tag: remove only the tag itself
    result =
      result.slice(0, match.index) +
      result.slice(match.index + match[0].length);

    tagPattern.lastIndex = match.index;
  }

  return result;
}
