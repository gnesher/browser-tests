import { fireEvent, screen, within } from "@testing-library/react";
import { render } from "vitest-browser-react";
import { CancelIcon } from "@redislabsdev/redis-ui-icons";
import { MultiSelect } from "@redislabsdev/redis-ui-components";
import { test, expect, describe, vi } from "vitest";
import { userEvent } from "@vitest/browser/context";

const options1 = [{ value: "option1", label: "Option1" }];
const options2 = [
  { value: "option1", label: "Option1", icon: CancelIcon },
  { value: "option2" },
];
const longOptions = new Array(1000)
  .fill(0)
  .map((_, i) => ({ value: `option${i}`, label: `Option${i}` }));

const defaultValue1 = ["option1"];
const defaultValue2 = ["option1", "option2"];

const placeholder = "Select...";

describe("MultiSelect", () => {
  test("Should be rendered", () => {
    render(<MultiSelect placeholder={placeholder} options={options1} />);
    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  test("Should be rendered in virtual mode when virtualized passed", () => {
    render(<MultiSelect open options={options1} virtualized />);

    expect(screen.getByText(options1[0].label)).toBeInTheDocument();
  });

  test("should show first item even if other item selected in virtual mode", () => {
    const index = 999;
    render(
      <MultiSelect
        open
        options={longOptions}
        virtualized
        defaultValue={[longOptions[index].value]}
      />
    );

    expect(screen.getByText(longOptions[0].label)).toBeInTheDocument();
  });

  test("Should trigger onOpenChange when space key is pressed", async () => {
    const open = false;
    const onOpenChangeCallback = vi.fn();

    render(
      <MultiSelect
        open={open}
        placeholder={placeholder}
        onOpenChange={onOpenChangeCallback}
        options={options1}
      />
    );
    const button = screen.getAllByText(placeholder)[0];
    expect(button).toBeInTheDocument();

    fireEvent.focus(button);
    fireEvent.keyDown(button, { key: " ", code: "Space" });
    expect(onOpenChangeCallback).toHaveBeenCalledTimes(1);
  });

  test("Should trigger onChange when click on option", async () => {
    const onChangeCallback = vi.fn();

    render(
      <MultiSelect
        onChange={onChangeCallback}
        open
        placeholder={placeholder}
        options={options1}
      />
    );

    const option = screen.getAllByText("Option1")[0];
    expect(option).toBeInTheDocument();

    fireEvent.pointerUp(option);
    expect(onChangeCallback).toHaveBeenCalledWith(["option1"]);
  });

  test("Should trigger onChange when focus on option and press space", async () => {
    const onChangeCallback = vi.fn();

    render(
      <MultiSelect
        onChange={onChangeCallback}
        open
        placeholder={placeholder}
        options={options1}
      />
    );

    const option = screen.getByText("Option1");
    fireEvent.keyDown(option, { key: " ", code: "Space" });
    expect(onChangeCallback).toHaveBeenCalledWith(["option1"]);
  });

  test("Should call onOpenChange when click outside", async () => {
    const onOpenChangeCallback = vi.fn();
    render(
      <MultiSelect
        placeholder={placeholder}
        onOpenChange={onOpenChangeCallback}
        options={options1}
      />
    );

    const button = screen.getByText(placeholder);
    fireEvent.pointerDown(button);

    fireEvent.click(document.body);

    expect(onOpenChangeCallback).toHaveBeenCalledTimes(1);
  });

  test("Should trigger onChange when click on reset button", async () => {
    const onChangeCallback = vi.fn();

    render(
      <MultiSelect
        onChange={onChangeCallback}
        placeholder={placeholder}
        options={options1}
        defaultValue={defaultValue1}
      />
    );

    const button = screen.getByText("Clear All");
    fireEvent.click(button);
    expect(onChangeCallback).toHaveBeenCalledTimes(1);
  });

  test("Should render search input when searchable passed", async () => {
    render(
      <MultiSelect
        searchable
        open
        options={options2}
        defaultValue={defaultValue2}
      />
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    const list = within(screen.getByRole("presentation"));

    expect(list.queryByText("option2")).toBeInTheDocument();
    await userEvent.type(input, "option1");
    expect(list.getByText("Option1")).toBeInTheDocument();
    expect(list.queryByText("option2")).not.toBeInTheDocument();
  });

  test("Should render Select All when allowSelectAll passed and no selection", async () => {
    const handleChange = vi.fn();
    render(
      <MultiSelect
        open
        allowSelectAll
        options={options2}
        onChange={handleChange}
      />
    );

    const button = screen.getByRole("button", { name: "Select All" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleChange).toHaveBeenCalledWith(defaultValue2);
  });

  test("Should render Select All when allowSelectAll passed and partially selected", async () => {
    const handleChange = vi.fn();
    render(
      <MultiSelect
        open
        allowSelectAll
        options={options2}
        defaultValue={defaultValue1}
        onChange={handleChange}
      />
    );

    const button = screen.getByRole("button", { name: "Select All" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleChange).toHaveBeenCalledWith(defaultValue2);
  });

  test("Should render Unselect All when allowSelectAll passed and all selected", async () => {
    const handleChange = vi.fn();
    render(
      <MultiSelect
        open
        allowSelectAll
        options={options2}
        defaultValue={defaultValue2}
        onChange={handleChange}
      />
    );

    const button = screen.getByRole("button", { name: "Unselect All" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  test("Should render Select All disabled if no options or empty search", async () => {
    render(<MultiSelect open searchable allowSelectAll options={options2} />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    await userEvent.type(input, "invalid search");

    const button = screen.getByRole("button", { name: "Select All" });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test("Should Select All in search results", async () => {
    const handleChange = vi.fn();
    render(
      <MultiSelect
        open
        searchable
        allowSelectAll
        options={options2}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    await userEvent.type(input, "option1");

    const button = screen.getByRole("button", { name: "Select All" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleChange).toHaveBeenCalledWith(["option1"]);
  });

  test("Should Unselect All in search results", async () => {
    const handleChange = vi.fn();
    render(
      <MultiSelect
        open
        searchable
        allowSelectAll
        options={options2}
        defaultValue={defaultValue2}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    await userEvent.type(input, "option1");

    const button = screen.getByRole("button", { name: "Unselect All" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleChange).toHaveBeenCalledWith(["option2"]);
  });

  test.only("Should call Select All when pressing ctrl+a", async () => {
    const handleChange = vi.fn();
    render(
      <MultiSelect
        open
        allowSelectAll
        options={options2}
        onChange={handleChange}
      />
    );

    const popup = screen.getByRole("listbox");
    expect(popup).toBeInTheDocument();

    fireEvent.keyDown(popup, { code: "KeyA", ctrlKey: true, metaKey: true });
    expect(handleChange).toHaveBeenCalledWith(defaultValue2);

    fireEvent.keyDown(popup, { code: "KeyA", ctrlKey: true, metaKey: true });
    expect(handleChange).toHaveBeenCalledWith([]);
  });
});
