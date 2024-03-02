import type { Environment } from 'vitest';

export default (<Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  setup() {
    // custom setup
    console.log('SETUP');
    return {
      teardown() {
        // called after all tests with this env have been run
        console.log('TEARDOWN');
      },
    };
  },
});
