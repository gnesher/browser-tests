import type { Meta, StoryObj } from "@storybook/react";
import { expect, fireEvent, within, fn, userEvent } from "@storybook/test";
import { MultiSelect, SelectOption } from "@redislabsdev/redis-ui-components";
import { ShardIcon } from "@redislabsdev/redis-ui-icons";

const options: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "orange", label: "Orange" },
  {
    value: "grape",
    label: "Grape",
    icon: ShardIcon,
  },
];

const meta: Meta<typeof MultiSelect> = {
  component: MultiSelect,
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const ShouldBeRendered: Story = {
  args: {
    options: options,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Should be rendered
    await expect(canvas.getByRole("combobox")).toBeInTheDocument();
  },
};

export const VirtualRender: Story = {
  args: {
    options: options,
    virtualized: false,
    defaultValue: ["apple"],
    onOpenChange: fn(),
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Apple")).toBeInTheDocument();

    const button = canvas.getByRole("combobox");
    fireEvent.pointerDown(button);

    await expect(args.onOpenChange).toHaveBeenCalled();

    // canvasElement is the component itself, not the storybook container, the list is rendered outside of it
    const content = within(document.body);
    await expect(content.getByText("Orange")).toBeInTheDocument();

    // Should trigger onChange when click on option
    fireEvent.pointerUp(content.getByText("Orange"));
    await expect(args.onChange).toHaveBeenCalled();

    // Should trigger onChange when focus on option and press space
    fireEvent.pointerDown(button);
    fireEvent.keyDown(content.getByText("Grape"), { key: " ", code: "Space" });
    await expect(args.onChange).toHaveBeenCalledWith([
      "apple",
      "orange",
      "grape",
    ]);

    //Should call onOpenChange when click outside
    fireEvent.pointerDown(button);
    fireEvent.pointerDown(document.body);
    await expect(args.onOpenChange).toHaveBeenCalled();

    //Should trigger onChange when click on reset button
    fireEvent.pointerDown(button);
    const clearButton = canvas.getByText("Clear All");
    fireEvent.click(clearButton);
    await expect(args.onChange).toHaveBeenCalledWith([]);
  },
};

export const WithSearch: Story = {
  args: {
    options: options,
    searchable: true,
    allowSelectAll: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole("combobox");
    fireEvent.pointerDown(button);

    const content = within(document.body);

    // Should render search input when searchable passed
    const input = content.getByRole("textbox");
    expect(input).toBeInTheDocument();

    const list = within(content.getByRole("presentation"));

    expect(list.queryByText("Orange")).toBeInTheDocument();
    await userEvent.type(input, "grape");
    expect(list.getByText("Grape")).toBeInTheDocument();
    expect(list.queryByText("Orange")).not.toBeInTheDocument();

    // Should render Select All when allowSelectAll passed and no selection
    fireEvent.pointerDown(button);
    // not sure why, but it required an extra press, maybe an issue with focus
    fireEvent.pointerDown(button);
    const selectAllButton = content.getByRole("button", { name: "Select All" });
    expect(selectAllButton).toBeInTheDocument();

    fireEvent.click(selectAllButton);
    expect(args.onChange).toHaveBeenCalled();

    //Should render Unselect All when allowSelectAll passed and all selected
    fireEvent.pointerDown(button);
    const unselectAllButton = content.getByRole("button", {
      name: "Unselect All",
    });
    expect(unselectAllButton).toBeInTheDocument();
    fireEvent.click(unselectAllButton);

    //Should render Select All when allowSelectAll passed and partially selected
    fireEvent.pointerUp(content.getByText("Orange"));
    expect(selectAllButton).toBeInTheDocument();

    //const selectAllButton = content.getByRole('button', { name: 'Select All' });
    expect(selectAllButton).toBeInTheDocument();
    await userEvent.type(input, "lala");
    expect(selectAllButton).toBeInTheDocument();
    expect(selectAllButton).toBeDisabled();

    //Should call Select All when pressing ctrl+a
    fireEvent.pointerDown(button);
    fireEvent.pointerDown(button);
    fireEvent.keyDown(content.getByRole("listbox"), {
      code: "KeyA",
      ctrlKey: true,
      metaKey: true,
    });
    expect(args.onChange).toHaveBeenCalledWith(["apple", "orange", "grape"]);

    fireEvent.keyDown(content.getByRole("listbox"), {
      code: "KeyA",
      ctrlKey: true,
      metaKey: true,
    });
    expect(args.onChange).toHaveBeenCalledWith([]);
  },
};
