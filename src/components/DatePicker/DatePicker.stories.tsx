import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./DatePicker";

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    weekStartsOn: { control: "select", options: [0, 1] },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  args: {
    label: "Departure date",
    size: "md",
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Pick any day in the future." },
};

export const WithError: Story = {
  args: { error: "A date is required." },
};

export const Preselected: Story = {
  args: { defaultValue: new Date() },
};

export const WeekStartsMonday: Story = {
  args: { weekStartsOn: 1, hint: "Weeks start on Monday." },
};

export const RangeLimited: Story = {
  render: (args) => {
    const today = new Date();
    const min = new Date(today);
    const max = new Date(today);
    max.setDate(max.getDate() + 14);
    return <DatePicker {...args} min={min} max={max} hint="Only the next 14 days are selectable." />;
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <DatePicker {...args} value={date} onChange={setDate} />
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          Selected: {date ? date.toDateString() : "none"}
        </p>
      </div>
    );
  },
};
