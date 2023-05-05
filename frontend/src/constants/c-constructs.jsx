// detecting modular programming
// function_regex = re.compile(r'^\w+\s+\w+\s*\([^)]*\)\s*{')
// header_regex = re.compile(r'^\s*#include\s+<.*\.h>')
// eslint-disable-next-line no-unused-vars
const reservedC = [
  { value: 'int', category: 'data types' },
  { value: 'float', category: 'data types' },
  { value: 'char', category: 'data types' },
  { value: 'void', category: 'data types' },
  { value: 'double', category: 'data types' },
  { value: 'if', category: 'control flow' },
  { value: 'else', category: 'control flow' },
  { value: 'while', category: 'control flow' },
  { value: 'for', category: 'control flow' },
  { value: 'switch', category: 'control flow' },
  { value: 'case', category: 'control flow' },
  { value: 'break', category: 'control flow' },
  { value: 'continue', category: 'control flow' },
  { value: 'goto', category: 'control flow' },
  { value: 'return', category: 'functions' },
  { value: 'static', category: 'storage classes' },
  { value: 'extern', category: 'storage classes' },
  { value: 'register', category: 'storage classes' },
  { value: 'typedef', category: 'user-defined types' },
  { value: 'enum', category: 'user-defined types' },
  { value: 'struct', category: 'user-defined types' },
  { value: 'union', category: 'user-defined types' },
  { value: 'const', category: 'others' },
  { value: 'sizeof', category: 'others' },
  { value: 'volatile', category: 'others' }];

export default reservedC;
