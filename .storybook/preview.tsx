import type { Preview} from '@storybook/react'
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story ) => (
      <div className="p-4 bg-gray-100 min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default preview;
