import type { Meta, StoryObj } from '@storybook/react';
import { TimelineView } from './TimelineView';
import { sampleRows, sampleTasks } from './sampleData';

const meta: Meta<typeof TimelineView> = {
  title: 'Components/TimelineView',
  component: TimelineView,
};
export default meta;

type Story = StoryObj<typeof TimelineView>;

export const Default: Story = {
  args: {
    rows: sampleRows,
    tasks: sampleTasks,
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 1, 1),
    viewMode: 'week',
  },
};
