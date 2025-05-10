import { test, expect } from "@playwright/experimental-ct-react";
import { MultiSelectTest } from "./multiselect.story";
import { SelectOption } from "@redislabsdev/redis-ui-components";
import React from "react";
import { describe } from "node:test";

const options: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "orange", label: "Orange" },
  {
    value: "grape",
    label: "Grape",
  },
];

describe("MultiSelect", () => {
  test("Should be rendered", async ({ mount }) => {
    const component = await mount(<MultiSelectTest options={options} />);
    await expect(component).toBeVisible();
  });

  test("Should be rendered in virtual mode when virtualized passed", async ({
    mount,
    page,
  }) => {
    const component = await mount(
      <MultiSelectTest
        options={options}
        defaultValue={["orange"]}
        virtualized={true}
      />
    );
    await expect(page.getByText("Orange")).toBeVisible();
  });

  test("should show first item even if other item selected in virtual mode", async ({
    mount,
    page,
  }) => {
    const index = 999;
    const longOptions = new Array(1000)
      .fill(0)
      .map((_, i) => ({ value: `option${i}`, label: `Option${i}` }));

    const component = await mount(
      <MultiSelectTest
        options={longOptions}
        defaultValue={[longOptions[index].value]}
        virtualized={true}
        open
      />
    );
    await expect(page.getByText(longOptions[0].label)).toBeVisible();
  });

  test("Should trigger onOpenChange when space key is pressed", async ({
    mount,
    page,
  }) => {
    let didOpen = false;

    const component = await mount(
      <MultiSelectTest
        options={options}
        onOpenChange={() => (didOpen = true)}
      />
    );

    await component.focus();
    await component.press("Space");

    await expect(didOpen).toBe(true);
  });

  test("Should trigger onChange when click on option", async ({
    mount,
    page,
  }) => {
    let didSelect = false;

    const component = await mount(
      <MultiSelectTest options={options} onChange={() => (didSelect = true)} />
    );

    await component.click();
    await page.getByText("Apple").dispatchEvent("pointerup");

    await expect(didSelect).toBe(true);
  });

  test("Should trigger onChange when focus on option and press space", async ({
    mount,
    page,
  }) => {
    let didSelect = false;

    const component = await mount(
      <MultiSelectTest options={options} onChange={() => (didSelect = true)} />
    );

    await component.focus();
    await component.press("Space");
    await component.press("ArrowDown");
    await component.press("Space");

    await expect(didSelect).toBe(true);
  });

  test("Should call onOpenChange when click outside", async ({
    mount,
    page,
  }) => {
    let count = 0;

    const component = await mount(
      <MultiSelectTest options={options} onOpenChange={() => count++} />
    );

    await component.click();

    await page.locator("html").click({ position: { x: 10, y: 10 } });

    await expect(count).toBe(2);
  });

  // Currently broken due to design issues
  test.skip("Should trigger onChange when click on reset button", async ({
    mount,
    page,
  }) => {
    let count = 0;

    const component = await mount(
      <MultiSelectTest
        options={options}
        onOpenChange={() => count++}
        placeholder={"Select..."}
        defaultValue={["orange"]}
      />
    );

    // expect(1).toBe(1);
    // await page.getByText('Clear All').click();

    await expect(component).toBeVisible();
  });

  test("Should render search input when searchable passed", async ({
    mount,
    page,
  }) => {
    let count = 0;

    const component = await mount(
      <MultiSelectTest options={options} searchable open />
    );

    expect(page.getByRole("presentation").getByText("Apple")).toBeVisible();
    await page.getByRole("textbox").fill("Orange");
    expect(page.getByRole("presentation").getByText("Orange")).toBeVisible();
    expect(page.getByRole("presentation").getByText("Apple")).not.toBeVisible();
  });

  test("Should render Select All when allowSelectAll passed and no selection", async ({
    mount,
    page,
  }) => {
    let count = 0;

    const component = await mount(
      <MultiSelectTest
        options={options}
        open
        allowSelectAll
        onChange={() => count++}
      />
    );

    await expect(
      page.getByRole("button", { name: "Select all" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Select all" }).click();
    await expect(count).toBe(1);
  });

  test("Should render Select All when allowSelectAll passed and partially selected", async ({
    mount,
    page,
  }) => {
    let count = 0;

    const component = await mount(
      <MultiSelectTest
        options={options}
        open
        allowSelectAll
        onChange={() => count++}
        defaultValue={["orange"]}
      />
    );

    await expect(
      page.getByRole("button", { name: "Select all" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Select all" }).click();
    await expect(count).toBe(1);
  });

  test("Should render Unselect All when allowSelectAll passed and all selected", async ({
    mount,
    page,
  }) => {
    let count = 0;

    const component = await mount(
      <MultiSelectTest
        options={options}
        open
        allowSelectAll
        onChange={() => count++}
        defaultValue={["orange", "grape", "apple"]}
      />
    );

    await expect(
      page.getByRole("button", { name: "Unselect all" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Unselect all" }).click();
    await expect(count).toBe(1);
  });

  test("Should render Select All disabled if no options or empty search", async ({
    mount,
    page,
  }) => {
    let count = 0;

    const component = await mount(
      <MultiSelectTest
        options={options}
        open
        allowSelectAll
        searchable
        onChange={() => count++}
      />
    );

    await page.getByRole("textbox").fill("noresults");

    await expect(
      page.getByRole("button", { name: "Select All" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Select All" })
    ).toBeDisabled();
  });

});
