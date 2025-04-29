import { render } from "vitest-browser-react";
import { MultiSelect, SelectOption } from "@redislabsdev/redis-ui-components";
import { test } from "vitest";


test("loads and displays greeting", async () => {
  const options: SelectOption[] = [
    { value: "apple", label: "Apple" },
    { value: "orange", label: "Orange" },
    {
      value: "grape",
      label: "Grape (disabled)",
      disabled: true,
    },
  ];

  const screen = render(<MultiSelect options={options} defaultValue={["orange"]} />);

});
