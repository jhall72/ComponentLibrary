import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
    onChange: { action: "changed" },
  },
  args: {
    label: "Accept terms and conditions",
    size: "md",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: "Select all" },
};

export const WithHint: Story = {
  args: { hint: "You can change this later in settings." },
};

export const WithError: Story = {
  args: { error: "You must accept to continue." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Checkbox {...args} size="sm" label="Small" defaultChecked />
      <Checkbox {...args} size="md" label="Medium" defaultChecked />
    </div>
  ),
};
